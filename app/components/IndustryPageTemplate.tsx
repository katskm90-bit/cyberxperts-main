import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { PageHero } from "@/app/components/PageHero";
import { Eyebrow, Section, PrimaryButton, SecondaryButton } from "@/app/components/ui";
import { getService } from "@/lib/services-data";
import type { IndustryContent } from "@/lib/industries-data";
import Link from "next/link";


export default function IndustryPageTemplate({ industry }: { industry: IndustryContent }) {
  const services = industry.relevantServices.map((slug) => getService(slug)).filter(Boolean);

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero eyebrow="Industries" title={industry.name} description={industry.summary} gradient="red" image={industry.image}>
          <div className="mt-10 flex flex-wrap gap-4">
            <PrimaryButton href="/contact#consultation">Book a Consultation</PrimaryButton>
            <SecondaryButton href="/security-pre-assessment">Run a Free Security Self-Assessment</SecondaryButton>
          </div>
        </PageHero>

        <Section className="border-t border-border-dark">
          <Eyebrow>Context</Eyebrow>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-ink-muted">{industry.context}</p>
        </Section>

        <Section className="border-t border-border-dark">
          <Eyebrow>Relevant services</Eyebrow>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border-dark bg-border-dark sm:grid-cols-2">
            {services.map((s) => (
              <Link key={s!.slug} href={`/services/${s!.slug}`} className="group bg-bg-secondary p-7 transition-colors hover:bg-bg-tertiary">
                <h3 className="font-display text-base font-bold text-ink-primary">{s!.name}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{s!.summary}</p>
                <span className="mt-3 inline-block font-mono text-xs text-accent-navy-bright opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </Section>

        <Section className="border-t border-border-dark text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-primary sm:text-4xl">
            Speak with a security professional about {industry.name.toLowerCase()}.
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
