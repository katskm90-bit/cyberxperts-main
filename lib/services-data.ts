import servicesJson from "@/content/services.json";

export type ServiceContent = {
  slug: string;
  name: string;
  summary: string;
  overview: string;
  problems: string[];
  benefits: string[];
  process: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  image?: string;
};

// Content lives in content/services.json — the admin tool reads/writes that
// file directly. This module just gives it a stable type and lookup helper.
export const services: ServiceContent[] = servicesJson as ServiceContent[];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
