# Component Library

Every component listed here exists in `app/components/` as of this
document's creation — nothing below is aspirational.

## Design system primitives (`ui.tsx`)

| Component | Purpose |
|---|---|
| `Eyebrow` | Small uppercase label above a heading (e.g. "SERVICES") |
| `DisplayHeading` | Large page/section headline |
| `SectionHeading` | Mid-weight section heading, one level below `DisplayHeading` |
| `CardHeading` | Smallest heading tier, used inside cards |
| `Section` | Layout wrapper handling consistent padding/max-width; accepts a `light` prop to switch between the dark and light surface variants |
| `PrimaryButton` / `SecondaryButton` | The two button treatments used sitewide |
| `Divider` | Horizontal rule with consistent spacing |

Three-tier heading system (`DisplayHeading` → `SectionHeading` →
`CardHeading`) is intentional — flat, uniform heading sizes were an early
design mistake corrected during the build.

## Page-level templates

- **`PageHero`** — shared hero banner used by About, Contact, Resources, and
  (via the two templates below) every Service and Industry page. Accepts an
  optional `image` prop; when provided, renders the photo with a
  colour-tinted scrim (`photo-scrim-navy` / `-red` / `-gold` in
  `globals.css`) so brand colour and text legibility are preserved
  regardless of the underlying photo. Falls back to a plain gradient
  background when no image is supplied — this is what keeps the 20+ other
  pages that don't pass an image unaffected by this feature.
- **`ServicePageTemplate`** — renders a single service's Overview, Problems,
  Benefits, Process, and FAQ sections from its `content/services.json`
  entry. All 8 service pages are thin wrappers around this template plus a
  `generateMetadata`/`metadata` export for unique SEO per page.
- **`IndustryPageTemplate`** — same pattern for the 6 industry pages.

## Navigation and layout

- **`SiteHeader`** — renders navigation from `content/site-content.json`'s
  `nav.links` array (admin-editable order/labels), with Services and
  Industries rendered as dropdowns sourced from their respective data
  files. Includes the "Under Attack?" emergency contact panel and mobile
  menu.
- **`SiteFooter`** — company info, service/industry link columns, social
  links, certification badges, and copyright — all sourced from
  `site-content.json`.
- **`WhatsAppButton`** — floating action button, dismissible, number sourced
  from admin-configured company contact details.

## Forms

- **`ContactForm`** — submits to `/api/contact/send`, which emails the
  submission via Resend. Shows inline success/error states; never displays
  raw error detail (see `architecture.md` on the email flow).
- **`AssessmentFlow`** — multi-step question flow for the Free Security
  Pre-Assessment, plus the results view (score, AI-generated narrative,
  suggested services, and the "email my report" capture form).

## Visual/decorative components

- **`GlobalCyberBackground`** — persistent, sitewide animated network
  texture (Canvas 2D: drifting nodes, connecting lines, occasional data
  pulses). Mounted once in the root layout so it survives client-side
  navigation without restarting. Respects `prefers-reduced-motion` (renders
  one static frame instead of animating) and reduces node count on mobile.
- **`CyberNetworkHero`** — the homepage hero's dedicated visual: a
  three-layer network topology (Three.js) with parallax depth, travelling
  data packets, and periodic scanning pulses. Built specifically to avoid
  the "rotating globe" and "decorative particles" patterns the project
  brief called out as generic.
- **`RegionalFootprintMap`** — interactive visualisation of real client
  engagement history (`lib/engagements-data.ts`), grouped by location, with
  click-to-reveal engagement detail. Deliberately not a literal
  geographic map — see the inline code comment for the reasoning (risk of
  an inaccurate coastline rendered from memory outweighed the benefit of
  attempting one).
- **`AnimatedCounter`** — counts up from 0 to a target value once scrolled
  into view (`IntersectionObserver`), used for the homepage stats section.
  Runs once per page load; respects reduced motion.
- **`LogoCarousel`** — scrolling logo strip for client/partner logos.

## Deliberately not built

- No Shadcn components. No Framer Motion. Both are named in the original
  brief's preferred stack but weren't used — see `architecture.md` for the
  reasoning.
