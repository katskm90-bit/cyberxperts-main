import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";
import GlobalCyberBackground from "./components/GlobalCyberBackground";
import { siteContent } from "@/lib/site-content";

// NOTE: replace with the real production domain once confirmed (must match
// app/sitemap.ts and app/robots.ts) — a Vercel preview URL should never be
// the canonical/OG domain.
const BASE_URL = "https://www.cyberxperts.co.za";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Cyberxperts | Cyber Security & Managed IT Services",
    template: "%s",
  },
  description:
    "Cyberxperts provides cyber security, IT, and cloud services to South African and SADC businesses, reducing risk and protecting critical systems and data.",
  icons: {
    icon: [
      { url: siteContent.branding.faviconPath32, sizes: "32x32", type: "image/png" },
      { url: siteContent.branding.faviconPath192, sizes: "192x192", type: "image/png" },
    ],
    apple: siteContent.branding.faviconPath180,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Cyberxperts",
    title: "Cyberxperts | Cyber Security & Managed IT Services",
    description:
      "Cyberxperts provides cyber security, IT, and cloud services to South African and SADC businesses, reducing risk and protecting critical systems and data.",
    // TODO: swap in a proper 1200x630 social share image before launch —
    // this is a raster fallback, not a designed OG card.
    images: [siteContent.branding.faviconPath192],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyberxperts | Cyber Security & Managed IT Services",
    description:
      "Cyberxperts provides cyber security, IT, and cloud services to South African and SADC businesses, reducing risk and protecting critical systems and data.",
    images: [siteContent.branding.faviconPath192],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Cyberxperts",
  description:
    "Cyber security and IT services company providing managed security, risk assessment, penetration testing, and compliance services to businesses across South Africa and the SADC region.",
  url: BASE_URL,
  telephone: siteContent.company.phoneHref,
  email: siteContent.company.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${siteContent.company.addressLine1}, ${siteContent.company.addressLine2}`,
    addressLocality: siteContent.company.addressLine3,
    addressCountry: "ZA",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Southern African Development Community (SADC)",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <GlobalCyberBackground />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
