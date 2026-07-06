"use client";

import { useState } from "react";
import Link from "next/link";
import type { AssessmentAnswers } from "@/lib/assessment-scoring";

type Question = {
  key: keyof AssessmentAnswers;
  label: string;
  type: "select" | "multiselect";
  options: { value: string; label: string }[];
};

const questions: Question[] = [
  { key: "companySize", label: "How many employees does your organisation have?", type: "select", options: [
    { value: "1-10", label: "1–10" }, { value: "11-50", label: "11–50" }, { value: "51-200", label: "51–200" },
    { value: "201-1000", label: "201–1,000" }, { value: "1000+", label: "1,000+" },
  ]},
  { key: "usesCloud", label: "Does your organisation use cloud services (e.g. Microsoft 365, AWS, Azure, Google Workspace)?", type: "select", options: [
    { value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" },
  ]},
  { key: "remoteWorkers", label: "How many of your staff work remotely, at least part of the time?", type: "select", options: [
    { value: "none", label: "None" }, { value: "some", label: "Some" }, { value: "most", label: "Most or all" },
  ]},
  { key: "backupPractices", label: "How does your organisation back up critical data?", type: "select", options: [
    { value: "none", label: "We do not have a formal backup process" },
    { value: "manual-irregular", label: "Manual backups, done irregularly" },
    { value: "automated-untested", label: "Automated backups, but not regularly tested" },
    { value: "automated-tested", label: "Automated backups, regularly tested" },
  ]},
  { key: "mfaUsage", label: "How widely is Multi-Factor Authentication (MFA) used across your systems?", type: "select", options: [
    { value: "none", label: "Not used" }, { value: "partial", label: "Used on a few systems" },
    { value: "most-systems", label: "Used on most systems" }, { value: "all-systems", label: "Used on all critical systems" },
  ]},
  { key: "awarenessTraining", label: "Does your organisation provide security awareness training to staff?", type: "select", options: [
    { value: "none", label: "No formal training" }, { value: "ad-hoc", label: "Occasional, informal training" },
    { value: "annual", label: "Annual training" }, { value: "ongoing", label: "Ongoing, regular training" },
  ]},
  { key: "endpointProtection", label: "What level of endpoint protection is in place on company devices?", type: "select", options: [
    { value: "none", label: "None or unsure" }, { value: "basic-antivirus", label: "Basic antivirus software" },
    { value: "managed-endpoint", label: "Managed endpoint protection platform" },
  ]},
  { key: "incidentResponsePlan", label: "Does your organisation have an incident response plan?", type: "select", options: [
    { value: "none", label: "No plan in place" }, { value: "informal", label: "Informal, undocumented plan" },
    { value: "documented-untested", label: "Documented, but not tested" }, { value: "documented-tested", label: "Documented and tested" },
  ]},
  { key: "vulnerabilityManagement", label: "How often are your systems checked for vulnerabilities?", type: "select", options: [
    { value: "none", label: "Never" }, { value: "ad-hoc", label: "Occasionally, as needed" },
    { value: "periodic", label: "On a periodic schedule" }, { value: "continuous", label: "Continuously monitored" },
  ]},
  { key: "thirdPartyVendorManagement", label: "How does your organisation manage the security of third-party vendors?", type: "select", options: [
    { value: "none", label: "Not currently managed" }, { value: "informal", label: "Managed informally, case by case" },
    { value: "formal", label: "Formal vendor security review process" },
  ]},
];

const TOTAL_STEPS = questions.length;

type AssessmentResult = {
  result: { percentage: number; maturityLevel: string; weakAreas: string[] };
  services: { name: string; slug: string }[];
  narrative?: { securityOverview: string; areasOfConcern: string; recommendedNextSteps: string } | null;
  error?: string;
};

export default function AssessmentFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<AssessmentAnswers>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const current = questions[step];
  const isLastQuestion = step === TOTAL_STEPS - 1;

  function selectAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
  }

  async function handleNext() {
    if (isLastQuestion) {
      setSubmitting(true);
      try {
        const fullAnswers: AssessmentAnswers = {
          industry: "unspecified",
          complianceRequirements: [],
          existingSecuritySolutions: [],
          ...answers,
        } as AssessmentAnswers;

        const res = await fetch("/api/assessment-narrative", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: fullAnswers }),
        });
        const data = await res.json();
        setResult(data);
      } catch {
        setResult({
          result: { percentage: 0, maturityLevel: "Unknown", weakAreas: [] },
          services: [],
          error: "Something went wrong generating your results. Please try again or contact us directly.",
        });
      } finally {
        setSubmitting(false);
      }
    } else {
      setStep((s) => s + 1);
    }
  }

  if (result) {
    return <ResultsView data={result} />;
  }

  if (submitting) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-dark border-t-accent-navy-bright" />
        <p className="font-body text-sm text-ink-muted">Calculating your results…</p>
      </div>
    );
  }

  const currentAnswer = answers[current.key];

  return (
    <div>
      <div className="mb-10 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-bg-secondary">
          <div
            className="h-full bg-accent-navy-bright transition-all"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <p className="font-mono text-xs text-ink-faint">{step + 1} / {TOTAL_STEPS}</p>
      </div>

      <h2 className="font-display text-2xl font-medium leading-snug tracking-tight text-ink-primary sm:text-3xl">
        {current.label}
      </h2>

      <div className="mt-8 flex flex-col gap-3">
        {current.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => selectAnswer(opt.value)}
            className={`rounded-sm border px-5 py-4 text-left font-body text-sm transition-colors ${
              currentAnswer === opt.value
                ? "border-accent-navy-bright bg-bg-secondary text-ink-primary"
                : "border-border-dark text-ink-muted hover:border-accent-navy"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="font-body text-sm text-ink-muted disabled:opacity-30"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={!currentAnswer}
          className="rounded-sm bg-accent-red px-6 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-accent-red-bright disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLastQuestion ? "See My Results" : "Next"}
        </button>
      </div>
    </div>
  );
}

function ResultsView({ data }: { data: AssessmentResult }) {
  const { result, services, narrative, error } = data;
  const [companyName, setCompanyName] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sendError, setSendError] = useState<string | null>(null);

  async function handleEmailReport() {
    if (!reportEmail.trim()) {
      setSendStatus("error");
      setSendError("Please enter your email address.");
      return;
    }
    setSendStatus("sending");
    setSendError(null);
    try {
      const res = await fetch("/api/assessment-narrative/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email: reportEmail, result, narrative, services }),
      });
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error || "Something went wrong.");
      setSendStatus("sent");
    } catch (err) {
      setSendStatus("error");
      setSendError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-accent-navy-bright">Your result</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-primary sm:text-4xl">
        {result.maturityLevel}
      </h2>
      <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
        <div className="h-full bg-accent-navy-bright" style={{ width: `${result.percentage}%` }} />
      </div>

      {result.maturityLevel === "Unknown" && error && (
        <p className="mt-6 rounded-sm border border-border-dark bg-bg-secondary p-4 font-body text-sm text-ink-muted">
          {error}
        </p>
      )}

      {narrative && (
        <div className="mt-10 flex flex-col gap-8">
          <div>
            <h3 className="font-display text-lg font-medium text-ink-primary">Security Overview</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{narrative.securityOverview}</p>
          </div>
          <div>
            <h3 className="font-display text-lg font-medium text-ink-primary">Identified Areas of Concern</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{narrative.areasOfConcern}</p>
          </div>
          <div>
            <h3 className="font-display text-lg font-medium text-ink-primary">Recommended Next Steps</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{narrative.recommendedNextSteps}</p>
          </div>
        </div>
      )}

      {services.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-lg font-medium text-ink-primary">Suggested Services</h3>
          <div className="mt-4 flex flex-col gap-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-sm border border-border-dark px-5 py-4 font-body text-sm text-ink-primary transition-colors hover:border-accent-navy-bright"
              >
                {s.name} →
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 rounded-sm border border-border-dark bg-bg-secondary p-5 font-body text-xs leading-relaxed text-ink-faint">
        This assessment provides a high level indication of your organisation&apos;s cyber
        security maturity based solely on the information provided. It is not a professional
        security assessment and should not be considered a complete evaluation of your
        security posture.
      </p>

      <div className="mt-8 rounded-sm border border-border-dark bg-bg-secondary p-6 sm:p-8">
        {sendStatus === "sent" ? (
          <div className="text-center">
            <p className="font-display text-lg font-bold text-ink-primary">Report sent.</p>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">
              Check <strong>{reportEmail}</strong> for your PDF report — it should arrive within a minute or two.
            </p>
          </div>
        ) : (
          <>
            <p className="font-display text-base font-bold text-ink-primary">Get your PDF report by email</p>
            <p className="mt-1.5 font-body text-sm text-ink-muted">
              Enter your details below and we&apos;ll email your full report.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                  Company name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Organisation"
                  className="mt-2 w-full rounded-sm border border-border-dark bg-bg-primary px-4 py-2.5 font-body text-sm text-ink-primary outline-none focus:border-accent-navy-bright"
                />
              </div>
              <div>
                <label htmlFor="reportEmail" className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                  Email address
                </label>
                <input
                  id="reportEmail"
                  type="email"
                  required
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-sm border border-border-dark bg-bg-primary px-4 py-2.5 font-body text-sm text-ink-primary outline-none focus:border-accent-navy-bright"
                />
              </div>
            </div>
            {sendStatus === "error" && sendError && (
              <p className="mt-3 font-body text-sm text-accent-red-bright">{sendError}</p>
            )}
            <button
              onClick={handleEmailReport}
              disabled={sendStatus === "sending"}
              className="mt-5 rounded-sm border-2 border-accent-navy-bright px-7 py-3.5 font-body text-sm font-semibold text-ink-primary transition-colors hover:bg-accent-navy-bright hover:text-white disabled:opacity-50"
            >
              {sendStatus === "sending" ? "Sending…" : "Email My Report"}
            </button>
          </>
        )}
      </div>

      <div className="mt-12 rounded-sm border border-accent-red/30 bg-bg-secondary p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-accent-red-bright">Recommended Next Step</p>
        <h3 className="mt-3 font-display text-2xl font-bold text-ink-primary">
          Get a complete picture with a free Vulnerability Assessment.
        </h3>
        <p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-ink-muted">
          A Cyberxperts security professional can perform a more detailed assessment of
          your environment and provide tailored, practical recommendations.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link href="/contact#consultation" className="rounded-sm bg-accent-red px-7 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-red-bright">
            Request a Free Vulnerability Assessment
          </Link>
          <Link href="/contact#consultation" className="rounded-sm border-2 border-ink-primary/30 px-7 py-3.5 font-body text-sm font-semibold text-ink-primary transition-colors hover:border-ink-primary">
            Schedule a Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
