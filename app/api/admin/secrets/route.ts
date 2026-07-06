import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";
import { getEnvVarStatus, setEnvVar, triggerRedeploy } from "@/lib/vercel";

const MANAGED_KEYS = ["ANTHROPIC_API_KEY"] as const;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const statuses: Record<string, unknown> = {};
    for (const key of MANAGED_KEYS) {
      statuses[key] = await getEnvVarStatus(key);
    }
    return NextResponse.json(statuses);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error reading Vercel environment.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = (await req.json()) as { key?: string; value?: string; redeploy?: boolean };
  if (!body.key || !MANAGED_KEYS.includes(body.key as (typeof MANAGED_KEYS)[number])) {
    return NextResponse.json({ error: "Unknown or unsupported key." }, { status: 400 });
  }
  if (!body.value || !body.value.trim()) {
    return NextResponse.json({ error: "Value cannot be empty." }, { status: 400 });
  }

  try {
    await setEnvVar(body.key, body.value.trim());
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error saving to Vercel.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  let redeployTriggered = false;
  let redeployError: string | null = null;
  if (body.redeploy) {
    try {
      await triggerRedeploy();
      redeployTriggered = true;
    } catch (err) {
      redeployError = err instanceof Error ? err.message : "Redeploy trigger failed.";
    }
  }

  return NextResponse.json({ ok: true, redeployTriggered, redeployError });
}
