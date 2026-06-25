/** Maps marketing slugs / aliases to canonical category slugs in the database. */
export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  lehengas: "occasion-wear",
  lehenga: "occasion-wear",
  lehanga: "occasion-wear",
  "lehenga-choli": "occasion-wear",
  suits: "festive-collections",
  "salwar-suits": "festive-collections",
  kurtas: "festive-collections",
  coords: "festive-collections",
  "co-ords": "festive-collections",
  dresses: "designer-sarees",
}

export function resolveCategorySlug(slug: string): string {
  const normalized = slug.toLowerCase().trim()
  return CATEGORY_SLUG_ALIASES[normalized] || normalized
}

export function isLehengaCategory(slug: string): boolean {
  const resolved = resolveCategorySlug(slug)
  return resolved === "occasion-wear"
}
