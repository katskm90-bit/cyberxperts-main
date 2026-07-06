import { NextRequest, NextResponse } from "next/server";
import { scoreAssessment, suggestedServices, type AssessmentAnswers } from "@/lib/assessment-scoring";

// This route calls the Claude API (Haiku) to generate a plain-language
// narrative from the deterministic score computed below. The score itself
// is NEVER decided by the model — only the wording describing it is. This
// keeps the result reproducible and explainable.
//
// REQUIRES: ANTHROPIC_API_KEY set as an environment variable.

const CLAUDE_MODEL = "claude-haiku-4-5-20251001";

function buildPrompt(result: { maturityLevel: string; percentage: number; weakAreas: string[] }) {
  return `You are writing a short, plain-language cyber security maturity summary for a business owner who just completed a self-assessment on the Cyberxperts website. Use a calm, professional, non-alarming tone. Never use fear-based language, exaggerated claims, or phrases like "industry leading" or "cutting edge". Write in South African business English.

Assessment result:
- Maturity level: ${result.maturityLevel}
- Score: ${result.percentage}%
- Weak areas identified: ${result.weakAreas.join(", ") || "none"}

Respond with ONLY a JSON object, no markdown formatting, no code fences, no preamble or explanation — just the raw JSON object in this exact shape:
{
  "securityOverview": "2-3 sentences",
  "areasOfConcern": "2-3 sentences",
  "recommendedNextSteps": "2-3 sentences"
}`;
}

function extractNarrative(rawText: string): { securityOverview: string; areasOfConcern: string; recommendedNextSteps: string } | null {
  // Claude is instructed to return raw JSON, but models occasionally wrap
  // output in markdown code fences despite instructions — strip those
  // before parsing, and fall back to extracting the first {...} block if
  // there's any surrounding text.
  let text = rawText.trim();
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { answers: AssessmentAnswers };
  const { answers } = body;

  const result = scoreAssessment(answers);
  const services = suggestedServices(result.weakAreas);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Assessment narrative unavailable: ANTHROPIC_API_KEY is not set.");
    return NextResponse.json({ error: "narrative_unavailable", result, services }, { status: 200 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 500,
        messages: [{ role: "user", content: buildPrompt(result) }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`Claude API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const textBlock = data.content?.find((c: { type: string }) => c.type === "text");
    const narrative = textBlock ? extractNarrative(textBlock.text) : null;

    if (!narrative) {
      console.error("Assessment narrative: Claude response could not be parsed as JSON.", textBlock?.text);
      return NextResponse.json({ error: "narrative_unavailable", result, services }, { status: 200 });
    }

    return NextResponse.json({ result, services, narrative });
  } catch (error) {
    console.error("Assessment narrative generation failed:", error);
    return NextResponse.json({ error: "narrative_unavailable", result, services }, { status: 200 });
  }
}
