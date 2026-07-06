import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";

// Authenticated equivalent of the earlier debug-env route — shows only
// whether each required integration is configured (true/false), never the
// actual secret values. This exists so "which integration is broken" can
// be answered by looking at one screen, instead of another round of
// screenshots and guessing.

const CHECKS = [
  { key: "GITHUB_TOKEN", label: "GitHub (content publishing)" },
  { key: "GITHUB_REPO", label: "GitHub repository" },
  { key: "VERCEL_API_TOKEN", label: "Vercel API (Anthropic key management)" },
  { key: "VERCEL_PROJECT_ID", label: "Vercel project ID" },
  { key: "BLOB_READ_WRITE_TOKEN", label: "Vercel Blob (CV storage)" },
  { key: "ANTHROPIC_API_KEY", label: "Anthropic (pre-assessment narrative)" },
  { key: "RESEND_API_KEY", label: "Resend (outgoing email)" },
  { key: "RESEND_FROM_EMAIL", label: "Resend custom sender (optional — sandbox used if unset)" },
] as const;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const results = CHECKS.map((c) => ({
    key: c.key,
    label: c.label,
    set: Boolean(process.env[c.key]),
    optional: c.key === "RESEND_FROM_EMAIL",
  }));

  return NextResponse.json({ checks: results });
}
