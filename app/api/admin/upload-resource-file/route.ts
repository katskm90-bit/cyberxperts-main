import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";
import { putFile } from "@/lib/github";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB — guides/reports can be larger than a CV
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

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
    return NextResponse.json({ error: `File type ${mimeType} is not allowed. Use PDF or Word (.doc/.docx).` }, { status: 400 });
  }

  const approxBytes = (base64Data.length * 3) / 4;
  if (approxBytes > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File is too large. Please keep resource files under 10MB." }, { status: 400 });
  }

  const safeName = body.filename.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
  const path = `public/resources/files/${Date.now()}-${safeName}`;

  try {
    await putFile(path, base64Data, `Upload resource file via admin panel: ${safeName}`, true);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error uploading to GitHub.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const publicPath = `/${path.replace("public/", "")}`;
  return NextResponse.json({ ok: true, path: publicPath, filename: body.filename });
}
