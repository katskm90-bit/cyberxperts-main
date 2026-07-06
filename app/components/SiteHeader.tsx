"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { siteContent, type NavLink } from "@/lib/site-content";
import { services } from "@/lib/services-data";
import { industries } from "@/lib/industries-data";

const dropdownItems: Record<string, { name: string; href: string }[]> = {
  services: services.map((s) => ({ name: s.name, href: `/services/${s.slug}` })),
  industries: industries.map((i) => ({ name: i.name, href: `/industries/${i.slug}` })),
};

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [attackOpen, setAttackOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks: NavLink[] = siteContent.nav.links;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "border-b border-border-dark bg-bg-primary/95 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteContent.branding.logoPath} alt="Cyberxperts" className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" onMouseLeave={() => setOpen(null)}>
          {navLinks.map((link) => {
            if (link.type === "link") {
              return (
                <Link
                  key={link.id}
                  href={link.href ?? "/"}
                  className="font-body text-[13px] font-medium text-ink-primary/80 transition-colors hover:text-ink-primary"
                >
                  {link.label}
                </Link>
              );
            }
            const items = link.dropdownSource ? dropdownItems[link.dropdownSource] : [];
            return (
              <div key={link.id} className="relative" onMouseEnter={() => setOpen(link.id)}>
                <button className="font-body text-[13px] font-medium text-ink-primary/80 transition-colors hover:text-ink-primary">
                  {link.label}
                </button>
                {open === link.id && (
                  <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-4">
                    <div className="rounded-sm border border-border-dark bg-bg-secondary p-2 shadow-2xl">
                      {items.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="block rounded-sm px-4 py-2.5 font-body text-sm text-ink-muted transition-colors hover:bg-bg-tertiary hover:text-ink-primary"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <div className="relative" onMouseLeave={() => setAttackOpen(false)}>
            <button
              onMouseEnter={() => setAttackOpen(true)}
              className="rounded-sm border border-accent-red-bright/60 bg-accent-red/10 px-4 py-2.5 font-body text-[13px] font-bold text-accent-red-bright shadow-[0_0_20px_-5px_rgba(255,59,78,0.5)] transition-colors hover:bg-accent-red/20"
            >
              Under Attack?
            </button>
            {attackOpen && (
              <div className="absolute right-0 top-full w-72 pt-4">
                <div className="rounded-sm border border-accent-red-bright/40 bg-bg-secondary p-5 shadow-2xl">
                  <p className="font-display text-sm font-bold text-ink-primary">Active incident? Get help now.</p>
                  <p className="mt-2 font-body text-xs leading-relaxed text-ink-muted">
                    Our emergency response line is staffed for active security incidents.
                  </p>
                  <a
                    href={`tel:${siteContent.company.emergencyPhoneHref}`}
                    className="mt-4 block rounded-sm bg-accent-red px-4 py-2.5 text-center font-body text-sm font-bold text-white transition-colors hover:bg-accent-red-bright"
                  >
                    Call Emergency Line
                  </a>
                  <a
                    href={`https://wa.me/${siteContent.company.emergencyWhatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block rounded-sm border border-border-dark px-4 py-2.5 text-center font-body text-sm font-semibold text-ink-primary transition-colors hover:border-accent-red-bright"
                  >
                    WhatsApp Emergency Line
                  </a>
                </div>
              </div>
            )}
          </div>
          <Link
            href="/contact#consultation"
            className="rounded-sm bg-accent-navy px-5 py-2.5 font-body text-[13px] font-semibold text-white transition-colors hover:bg-accent-navy-bright"
          >
            Book a Consultation
          </Link>
        </div>

        <button
          className="flex flex-col gap-1.5 xl:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`h-px w-6 bg-ink-primary transition-transform ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-ink-primary transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-ink-primary transition-transform ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-border-dark bg-bg-primary px-6 py-6 xl:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              if (link.type === "link") {
                return (
                  <Link key={link.id} href={link.href ?? "/"} className="rounded-sm px-2 py-2.5 font-body text-sm text-ink-primary">
                    {link.label}
                  </Link>
                );
              }
              const items = link.dropdownSource ? dropdownItems[link.dropdownSource] : [];
              return (
                <div key={link.id}>
                  <p className="mt-2 px-2 py-2 font-mono text-xs uppercase tracking-wider text-ink-faint">{link.label}</p>
                  {items.map((s) => (
                    <Link key={s.href} href={s.href} className="rounded-sm px-2 py-2.5 font-body text-sm text-ink-muted">
                      {s.name}
                    </Link>
                  ))}
                </div>
              );
            })}
            <a
              href={`tel:${siteContent.company.emergencyPhoneHref}`}
              className="mt-4 rounded-sm bg-accent-red px-4 py-3 text-center font-body text-sm font-bold text-white"
            >
              Under Attack? Call Now
            </a>
            <Link
              href="/contact#consultation"
              className="mt-2 rounded-sm bg-accent-navy px-4 py-3 text-center font-body text-sm font-semibold text-white"
            >
              Book a Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
