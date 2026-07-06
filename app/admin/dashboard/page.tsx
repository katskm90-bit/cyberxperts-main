"use client";

import { useEffect, useState } from "react";
import type { SiteContent, NavLink } from "@/lib/site-content";
import type { ServiceContent } from "@/lib/services-data";
import type { IndustryContent } from "@/lib/industries-data";
import type { Partner, Product } from "@/lib/products-data";
import type { JobListing } from "@/lib/careers-data";
import type { ApplicationRecord } from "@/lib/blob";
import type { ResourceArticle } from "@/lib/resources-data";

type Tab = "homepage" | "nav" | "services" | "industries" | "products" | "jobs" | "applications" | "articles" | "pages" | "company" | "branding" | "settings";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [services, setServices] = useState<ServiceContent[] | null>(null);
  const [industries, setIndustries] = useState<IndustryContent[] | null>(null);
  const [products, setProducts] = useState<Partner[] | null>(null);
  const [productCategories, setProductCategories] = useState<string[] | null>(null);
  const [careers, setCareers] = useState<JobListing[] | null>(null);
  const [resourceArticles, setResourceArticles] = useState<ResourceArticle[] | null>(null);
  const [tab, setTab] = useState<Tab>("homepage");
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load content — you may need to log in again.");
        return r.json();
      })
      .then((data) => {
        setSiteContent(data.siteContent);
        setServices(data.services);
        setIndustries(data.industries);
        setProducts(data.products);
        setProductCategories(data.productCategories);
        setCareers(data.careers);
        setResourceArticles(data.resourceArticles);
        setLoading(false);
      })
      .catch((err) => {
        setLoadError(err.message);
        setLoading(false);
      });
  }, []);

  async function handlePublish() {
    setPublishing(true);
    setPublishMessage(null);
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteContent,
          services,
          industries,
          products,
          productCategories,
          careers,
          resourceArticles,
          commitMessage: "Update content via admin panel",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed.");
      setPublishMessage({
        type: "ok",
        text: `Published successfully (${data.published.join(", ")}). Vercel is now rebuilding — changes go live in a minute or two.`,
      });
    } catch (err) {
      setPublishMessage({ type: "error", text: err instanceof Error ? err.message : "Publish failed." });
    } finally {
      setPublishing(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-primary">
        <p className="font-body text-sm text-ink-muted">Loading content…</p>
      </main>
    );
  }

  if (loadError || !siteContent || !services || !industries || !products || !productCategories || !careers || !resourceArticles) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-primary px-6 text-center">
        <p className="font-body text-sm text-accent-red-bright">{loadError || "Something went wrong loading content."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border-dark bg-bg-primary/95 px-6 py-4 backdrop-blur-md">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-accent-navy-bright">Cyberxperts</p>
          <h1 className="font-display text-lg font-bold text-ink-primary">Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="rounded-sm bg-accent-red px-5 py-2.5 font-body text-sm font-bold text-white transition-colors hover:bg-accent-red-bright disabled:opacity-50"
          >
            {publishing ? "Publishing…" : "Publish Changes"}
          </button>
          <button onClick={handleLogout} className="font-body text-sm text-ink-muted hover:text-ink-primary">
            Log Out
          </button>
        </div>
      </header>

      {publishMessage && (
        <div
          className={`mx-6 mt-4 border p-4 font-body text-sm ${
            publishMessage.type === "ok"
              ? "border-accent-navy-bright/40 bg-accent-navy/10 text-ink-primary"
              : "border-accent-red-bright/40 bg-accent-red/10 text-accent-red-bright"
          }`}
        >
          {publishMessage.text}
        </div>
      )}

      <nav className="mt-6 flex flex-wrap gap-2 border-b border-border-dark px-6">
        {(["homepage", "nav", "services", "industries", "products", "jobs", "applications", "articles", "pages", "company", "branding", "settings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-3 font-body text-sm font-medium capitalize transition-colors ${
              tab === t ? "border-accent-red-bright text-ink-primary" : "border-transparent text-ink-muted hover:text-ink-primary"
            }`}
          >
            {t === "nav" ? "Navigation" : t === "company" ? "Company & Footer" : t === "pages" ? "Other Pages" : t === "jobs" ? "Job Listings" : t === "articles" ? "Resources" : t}
          </button>
        ))}
      </nav>

      <div className="px-6 py-8">
        {tab === "homepage" && <HomepageEditor siteContent={siteContent} setSiteContent={setSiteContent} />}
        {tab === "nav" && <NavEditor siteContent={siteContent} setSiteContent={setSiteContent} />}
        {tab === "services" && <ServicesEditor services={services} setServices={setServices} />}
        {tab === "industries" && <IndustriesEditor industries={industries} setIndustries={setIndustries} />}
        {tab === "products" && (
          <ProductsEditor
            products={products}
            setProducts={setProducts}
            productCategories={productCategories}
            setProductCategories={setProductCategories}
          />
        )}
        {tab === "jobs" && <JobsEditor careers={careers} setCareers={setCareers} />}
        {tab === "applications" && <ApplicationsViewer />}
        {tab === "articles" && <ArticlesEditor articles={resourceArticles} setArticles={setResourceArticles} />}
        {tab === "pages" && <PagesEditor siteContent={siteContent} setSiteContent={setSiteContent} />}
        {tab === "company" && <CompanyFooterEditor siteContent={siteContent} setSiteContent={setSiteContent} />}
        {tab === "branding" && <BrandingEditor siteContent={siteContent} setSiteContent={setSiteContent} />}
        {tab === "settings" && <SettingsEditor />}
      </div>
    </main>
  );
}

// ---------- Shared field components ----------

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-faint">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full border border-border-dark bg-bg-secondary px-3 py-2.5 font-body text-sm text-ink-primary outline-none focus:border-accent-navy-bright";

const smallBtn = "rounded-sm border border-border-dark px-3 py-1.5 font-body text-xs text-ink-primary hover:border-accent-navy-bright";
const dangerBtn = "font-body text-xs text-accent-red-bright hover:underline";

function ImageField({ value, onChange }: { value?: string; onChange: (path: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} className={inputClass} placeholder="Image URL or path" />
      <div className="mt-2 flex items-center gap-3">
        <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={handleFile} className="font-body text-xs text-ink-muted" />
        {uploading && <span className="font-body text-xs text-ink-faint">Uploading…</span>}
      </div>
      {error && <p className="mt-1 font-body text-xs text-accent-red-bright">{error}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 h-24 w-40 object-cover border border-border-dark" />
      )}
    </div>
  );
}

// ---------- Navigation editor ----------

function NavEditor({
  siteContent,
  setSiteContent,
}: {
  siteContent: SiteContent;
  setSiteContent: (c: SiteContent) => void;
}) {
  const links = siteContent.nav.links;

  function updateLink(idx: number, patch: Partial<NavLink>) {
    const next = links.map((l, i) => (i === idx ? { ...l, ...patch } : l));
    setSiteContent({ ...siteContent, nav: { links: next } });
  }

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[idx], next[target]] = [next[target], next[idx]];
    setSiteContent({ ...siteContent, nav: { links: next } });
  }

  function remove(idx: number) {
    setSiteContent({ ...siteContent, nav: { links: links.filter((_, i) => i !== idx) } });
  }

  function addLink() {
    setSiteContent({
      ...siteContent,
      nav: { links: [...links, { id: `link-${Date.now()}`, type: "link", label: "New Link", href: "/" }] },
    });
  }

  return (
    <div className="max-w-2xl">
      <p className="mb-4 font-body text-sm text-ink-muted">
        Reorder with the arrows. &quot;Services&quot; and &quot;Industries&quot; are dropdown menus — their submenu items come from the
        Services and Industries tabs, not here.
      </p>
      <div className="flex flex-col gap-3">
        {links.map((link, idx) => (
          <div key={link.id} className="flex items-center gap-3 border border-border-dark bg-bg-secondary p-4">
            <div className="flex flex-col gap-1">
              <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-ink-muted hover:text-ink-primary disabled:opacity-20">▲</button>
              <button onClick={() => move(idx, 1)} disabled={idx === links.length - 1} className="text-ink-muted hover:text-ink-primary disabled:opacity-20">▼</button>
            </div>
            <div className="flex-1">
              <input value={link.label} onChange={(e) => updateLink(idx, { label: e.target.value })} className={inputClass} placeholder="Label" />
              {link.type === "link" ? (
                <input value={link.href || ""} onChange={(e) => updateLink(idx, { href: e.target.value })} className={`${inputClass} mt-2`} placeholder="URL (e.g. /about)" />
              ) : (
                <p className="mt-2 font-mono text-xs text-ink-faint">Dropdown — source: {link.dropdownSource}</p>
              )}
            </div>
            <button onClick={() => remove(idx)} className={dangerBtn}>Remove</button>
          </div>
        ))}
      </div>
      <button onClick={addLink} className={`mt-4 ${smallBtn}`}>+ Add Link</button>
    </div>
  );
}

// ---------- Homepage editor (hero, trust strip, stats) ----------

function HomepageEditor({
  siteContent,
  setSiteContent,
}: {
  siteContent: SiteContent;
  setSiteContent: (c: SiteContent) => void;
}) {
  const { hero, trustStrip, stats } = siteContent;

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Hero Section</h2>
        <div className="flex flex-col gap-4">
          <Field label="Eyebrow text">
            <input className={inputClass} value={hero.eyebrow} onChange={(e) => setSiteContent({ ...siteContent, hero: { ...hero, eyebrow: e.target.value } })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Headline — line 1">
              <input className={inputClass} value={hero.headlineLine1} onChange={(e) => setSiteContent({ ...siteContent, hero: { ...hero, headlineLine1: e.target.value } })} />
            </Field>
            <Field label="Headline — line 2">
              <input className={inputClass} value={hero.headlineLine2} onChange={(e) => setSiteContent({ ...siteContent, hero: { ...hero, headlineLine2: e.target.value } })} />
            </Field>
          </div>
          <Field label="Supporting text">
            <textarea rows={3} className={inputClass} value={hero.supportingText} onChange={(e) => setSiteContent({ ...siteContent, hero: { ...hero, supportingText: e.target.value } })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary button text">
              <input className={inputClass} value={hero.primaryButtonText} onChange={(e) => setSiteContent({ ...siteContent, hero: { ...hero, primaryButtonText: e.target.value } })} />
            </Field>
            <Field label="Primary button URL">
              <input className={inputClass} value={hero.primaryButtonHref} onChange={(e) => setSiteContent({ ...siteContent, hero: { ...hero, primaryButtonHref: e.target.value } })} />
            </Field>
            <Field label="Secondary button text">
              <input className={inputClass} value={hero.secondaryButtonText} onChange={(e) => setSiteContent({ ...siteContent, hero: { ...hero, secondaryButtonText: e.target.value } })} />
            </Field>
            <Field label="Secondary button URL">
              <input className={inputClass} value={hero.secondaryButtonHref} onChange={(e) => setSiteContent({ ...siteContent, hero: { ...hero, secondaryButtonHref: e.target.value } })} />
            </Field>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Trust Strip (4 items)</h2>
        <div className="flex flex-col gap-4">
          {trustStrip.map((item, idx) => (
            <div key={idx} className="border border-border-dark bg-bg-secondary p-4">
              <div className="grid grid-cols-2 gap-3">
                <input className={inputClass} value={item.title} placeholder="Title" onChange={(e) => {
                  const next = [...trustStrip]; next[idx] = { ...next[idx], title: e.target.value };
                  setSiteContent({ ...siteContent, trustStrip: next });
                }} />
                <input className={inputClass} value={item.href} placeholder="Link URL (optional)" onChange={(e) => {
                  const next = [...trustStrip]; next[idx] = { ...next[idx], href: e.target.value };
                  setSiteContent({ ...siteContent, trustStrip: next });
                }} />
              </div>
              <input className={`${inputClass} mt-3`} value={item.desc} placeholder="Description" onChange={(e) => {
                const next = [...trustStrip]; next[idx] = { ...next[idx], desc: e.target.value };
                setSiteContent({ ...siteContent, trustStrip: next });
              }} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Stats Section</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eyebrow">
            <input className={inputClass} value={stats.eyebrow} onChange={(e) => setSiteContent({ ...siteContent, stats: { ...stats, eyebrow: e.target.value } })} />
          </Field>
          <Field label="Heading">
            <input className={inputClass} value={stats.heading} onChange={(e) => setSiteContent({ ...siteContent, stats: { ...stats, heading: e.target.value } })} />
          </Field>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.items.map((item, idx) => (
            <div key={idx} className="border border-border-dark bg-bg-secondary p-4">
              <Field label="Number">
                <input type="number" className={inputClass} value={item.value} onChange={(e) => {
                  const next = [...stats.items]; next[idx] = { ...next[idx], value: Number(e.target.value) };
                  setSiteContent({ ...siteContent, stats: { ...stats, items: next } });
                }} />
              </Field>
              <div className="mt-2">
                <Field label="Label">
                  <input className={inputClass} value={item.label} onChange={(e) => {
                    const next = [...stats.items]; next[idx] = { ...next[idx], label: e.target.value };
                    setSiteContent({ ...siteContent, stats: { ...stats, items: next } });
                  }} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------- Company & Footer editor ----------

function CompanyFooterEditor({
  siteContent,
  setSiteContent,
}: {
  siteContent: SiteContent;
  setSiteContent: (c: SiteContent) => void;
}) {
  const { company, footer } = siteContent;

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Company Contact Details</h2>
        <p className="mb-4 font-body text-sm text-ink-muted">
          These feed the footer, the Contact page (including the embedded map), and the WhatsApp button
          automatically — one place to update them everywhere.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Address line 1"><input className={inputClass} value={company.addressLine1} onChange={(e) => setSiteContent({ ...siteContent, company: { ...company, addressLine1: e.target.value } })} /></Field>
          <Field label="Address line 2"><input className={inputClass} value={company.addressLine2} onChange={(e) => setSiteContent({ ...siteContent, company: { ...company, addressLine2: e.target.value } })} /></Field>
          <Field label="Address line 3"><input className={inputClass} value={company.addressLine3} onChange={(e) => setSiteContent({ ...siteContent, company: { ...company, addressLine3: e.target.value } })} /></Field>
          <Field label="Email"><input className={inputClass} value={company.email} onChange={(e) => setSiteContent({ ...siteContent, company: { ...company, email: e.target.value } })} /></Field>
          <Field label="Phone (displayed, e.g. 011 568 6725)"><input className={inputClass} value={company.phoneDisplay} onChange={(e) => setSiteContent({ ...siteContent, company: { ...company, phoneDisplay: e.target.value } })} /></Field>
          <Field label="Phone (dial format, e.g. +27115686725)"><input className={inputClass} value={company.phoneHref} onChange={(e) => setSiteContent({ ...siteContent, company: { ...company, phoneHref: e.target.value } })} /></Field>
          <Field label="WhatsApp number (digits only)"><input className={inputClass} value={company.whatsappNumber} onChange={(e) => setSiteContent({ ...siteContent, company: { ...company, whatsappNumber: e.target.value } })} /></Field>
          <Field label="WhatsApp default message"><input className={inputClass} value={company.whatsappMessage} onChange={(e) => setSiteContent({ ...siteContent, company: { ...company, whatsappMessage: e.target.value } })} /></Field>
          <Field label="Emergency phone (dial format)"><input className={inputClass} value={company.emergencyPhoneHref} onChange={(e) => setSiteContent({ ...siteContent, company: { ...company, emergencyPhoneHref: e.target.value } })} /></Field>
          <Field label="Emergency WhatsApp number (digits only)"><input className={inputClass} value={company.emergencyWhatsappNumber} onChange={(e) => setSiteContent({ ...siteContent, company: { ...company, emergencyWhatsappNumber: e.target.value } })} /></Field>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Footer</h2>
        <div className="flex flex-col gap-4">
          <Field label="Tagline (under the logo)">
            <textarea rows={2} className={inputClass} value={footer.tagline} onChange={(e) => setSiteContent({ ...siteContent, footer: { ...footer, tagline: e.target.value } })} />
          </Field>
          <Field label="Certification badges (comma-separated)">
            <input className={inputClass} value={footer.badges.join(", ")} onChange={(e) => setSiteContent({ ...siteContent, footer: { ...footer, badges: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })} />
          </Field>
          <Field label="Location line (bottom of footer)">
            <input className={inputClass} value={footer.locationText} onChange={(e) => setSiteContent({ ...siteContent, footer: { ...footer, locationText: e.target.value } })} />
          </Field>
          <Field label="Copyright text (use {year} for the current year)">
            <input className={inputClass} value={footer.copyrightText} onChange={(e) => setSiteContent({ ...siteContent, footer: { ...footer, copyrightText: e.target.value } })} />
          </Field>
          <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">Social links</p>
          {footer.socials.map((s, idx) => (
            <div key={s.name} className="grid grid-cols-2 gap-3">
              <input className={inputClass} value={s.name} disabled />
              <input className={inputClass} value={s.href} placeholder="URL" onChange={(e) => {
                const next = [...footer.socials]; next[idx] = { ...next[idx], href: e.target.value };
                setSiteContent({ ...siteContent, footer: { ...footer, socials: next } });
              }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------- Branding editor (logo + favicon) ----------

function BrandingEditor({
  siteContent,
  setSiteContent,
}: {
  siteContent: SiteContent;
  setSiteContent: (c: SiteContent) => void;
}) {
  const { branding } = siteContent;

  return (
    <div className="flex max-w-xl flex-col gap-10">
      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-ink-primary">Site Logo</h2>
        <p className="mb-4 font-body text-sm text-ink-muted">
          Used in the header and footer. SVG recommended for crispness at any size, but PNG/JPG/WebP also work.
        </p>
        <ImageField value={branding.logoPath} onChange={(path) => setSiteContent({ ...siteContent, branding: { ...branding, logoPath: path } })} />
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold text-ink-primary">Favicon</h2>
        <p className="mb-4 font-body text-sm text-ink-muted">
          The small icon shown in browser tabs and bookmarks. Upload one square image (PNG recommended,
          512×512 or larger) — it's used for all icon sizes the site needs.
        </p>
        <ImageField
          value={branding.faviconPath32}
          onChange={(path) =>
            setSiteContent({
              ...siteContent,
              branding: { ...branding, faviconPath32: path, faviconPath192: path, faviconPath180: path },
            })
          }
        />
      </section>
    </div>
  );
}

// ---------- Other Pages editor ----------

function PagesEditor({
  siteContent,
  setSiteContent,
}: {
  siteContent: SiteContent;
  setSiteContent: (c: SiteContent) => void;
}) {
  const { pages } = siteContent;

  function updatePage<K extends keyof SiteContent["pages"]>(key: K, patch: Partial<SiteContent["pages"][K]>) {
    setSiteContent({ ...siteContent, pages: { ...pages, [key]: { ...pages[key], ...patch } } });
  }

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Products Page</h2>
        <div className="flex flex-col gap-4">
          <Field label="Eyebrow"><input className={inputClass} value={pages.products.eyebrow} onChange={(e) => updatePage("products", { eyebrow: e.target.value })} /></Field>
          <Field label="Headline"><input className={inputClass} value={pages.products.headline} onChange={(e) => updatePage("products", { headline: e.target.value })} /></Field>
          <Field label="Description"><textarea rows={2} className={inputClass} value={pages.products.description} onChange={(e) => updatePage("products", { description: e.target.value })} /></Field>
        </div>
        <p className="mt-2 font-body text-xs text-ink-faint">Partner/product list itself is edited on the Products tab.</p>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Resources Page</h2>
        <div className="flex flex-col gap-4">
          <Field label="Eyebrow"><input className={inputClass} value={pages.resources.eyebrow} onChange={(e) => updatePage("resources", { eyebrow: e.target.value })} /></Field>
          <Field label="Headline"><input className={inputClass} value={pages.resources.headline} onChange={(e) => updatePage("resources", { headline: e.target.value })} /></Field>
          <Field label="Description"><textarea rows={2} className={inputClass} value={pages.resources.description} onChange={(e) => updatePage("resources", { description: e.target.value })} /></Field>
          {pages.resources.categories.map((c, idx) => (
            <div key={idx} className="border border-border-dark bg-bg-secondary p-4">
              <input className={inputClass} value={c.title} placeholder="Category title" onChange={(e) => {
                const next = [...pages.resources.categories]; next[idx] = { ...next[idx], title: e.target.value };
                updatePage("resources", { categories: next });
              }} />
              <textarea rows={2} className={`${inputClass} mt-2`} value={c.desc} placeholder="Description" onChange={(e) => {
                const next = [...pages.resources.categories]; next[idx] = { ...next[idx], desc: e.target.value };
                updatePage("resources", { categories: next });
              }} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Careers Page (intro text)</h2>
        <div className="flex flex-col gap-4">
          <Field label="Eyebrow"><input className={inputClass} value={pages.careers.eyebrow} onChange={(e) => updatePage("careers", { eyebrow: e.target.value })} /></Field>
          <Field label="Headline"><input className={inputClass} value={pages.careers.headline} onChange={(e) => updatePage("careers", { headline: e.target.value })} /></Field>
          <Field label="Description"><textarea rows={2} className={inputClass} value={pages.careers.description} onChange={(e) => updatePage("careers", { description: e.target.value })} /></Field>
        </div>
        <p className="mt-2 font-body text-xs text-ink-faint">Job listings themselves are on the &quot;Job Listings&quot; tab.</p>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Contact Page</h2>
        <div className="flex flex-col gap-4">
          <Field label="Eyebrow"><input className={inputClass} value={pages.contact.eyebrow} onChange={(e) => updatePage("contact", { eyebrow: e.target.value })} /></Field>
          <Field label="Headline"><input className={inputClass} value={pages.contact.headline} onChange={(e) => updatePage("contact", { headline: e.target.value })} /></Field>
          <Field label="Description"><textarea rows={2} className={inputClass} value={pages.contact.description} onChange={(e) => updatePage("contact", { description: e.target.value })} /></Field>
          <p className="mt-2 font-mono text-xs uppercase tracking-wide text-ink-faint">FAQs</p>
          {pages.contact.faqs.map((f, idx) => (
            <div key={idx} className="border border-border-dark bg-bg-secondary p-4">
              <input className={inputClass} value={f.q} placeholder="Question" onChange={(e) => {
                const next = [...pages.contact.faqs]; next[idx] = { ...next[idx], q: e.target.value };
                updatePage("contact", { faqs: next });
              }} />
              <textarea rows={2} className={`${inputClass} mt-2`} value={f.a} placeholder="Answer" onChange={(e) => {
                const next = [...pages.contact.faqs]; next[idx] = { ...next[idx], a: e.target.value };
                updatePage("contact", { faqs: next });
              }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------- Services editor ----------

function ServicesEditor({
  services,
  setServices,
}: {
  services: ServiceContent[];
  setServices: (s: ServiceContent[]) => void;
}) {
  const [selectedSlug, setSelectedSlug] = useState(services[0]?.slug);
  const selectedIdx = services.findIndex((s) => s.slug === selectedSlug);
  const service = services[selectedIdx];

  function update(patch: Partial<ServiceContent>) {
    const next = [...services];
    next[selectedIdx] = { ...next[selectedIdx], ...patch };
    setServices(next);
  }

  if (!service) return null;

  return (
    <div className="flex gap-8">
      <div className="w-64 shrink-0">
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-faint">Select a service</p>
        <div className="flex flex-col gap-1">
          {services.map((s) => (
            <button key={s.slug} onClick={() => setSelectedSlug(s.slug)} className={`px-3 py-2 text-left font-body text-sm ${s.slug === selectedSlug ? "bg-bg-tertiary text-ink-primary" : "text-ink-muted hover:text-ink-primary"}`}>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex max-w-2xl flex-1 flex-col gap-4">
        <Field label="Name"><input className={inputClass} value={service.name} onChange={(e) => update({ name: e.target.value })} /></Field>
        <Field label="Summary (shown on cards and hero)"><textarea rows={2} className={inputClass} value={service.summary} onChange={(e) => update({ summary: e.target.value })} /></Field>
        <Field label="Overview (full page text)"><textarea rows={4} className={inputClass} value={service.overview} onChange={(e) => update({ overview: e.target.value })} /></Field>
        <Field label="Problems this addresses (one per line)">
          <textarea rows={4} className={inputClass} value={service.problems.join("\n")} onChange={(e) => update({ problems: e.target.value.split("\n").filter(Boolean) })} />
        </Field>
        <Field label="Benefits (one per line)">
          <textarea rows={4} className={inputClass} value={service.benefits.join("\n")} onChange={(e) => update({ benefits: e.target.value.split("\n").filter(Boolean) })} />
        </Field>
        <Field label="Hero / card image"><ImageField value={service.image} onChange={(path) => update({ image: path })} /></Field>
        <p className="font-body text-xs text-ink-faint">
          Process steps and FAQs aren&apos;t editable here yet — tell me if you need those exposed too.
        </p>
      </div>
    </div>
  );
}

// ---------- Industries editor ----------

function IndustriesEditor({
  industries,
  setIndustries,
}: {
  industries: IndustryContent[];
  setIndustries: (i: IndustryContent[]) => void;
}) {
  const [selectedSlug, setSelectedSlug] = useState(industries[0]?.slug);
  const selectedIdx = industries.findIndex((i) => i.slug === selectedSlug);
  const industry = industries[selectedIdx];

  function update(patch: Partial<IndustryContent>) {
    const next = [...industries];
    next[selectedIdx] = { ...next[selectedIdx], ...patch };
    setIndustries(next);
  }

  if (!industry) return null;

  return (
    <div className="flex gap-8">
      <div className="w-64 shrink-0">
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-faint">Select an industry</p>
        <div className="flex flex-col gap-1">
          {industries.map((i) => (
            <button key={i.slug} onClick={() => setSelectedSlug(i.slug)} className={`px-3 py-2 text-left font-body text-sm ${i.slug === selectedSlug ? "bg-bg-tertiary text-ink-primary" : "text-ink-muted hover:text-ink-primary"}`}>
              {i.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex max-w-2xl flex-1 flex-col gap-4">
        <Field label="Name"><input className={inputClass} value={industry.name} onChange={(e) => update({ name: e.target.value })} /></Field>
        <Field label="Summary"><textarea rows={2} className={inputClass} value={industry.summary} onChange={(e) => update({ summary: e.target.value })} /></Field>
        <Field label="Context (full page text)"><textarea rows={5} className={inputClass} value={industry.context} onChange={(e) => update({ context: e.target.value })} /></Field>
        <Field label="Hero image"><ImageField value={industry.image} onChange={(path) => update({ image: path })} /></Field>
      </div>
    </div>
  );
}

// ---------- Products editor: partners, products, and categories, all with add/edit/delete ----------

function ProductsEditor({
  products,
  setProducts,
  productCategories,
  setProductCategories,
}: {
  products: Partner[];
  setProducts: (p: Partner[]) => void;
  productCategories: string[];
  setProductCategories: (c: string[]) => void;
}) {
  const [selectedSlug, setSelectedSlug] = useState(products[0]?.slug);
  const [newCategoryName, setNewCategoryName] = useState("");
  const selectedIdx = products.findIndex((p) => p.slug === selectedSlug);
  const partner = products[selectedIdx];

  function updatePartner(patch: Partial<Partner>) {
    const next = [...products];
    next[selectedIdx] = { ...next[selectedIdx], ...patch };
    setProducts(next);
  }

  function addPartner() {
    const slug = `partner-${Date.now()}`;
    const next = [...products, { slug, name: "New Partner", products: [] }];
    setProducts(next);
    setSelectedSlug(slug);
  }

  function deletePartner(slug: string) {
    if (!confirm("Delete this partner and all its products? This cannot be undone until you publish again.")) return;
    const next = products.filter((p) => p.slug !== slug);
    setProducts(next);
    if (selectedSlug === slug) setSelectedSlug(next[0]?.slug);
  }

  function addProduct() {
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: "New Product",
      category: productCategories[0] || "Uncategorised",
      description: "",
    };
    updatePartner({ products: [...partner.products, newProduct] });
  }

  function updateProduct(prodId: string, patch: Partial<Product>) {
    updatePartner({ products: partner.products.map((p) => (p.id === prodId ? { ...p, ...patch } : p)) });
  }

  function deleteProduct(prodId: string) {
    updatePartner({ products: partner.products.filter((p) => p.id !== prodId) });
  }

  function addCategory() {
    const name = newCategoryName.trim();
    if (!name || productCategories.includes(name)) return;
    setProductCategories([...productCategories, name]);
    setNewCategoryName("");
  }

  function renameCategory(oldName: string, newName: string) {
    if (!newName.trim() || newName === oldName) return;
    setProductCategories(productCategories.map((c) => (c === oldName ? newName : c)));
    // Keep every product referencing the old name in sync
    setProducts(products.map((p) => ({ ...p, products: p.products.map((prod) => (prod.category === oldName ? { ...prod, category: newName } : prod)) })));
  }

  function deleteCategory(name: string) {
    const inUse = products.some((p) => p.products.some((prod) => prod.category === name));
    if (inUse && !confirm(`"${name}" is still used by one or more products. Delete it anyway? Those products will keep the old category name as free text until you reassign them.`)) return;
    setProductCategories(productCategories.filter((c) => c !== name));
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Categories</h2>
        <p className="mb-4 font-body text-sm text-ink-muted">
          Manage the global category list here. New categories become available in the dropdown when adding or
          editing a product.
        </p>
        <div className="flex flex-wrap gap-2">
          {productCategories.map((cat) => (
            <div key={cat} className="flex items-center gap-2 border border-border-dark bg-bg-secondary px-3 py-1.5">
              <input
                className="bg-transparent font-body text-sm text-ink-primary outline-none"
                value={cat}
                style={{ width: `${Math.max(cat.length, 4)}ch` }}
                onChange={(e) => renameCategory(cat, e.target.value)}
              />
              <button onClick={() => deleteCategory(cat)} className="text-accent-red-bright hover:opacity-80">✕</button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input className={`${inputClass} max-w-xs`} placeholder="New category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
          <button onClick={addCategory} className={smallBtn}>+ Add Category</button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Partners &amp; Products</h2>
        <div className="flex gap-8">
          <div className="w-64 shrink-0">
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-faint">Partners</p>
            <div className="flex flex-col gap-1">
              {products.map((p) => (
                <button key={p.slug} onClick={() => setSelectedSlug(p.slug)} className={`px-3 py-2 text-left font-body text-sm ${p.slug === selectedSlug ? "bg-bg-tertiary text-ink-primary" : "text-ink-muted hover:text-ink-primary"}`}>
                  {p.name} <span className="text-ink-faint">({p.products.length})</span>
                </button>
              ))}
            </div>
            <button onClick={addPartner} className={`mt-3 ${smallBtn}`}>+ Add Partner</button>
          </div>

          {partner && (
            <div className="max-w-2xl flex-1">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Field label="Partner name">
                    <input className={inputClass} value={partner.name} onChange={(e) => updatePartner({ name: e.target.value })} />
                  </Field>
                </div>
                <button onClick={() => deletePartner(partner.slug)} className={dangerBtn}>Delete Partner</button>
              </div>

              <p className="mb-2 mt-6 font-mono text-xs uppercase tracking-wide text-ink-faint">Products</p>
              <div className="flex flex-col gap-3">
                {partner.products.map((prod) => (
                  <div key={prod.id} className="border border-border-dark bg-bg-secondary p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input className={inputClass} value={prod.name} placeholder="Product name" onChange={(e) => updateProduct(prod.id, { name: e.target.value })} />
                      <select className={inputClass} value={prod.category} onChange={(e) => updateProduct(prod.id, { category: e.target.value })}>
                        {productCategories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <textarea rows={2} className={`${inputClass} mt-2`} value={prod.description} placeholder="Description" onChange={(e) => updateProduct(prod.id, { description: e.target.value })} />
                    <button onClick={() => deleteProduct(prod.id)} className={`mt-2 ${dangerBtn}`}>Delete Product</button>
                  </div>
                ))}
              </div>
              <button onClick={addProduct} className={`mt-3 ${smallBtn}`}>+ Add Product</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ---------- Job Listings editor (full CRUD) ----------

function JobsEditor({
  careers,
  setCareers,
}: {
  careers: JobListing[];
  setCareers: (j: JobListing[]) => void;
}) {
  const [selectedSlug, setSelectedSlug] = useState(careers[0]?.slug);
  const selectedIdx = careers.findIndex((j) => j.slug === selectedSlug);
  const job = careers[selectedIdx];

  function update(patch: Partial<JobListing>) {
    const next = [...careers];
    next[selectedIdx] = { ...next[selectedIdx], ...patch };
    setCareers(next);
  }

  function addJob() {
    const slug = `job-${Date.now()}`;
    const newJob: JobListing = {
      slug,
      title: "New Role",
      department: "",
      contractType: "Full-time",
      address: "Sandton, South Africa",
      specs: [],
      summary: "",
      closingDate: "",
    };
    setCareers([...careers, newJob]);
    setSelectedSlug(slug);
  }

  function deleteJob(slug: string) {
    if (!confirm("Delete this job listing? It will disappear from the Careers page once you publish.")) return;
    const next = careers.filter((j) => j.slug !== slug);
    setCareers(next);
    if (selectedSlug === slug) setSelectedSlug(next[0]?.slug);
  }

  return (
    <div className="flex gap-8">
      <div className="w-64 shrink-0">
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-faint">Listings</p>
        <div className="flex flex-col gap-1">
          {careers.map((j) => (
            <button key={j.slug} onClick={() => setSelectedSlug(j.slug)} className={`px-3 py-2 text-left font-body text-sm ${j.slug === selectedSlug ? "bg-bg-tertiary text-ink-primary" : "text-ink-muted hover:text-ink-primary"}`}>
              {j.title}
            </button>
          ))}
        </div>
        <button onClick={addJob} className={`mt-3 ${smallBtn}`}>+ Add Job Listing</button>
      </div>

      {job && (
        <div className="max-w-2xl flex-1">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-lg font-bold text-ink-primary">Edit Listing</h2>
            <button onClick={() => deleteJob(job.slug)} className={dangerBtn}>Delete Listing</button>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <Field label="Job title"><input className={inputClass} value={job.title} onChange={(e) => update({ title: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Department"><input className={inputClass} value={job.department} onChange={(e) => update({ department: e.target.value })} /></Field>
              <Field label="Contract type (e.g. Full-time, Contract, Internship)"><input className={inputClass} value={job.contractType} onChange={(e) => update({ contractType: e.target.value })} /></Field>
              <Field label="Address / location"><input className={inputClass} value={job.address} onChange={(e) => update({ address: e.target.value })} /></Field>
              <Field label="Closing date (e.g. 2026-08-31, or leave blank)"><input className={inputClass} value={job.closingDate} onChange={(e) => update({ closingDate: e.target.value })} /></Field>
            </div>
            <Field label="Short summary (shown in the listing preview)">
              <textarea rows={2} className={inputClass} value={job.summary} onChange={(e) => update({ summary: e.target.value })} />
            </Field>
            <Field label="Job specs / requirements (one per line)">
              <textarea rows={5} className={inputClass} value={job.specs.join("\n")} onChange={(e) => update({ specs: e.target.value.split("\n").filter(Boolean) })} />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Applications viewer (CVs, via Vercel Blob) ----------

function ApplicationsViewer() {
  const [applications, setApplications] = useState<ApplicationRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setApplications(data.applications);
      })
      .catch(() => setError("Could not load applications."));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this application and its CV permanently? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/applications?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      setApplications((prev) => prev?.filter((a) => a.id !== id) ?? null);
    } catch {
      alert("Could not delete this application. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleDownload(app: ApplicationRecord) {
    const url = `/api/admin/applications/download?url=${encodeURIComponent(app.cvBlobUrl)}&filename=${encodeURIComponent(app.cvFileName)}`;
    window.open(url, "_blank");
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <p className="font-body text-sm text-accent-red-bright">{error}</p>
        <p className="mt-2 font-body text-xs text-ink-faint">
          This usually means Vercel Blob isn&apos;t set up yet — see the deployment guide for how to enable it.
        </p>
      </div>
    );
  }

  if (!applications) {
    return <p className="font-body text-sm text-ink-muted">Loading applications…</p>;
  }

  if (applications.length === 0) {
    return <p className="font-body text-sm text-ink-muted">No applications received yet.</p>;
  }

  return (
    <div className="max-w-4xl">
      <p className="mb-4 font-body text-sm text-ink-muted">{applications.length} application{applications.length > 1 ? "s" : ""} received.</p>
      <div className="flex flex-col gap-3">
        {applications.map((app) => (
          <div key={app.id} className="flex flex-col gap-2 border border-border-dark bg-bg-secondary p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-sm font-bold text-ink-primary">{app.name} — {app.jobTitle}</p>
              <p className="mt-1 font-body text-xs text-ink-muted">{app.email} · {app.phone}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                {new Date(app.submittedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button onClick={() => handleDownload(app)} className={smallBtn}>Download CV</button>
              <button onClick={() => handleDelete(app.id)} disabled={deletingId === app.id} className={dangerBtn}>
                {deletingId === app.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Settings (API keys / secrets) ----------

function SettingsEditor() {
  const [status, setStatus] = useState<Record<string, { set: boolean }> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [systemChecks, setSystemChecks] = useState<{ key: string; label: string; set: boolean; optional: boolean }[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/system-status")
      .then((r) => r.json())
      .then((data) => setSystemChecks(data.checks || null))
      .catch(() => setSystemChecks(null));
  }, []);

  useEffect(() => {
    fetch("/api/admin/secrets")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setLoadError(data.error);
        else setStatus(data);
      })
      .catch(() => setLoadError("Could not load secret status."));
  }, []);

  async function handleSave() {
    if (!newKey.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "ANTHROPIC_API_KEY", value: newKey.trim(), redeploy: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setMessage({
        type: "ok",
        text: data.redeployTriggered
          ? "Saved. A redeploy has been triggered — the new key will be live in a minute or two."
          : `Saved, but automatic redeploy failed (${data.redeployError || "unknown error"}) — redeploy manually in Vercel for the new key to take effect.`,
      });
      setNewKey("");
      setStatus((prev) => ({ ...prev, ANTHROPIC_API_KEY: { set: true } }));
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="mb-2 font-display text-lg font-bold text-ink-primary">System Status</h2>
      <p className="mb-4 font-body text-sm text-ink-muted">
        What&apos;s actually configured right now — check this first whenever a form, email, or report says it
        couldn&apos;t send. This shows only whether each item is set, never the actual secret values.
      </p>
      {systemChecks ? (
        <div className="mb-10 flex flex-col gap-2">
          {systemChecks.map((c) => (
            <div key={c.key} className="flex items-center justify-between border border-border-dark bg-bg-secondary px-4 py-3">
              <span className="font-body text-sm text-ink-primary">{c.label}</span>
              <span className={`font-mono text-xs font-bold uppercase ${c.set ? "text-accent-navy-bright" : c.optional ? "text-ink-faint" : "text-accent-red-bright"}`}>
                {c.set ? "Configured" : c.optional ? "Not set (optional)" : "Not configured"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-10 font-body text-sm text-ink-faint">Loading system status…</p>
      )}

      <h2 className="mb-2 font-display text-lg font-bold text-ink-primary">API Keys &amp; Secrets</h2>
      <p className="mb-6 font-body text-sm text-ink-muted">
        This updates the key directly in Vercel&apos;s environment variables — it is never written to GitHub or
        stored in this codebase, since secrets shouldn&apos;t live in git history. Requires{" "}
        <code className="font-mono text-xs">VERCEL_API_TOKEN</code> and{" "}
        <code className="font-mono text-xs">VERCEL_PROJECT_ID</code> to be configured on the server — if this
        section shows an error below, that&apos;s almost always why.
      </p>

      {loadError && <p className="mb-4 font-body text-sm text-accent-red-bright">{loadError}</p>}

      {status && (
        <p className="mb-4 font-body text-sm text-ink-muted">
          Current status: <span className={status.ANTHROPIC_API_KEY?.set ? "text-accent-navy-bright" : "text-accent-red-bright"}>
            {status.ANTHROPIC_API_KEY?.set ? "A key is currently set." : "No key is currently set."}
          </span>
        </p>
      )}

      <Field label="Anthropic API Key (for the Free Pre-Assessment tool)">
        <input type="password" className={inputClass} value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="sk-ant-..." />
      </Field>

      {message && (
        <p className={`mt-3 font-body text-sm ${message.type === "ok" ? "text-accent-navy-bright" : "text-accent-red-bright"}`}>{message.text}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving || !newKey.trim()}
        className="mt-4 rounded-sm bg-accent-navy px-5 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-navy-bright disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save & Redeploy"}
      </button>
    </div>
  );
}

// ---------- Resource file field (PDF/Word upload, distinct from images) ----------

function ResourceFileField({
  value,
  onChange,
}: {
  value?: { url: string; filename: string };
  onChange: (file: { url: string; filename: string } | undefined) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/admin/upload-resource-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange({ url: data.path, filename: data.filename });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="flex items-center justify-between border border-border-dark bg-bg-secondary px-3 py-2.5">
          <span className="font-body text-sm text-ink-primary">{value.filename}</span>
          <button onClick={() => onChange(undefined)} className="font-body text-xs text-accent-red-bright hover:underline">Remove</button>
        </div>
      ) : (
        <input type="file" accept="application/pdf,.doc,.docx" onChange={handleFile} className="font-body text-xs text-ink-muted" />
      )}
      {uploading && <span className="mt-1 block font-body text-xs text-ink-faint">Uploading…</span>}
      {error && <p className="mt-1 font-body text-xs text-accent-red-bright">{error}</p>}
    </div>
  );
}

// ---------- Resources (articles) editor: full CRUD with images, links, and downloadable files ----------

function ArticlesEditor({
  articles,
  setArticles,
}: {
  articles: ResourceArticle[];
  setArticles: (a: ResourceArticle[]) => void;
}) {
  const [selectedId, setSelectedId] = useState(articles[0]?.id);
  const selectedIdx = articles.findIndex((a) => a.id === selectedId);
  const article = articles[selectedIdx];

  function update(patch: Partial<ResourceArticle>) {
    const next = [...articles];
    next[selectedIdx] = { ...next[selectedIdx], ...patch };
    setArticles(next);
  }

  function addArticle() {
    const id = `article-${Date.now()}`;
    const newArticle: ResourceArticle = {
      id,
      slug: `new-article-${Date.now()}`,
      title: "New Article",
      category: "Article",
      excerpt: "",
      bodyMarkdown: "",
      publishedDate: new Date().toISOString().slice(0, 10),
    };
    setArticles([...articles, newArticle]);
    setSelectedId(id);
  }

  function deleteArticle(id: string) {
    if (!confirm("Delete this article permanently? This cannot be undone once published.")) return;
    const next = articles.filter((a) => a.id !== id);
    setArticles(next);
    if (selectedId === id) setSelectedId(next[0]?.id);
  }

  return (
    <div className="flex gap-8">
      <div className="w-64 shrink-0">
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-faint">Articles, Guides &amp; Reports</p>
        <div className="flex flex-col gap-1">
          {articles.map((a) => (
            <button key={a.id} onClick={() => setSelectedId(a.id)} className={`px-3 py-2 text-left font-body text-sm ${a.id === selectedId ? "bg-bg-tertiary text-ink-primary" : "text-ink-muted hover:text-ink-primary"}`}>
              {a.title || "Untitled"}
            </button>
          ))}
        </div>
        <button onClick={addArticle} className={`mt-3 ${smallBtn}`}>+ Add Article</button>
      </div>

      {article && (
        <div className="max-w-2xl flex-1">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-lg font-bold text-ink-primary">Edit Article</h2>
            <button onClick={() => deleteArticle(article.id)} className={dangerBtn}>Delete Article</button>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <Field label="Title"><input className={inputClass} value={article.title} onChange={(e) => update({ title: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="URL slug (e.g. phishing-awareness-2026)">
                <input className={inputClass} value={article.slug} onChange={(e) => update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
              </Field>
              <Field label="Category">
                <select className={inputClass} value={article.category} onChange={(e) => update({ category: e.target.value as ResourceArticle["category"] })}>
                  <option value="Article">Article</option>
                  <option value="Guide">Guide</option>
                  <option value="Report">Report</option>
                  <option value="Case Study">Case Study</option>
                </select>
              </Field>
            </div>
            <Field label="Published date">
              <input type="date" className={inputClass} value={article.publishedDate} onChange={(e) => update({ publishedDate: e.target.value })} />
            </Field>
            <Field label="Excerpt (shown on the Resources listing page)">
              <textarea rows={2} className={inputClass} value={article.excerpt} onChange={(e) => update({ excerpt: e.target.value })} />
            </Field>
            <Field label="Cover image">
              <ImageField value={article.coverImage} onChange={(path) => update({ coverImage: path })} />
            </Field>
            <Field label="Body">
              <textarea
                rows={12}
                className={inputClass}
                value={article.bodyMarkdown}
                onChange={(e) => update({ bodyMarkdown: e.target.value })}
                placeholder="Write the article here. Leave a blank line between paragraphs. Use **bold**, *italic*, and [link text](https://example.com) for hyperlinks."
              />
              <p className="mt-1.5 font-body text-xs text-ink-faint">
                Blank lines start new paragraphs. Use <code className="font-mono">**bold**</code>,{" "}
                <code className="font-mono">*italic*</code>, and{" "}
                <code className="font-mono">[link text](https://example.com)</code> for hyperlinks anywhere in the text.
              </p>
            </Field>
            <Field label="Downloadable PDF or Word document (optional)">
              <ResourceFileField value={article.downloadFile} onChange={(file) => update({ downloadFile: file })} />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}
