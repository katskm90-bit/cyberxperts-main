import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { LogoCarousel } from "./components/LogoCarousel";
import CyberNetworkHero from "./components/CyberNetworkHero";
import AnimatedCounter from "./components/AnimatedCounter";
import RegionalFootprintMap from "./components/RegionalFootprintMap";
import { siteContent } from "@/lib/site-content";
import { Eyebrow, DisplayHeading, SectionHeading, Section, PrimaryButton, SecondaryButton } from "./components/ui";

const services = [
  {
    name: "Managed Security Services",
    href: "/services/managed-security-services",
    desc: "Ongoing monitoring and management of your security environment.",
    tag: "Primary Service",
    image: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Security Operations Centre",
    href: "/services/security-operations-centre",
    desc: "24/7 threat detection, monitoring, and response.",
    tag: "Continuous Coverage",
    image: "https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Penetration Testing",
    href: "/services/penetration-testing",
    desc: "Controlled testing to identify exploitable weaknesses.",
    tag: "Evidence-Based",
    image: "https://images.pexels.com/photos/5483240/pexels-photo-5483240.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

const otherServices = [
  { name: "Risk Assessments", href: "/services/risk-assessments", desc: "Structured evaluation against NIST, ISO 27001, and COBIT." },
  { name: "Compliance Services", href: "/services/compliance-services", desc: "Support for POPIA, ISO 27001, and regulatory obligations." },
  { name: "Security Awareness Training", href: "/services/security-awareness-training", desc: "Practical training that reduces human-factor risk." },
  { name: "Incident Response", href: "/services/incident-response", desc: "Digital forensics and structured breach investigation." },
  { name: "Consulting", href: "/services/consulting", desc: "Strategic guidance on security programs and governance." },
];

const clients = [
  "National Nuclear Regulator", "PanSALB", "SASSETA", "SAQA", "QCTO", "EPPF",
  "Mzimkhulu Holdings", "Grant Thornton SNG", "Innovation Hub Group", "Afrocentric IP",
];

const partners = [
  "Microsoft", "AWS", "Fortinet", "Kaspersky", "Trend Micro", "ESET",
  "Mimecast", "CheckPoint", "Sophos", "Dell", "Rapid7", "Qualys",
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-bg-primary">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-navy/10 via-transparent to-accent-red/10" />

          <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 px-6 pt-16 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-12">
            <div className="relative z-10 flex flex-col justify-center">
              <div className="mb-4 inline-flex items-center gap-2 border-l-2 border-accent-red-bright pl-3">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-primary">
                  {siteContent.hero.eyebrow}
                </p>
              </div>
              <DisplayHeading className="max-w-4xl !text-4xl sm:!text-6xl lg:!text-8xl">
                {siteContent.hero.headlineLine1}
                <br />
                {siteContent.hero.headlineLine2}
              </DisplayHeading>
              <p className="mt-7 max-w-xl font-body text-lg leading-relaxed text-ink-muted">
                {siteContent.hero.supportingText}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <PrimaryButton href={siteContent.hero.primaryButtonHref}>{siteContent.hero.primaryButtonText}</PrimaryButton>
                <SecondaryButton href={siteContent.hero.secondaryButtonHref}>{siteContent.hero.secondaryButtonText}</SecondaryButton>
              </div>
            </div>

            <div className="relative min-h-[360px] lg:min-h-0">
              <CyberNetworkHero />
            </div>
          </div>
        </section>

        <section className="border-b border-border-dark bg-bg-secondary">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-border-dark px-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-12">
            {siteContent.trustStrip.map((item, i) => {
              const content = (
                <>
                  <p className="font-display text-base font-bold text-ink-primary sm:text-lg">{item.title}</p>
                  <p className="mt-1.5 font-body text-sm leading-snug text-ink-muted">{item.desc}</p>
                </>
              );
              return item.href ? (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group px-6 py-7 transition-colors hover:bg-bg-tertiary ${i === 0 ? "lg:pl-0" : ""}`}
                >
                  {content}
                  <span className="mt-3 inline-block font-mono text-xs text-accent-navy-bright opacity-0 transition-opacity group-hover:opacity-100">
                    Start now →
                  </span>
                </Link>
              ) : (
                <div key={item.title} className={`px-6 py-7 ${i === 0 ? "lg:pl-0" : ""}`}>
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-b border-border-dark bg-bg-primary">
          <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-20">
            <Eyebrow>{siteContent.stats.eyebrow}</Eyebrow>
            <SectionHeading className="mt-3">{siteContent.stats.heading}</SectionHeading>
            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {siteContent.stats.items.map((item) => (
                <div key={item.label} className="border border-border-dark bg-bg-secondary p-8 text-center">
                  <p className="font-display text-4xl font-black text-accent-red-bright sm:text-5xl">
                    <AnimatedCounter value={item.value} prefix="+" />
                  </p>
                  <p className="mt-2 font-mono text-xs font-medium uppercase tracking-wide text-ink-muted">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Section className="border-b border-border-dark">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>What We Do</Eyebrow>
              <SectionHeading className="mt-3">Eight services. One accountable team.</SectionHeading>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1 lg:grid-cols-3">
            {services.map((s, i) => (
              <Link
                key={s.href}
                href={s.href}
                className="group relative block h-[420px] overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div
                  className={`absolute inset-0 ${
                    i === 0 ? "photo-scrim-navy" : i === 1 ? "photo-scrim-red" : "photo-scrim-gold"
                  }`}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <p className="font-mono text-xs uppercase tracking-wider text-accent-gold">{s.tag}</p>
                  <h3 className="mt-2 font-display text-2xl font-black text-white">{s.name}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-white/80">{s.desc}</p>
                  <span className="mt-4 font-mono text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Explore service →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-1 gap-px overflow-hidden border border-border-dark bg-border-dark sm:grid-cols-2 lg:grid-cols-5">
            {otherServices.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col justify-between gap-5 bg-bg-secondary p-6 transition-colors hover:bg-bg-tertiary"
              >
                <h3 className="font-display text-sm font-bold text-ink-primary">{s.name}</h3>
                <p className="font-body text-xs leading-relaxed text-ink-muted">{s.desc}</p>
                <span className="font-mono text-[11px] text-accent-navy-bright opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </Section>

        {/* Products teaser */}
        <section className="bg-gradient-navy-glow">
          <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <Eyebrow>Products</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Solutions from the partners we trust.
                </h2>
                <p className="mt-3 max-w-xl font-body text-base leading-relaxed text-white/70">
                  Microsoft, Fortinet, AWS, Nessus, and more — browse the products we
                  implement and support, organised by partner and category.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-6 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  Browse Products →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-bg-light text-ink-on-light">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-16 lg:px-12 lg:py-24">
              <Eyebrow>Why Cyberxperts</Eyebrow>
              <h2 className="mt-4 font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
                Certified.
                <br />
                Accountable.
                <br />
                <span className="text-accent-navy">Engaged on real assignments.</span>
              </h2>
              <p className="mt-7 max-w-md font-body text-base leading-relaxed text-ink-on-light-muted">
                Our work spans government regulators, financial services providers,
                municipalities, and private enterprise across the SADC region, delivered
                against recognised security frameworks with documented, reviewable outcomes.
              </p>

              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8">
                {[
                  { n: "01", label: "Accountable", desc: "Documented engagements, reviewable outcomes." },
                  { n: "02", label: "Evidenced", desc: "Real engagements, not claims without record." },
                  { n: "03", label: "Frameworks-led", desc: "NIST, ISO 27001, and COBIT, not ad hoc." },
                  { n: "04", label: "Regionally present", desc: "Active across South Africa and SADC." },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="font-mono text-xs text-accent-red">{item.n}</p>
                    <h3 className="mt-1 font-display text-lg font-bold">{item.label}</h3>
                    <p className="mt-1.5 font-body text-sm leading-snug text-ink-on-light-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[420px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.pexels.com/photos/3861571/pexels-photo-3861571.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="photo-scrim-navy absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <p className="text-center font-display text-2xl font-black leading-tight text-white">
                  Eight services.
                  <br />
                  One accountable team.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Section className="border-t border-border-dark">
          <Eyebrow>Organisations We Have Worked With</Eyebrow>
          <div className="mt-8">
            <LogoCarousel items={clients} />
          </div>
        </Section>

        <Section light className="border-t border-border-light">
          <Eyebrow>Partners</Eyebrow>
          <div className="mt-8">
            <LogoCarousel items={partners} light />
          </div>
        </Section>

        <Section className="border-t border-border-dark">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Regional Footprint</Eyebrow>
              <SectionHeading className="mt-3">Work delivered, not just listed.</SectionHeading>
            </div>
            <Link href="/contact#consultation" className="font-body text-sm font-medium text-accent-red-bright hover:text-ink-primary">
              Discuss your requirements →
            </Link>
          </div>

          <RegionalFootprintMap />
        </Section>

        <section className="bg-gradient-red-glow">
          <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12 lg:py-16">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p className="font-mono text-xs uppercase tracking-wider text-white/70">Free Tool</p>
                <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Understand your security maturity in minutes.
                </h2>
                <p className="mt-3 max-w-xl font-body text-base leading-relaxed text-white/80">
                  Answer a short set of business-focused questions and receive an
                  immediate, plain-language indication of your organisation&apos;s
                  cyber security posture.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link
                  href="/security-pre-assessment"
                  className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3.5 font-body text-sm font-semibold text-ink-on-light transition-colors hover:bg-bg-light"
                >
                  Run a Free Security Self-Assessment →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Careers teaser */}
        <section className="bg-bg-secondary">
          <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <Eyebrow>Careers</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink-primary sm:text-4xl">
                  Build your career with Cyberxperts.
                </h2>
                <p className="mt-3 max-w-xl font-body text-base leading-relaxed text-ink-muted">
                  We&apos;re always looking for capable people to join our cyber security and
                  IT teams across South Africa.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link
                  href="/careers"
                  className="inline-flex items-center gap-2 rounded-sm border-2 border-ink-primary/30 px-6 py-3.5 font-body text-sm font-semibold text-ink-primary transition-colors hover:border-ink-primary"
                >
                  View Open Roles →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Section className="text-center">
          <SectionHeading className="mx-auto max-w-2xl">
            Speak with a security professional before your next decision.
          </SectionHeading>
          <div className="mt-9 flex justify-center gap-4">
            <PrimaryButton href="/contact#consultation">Book a Consultation</PrimaryButton>
            <SecondaryButton href="/contact">Contact an Expert</SecondaryButton>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
