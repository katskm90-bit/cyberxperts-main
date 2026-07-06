import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { Eyebrow, DisplayHeading, Section } from "@/app/components/ui";
import AssessmentFlow from "@/app/components/AssessmentFlow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Security Pre-Assessment | Cyberxperts",
  description:
    "Answer a short set of business-focused questions to get an immediate, plain-language indication of your organisation's cyber security maturity.",
};

export default function SecurityPreAssessmentPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden pt-36 lg:pt-44">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="photo-scrim-gold absolute inset-0" />
          <div className="relative mx-auto max-w-[1400px] px-6 pb-16 lg:px-12">
            <Eyebrow>Free Tool</Eyebrow>
            <DisplayHeading className="mt-6 max-w-2xl !text-4xl sm:!text-5xl">
              Free Security Self-Assessment
            </DisplayHeading>
            <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-ink-muted">
              Answer a short set of business-focused questions to get an immediate,
              plain-language indication of your organisation&apos;s cyber security maturity.
              This takes about three minutes.
            </p>
          </div>
        </section>

        <Section className="border-t border-border-dark">
          <div className="mx-auto max-w-2xl">
            <AssessmentFlow />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
