import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";
import { putFile } from "@/lib/github";

// Publishes edited content back to GitHub. Vercel is already connected to
// this repo, so a successful commit here triggers an automatic redeploy —
// no separate "trigger build" step is needed.
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = (await req.json()) as {
    siteContent?: unknown;
    services?: unknown;
    industries?: unknown;
    products?: unknown;
    productCategories?: unknown;
    careers?: unknown;
    resourceArticles?: unknown;
    commitMessage?: string;
  };

  const message = body.commitMessage?.trim() || "Update site content via admin panel";
  const results: string[] = [];
  const files: [string, unknown, string][] = [
    ["content/site-content.json", body.siteContent, "site content"],
    ["content/services.json", body.services, "services"],
    ["content/industries.json", body.industries, "industries"],
    ["content/products.json", body.products, "products"],
    ["content/product-categories.json", body.productCategories, "product categories"],
    ["content/careers.json", body.careers, "job listings"],
    ["content/resources-articles.json", body.resourceArticles, "resource articles"],
  ];

  try {
    for (const [path, data, label] of files) {
      if (data === undefined) continue;
      await putFile(path, JSON.stringify(data, null, 2) + "\n", `${message} (${label})`);
      results.push(path.split("/").pop()!);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error publishing to GitHub.";
    return NextResponse.json({ error: msg, published: results }, { status: 500 });
  }

  return NextResponse.json({ ok: true, published: results });
}
