import industriesJson from "@/content/industries.json";

export type IndustryContent = {
  slug: string;
  name: string;
  summary: string;
  context: string;
  relevantServices: string[];
  image?: string;
};

// Content lives in content/industries.json — the admin tool reads/writes
// that file directly. This module just gives it a stable type and lookup helper.
export const industries: IndustryContent[] = industriesJson as IndustryContent[];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
