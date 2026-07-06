# Design System

All values below are copied directly from `app/globals.css` — this
document describes what's actually implemented, not a separate aspirational
spec.

## Colour tokens

### Dark theme (primary — used on most of the site)

| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#0a0a0c` | Base page background |
| `--bg-secondary` | `#131316` | Card/panel surfaces |
| `--bg-tertiary` | `#1c1c20` | Hover/elevated states |
| `--bg-elevated` | `#232328` | Highest elevation surfaces |
| `--ink-primary` | `#f5f5f7` | Primary text on dark |
| `--ink-muted` | `#9a9aa3` | Secondary text on dark |
| `--ink-faint` | `#6b6b74` | Tertiary/label text on dark |
| `--border-dark` | `#2a2a30` | Borders on dark surfaces |

### Light theme (used for specific sections — About page split layouts, FAQ sections)

| Token | Value | Use |
|---|---|---|
| `--bg-light` | `#f5f5f7` | Light section background |
| `--ink-on-light` | `#16161a` | Primary text on light |
| `--ink-on-light-muted` | `#5a5a64` | Secondary text on light |
| `--border-light` | `#e5e7eb` | Borders on light surfaces |

### Brand accents (used across both themes)

| Token | Value | Use |
|---|---|---|
| `--accent-navy` | `#003b8e` | Primary brand colour |
| `--accent-navy-bright` | `#1d5ac4` | Interactive/hover states |
| `--accent-red` | `#e11d2e` | Secondary brand colour, alerts |
| `--accent-red-bright` | `#ff3b4e` | Interactive red (buttons, links, emergency panel) |
| `--accent-gold` | `#c8a75b` | Sparingly used tertiary accent |

## Typography

| Role | Font stack | Notes |
|---|---|---|
| Display (`--font-display`) | Archivo Black, Arial Black, Helvetica Neue, Impact, Barlow Condensed | Headlines only — deliberately heavy weight for the "confident, authoritative" brand personality |
| Body (`--font-body`) | Inter, system fonts | All running text |
| Mono (`--font-mono`) | JetBrains Mono, system monospace | Labels, eyebrows, timestamps, technical data — not body copy |

### Heading scale (`ui.tsx`)

Three explicit tiers — `DisplayHeading` (largest, page/hero level),
`SectionHeading` (section level), `CardHeading` (smallest, inside cards).
Uniform heading sizes were identified and corrected during the build; this
tiering is a deliberate fix, not incidental.

## Gradient and photo-overlay system

Two related but distinct sets of classes in `globals.css`:

- `.bg-gradient-navy-glow` / `-red-glow` / `-gold-glow` — solid background
  gradients (opaque base + subtle radial colour tint), used on hero/section
  backgrounds that have no photo.
- `.photo-scrim-navy` / `-red` / `-gold` — the same colour tint recipe but
  with a **translucent** base, designed to sit as an overlay on top of a
  photo rather than as a standalone background. This is what lets `PageHero`
  and other photo sections show a real photograph while still carrying the
  brand's colour language and guaranteeing text contrast.

This distinction matters for consistency: a section either uses the
`-glow` variant (no photo) or a photo plus the matching `photo-scrim-`
variant — never a raw, untinted photo, and never both variants stacked.

## Motion

- `prefers-reduced-motion` is respected globally — every animated component
  (`GlobalCyberBackground`, `CyberNetworkHero`, `AnimatedCounter`) checks
  for it and either skips animation or renders a single static frame.
- Animation is deliberately slow and understated where it exists — the
  network background and hero visualisation move on a scale of seconds, not
  the fast micro-interactions typical of SaaS marketing sites. This is a
  direct response to the brief's "subtle interactions, no trendy effects"
  requirement.

## Layout

- Consistent max-width container: `max-w-[1400px]`, with responsive
  horizontal padding (`px-6` mobile, `lg:px-12` desktop).
- Every multi-column grid in the codebase collapses to a single column
  below the `sm:` breakpoint — verified by code audit, not just assumed.
