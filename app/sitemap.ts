import { MetadataRoute } from "next";
import { services } from "@/lib/services-data";
import { industries } from "@/lib/industries-data";

// NOTE: replace with the real production domain once it's confirmed —
// currently set to the placeholder used elsewhere in the project. Vercel
// preview URLs should never be the canonical domain in the sitemap.
const BASE_URL = "https://www.cyberxperts.co.za";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/products",
    "/resources",
    "/careers",
    "/security-pre-assessment",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const industryRoutes = industries.map((i) => ({
    url: `${BASE_URL}/industries/${i.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...industryRoutes];
}
