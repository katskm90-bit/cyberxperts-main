import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";
import { putFile } from "@/lib/github";

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB — GitHub's Contents API rejects files over ~1MB via this method reliably in practice for larger sizes it can get flaky; keep uploads modest.
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = (await req.json()) as { filename?: string; dataUrl?: string };
  if (!body.filename || !body.dataUrl) {
    return NextResponse.json({ error: "Missing filename or file data." }, { status: 400 });
  }

  const match = body.dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) {
    return NextResponse.json({ error: "File data is not a valid base64 data URL." }, { status: 400 });
  }
  const [, mimeType, base64Data] = match;

  if (!ALLOWED_TYPES.includes(mimeType)) {
    return NextResponse.json({ error: `File type ${mimeType} is not allowed. Use JPEG, PNG, WebP, or SVG.` }, { status: 400 });
  }

  const approxBytes = (base64Data.length * 3) / 4;
  if (approxBytes > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File is too large. Please keep uploads under 4MB." }, { status: 400 });
  }

  // Sanitise filename: alphanumeric, dashes, underscores, single extension
  const safeName = body.filename.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
  const path = `public/images/uploads/${Date.now()}-${safeName}`;

  try {
    await putFile(path, base64Data, `Upload image via admin panel: ${safeName}`, true);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error uploading to GitHub.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  // Public URL once deployed — matches Next.js's static file serving from /public
  const publicPath = `/${path.replace("public/", "")}`;
  return NextResponse.json({ ok: true, path: publicPath });
}
