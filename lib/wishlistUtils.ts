import { WishlistItem, Product } from "@/types"
import { toIso } from "@/lib/dateUtils"

export function normalizeWishlistItems(raw: unknown): WishlistItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item) => item && typeof item === "object" && "productId" in item && item.product)
    .map((item) => ({
      id: String(item.id),
      userId: String(item.userId ?? ""),
      productId: String(item.productId),
      product: item.product as Product,
      createdAt: toIso(
        item.createdAt instanceof Date
          ? item.createdAt
          : typeof item.createdAt === "string"
            ? item.createdAt
            : new Date()
      ),
    }))
}
