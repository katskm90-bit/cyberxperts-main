# Deployment Checklist

Complete list of everything required for a working deployment. Use this
when setting up a new Vercel project from scratch (e.g. after deleting and
recreating one), not just for routine content publishes — routine publishes
need none of this, they go through the admin panel.

## 1. Code

- [ ] Latest code uploaded to `github.com/katskm90-bit/cyberxperts-main`, branch `main`.

## 2. Vercel project

- [ ] New project created, imported from the GitHub repo above.
- [ ] Vercel Blob storage created (**Storage** tab → **Create Database** → **Blob**) and connected to this project. Confirm `BLOB_READ_WRITE_TOKEN` appears automatically under Environment Variables afterward — if it doesn't, the store wasn't linked; check the store's own Settings for a "Connect Project" option.

## 3. Environment variables

All of the following, set for **Production** at minimum:

| Variable | Source |
|---|---|
| `ADMIN_PASSWORD` | Chosen by the site owner |
| `ADMIN_SESSION_SECRET` | Any long random string (`openssl rand -hex 32`) |
| `GITHUB_TOKEN` | GitHub → Settings → Developer settings → Fine-grained tokens → scoped to this repo, Contents: Read and write. **Must have the repository explicitly selected under "Repository access"** — a token with correct permissions but no repository selected will fail with a 404 on write, not a permissions error, which is easy to misdiagnose |
| `GITHUB_REPO` | Exactly `katskm90-bit/cyberxperts-main` — no URL, no `https://github.com/` prefix |
| `GITHUB_BRANCH` | `main` |
| `VERCEL_API_TOKEN` | Vercel → avatar → Settings → Tokens → Create Token |
| `VERCEL_PROJECT_ID` | This project → Settings → General → "Project ID". **Must be regenerated if the Vercel project is ever deleted and recreated** — it is not portable between projects |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys. Requires billing/credit added first, or narrative generation will fail silently (degrades to score-only, does not error visibly to visitors) |
| `RESEND_API_KEY` | resend.com → API Keys. **Account email must be confirmed** before real sends will work |
| `RESEND_FROM_EMAIL` | Optional. Omit to use Resend's sandbox sender (works immediately, less deliverable). Set once a custom domain is verified in Resend — see below |

## 4. Redeploy

- [ ] After all variables are set, trigger one redeploy (Deployments → top entry → ⋯ → Redeploy). Environment variables only take effect on deployments created after they were saved.

## 5. Verification, in this exact order

1. Homepage loads.
2. `/admin/login` → log in successfully.
3. Dashboard loads with all tabs, no red error banners.
4. Make a trivial content edit → **Publish Changes** → succeeds → check the GitHub repo for the resulting commit.
5. Contact page → submit a real test enquiry → confirm it arrives at the configured company email (check spam folder if using Resend's sandbox sender).
6. Careers page → submit a test application with a real PDF → confirm it appears in the admin **Applications** tab with a working **Download CV** button, and that a notification email arrived.
7. Free Pre-Assessment → complete it → confirm the written narrative appears (not just the score) → enter an email → confirm the PDF report arrives, with the Cyberxperts wordmark, full narrative, and the vulnerability-assessment recommendation.
8. Admin **Settings** tab → confirm the Anthropic key shows as set.

## 6. Upgrading email deliverability later

Once DNS access for `cyberxperts.co.za` is available:

1. Resend → **Domains** → **Add Domain** → follow the DNS records provided.
2. Add those records at the domain's DNS host.
3. Verify in Resend (may take minutes to hours to propagate).
4. Add `RESEND_FROM_EMAIL` = the real sending address (e.g. `katleho.mokoena@cyberxperts.co.za`).
5. Redeploy. No code changes required.

## Common failure and what it actually means

| Symptom | Actual cause |
|---|---|
| "Publish Changes" fails with a 404 | `GITHUB_REPO` is malformed (usually a full URL was pasted instead of `owner/repo`), or the GitHub token has no repository selected |
| "Publish Changes" fails with a 401/403 | `GITHUB_TOKEN` missing, expired, or lacks Contents: Read and write |
| Applications tab shows a Blob error | `BLOB_READ_WRITE_TOKEN` not set — Blob storage wasn't created, or wasn't connected to this specific project |
| Assessment shows score but no written narrative | `ANTHROPIC_API_KEY` missing, or Anthropic account has no billing/credit |
| Contact form / applications say "couldn't send" | `RESEND_API_KEY` missing, or the Resend account's signup email hasn't been confirmed yet |
| Nothing seems to change after a publish | Almost always a stale browser tab/cache, not a real failure — hard refresh, or open the site in a private/incognito window, or get the current URL fresh from Vercel's deployment detail page rather than reusing an old tab |
