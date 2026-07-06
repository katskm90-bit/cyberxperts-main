import jobListingsJson from "@/content/careers.json";

export type JobListing = {
  slug: string;
  title: string;
  department: string;
  contractType: string;
  address: string;
  specs: string[];
  summary: string;
  closingDate: string; // ISO date string (e.g. "2026-08-31") or "" if none set
};

// Content lives in content/careers.json — the admin tool reads/writes that
// file directly. Listings stay visible until manually removed, regardless
// of closing date (closing date is informational/display only).
export const jobListings: JobListing[] = jobListingsJson as JobListing[];

export function getJob(slug: string) {
  return jobListings.find((j) => j.slug === slug);
}
