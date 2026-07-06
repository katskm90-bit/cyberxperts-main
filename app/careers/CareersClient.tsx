"use client";

import { useState } from "react";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { Eyebrow, DisplayHeading, Section } from "@/app/components/ui";
import { jobListings } from "@/lib/careers-data";
import { siteContent } from "@/lib/site-content";

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string>(jobListings[0]?.slug ?? "");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { careers } = siteContent.pages;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileError(null);
    setFileDataUrl(null);
    setFileName(null);
    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileError("Only PDF files are accepted. Please convert your CV to PDF and try again.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File is too large. Please keep your CV under 5MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUrl(reader.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    if (!fileDataUrl || !fileName) {
      setFileError("Please attach your CV as a PDF.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const job = jobListings.find((j) => j.slug === selectedJob);

    setSubmitting(true);
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("fullName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          jobSlug: job?.slug ?? "general",
          jobTitle: job?.title ?? "General Application",
          cvFileName: fileName,
          cvDataUrl: fileDataUrl,
          consent: formData.get("consent") === "on",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong submitting your application.");
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden pb-16 pt-36 lg:pt-44">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="photo-scrim-gold absolute inset-0" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
            <Eyebrow>{careers.eyebrow}</Eyebrow>
            <DisplayHeading className="mt-6 max-w-3xl !text-5xl sm:!text-6xl lg:!text-7xl">
              {careers.headline}
            </DisplayHeading>
            <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-ink-muted">
              {careers.description}
            </p>
          </div>
        </section>

        <Section className="border-t border-border-dark">
          <div className="grid grid-cols-1 gap-4">
            {jobListings.map((job) => (
              <div
                key={job.slug}
                className={`flex flex-col gap-3 rounded-sm border p-6 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                  selectedJob === job.slug ? "border-accent-navy-bright bg-bg-secondary" : "border-border-dark"
                }`}
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-accent-gold">
                    {job.department} · {job.address} · {job.contractType}
                    {job.closingDate && ` · Closes ${job.closingDate}`}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold text-ink-primary">{job.title}</h3>
                  <p className="mt-1 font-body text-sm text-ink-muted">{job.summary}</p>
                  {job.specs.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-1">
                      {job.specs.map((s, i) => (
                        <li key={i} className="font-body text-xs leading-relaxed text-ink-faint">• {s}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => setSelectedJob(job.slug)}
                  className={`shrink-0 rounded-sm px-5 py-2.5 font-body text-sm font-semibold transition-colors ${
                    selectedJob === job.slug
                      ? "bg-accent-navy text-white"
                      : "border border-border-dark text-ink-primary hover:border-accent-navy-bright"
                  }`}
                >
                  {selectedJob === job.slug ? "Selected" : "Select Role"}
                </button>
              </div>
            ))}
          </div>
        </Section>

        <Section light className="border-t border-border-light">
          <Eyebrow>Apply Now</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-black text-ink-on-light">
            Applying for: {jobListings.find((j) => j.slug === selectedJob)?.title ?? "Select a role above"}
          </h2>

          {submitted ? (
            <div className="mt-8 rounded-sm border border-border-light bg-white p-8">
              <p className="font-display text-lg font-bold text-ink-on-light">Application received.</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink-on-light-muted">
                Thank you for applying. Our team will review your application and be in touch
                if your experience matches what we&apos;re looking for.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="font-mono text-xs uppercase tracking-wider text-ink-on-light-muted">Full name</label>
                  <input id="fullName" name="fullName" type="text" required className="mt-2 w-full rounded-sm border border-border-light bg-white px-4 py-3 font-body text-sm text-ink-on-light outline-none focus:border-accent-navy-bright" />
                </div>
                <div>
                  <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-ink-on-light-muted">Email</label>
                  <input id="email" name="email" type="email" required className="mt-2 w-full rounded-sm border border-border-light bg-white px-4 py-3 font-body text-sm text-ink-on-light outline-none focus:border-accent-navy-bright" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="font-mono text-xs uppercase tracking-wider text-ink-on-light-muted">Phone</label>
                <input id="phone" name="phone" type="tel" required className="mt-2 w-full rounded-sm border border-border-light bg-white px-4 py-3 font-body text-sm text-ink-on-light outline-none focus:border-accent-navy-bright" />
              </div>
              <div>
                <label htmlFor="cv" className="font-mono text-xs uppercase tracking-wider text-ink-on-light-muted">Upload CV (PDF only)</label>
                <div className="mt-2">
                  <label
                    htmlFor="cv"
                    className="flex cursor-pointer items-center justify-center rounded-sm border-2 border-dashed border-border-light bg-white px-6 py-8 text-center transition-colors hover:border-accent-navy-bright"
                  >
                    <span className="font-body text-sm text-ink-on-light-muted">
                      {fileName ?? "Click to select a PDF file, or drag and drop"}
                    </span>
                  </label>
                  <input
                    id="cv"
                    name="cv"
                    type="file"
                    accept="application/pdf"
                    required
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {fileError && <p className="mt-2 font-body text-xs text-red-600">{fileError}</p>}
                </div>
              </div>
              <label className="flex items-start gap-3 font-body text-xs leading-relaxed text-ink-on-light-muted">
                <input type="checkbox" name="consent" required className="mt-0.5" />
                I consent to Cyberxperts processing my personal information and CV for the
                purpose of evaluating this application, in line with POPIA.
              </label>
              {submitError && <p className="font-body text-sm text-red-600">{submitError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-sm bg-accent-red px-6 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-red-bright disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          )}
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
