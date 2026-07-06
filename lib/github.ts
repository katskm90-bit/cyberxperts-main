// Thin wrapper around GitHub's Contents API. No SDK dependency — plain
// fetch calls, since this is a small, well-defined set of operations
// (read a file, write a file, both text and binary).

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // format: "owner/repo-name"
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token) throw new Error("GITHUB_TOKEN environment variable is not set");
  if (!repo) throw new Error("GITHUB_REPO environment variable is not set (format: owner/repo-name)");
  return { token, repo, branch };
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function getFile(path: string): Promise<{ content: string; sha: string } | null> {
  const { token, repo, branch } = getConfig();
  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
    { headers: headers(token), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed for ${path}: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf8");
  return { content, sha: data.sha };
}

export async function putFile(path: string, contentBase64: string, message: string, isBase64Content = false) {
  const { token, repo, branch } = getConfig();
  const existing = await getFile(path).catch(() => null);

  const body: Record<string, unknown> = {
    message,
    branch,
    content: isBase64Content ? contentBase64 : Buffer.from(contentBase64, "utf8").toString("base64"),
  };
  if (existing) body.sha = existing.sha;

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        `GitHub write failed for ${path}: repository not found (404). This almost always means GITHUB_REPO is set incorrectly — it must be exactly "owner/repo-name" (e.g. "katskm90-bit/cyberxperts-main"), not a full URL and not including "https://github.com/". Check this in Vercel's environment variables.`
      );
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        `GitHub write failed for ${path}: authentication/permission error (${res.status}). GITHUB_TOKEN is likely missing, expired, or doesn't have "Contents: Read and write" permission on this repository.`
      );
    }
    throw new Error(`GitHub write failed for ${path}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
