/** Safe ISO string for Prisma dates and JSON/cache-deserialized strings. */
export function toIso(value: Date | string | null | undefined): string {
  if (value == null) return new Date(0).toISOString()
  if (typeof value === "string") return value
  return value.toISOString()
}
