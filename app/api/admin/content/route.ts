import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";
import siteContent from "@/content/site-content.json";
import services from "@/content/services.json";
import industries from "@/content/industries.json";
import products from "@/content/products.json";
import productCategories from "@/content/product-categories.json";
import careers from "@/content/careers.json";
import resourceArticles from "@/content/resources-articles.json";

// Reads the content bundled into this deployment (not a live GitHub call).
// Since every Publish triggers a fresh Vercel deploy, this is in sync with
// GitHub main immediately after any successful publish — the only gap is
// the few seconds/minutes between a publish and the resulting redeploy
// finishing, during which this briefly still shows the pre-publish state.
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  return NextResponse.json({ siteContent, services, industries, products, productCategories, careers, resourceArticles });
}
