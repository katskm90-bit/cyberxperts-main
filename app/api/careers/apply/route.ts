import { NextRequest, NextResponse } from "next/server";
import { addApplication } from "@/lib/blob";
import { sendEmail } from "@/lib/email";
import { siteContent } from "@/lib/site-content";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    jobSlug?: string;
    jobTitle?: string;
    cvFileName?: string;
    cvDataUrl?: string;
    consent?: boolean;
  };

  if (!body.name?.trim() || !body.email?.trim() || !body.phone?.trim()) {
    return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json({ error: "Consent to processing your information is required." }, { status: 400 });
  }
  if (!body.cvDataUrl || !body.cvFileName) {
    return NextResponse.json({ error: "A CV file is required." }, { status: 400 });
  }

  const match = body.cvDataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) {
    return NextResponse.json({ error: "File data is not valid." }, { status: 400 });
  }
  const [, mimeType, base64Data] = match;

  // Strict PDF-only: check both the declared MIME type and the actual file
  // signature (the first bytes of every real PDF are "%PDF"), since a
  // browser-reported MIME type can be spoofed but the magic bytes can't be
  // faked without the file no longer being a valid PDF.
  if (mimeType !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted for CVs. Please convert your document to PDF and try again." }, { status: 400 });
  }
  const fileBuffer = Buffer.from(base64Data, "base64");
  const signature = fileBuffer.subarray(0, 4).toString("utf8");
  if (signature !== "%PDF") {
    return NextResponse.json({ error: "This file doesn't appear to be a valid PDF. Please check the file and try again." }, { status: 400 });
  }

  const approxBytes = (base64Data.length * 3) / 4;
  if (approxBytes > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File is too large. Please keep your CV under 5MB." }, { status: 400 });
  }

  try {
    await addApplication({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      jobSlug: body.jobSlug || "general",
      jobTitle: body.jobTitle || "General Application",
      cvFileName: body.cvFileName,
      cvBase64: base64Data,
    });
  } catch (err) {
    // Log the real cause server-side (visible in Vercel's function logs) —
    // never expose internal configuration/system errors to a visitor
    // submitting a job application.
    console.error("Job application submission failed:", err);
    return NextResponse.json(
      { error: "We couldn't submit your application right now. Please try again shortly, or email your CV directly to the address on our Contact page." },
      { status: 500 }
    );
  }

  // Email notification is best-effort and never blocks the applicant's
  // success response — Vercel Blob (above) is the reliable, permanent
  // record; this is a convenience notification on top of it. If email
  // sending fails (e.g. Resend not configured yet), the application is
  // still safely stored and visible in the admin Applications tab.
  try {
    await sendEmail({
      to: siteContent.company.email,
      subject: `New job application: ${body.jobTitle || "General Application"} — ${body.name.trim()}`,
      html: `
        <div style="font-family: sans-serif; font-size: 14px; color: #111;">
          <p><strong>New job application received</strong></p>
          <p><strong>Role:</strong> ${body.jobTitle || "General Application"}</p>
          <p><strong>Name:</strong> ${body.name.trim()}</p>
          <p><strong>Email:</strong> ${body.email.trim()}</p>
          <p><strong>Phone:</strong> ${body.phone.trim()}</p>
          <p style="margin-top: 16px;">CV is attached to this email, and also permanently stored in the admin panel's Applications tab.</p>
        </div>
      `,
      replyTo: body.email.trim(),
      attachments: [{ filename: body.cvFileName, content: base64Data }],
    });
  } catch (err) {
    console.error("Job application email notification failed (application was still saved):", err);
  }

  return NextResponse.json({ ok: true });
}
