import { notFound } from "next/navigation";
import type { Metadata } from "next";
import IndustryPageTemplate from "@/app/components/IndustryPageTemplate";
import { getIndustry } from "@/lib/industries-data";

const industry = getIndustry("financial-services");

export const metadata: Metadata = {
  title: `Cyber Security for ${industry?.name ?? "Industry"} | Cyberxperts`,
  description: industry?.summary,
};

export default function Page() {
  if (!industry) return notFound();
  return <IndustryPageTemplate industry={industry} />;
}
