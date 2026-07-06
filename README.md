# Cyberxperts Website

Corporate website for Cyberxperts, a cyber security and managed IT services
company based in Sandton, South Africa, operating across the SADC region.

## Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** structured JSON files in `content/`, editable via the admin
  panel at `/admin`, publishing directly to this repository via GitHub's
  Contents API — every publish triggers an automatic Vercel redeploy.
- **Hosting:** Vercel
- **File storage:** Vercel Blob (job application CVs)
- **Email:** Resend (contact form and job application notifications)
- **AI:** Anthropic Claude (Haiku) for the Free Security Pre-Assessment's
  narrative generation

## Project structure

```
app/                    Next.js App Router pages and API routes
  admin/                Password-protected admin panel (content editor)
  api/                  Server routes: admin actions, contact form,
                         careers applications, assessment narrative + PDF
  components/           Shared UI components
  [service]/[industry]/ Dynamic-content pages driven by content/*.json
content/                All editable site content (JSON) — this is what
                         the admin panel reads and writes
lib/                    Typed data loaders, GitHub/Vercel/Resend/Blob
                         integrations, PDF generation
```

## Content model

Nearly all site copy, navigation, service/industry/product/job-listing
data, and company contact details live in `content/*.json`, not hardcoded
in components. This is deliberate: it's what makes the admin panel safe to
use without risking corrupting application code — the admin only ever
reads and writes plain JSON.

## Environment variables required

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Admin panel login |
| `ADMIN_SESSION_SECRET` | Signs admin login sessions |
| `GITHUB_TOKEN` | Lets the admin panel commit content changes |
| `GITHUB_REPO` | `owner/repo-name` format |
| `GITHUB_BRANCH` | Branch to commit to (typically `main`) |
| `VERCEL_API_TOKEN` | Lets the admin panel update the Anthropic key |
| `VERCEL_PROJECT_ID` | This project's Vercel ID |
| `BLOB_READ_WRITE_TOKEN` | Auto-added when Vercel Blob storage is created |
| `ANTHROPIC_API_KEY` | Pre-assessment narrative generation |
| `RESEND_API_KEY` | Outgoing email (contact form, applications, reports) |
| `RESEND_FROM_EMAIL` | Optional — defaults to Resend's sandbox sender until a custom domain is verified |

## Local development

```bash
npm install
npm run dev
```

## Deployment

Connected to Vercel — pushes to `main` (including admin panel publishes)
trigger an automatic production deployment.
