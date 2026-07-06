import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { PageHero } from "@/app/components/PageHero";
import { Eyebrow, Section } from "@/app/components/ui";
import ContactForm from "@/app/components/ContactForm";
import { siteContent } from "@/lib/site-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Cyberxperts",
  description:
    "Book a consultation, request a security assessment, or get in touch directly with Cyberxperts. We respond to every enquiry personally.",
};

export default function ContactPage() {
  const { contact } = siteContent.pages;
  const { company } = siteContent;
  const fullAddress = `${company.addressLine1}, ${company.addressLine2}, ${company.addressLine3}`;
  const mapQuery = encodeURIComponent(fullAddress);

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={contact.eyebrow}
          title={contact.headline}
          description={contact.description}
          gradient="gold"
          image="https://images.pexels.com/photos/5324992/pexels-photo-5324992.jpeg?auto=compress&cs=tinysrgb&w=1600"
        />

        <Section id="consultation" className="border-t border-border-dark">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>Send a Message</Eyebrow>
              <ContactForm />
            </div>

            <div className="lg:col-span-5">
              <Eyebrow>Office</Eyebrow>
              <div className="mt-6 font-body text-base leading-relaxed text-ink-muted">
                <p>{company.addressLine1}</p>
                <p>{company.addressLine2}</p>
                <p>{company.addressLine3}</p>
                <p className="mt-4">
                  <a href={`tel:${company.phoneHref}`} className="text-ink-primary hover:text-accent-navy-bright">{company.phoneDisplay}</a>
                </p>
                <p>
                  <a href={`mailto:${company.email}`} className="text-ink-primary hover:text-accent-navy-bright">{company.email}</a>
                </p>
              </div>

              <a
                href={`https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(company.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-3 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <svg viewBox="0 0 32 32" className="h-4 w-4 fill-white">
                  <path d="M16.04 4C9.4 4 4 9.32 4 15.87c0 2.1.56 4.16 1.62 5.97L4 28l6.36-1.63a12.2 12.2 0 0 0 5.68 1.4h.01c6.64 0 12.04-5.32 12.04-11.87C28.09 9.32 22.69 4 16.04 4zm0 21.7h-.01a10.2 10.2 0 0 1-5.13-1.4l-.37-.21-3.77.97 1-3.62-.24-.37a9.7 9.7 0 0 1-1.5-5.2c0-5.4 4.46-9.8 9.95-9.8 2.66 0 5.16 1.02 7.04 2.87a9.65 9.65 0 0 1 2.92 6.93c0 5.4-4.47 9.8-9.95 9.8z" />
                </svg>
                Chat on WhatsApp
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mt-6 block h-[260px] overflow-hidden rounded-sm border border-border-dark"
              >
                <iframe
                  title="Cyberxperts office location"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  className="h-full w-full pointer-events-none"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-bg-primary/50 to-transparent p-5 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-sm bg-accent-red px-4 py-2 font-body text-xs font-semibold text-white">
                    Open in Google Maps →
                  </span>
                </div>
              </a>
            </div>
          </div>
        </Section>

        <Section light className="border-t border-border-light">
          <Eyebrow>Frequently Asked Questions</Eyebrow>
          <div className="mt-8 divide-y divide-border-light border-y border-border-light">
            {contact.faqs.map((f) => (
              <div key={f.q} className="py-6">
                <h3 className="font-display text-base font-bold">{f.q}</h3>
                <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-ink-on-light-muted">{f.a}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
