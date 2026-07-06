// Deterministic scoring engine for the Security Pre-Assessment tool.
//
// Weighting rationale (Phase 1 architecture decision: scoring must be
// reproducible and explainable, never decided by the LLM):
//
// Controls are weighted by their typical effect on breach likelihood and
// blast radius, not weighted equally. This draws on widely observed incident
// patterns (credential-based attacks and ransomware dominate real-world
// breaches) and the relative criticality of these controls within NIST CSF
// and ISO 27001 Annex A.
//
// - MFA usage (weight 18): the single highest-leverage control against
//   credential-based compromise, which underlies most initial access in
//   reported breaches.
// - Backup practices (weight 16): determines whether a ransomware incident
//   is a contained inconvenience or a business-ending event.
// - Incident response plan (weight 14): determines how fast and cleanly an
//   organisation recovers once something does go wrong; absence sharply
//   increases the cost and duration of any incident.
// - Vulnerability management (weight 13): reduces the window of exposure to
//   known, exploitable weaknesses.
// - Endpoint protection (weight 13): a baseline control against malware and
//   the most common delivery mechanisms.
// - Awareness training (weight 13): reduces likelihood of initial compromise
//   via phishing and social engineering, the most common entry vector.
// - Third-party vendor management (weight 13): supply-chain risk, generally
//   lower immediate likelihood than the above but increasingly material.
//
// This produces a 100-point scale directly, with no equal-weighting
// distortion. These weights are Cyberxperts' professional judgment and
// should be reviewed and confirmed by your security team before this tool
// is treated as final; they are straightforward to amend in this file.

export type AssessmentAnswers = {
  companySize: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+";
  industry: string;
  usesCloud: "yes" | "no" | "unsure";
  remoteWorkers: "none" | "some" | "most";
  backupPractices: "none" | "manual-irregular" | "automated-untested" | "automated-tested";
  mfaUsage: "none" | "partial" | "most-systems" | "all-systems";
  awarenessTraining: "none" | "ad-hoc" | "annual" | "ongoing";
  endpointProtection: "none" | "basic-antivirus" | "managed-endpoint";
  incidentResponsePlan: "none" | "informal" | "documented-untested" | "documented-tested";
  vulnerabilityManagement: "none" | "ad-hoc" | "periodic" | "continuous";
  complianceRequirements: string[];
  thirdPartyVendorManagement: "none" | "informal" | "formal";
  existingSecuritySolutions: string[];
};

export type MaturityLevel = "Low Maturity" | "Developing Maturity" | "Moderate Maturity" | "Strong Maturity" | "Advanced Maturity";

// Each control's max weight, and the proportion of that weight earned by
// each answer tier (0 / partial / mostly / fully).
const CONTROL_WEIGHTS: Record<string, number> = {
  mfaUsage: 18,
  backupPractices: 16,
  incidentResponsePlan: 14,
  vulnerabilityManagement: 13,
  endpointProtection: 13,
  awarenessTraining: 13,
  thirdPartyVendorManagement: 13,
};

const TIER_FRACTIONS: Record<string, Record<string, number>> = {
  backupPractices: { none: 0, "manual-irregular": 0.3, "automated-untested": 0.65, "automated-tested": 1 },
  mfaUsage: { none: 0, partial: 0.4, "most-systems": 0.7, "all-systems": 1 },
  awarenessTraining: { none: 0, "ad-hoc": 0.3, annual: 0.65, ongoing: 1 },
  endpointProtection: { none: 0, "basic-antivirus": 0.5, "managed-endpoint": 1 },
  incidentResponsePlan: { none: 0, informal: 0.3, "documented-untested": 0.65, "documented-tested": 1 },
  vulnerabilityManagement: { none: 0, "ad-hoc": 0.3, periodic: 0.65, continuous: 1 },
  thirdPartyVendorManagement: { none: 0, informal: 0.4, formal: 1 },
};

const MAX_SCORE = Object.values(CONTROL_WEIGHTS).reduce((a, b) => a + b, 0); // = 100

export function scoreAssessment(answers: AssessmentAnswers): {
  rawScore: number;
  maxScore: number;
  percentage: number;
  maturityLevel: MaturityLevel;
  weakAreas: string[];
} {
  let rawScore = 0;
  const weakAreas: string[] = [];

  for (const key of Object.keys(CONTROL_WEIGHTS)) {
    const answer = answers[key as keyof AssessmentAnswers] as string;
    const fraction = TIER_FRACTIONS[key][answer] ?? 0;
    const points = CONTROL_WEIGHTS[key] * fraction;
    rawScore += points;
    // Flag as a weak area if the control is earning less than a third of
    // its available weight — i.e. meaningfully under-resourced, not just
    // imperfect.
    if (fraction < 0.34) weakAreas.push(key);
  }

  const percentage = Math.round((rawScore / MAX_SCORE) * 100);

  let maturityLevel: MaturityLevel;
  if (percentage < 20) maturityLevel = "Low Maturity";
  else if (percentage < 40) maturityLevel = "Developing Maturity";
  else if (percentage < 60) maturityLevel = "Moderate Maturity";
  else if (percentage < 80) maturityLevel = "Strong Maturity";
  else maturityLevel = "Advanced Maturity";

  return { rawScore: Math.round(rawScore), maxScore: MAX_SCORE, percentage, maturityLevel, weakAreas };
}

const SERVICE_MAP: Record<string, { name: string; slug: string }> = {
  backupPractices: { name: "Managed Security Services", slug: "managed-security-services" },
  mfaUsage: { name: "Risk Assessments", slug: "risk-assessments" },
  awarenessTraining: { name: "Security Awareness Training", slug: "security-awareness-training" },
  endpointProtection: { name: "Managed Security Services", slug: "managed-security-services" },
  incidentResponsePlan: { name: "Incident Response", slug: "incident-response" },
  vulnerabilityManagement: { name: "Penetration Testing", slug: "penetration-testing" },
  thirdPartyVendorManagement: { name: "Compliance Services", slug: "compliance-services" },
};

export function suggestedServices(weakAreas: string[]) {
  const seen = new Set<string>();
  const out: { name: string; slug: string }[] = [];
  for (const area of weakAreas) {
    const svc = SERVICE_MAP[area];
    if (svc && !seen.has(svc.slug)) {
      seen.add(svc.slug);
      out.push(svc);
    }
  }
  return out;
}
