import Link from "next/link";
import { siteContent } from "@/lib/site-content";

const services = [
  { name: "Managed Security Services", href: "/services/managed-security-services" },
  { name: "Security Operations Centre", href: "/services/security-operations-centre" },
  { name: "Risk Assessments", href: "/services/risk-assessments" },
  { name: "Penetration Testing", href: "/services/penetration-testing" },
  { name: "Compliance Services", href: "/services/compliance-services" },
  { name: "Security Awareness Training", href: "/services/security-awareness-training" },
  { name: "Incident Response", href: "/services/incident-response" },
  { name: "Consulting", href: "/services/consulting" },
];

const industries = [
  { name: "Financial Services", href: "/industries/financial-services" },
  { name: "Healthcare", href: "/industries/healthcare" },
  { name: "Education", href: "/industries/education" },
  { name: "Government", href: "/industries/government" },
  { name: "Manufacturing", href: "/industries/manufacturing" },
  { name: "Professional Services", href: "/industries/professional-services" },
];

export default function SiteFooter() {
  const { footer, company, branding } = siteContent;
  const copyright = footer.copyrightText.replace("{year}", String(new Date().getFullYear()));

  return (
    <footer className="border-t border-border-dark bg-bg-primary">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={branding.logoPath} alt="Cyberxperts" className="h-9 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-ink-muted">{footer.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {footer.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-sm border border-border-dark px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-faint"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              {footer.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.name === "WhatsApp" ? `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(company.whatsappMessage)}` : s.href}
                  target={s.name === "WhatsApp" ? "_blank" : undefined}
                  rel={s.name === "WhatsApp" ? "noopener noreferrer" : undefined}
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-dark text-ink-muted transition-colors hover:border-accent-red hover:text-accent-red-bright"
                >
                  {s.name === "LinkedIn" && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
                  )}
                  {s.name === "Twitter/X" && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-7-6.2 7H1.3l8.1-9.3L1 2h7l4.9 6.4L18.9 2zm-1.2 18h1.9L7.3 4H5.3l12.4 16z"/></svg>
                  )}
                  {s.name === "WhatsApp" && (
                    <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current"><path d="M16.04 4C9.4 4 4 9.32 4 15.87c0 2.1.56 4.16 1.62 5.97L4 28l6.36-1.63a12.2 12.2 0 0 0 5.68 1.4h.01c6.64 0 12.04-5.32 12.04-11.87C28.09 9.32 22.69 4 16.04 4zm0 21.7h-.01a10.2 10.2 0 0 1-5.13-1.4l-.37-.21-3.77.97 1-3.62-.24-.37a9.7 9.7 0 0 1-1.5-5.2c0-5.4 4.46-9.8 9.95-9.8 2.66 0 5.16 1.02 7.04 2.87a9.65 9.65 0 0 1 2.92 6.93c0 5.4-4.47 9.8-9.95 9.8z"/></svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-accent-red-bright">Services</p>
            <ul className="mt-4 flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="font-body text-sm text-ink-muted transition-colors hover:text-ink-primary">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-accent-red-bright">Industries</p>
            <ul className="mt-4 flex flex-col gap-3">
              {industries.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="font-body text-sm text-ink-muted transition-colors hover:text-ink-primary">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-accent-red-bright">Company</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li><Link href="/about" className="font-body text-sm text-ink-muted transition-colors hover:text-ink-primary">About</Link></li>
              <li><Link href="/products" className="font-body text-sm text-ink-muted transition-colors hover:text-ink-primary">Products</Link></li>
              <li><Link href="/resources" className="font-body text-sm text-ink-muted transition-colors hover:text-ink-primary">Resources</Link></li>
              <li><Link href="/careers" className="font-body text-sm text-ink-muted transition-colors hover:text-ink-primary">Careers</Link></li>
              <li><Link href="/security-pre-assessment" className="font-body text-sm text-ink-muted transition-colors hover:text-ink-primary">Free Pre-Assessment</Link></li>
              <li><Link href="/contact" className="font-body text-sm text-ink-muted transition-colors hover:text-ink-primary">Contact</Link></li>
            </ul>
            <div className="mt-6 font-body text-sm leading-relaxed text-ink-muted">
              <p>{company.addressLine1}</p>
              <p>{company.addressLine2}</p>
              <p>{company.addressLine3}</p>
              <p className="mt-2">
                <a href={`tel:${company.phoneHref}`} className="hover:text-ink-primary">{company.phoneDisplay}</a>
              </p>
              <p>
                <a href={`mailto:${company.email}`} className="hover:text-ink-primary">{company.email}</a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border-dark pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-body text-xs text-ink-faint">{copyright}</p>
          <p className="font-body text-xs text-ink-faint">{footer.locationText}</p>
        </div>
      </div>
    </footer>
  );
}
