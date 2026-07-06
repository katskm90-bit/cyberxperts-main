import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";

// Proxies the CV download through an authenticated route rather than ever
// exposing the raw Blob URL to the admin's browser — see lib/blob.ts for
// the full reasoning on why this matters given Blob storage's access model.
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const url = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename") || "cv.pdf";
  if (!url || !url.startsWith("https://") || !url.includes(".public.blob.vercel-storage.com")) {
    return NextResponse.json({ error: "Invalid file URL." }, { status: 400 });
  }

  const fileRes = await fetch(url);
  if (!fileRes.ok) {
    return NextResponse.json({ error: "Could not retrieve the file." }, { status: 502 });
  }

  const buffer = await fileRes.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
    },
  });
}
