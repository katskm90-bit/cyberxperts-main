"use client";

import { useState } from "react";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { Eyebrow, SectionHeading, DisplayHeading, Section } from "@/app/components/ui";
import { partners, getAllCategories } from "@/lib/products-data";
import { siteContent } from "@/lib/site-content";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = getAllCategories();
  const { products } = siteContent.pages;

  const filteredPartners = activeCategory
    ? partners
        .map((p) => ({ ...p, products: p.products.filter((prod) => prod.category === activeCategory) }))
        .filter((p) => p.products.length > 0)
    : partners;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden pb-16 pt-36 lg:pt-44">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="photo-scrim-navy absolute inset-0" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
            <Eyebrow>{products.eyebrow}</Eyebrow>
            <DisplayHeading className="mt-6 max-w-3xl !text-5xl sm:!text-6xl lg:!text-7xl">
              {products.headline}
            </DisplayHeading>
            <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-ink-muted">
              {products.description}
            </p>
          </div>
        </section>

        <Section className="border-t border-border-dark">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full border px-4 py-2 font-body text-xs font-semibold transition-colors ${
                activeCategory === null
                  ? "border-accent-navy-bright bg-accent-navy text-white"
                  : "border-border-dark text-ink-muted hover:border-accent-navy-bright"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-2 font-body text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? "border-accent-navy-bright bg-accent-navy text-white"
                    : "border-border-dark text-ink-muted hover:border-accent-navy-bright"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-12">
            {filteredPartners.map((partner) => (
              <div key={partner.slug} className="border-t border-border-dark pt-8">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-2xl font-black text-ink-primary">{partner.name}</h2>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                    {Array.from(new Set(partner.products.map((p) => p.category))).join(" · ")}
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border-dark bg-border-dark sm:grid-cols-2 lg:grid-cols-3">
                  {partner.products.map((product) => (
                    <div key={product.id} className="bg-bg-secondary p-6">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-accent-gold">{product.category}</p>
                      <h3 className="mt-2 font-display text-base font-bold text-ink-primary">{product.name}</h3>
                      <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{product.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 font-body text-xs text-ink-faint">
            Product listings reflect Cyberxperts&apos; partner relationships and solution
            categories. Specific product names and availability should be confirmed directly
            with our team, as vendor lineups are updated regularly.
          </p>
        </Section>

        <Section light className="border-t border-border-light text-center">
          <SectionHeading className="mx-auto max-w-2xl">
            Not sure which solution fits your environment?
          </SectionHeading>
          <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-ink-on-light-muted">
            Speak with our team about the right combination of products and services for your
            organisation.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="/contact#consultation"
              className="inline-flex items-center gap-2 rounded-sm bg-accent-red px-6 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-red-bright"
            >
              Talk to an Expert →
            </a>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
