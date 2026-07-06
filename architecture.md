# Architecture

Verified against the codebase as of this document's creation. Where a claim
below can't be confirmed from code alone (e.g. runtime behaviour under
load), it's marked as such rather than asserted.

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS.
- No Shadcn, no Framer Motion — see note in `component-library.md` on why.
- Rendering: static generation (SSG) for all content pages; dynamic
  (server-rendered per request) for API routes and the admin panel.

## Content model

Site copy and structured data (navigation, services, industries, products,
job listings, company contact details) live in `content/*.json`, not
hardcoded in components. Each JSON file has a typed loader in `lib/` (e.g.
`lib/site-content.ts`, `lib/services-data.ts`) that imports the JSON and
exposes a typed shape plus any lookup helpers.

This is the core architectural decision the admin panel depends on: because
content is data, not code, the admin can safely read and rewrite it without
risk of corrupting a React component through string manipulation.

## Admin panel and publish flow

Route: `/admin` (redirects to `/admin/dashboard`, which is protected by
`middleware.ts`).

**Authentication:** a single shared password (`ADMIN_PASSWORD`), verified in
`app/api/admin/login/route.ts`. On success, a signed session token is set as
an httpOnly cookie. The token is a HMAC-SHA256 signature over an expiry
timestamp, verified statelessly via `lib/admin-auth.ts` using the Web Crypto
API (not Node's `crypto` module) — required because `middleware.ts` runs on
Vercel's Edge runtime, which doesn't support Node's `crypto`.

**Publishing:** the dashboard (`app/admin/dashboard/page.tsx`) loads current
content via `GET /api/admin/content` (reads the JSON files bundled in the
current deployment — not a live GitHub call, see limitation below), lets the
admin edit in local React state, and on "Publish Changes" sends the full
edited bundle to `POST /api/admin/publish`, which writes each changed file
to GitHub via the Contents API (`lib/github.ts`). A successful commit
triggers Vercel's existing GitHub integration to redeploy automatically —
no separate deploy-trigger step exists or is needed.

**Known limitation:** because the content GET route reads the bundled
deployment rather than fetching live from GitHub, there's a brief window
(the time between a publish and the resulting redeploy completing) where
re-opening the dashboard would show pre-publish content. Low impact in
practice since redeploys typically complete in one to two minutes.

## Secrets management

Two genuinely separate mechanisms, deliberately not unified:

1. **Content** → GitHub, via `lib/github.ts`. Appropriate because content
   isn't sensitive and benefits from being versioned.
2. **Secrets** (currently just `ANTHROPIC_API_KEY`) → Vercel's environment
   variables directly, via `lib/vercel.ts`, using the Vercel REST API.
   Deliberately never committed to git — even a private repository keeps
   full history forever, which is the wrong place for a credential.

## File storage (job applications)

CVs are stored in Vercel Blob (`lib/blob.ts`), not GitHub — committing
applicant personal data to git history indefinitely is a POPIA-relevant
concern, and Blob storage doesn't trigger a rebuild per upload the way a git
commit would. An index file (`applications/index.json`) in the same Blob
store tracks submission metadata (name, email, job applied for, submission
date, file reference) for the admin's Applications tab to list.

Admin downloads proxy through an authenticated API route
(`/api/admin/applications/download`) rather than exposing the Blob file's
direct URL to the browser.

## Email

`lib/email.ts` wraps Resend's REST API directly (no SDK dependency, for
consistency with the GitHub/Vercel integrations). Three flows use it:

- Contact form submissions → sent to the company's admin-configured email
  address, with reply-to set to the enquirer's email.
- Job application notifications → sent to the same address, with the CV
  attached directly (Blob remains the permanent record; email is a
  convenience notification and is explicitly non-blocking — if email
  sending fails, the application is still saved).
- Pre-assessment PDF reports → sent to the address the visitor provides.

**Current configuration:** sends from Resend's shared sandbox address
(`onboarding@resend.dev`) until a custom domain is verified in Resend and
`RESEND_FROM_EMAIL` is set. No code change is needed to switch — see
`deployment-checklist.md`.

## Free Security Pre-Assessment

`app/api/assessment-narrative/route.ts` computes a maturity score
deterministically (`lib/assessment-scoring.ts` — the score is never decided
by the model) and separately asks Claude (Haiku) to write a plain-language
narrative describing that score. If the Claude call fails for any reason,
the route degrades gracefully: it still returns the score and suggested
services, logs the real failure server-side, and never surfaces internal
error detail to the visitor.

The downloadable report (`lib/generate-assessment-pdf.ts`) is generated
server-side using `jsPDF`, then emailed as an attachment
(`app/api/assessment-narrative/send-report/route.ts`) rather than offered as
a direct browser download — a deliberate choice per project requirements,
and one that also means PDF generation had to be Node-compatible (no
browser-only APIs like `canvas` or `Image`). The Cyberxperts brand mark in
the PDF is rendered as styled text (navy "Cyber" + red "xperts") rather than
an embedded image, specifically to eliminate image-loading as a failure
mode in a document that must render identically every time.

## Known deviations from the original technical brief

Documented here rather than left implicit:

- **No Framer Motion.** Animations are plain CSS transitions, or (for the
  hero network visualisation and persistent background) Canvas 2D /
  Three.js — neither is achievable with Framer Motion's declarative
  animation model, but the simpler UI transitions elsewhere could have used
  it and don't.
- **No Shadcn.** A custom component set (`app/components/ui.tsx`) was built
  instead, to match the brand's specific typography scale and visual
  language more closely than Shadcn's defaults would without heavy
  overriding.
- **GitHub workflow** (main/develop/feature branches, PR review, tagged
  releases) was not followed. Content changes are published directly to
  `main` via the admin panel by design (that's the entire point of the
  admin system — non-technical, direct publishing), and code changes were
  delivered as file uploads rather than through a branching workflow. This
  reflects how the project was actually operated, not an oversight.
