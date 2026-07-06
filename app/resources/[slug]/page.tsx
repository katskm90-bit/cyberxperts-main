import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { Eyebrow, PrimaryButton } from "@/app/components/ui";
import { getArticle, resourceArticles } from "@/lib/resources-data";
import { renderArticleBody } from "@/lib/simple-markdown";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return resourceArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Cyberxperts Resources`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return notFound();

  const bodyHtml = renderArticleBody(article.bodyMarkdown);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden pb-16 pt-36 lg:pt-44">
          {article.coverImage && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="photo-scrim-red absolute inset-0" />
            </>
          )}
          <div className={`relative mx-auto max-w-3xl px-6 lg:px-12 ${!article.coverImage ? "bg-bg-primary" : ""}`}>
            <Eyebrow>{article.category}</Eyebrow>
            <h1 className="mt-6 font-display text-4xl font-black text-ink-primary sm:text-5xl">{article.title}</h1>
            <p className="mt-4 font-mono text-xs uppercase tracking-wide text-ink-faint">
              {new Date(article.publishedDate).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </section>

        <section className="border-t border-border-dark bg-bg-primary py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-12">
            <div
              className="prose-cyberxperts font-body text-base leading-relaxed text-ink-muted [&_a]:text-accent-navy-bright [&_a]:underline [&_p]:mb-5 [&_strong]:text-ink-primary"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {article.downloadFile && (
              <div className="mt-10 border border-border-dark bg-bg-secondary p-6">
                <p className="font-display text-base font-bold text-ink-primary">Download this resource</p>
                <p className="mt-1 font-body text-sm text-ink-muted">{article.downloadFile.filename}</p>
                <a
                  href={article.downloadFile.url}
                  download
                  className="mt-4 inline-block rounded-sm bg-accent-red px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-red-bright"
                >
                  Download PDF/Document →
                </a>
              </div>
            )}

            <div className="mt-12 border-t border-border-dark pt-8">
              <PrimaryButton href="/contact#consultation">Speak With Our Team</PrimaryButton>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
