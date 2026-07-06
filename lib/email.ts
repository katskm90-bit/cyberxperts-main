// Thin wrapper around Resend's REST API — no SDK dependency, consistent
// with how the GitHub and Vercel integrations are built elsewhere in this
// project. Handles both plain notification emails and emails with
// attachments (used for CV notifications and assessment PDF reports).

type EmailAttachment = {
  filename: string;
  content: string; // base64
};

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
};

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Email sending needs a Resend account and API key — see the deployment guide."
    );
  }
  // Defaults to Resend's shared sandbox sender until a custom domain is
  // verified in Resend (Settings → Domains) and RESEND_FROM_EMAIL is set
  // to a real @cyberxperts.co.za address. No code change needed to switch
  // later — just update the environment variable.
  const from = process.env.RESEND_FROM_EMAIL || "Cyberxperts Website <onboarding@resend.dev>";
  return { apiKey, from };
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const { apiKey, from } = getConfig();

  const body: Record<string, unknown> = {
    from,
    to: [input.to],
    subject: input.subject,
    html: input.html,
  };
  if (input.replyTo) body.reply_to = input.replyTo;
  if (input.attachments?.length) body.attachments = input.attachments;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend send failed: ${res.status} ${text}`);
  }
}
