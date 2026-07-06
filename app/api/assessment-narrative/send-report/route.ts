import { NextRequest, NextResponse } from "next/server";
import { generateAssessmentPdfBuffer } from "@/lib/generate-assessment-pdf";
import { sendEmail } from "@/lib/email";
import { siteContent } from "@/lib/site-content";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    companyName?: string;
    email?: string;
    result?: { percentage: number; maturityLevel: string };
    narrative?: { securityOverview: string; areasOfConcern: string; recommendedNextSteps: string } | null;
    services?: { name: string }[];
  };

  if (!body.email?.trim() || !isValidEmail(body.email.trim())) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!body.result || typeof body.result.percentage !== "number" || !body.result.maturityLevel) {
    return NextResponse.json({ error: "Missing assessment result." }, { status: 400 });
  }

  const companyName = (body.companyName || "").trim().slice(0, 200);
  const services = Array.isArray(body.services) ? body.services.slice(0, 20) : [];

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = generateAssessmentPdfBuffer({
      companyName,
      result: body.result,
      narrative: body.narrative ?? null,
      services,
      contact: { phoneDisplay: siteContent.company.phoneDisplay, email: siteContent.company.email },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json(
      { error: "We couldn't generate your report right now. Please try again shortly." },
      { status: 500 }
    );
  }

  const fileNameSafe = (companyName || "assessment").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  try {
    await sendEmail({
      to: body.email.trim(),
      subject: "Your Cyberxperts Cyber Security Pre-Assessment Report",
      html: `
        <div style="font-family: sans-serif; font-size: 14px; color: #111;">
          <p>Hello,</p>
          <p>Thank you for completing the Cyberxperts Free Security Pre-Assessment${companyName ? ` for <strong>${companyName}</strong>` : ""}. Your report is attached as a PDF.</p>
          <p>This assessment is a high-level, self-reported indication only — for a complete, professional evaluation of your actual security posture, request a free vulnerability assessment by replying to this email or calling ${siteContent.company.phoneDisplay}.</p>
          <p>Regards,<br/>Cyberxperts</p>
        </div>
      `,
      replyTo: siteContent.company.email,
      attachments: [{ filename: `cyberxperts-pre-assessment-${fileNameSafe}.pdf`, content: pdfBuffer.toString("base64") }],
    });
  } catch (err) {
    console.error("Assessment report email failed:", err);
    return NextResponse.json(
      { error: "We generated your report but couldn't email it right now. Please try again shortly." },
      { status: 500 }
    );
  }

  // Best-effort internal notification too, so the team knows a lead came
  // through — never blocks the visitor's success response.
  try {
    await sendEmail({
      to: siteContent.company.email,
      subject: `Pre-assessment completed: ${companyName || "Unknown organisation"}`,
      html: `
        <div style="font-family: sans-serif; font-size: 14px; color: #111;">
          <p><strong>New pre-assessment report requested</strong></p>
          <p><strong>Company:</strong> ${companyName || "—"}</p>
          <p><strong>Email:</strong> ${body.email.trim()}</p>
          <p><strong>Maturity level:</strong> ${body.result.maturityLevel} (${body.result.percentage}%)</p>
        </div>
      `,
      replyTo: body.email.trim(),
    });
  } catch (err) {
    console.error("Internal pre-assessment notification failed (report was still emailed to visitor):", err);
  }

  return NextResponse.json({ ok: true });
}
