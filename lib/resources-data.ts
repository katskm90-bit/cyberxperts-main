import articlesJson from "@/content/resources-articles.json";

export type ResourceArticle = {
  id: string;
  slug: string;
  title: string;
  category: "Article" | "Guide" | "Report" | "Case Study";
  excerpt: string;
  bodyMarkdown: string;
  coverImage?: string;
  downloadFile?: { url: string; filename: string };
  publishedDate: string; // e.g. "2026-07-01"
};

// Content lives in content/resources-articles.json — the admin tool
// reads/writes that file directly. Starts empty; real articles are added
// through the admin panel, not fabricated placeholders.
export const resourceArticles: ResourceArticle[] = articlesJson as ResourceArticle[];

export function getArticle(slug: string) {
  return resourceArticles.find((a) => a.slug === slug);
}

export function getPublishedArticles() {
  return [...resourceArticles].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}
