import siteContentJson from "@/content/site-content.json";

export type NavLink = {
  id: string;
  type: "link" | "dropdown";
  label: string;
  href?: string;
  dropdownSource?: "services" | "industries";
};

export type PageIntro = {
  eyebrow: string;
  headline: string;
  description: string;
};

export type SiteContent = {
  nav: { links: NavLink[] };
  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    supportingText: string;
    primaryButtonText: string;
    primaryButtonHref: string;
    secondaryButtonText: string;
    secondaryButtonHref: string;
  };
  trustStrip: { title: string; desc: string; href: string }[];
  stats: {
    eyebrow: string;
    heading: string;
    items: { value: number; label: string }[];
  };
  footer: {
    locationText: string;
    tagline: string;
    badges: string[];
    socials: { name: string; href: string }[];
    copyrightText: string;
  };
  company: {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    phoneDisplay: string;
    phoneHref: string;
    email: string;
    whatsappNumber: string;
    whatsappMessage: string;
    emergencyPhoneHref: string;
    emergencyWhatsappNumber: string;
  };
  branding: {
    logoPath: string;
    faviconPath32: string;
    faviconPath192: string;
    faviconPath180: string;
  };
  pages: {
    products: PageIntro;
    resources: PageIntro & { categories: { title: string; desc: string }[] };
    careers: PageIntro;
    contact: PageIntro & { faqs: { q: string; a: string }[] };
  };
};

export const siteContent: SiteContent = siteContentJson as SiteContent;
