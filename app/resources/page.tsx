import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { PageHero } from "@/app/components/PageHero";
import { Eyebrow, Section, PrimaryButton } from "@/app/components/ui";
import { siteContent } from "@/lib/site-content";
import { getPublishedArticles } from "@/lib/resources-data";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | Cyberxperts",
  description:
    "Threat updates, partner news, and industry trends from Cyberxperts to help you stay informed about emerging risks affecting South African and SADC businesses.",
};

export default function ResourcesPage() {
  const { resources } = siteContent.pages;
  const articles = getPublishedArticles();

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={resources.eyebrow}
          title={resources.headline}
          description={resources.description}
          gradient="red"
          image="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1600"
        />

        <Section className="border-t border-border-dark">
          <Eyebrow>What You&apos;ll Find Here</Eyebrow>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border-dark bg-border-dark sm:grid-cols-3">
            {resources.categories.map((c) => (
              <div key={c.title} className="bg-bg-secondary p-7">
                <h3 className="font-display text-lg font-bold text-ink-primary">{c.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{c.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {articles.length > 0 ? (
          <Section className="border-t border-border-dark">
            <Eyebrow>Latest</Eyebrow>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/resources/${article.slug}`}
                  className="group block border border-border-dark bg-bg-secondary transition-colors hover:border-accent-navy-bright"
                >
                  {article.coverImage && (
                    <div className="h-40 w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={article.coverImage} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-accent-gold">{article.category}</p>
                    <h3 className="mt-2 font-display text-lg font-bold text-ink-primary">{article.title}</h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{article.excerpt}</p>
                    {article.downloadFile && (
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-accent-navy-bright">Downloadable resource</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        ) : (
          <Section light className="border-t border-border-light text-center">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              New content is published regularly.
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-ink-on-light-muted">
              This section is updated as new threats emerge and our partners release new
              capabilities. In the meantime, speak with our team directly about your specific
              security questions.
            </p>
            <div className="mt-8 flex justify-center">
              <PrimaryButton href="/contact#consultation">Contact Our Team</PrimaryButton>
            </div>
          </Section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
