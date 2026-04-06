// lib/nlp-filter.ts
// Artık kural tabanlı değil — kendi eğittiğimiz FastAPI modeline istek atar.

export type FilterState = {
  colors: string[];
  categories: string[];
  genders: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  inStockOnly: boolean;
  intent: "FILTER" | "RESET" | "BROWSE" | "";
  intentConfidence: number;
  rawText: string;
};

export const EMPTY_FILTER: FilterState = {
  colors: [],
  categories: [],
  genders: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  inStockOnly: false,
  intent: "",
  intentConfidence: 0,
  rawText: "",
};

const API_URL = process.env.NEXT_PUBLIC_NLP_API_URL ?? "http://localhost:8000";

// ─── Model API çağrısı ────────────────────────────────────────────────────────

export async function parseVoiceCommand(text: string): Promise<FilterState> {
  const res = await fetch(`${API_URL}/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`NLP API hatası: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  return {
    colors: data.entities.colors ?? [],
    categories: data.entities.categories ?? [],
    genders: data.entities.genders ?? [],
    minPrice: data.entities.price_min ?? null,
    maxPrice: data.entities.price_max ?? null,
    minRating: data.entities.rating_min ?? null,
    inStockOnly: data.entities.in_stock_only ?? false,
    intent: data.intent ?? "FILTER",
    intentConfidence: data.intent_confidence ?? 0,
    rawText: text,
  };
}

// ─── Ürün filtreleme ──────────────────────────────────────────────────────────

import type { Product } from "./products";

export function applyFilters(products: Product[], filter: FilterState): Product[] {
  if (isEmptyFilter(filter)) return products;
  if (filter.intent === "RESET") return products;

  return products.filter((p) => {
    if (filter.colors.length > 0) {
      const hasColor = filter.colors.some((c) => p.color === c || p.colors.includes(c));
      if (!hasColor) return false;
    }
    if (filter.categories.length > 0) {
      if (!filter.categories.includes(p.category)) return false;
    }
    if (filter.genders.length > 0) {
      const match = filter.genders.some((g) => p.gender === g || p.gender === "unisex");
      if (!match) return false;
    }
    if (filter.maxPrice !== null && p.price > filter.maxPrice) return false;
    if (filter.minPrice !== null && p.price < filter.minPrice) return false;
    if (filter.minRating !== null && p.rating < filter.minRating) return false;
    if (filter.inStockOnly && !p.inStock) return false;
    return true;
  });
}

export function isEmptyFilter(f: FilterState): boolean {
  return (
    f.colors.length === 0 &&
    f.categories.length === 0 &&
    f.genders.length === 0 &&
    f.minPrice === null &&
    f.maxPrice === null &&
    f.minRating === null &&
    !f.inStockOnly
  );
}

export function describeFilter(f: FilterState): string {
  const parts: string[] = [];
  if (f.colors.length > 0) parts.push(f.colors.join(", "));
  if (f.categories.length > 0) parts.push(f.categories.join(", "));
  if (f.genders.length > 0) parts.push(f.genders.join(", "));
  if (f.maxPrice !== null && f.minPrice !== null)
    parts.push(`${f.minPrice}₺–${f.maxPrice}₺`);
  else if (f.maxPrice !== null) parts.push(`max ${f.maxPrice}₺`);
  else if (f.minPrice !== null) parts.push(`min ${f.minPrice}₺`);
  if (f.minRating !== null) parts.push(`${f.minRating}+ ⭐`);
  if (f.inStockOnly) parts.push("stokta");
  return parts.join(" · ") || "Tüm ürünler";
}
