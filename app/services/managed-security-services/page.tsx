import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServicePageTemplate from "@/app/components/ServicePageTemplate";
import { getService } from "@/lib/services-data";

const service = getService("managed-security-services");

export const metadata: Metadata = {
  title: `${service?.name ?? "Service"} | Cyberxperts`,
  description: service?.summary,
};

export default function Page() {
  if (!service) return notFound();
  return <ServicePageTemplate service={service} />;
}
