import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { PageHero } from "@/app/components/PageHero";
import { Eyebrow, Section, PrimaryButton, SecondaryButton } from "@/app/components/ui";
import type { ServiceContent } from "@/lib/services-data";


export default function ServicePageTemplate({ service }: { service: ServiceContent }) {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero eyebrow="Services" title={service.name} description={service.summary} gradient="navy" image={service.image}>
          <div className="mt-10 flex flex-wrap gap-4">
            <PrimaryButton href="/contact#consultation">Book a Consultation</PrimaryButton>
            <SecondaryButton href="/security-pre-assessment">Run a Free Security Self-Assessment</SecondaryButton>
          </div>
        </PageHero>

        <Section className="border-t border-border-dark">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>Overview</Eyebrow>
              <p className="mt-4 font-body text-base leading-relaxed text-ink-muted">{service.overview}</p>
            </div>
            <div className="lg:col-span-5">
              <Eyebrow>Problems this addresses</Eyebrow>
              <ul className="mt-4 flex flex-col gap-3">
                {service.problems.map((p) => (
                  <li key={p} className="flex gap-3 font-body text-sm leading-relaxed text-ink-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-navy-bright" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section className="border-t border-border-dark">
          <Eyebrow>Benefits</Eyebrow>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border-dark bg-border-dark sm:grid-cols-2">
            {service.benefits.map((b) => (
              <div key={b} className="bg-bg-secondary p-7">
                <p className="font-body text-sm leading-relaxed text-ink-primary">{b}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="border-t border-border-dark">
          <Eyebrow>Our process</Eyebrow>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border-dark bg-border-dark sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => (
              <div key={step.title} className="bg-bg-primary p-7">
                <p className="font-mono text-xs text-accent-navy-bright">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-display text-base font-medium text-ink-primary">{step.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="border-t border-border-dark">
          <Eyebrow>Frequently asked questions</Eyebrow>
          <div className="mt-8 divide-y divide-border-dark border-y border-border-dark">
            {service.faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <h3 className="font-display text-base font-medium text-ink-primary">{faq.question}</h3>
                <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-ink-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="border-t border-border-dark text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-primary sm:text-4xl">
            Speak with a security professional about {service.name.toLowerCase()}.
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
