import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { PageHero } from "@/app/components/PageHero";
import { LogoCarousel } from "@/app/components/LogoCarousel";
import { Eyebrow, Section, PrimaryButton, SecondaryButton } from "@/app/components/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Cyberxperts",
  description:
    "Cyberxperts is a Level 1 B-BBEE, ISO 27001 and ISO 9001 certified cyber security and IT services company based in Sandton, South Africa, operating across the SADC region.",
};

const partners = [
  "Microsoft", "AWS", "Fortinet", "Kaspersky", "Trend Micro", "ESET", "Mimecast", "Fortra",
  "Rapid7", "CheckPoint", "Sophos", "Dell", "Nessus", "Qualys", "Manage Engine", "Pinnacle",
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="About Cyberxperts"
          title="Cyber security and IT delivery, built on evidence rather than claims."
          description="Cyberxperts is a Level 1 B-BBEE, ISO 27001 and ISO 9001 certified cyber security and IT services company based in Sandton, South Africa, operating across the SADC region."
          gradient="navy"
          image="https://images.pexels.com/photos/1181304/pexels-photo-1181304.jpeg?auto=compress&cs=tinysrgb&w=1600"
        />

        <Section className="border-t border-border-dark">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <Eyebrow>Mission</Eyebrow>
              <p className="mt-4 font-display text-2xl font-bold leading-snug tracking-tight text-ink-primary">
                To provide top-tier cybersecurity solutions and IT services that ensure the
                protection and efficiency of our clients&apos; digital assets.
              </p>
            </div>
            <div>
              <Eyebrow>Vision</Eyebrow>
              <p className="mt-4 font-display text-2xl font-bold leading-snug tracking-tight text-ink-primary">
                To be one of the trusted and innovative IT and cybersecurity partners in
                Africa, empowering our clients to thrive in the digital era.
              </p>
            </div>
          </div>
        </Section>

        <Section light className="border-t border-border-light">
          <Eyebrow>Approach</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Framework-led, not opinion-led.
          </h2>
          <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-ink-on-light-muted">
            Our assessments and engagements are structured against recognised frameworks,
            including NIST, ISO 27001, and COBIT. We work with established security vendors
            and platforms rather than proprietary, unproven tooling, and our engagement
            history spans government regulators, financial services providers, municipalities,
            and private enterprise.
          </p>
        </Section>

        <Section className="border-t border-border-dark">
          <Eyebrow>Certifications</Eyebrow>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border-dark bg-border-dark sm:grid-cols-3">
            {[
              { title: "ISO 27001", desc: "Certified information security management system." },
              { title: "ISO 9001", desc: "Certified quality management system." },
              { title: "POPIA Compliant", desc: "Operating in line with South Africa's data protection legislation." },
            ].map((c) => (
              <div key={c.title} className="bg-bg-primary p-7">
                <h3 className="font-display text-lg font-bold text-ink-primary">{c.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{c.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="border-t border-border-dark">
          <Eyebrow>Values</Eyebrow>
          <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-ink-muted">
            We love what we do. We choose a positive outlook. We choose to do things better.
            We do the right thing, always.
          </p>
        </Section>

        <Section light className="border-t border-border-light">
          <Eyebrow>Partners</Eyebrow>
          <div className="mt-8">
            <LogoCarousel items={partners} light />
          </div>
        </Section>

        <Section className="border-t border-border-dark text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">
            Speak with our team about your security requirements.
          </h2>
          <div className="mt-8 flex justify-center gap-4">
            <PrimaryButton href="/contact#consultation">Book a Consultation</PrimaryButton>
            <SecondaryButton href="/contact">Contact an Expert</SecondaryButton>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
