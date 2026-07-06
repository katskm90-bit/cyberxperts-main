import { jsPDF } from "jspdf";

// Generates the Cyber Security Pre-Assessment PDF report, server-side, for
// emailing to the visitor. Runs in a Node.js serverless function, not a
// browser — so this deliberately avoids anything DOM-dependent (canvas,
// Image elements, fetch-based image conversion).
//
// The Cyberxperts brand mark is rendered as styled TEXT ("Cyber" in navy +
// "xperts" in red, matching the real logo's colour split) rather than an
// embedded image. This is a deliberate reliability choice: a text mark has
// zero failure modes (no network fetch, no image parsing, no format
// conversion) and renders identically every single time, which matters
// more here than pixel-matching the actual logo graphic. If an exact image
// logo in the PDF becomes a hard requirement later, that's a well-scoped
// follow-up (needs either a bundled raster asset or a server-side SVG
// rasterizer library).

export type AssessmentPdfInput = {
  companyName: string;
  result: { percentage: number; maturityLevel: string };
  narrative?: { securityOverview: string; areasOfConcern: string; recommendedNextSteps: string } | null;
  services: { name: string }[];
  contact: { phoneDisplay: string; email: string };
};

export function generateAssessmentPdfBuffer(input: AssessmentPdfInput): Buffer {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 64;

  // Brand mark: "Cyber" (navy) + "xperts" (red), bold, matching the site's
  // actual logo colour split.
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(29, 90, 196); // navy
  doc.text("Cyber", margin, y);
  const cyberWidth = doc.getTextWidth("Cyber");
  doc.setTextColor(225, 29, 46); // red
  doc.text("xperts", margin + cyberWidth, y);
  y += 34;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text("Cyber Security Pre-Assessment Report", margin, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90);
  doc.text(`Prepared for: ${input.companyName || "Your Organisation"}`, margin, y);
  y += 16;
  doc.text(`Date: ${new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}`, margin, y);
  y += 28;

  doc.setDrawColor(220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 28;

  doc.setTextColor(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Maturity Level: ${input.result.maturityLevel}`, margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Score: ${input.result.percentage}%`, margin, y);
  y += 28;

  function addSection(title: string, body: string) {
    if (!body) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text(title, margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(60);
    const lines = doc.splitTextToSize(body, pageWidth - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 13 + 18;
    if (y > 700) {
      doc.addPage();
      y = 56;
    }
  }

  if (input.narrative) {
    addSection("Security Overview", input.narrative.securityOverview);
    addSection("Identified Areas of Concern", input.narrative.areasOfConcern);
    addSection("Recommended Next Steps", input.narrative.recommendedNextSteps);
  }

  if (input.services.length > 0) {
    addSection("Suggested Services", input.services.map((s) => `• ${s.name}`).join("\n"));
  }

  doc.setDrawColor(220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(110);
  const disclaimer =
    "This assessment provides a high level indication of your organisation's cyber security maturity based solely on the information you provided. It is not a professional security assessment and does not reflect a true, complete evaluation of your security posture. To understand your actual exposure and receive tailored recommendations, request a free vulnerability assessment from Cyberxperts.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - margin * 2);
  doc.text(disclaimerLines, margin, y);
  y += disclaimerLines.length * 12 + 24;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text("Get a complete picture with a free Vulnerability Assessment.", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(60);
  doc.text(`Call ${input.contact.phoneDisplay} or email ${input.contact.email} to request yours.`, margin, y);

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
