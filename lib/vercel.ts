// Manages environment variables via Vercel's REST API — a deliberately
// separate mechanism from lib/github.ts. Secrets should never be committed
// to git (even a private repo keeps them in history forever), so this talks
// directly to Vercel's project settings instead.
//
// Requires VERCEL_API_TOKEN (a Vercel personal access token) and
// VERCEL_PROJECT_ID. If the project belongs to a team, also set
// VERCEL_TEAM_ID.

const VERCEL_API_BASE = "https://api.vercel.com";

function getConfig() {
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID; // optional
  if (!token) throw new Error("VERCEL_API_TOKEN environment variable is not set");
  if (!projectId) throw new Error("VERCEL_PROJECT_ID environment variable is not set");
  return { token, projectId, teamId };
}

function withTeam(url: string, teamId: string | undefined) {
  if (!teamId) return url;
  return url + (url.includes("?") ? "&" : "?") + `teamId=${teamId}`;
}

type VercelEnvVar = {
  id: string;
  key: string;
  value?: string;
  target: string[];
};

export async function getEnvVarStatus(key: string): Promise<{ set: boolean; envId?: string; targets?: string[] }> {
  const { token, projectId, teamId } = getConfig();
  const url = withTeam(`${VERCEL_API_BASE}/v9/projects/${projectId}/env`, teamId);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!res.ok) throw new Error(`Vercel API read failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const match = (data.envs as VercelEnvVar[]).find((e) => e.key === key);
  if (!match) return { set: false };
  return { set: true, envId: match.id, targets: match.target };
}

export async function setEnvVar(key: string, value: string): Promise<void> {
  const { token, projectId, teamId } = getConfig();
  const existing = await getEnvVarStatus(key);

  if (existing.set && existing.envId) {
    const url = withTeam(`${VERCEL_API_BASE}/v9/projects/${projectId}/env/${existing.envId}`, teamId);
    const res = await fetch(url, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error(`Vercel API update failed: ${res.status} ${await res.text()}`);
  } else {
    const url = withTeam(`${VERCEL_API_BASE}/v10/projects/${projectId}/env`, teamId);
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: ["production", "preview", "development"],
      }),
    });
    if (!res.ok) throw new Error(`Vercel API create failed: ${res.status} ${await res.text()}`);
  }
}

export async function triggerRedeploy(): Promise<void> {
  const { token, projectId, teamId } = getConfig();
  const listUrl = withTeam(`${VERCEL_API_BASE}/v6/deployments?projectId=${projectId}&limit=1&target=production`, teamId);
  const listRes = await fetch(listUrl, { headers: { Authorization: `Bearer ${token}` } });
  if (!listRes.ok) throw new Error(`Could not find latest deployment to redeploy: ${listRes.status}`);
  const listData = await listRes.json();
  const latest = listData.deployments?.[0];
  if (!latest) throw new Error("No existing production deployment found to redeploy from.");

  const deployUrl = withTeam(`${VERCEL_API_BASE}/v13/deployments`, teamId);
  const res = await fetch(deployUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: latest.name,
      deploymentId: latest.uid,
      target: "production",
    }),
  });
  if (!res.ok) throw new Error(`Redeploy trigger failed: ${res.status} ${await res.text()}`);
}
