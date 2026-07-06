# SEO Checklist

Status column reflects what's actually confirmed in the codebase, not
intent. "Confirmed" means checked directly; "Unverifiable here" means it
needs checking against the live site, not just the code.

| Item | Status | Notes |
|---|---|---|
| `sitemap.xml` | Confirmed | `app/sitemap.ts`, auto-generated from real routes |
| `robots.txt` | Confirmed | `app/robots.ts` |
| Unique `<title>` per page | Confirmed | 20 of 21 pages have their own `metadata` export; the homepage correctly uses the root layout's title directly (standard practice, not a gap) |
| Unique meta description per page | Confirmed | Same coverage as titles |
| Open Graph tags | Confirmed | Set site-wide in `app/layout.tsx` |
| Twitter card tags | Confirmed | Same location |
| JSON-LD structured data | Confirmed | `ProfessionalService` schema in `app/layout.tsx`, using real address/phone/email |
| Canonical domain configured | **Needs action** | `BASE_URL` in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts` is currently set to `https://www.cyberxperts.co.za` — confirm this matches wherever the site actually ends up living before launch, or update all three |
| Semantic HTML headings | Confirmed | Enforced via the three-tier heading component system, not raw `<h1>`–`<h6>` scattered inline |
| Internal linking | Confirmed | Every service/industry page links to related services; footer links to all major sections |
| SEO-friendly URLs | Confirmed | `/services/[slug]`, `/industries/[slug]` — readable, no query strings or IDs |
| Image alt text | Confirmed | Decorative photos correctly use empty `alt=""`; no content-conveying images found without alt text (audited directly, see prior conversation) |
| OG share image | **Gap** | Currently falls back to a small favicon PNG, undersized for a proper social card (should be 1200×630). Needs a designed image |
| Image optimisation (Next.js Image component / lazy loading) | **Gap** | Photos added to the site use plain `<img>` tags, not `next/image` — no automatic compression, responsive sizing, or lazy-loading. This is the single biggest remaining SEO/performance lever not yet pulled |
| Lighthouse score above 90 | Unverifiable here | No live-URL testing tool available in this environment — run the live site through PageSpeed Insights (pagespeed.web.dev) once deployed |
| Mobile-friendliness | Unverifiable here (code-audited, not device-tested) | Every grid layout confirmed to collapse to single-column below `sm:`; no fixed-width overflow risks found in changed components. Real device testing (physical iPhone/Android/tablet) not performed |

## Recommended before public launch

1. Confirm the canonical domain and update the three `BASE_URL` constants if it differs from `cyberxperts.co.za`.
2. Design a proper 1200×630 Open Graph image.
3. Migrate photo `<img>` tags to `next/image` — the largest remaining performance lever.
4. Run PageSpeed Insights against the live URL and address anything flagged.
