# Cyberxperts Website — Phase 2 Build

## Running this locally

You need Node.js installed (version 20 or later recommended). Get it from
https://nodejs.org if you don't have it.

1. Unzip this project.
2. Open a terminal in the project folder.
3. Run:
   ```
   npm install
   ```
   This installs all required packages — it will take a minute or two.
4. Run:
   ```
   npm run dev
   ```
5. Open your browser to **http://localhost:3000**

The site will hot-reload as files change, if you want to tweak anything.

## What's built

- Homepage, About, Contact, Resources
- All 8 Service pages (Managed Security Services, SOC, Risk Assessments,
  Penetration Testing, Compliance Services, Security Awareness Training,
  Incident Response, Consulting)
- All 6 Industry pages (Financial Services, Healthcare, Education,
  Government, Manufacturing, Professional Services)
- The Security Pre-Assessment tool — full question flow and a working,
  reasoned scoring engine (see below)

## Known limitations in this local build

**Fonts**: the build environment I worked in could not reach Google Fonts,
so I substituted system font fallbacks (your computer's default UI font)
instead of the intended Public Sans / Inter pairing. When you run this
locally with normal internet access, you can swap back to the real webfonts
by editing `app/layout.tsx` and `app/globals.css` — flag this to me and I'll
do the swap directly.

**The Pre-Assessment tool's AI narrative**: the scoring engine itself is
fully functional and uses real, reasoned weights (see
`lib/assessment-scoring.ts` for the full explanation of why each control is
weighted the way it is). The plain-language narrative section (Security
Overview / Areas of Concern / Recommended Next Steps) calls the Claude API
and requires an API key to actually generate text. Without one, the tool
still works and shows your score, maturity level, and suggested services —
it just won't show the AI-written paragraphs. To enable this, create a file
named `.env.local` in the project root containing:
```
ANTHROPIC_API_KEY=your-key-here
```

**Resources page**: lists real completed-project case studies from your
company profile. The Articles/Guides/Reports section is intentionally left
as "in development" — that needs real written content, which wasn't in your
source materials for me to adapt.

## Scoring rubric — what to review

Open `lib/assessment-scoring.ts`. The top comment block explains the
reasoning behind each control's weight. In short: MFA, backups, and
incident response carry the most weight because they determine how bad a
real incident becomes, while awareness training and vendor management
carry somewhat less because they reduce likelihood rather than blast
radius. These are professional judgment calls, not invented numbers — but
they are absolutely meant to be reviewed and adjusted by your security
team. The file is written so changing a weight is a one-line edit.
