import partnersJson from "@/content/products.json";
import categoriesJson from "@/content/product-categories.json";

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
};

export type Partner = {
  slug: string;
  name: string;
  products: Product[];
};

// Content lives in content/products.json (partners + their products) and
// content/product-categories.json (the global, admin-managed category
// list) — the admin tool reads/writes both directly.
export const partners: Partner[] = partnersJson as Partner[];
export const productCategories: string[] = categoriesJson as string[];

export function getAllCategories(): string[] {
  return [...productCategories].sort();
}
