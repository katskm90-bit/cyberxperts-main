"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          phone: data.get("phone"),
          interest: data.get("interest"),
          message: data.get("message"),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-6 rounded-sm border border-accent-navy-bright/40 bg-bg-secondary p-8">
        <p className="font-display text-lg font-bold text-ink-primary">Message sent.</p>
        <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">
          Thank you for reaching out. Your message has been sent to our team and will be attended to shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 font-body text-sm text-accent-navy-bright hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-mono text-xs uppercase tracking-wider text-ink-faint">Full name</label>
          <input id="name" name="name" type="text" required className="mt-2 w-full rounded-sm border border-border-dark bg-bg-secondary px-4 py-3 font-body text-sm text-ink-primary outline-none focus:border-accent-navy-bright" />
        </div>
        <div>
          <label htmlFor="company" className="font-mono text-xs uppercase tracking-wider text-ink-faint">Company</label>
          <input id="company" name="company" type="text" className="mt-2 w-full rounded-sm border border-border-dark bg-bg-secondary px-4 py-3 font-body text-sm text-ink-primary outline-none focus:border-accent-navy-bright" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-ink-faint">Email</label>
          <input id="email" name="email" type="email" required className="mt-2 w-full rounded-sm border border-border-dark bg-bg-secondary px-4 py-3 font-body text-sm text-ink-primary outline-none focus:border-accent-navy-bright" />
        </div>
        <div>
          <label htmlFor="phone" className="font-mono text-xs uppercase tracking-wider text-ink-faint">Phone</label>
          <input id="phone" name="phone" type="tel" className="mt-2 w-full rounded-sm border border-border-dark bg-bg-secondary px-4 py-3 font-body text-sm text-ink-primary outline-none focus:border-accent-navy-bright" />
        </div>
      </div>
      <div>
        <label htmlFor="interest" className="font-mono text-xs uppercase tracking-wider text-ink-faint">I&apos;m interested in</label>
        <select id="interest" name="interest" className="mt-2 w-full rounded-sm border border-border-dark bg-bg-secondary px-4 py-3 font-body text-sm text-ink-primary outline-none focus:border-accent-navy-bright">
          <option>Booking a consultation</option>
          <option>Requesting a vulnerability assessment</option>
          <option>Managed security services</option>
          <option>Compliance and risk assessment</option>
          <option>General enquiry</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="font-mono text-xs uppercase tracking-wider text-ink-faint">Message</label>
        <textarea id="message" name="message" rows={5} required className="mt-2 w-full rounded-sm border border-border-dark bg-bg-secondary px-4 py-3 font-body text-sm text-ink-primary outline-none focus:border-accent-navy-bright" />
      </div>
      {status === "error" && errorMessage && (
        <p className="font-body text-sm text-accent-red-bright">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex w-fit items-center gap-2 rounded-sm bg-accent-red px-6 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-red-bright disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
