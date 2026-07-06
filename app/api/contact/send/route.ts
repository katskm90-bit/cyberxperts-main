import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { siteContent } from "@/lib/site-content";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
    interest?: string;
    message?: string;
  };

  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return NextResponse.json({ error: "Please fill in your name, email, and message." }, { status: 400 });
  }

  const html = `
    <div style="font-family: sans-serif; font-size: 14px; color: #111;">
      <p><strong>New website enquiry</strong></p>
      <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
      <p><strong>Company:</strong> ${escapeHtml(body.company || "—")}</p>
      <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(body.phone || "—")}</p>
      <p><strong>Interested in:</strong> ${escapeHtml(body.interest || "—")}</p>
      <p><strong>Message:</strong><br/>${escapeHtml(body.message).replace(/\n/g, "<br/>")}</p>
    </div>
  `;

  try {
    await sendEmail({
      to: siteContent.company.email,
      subject: `Website enquiry: ${body.interest || "General"}`,
      html,
      replyTo: body.email.trim(),
    });
  } catch (err) {
    console.error("Contact form email failed:", err);
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please try again shortly, or call us directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
