import axios from "@/lib/apiClient"
import { WishlistItem } from "@/types"
import { normalizeWishlistItems } from "@/lib/wishlistUtils"

export { normalizeWishlistItems } from "@/lib/wishlistUtils"

export async function fetchWishlistFromApi(token?: string | null): Promise<WishlistItem[]> {
  const res = await axios.get("/api/wishlist", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  const payload = res.data?.wishlist ?? res.data
  return normalizeWishlistItems(payload)
}

export async function setWishlistOnServer(
  productId: string,
  action: "add" | "remove",
  token?: string | null
): Promise<{ wishlisted: boolean }> {
  const res = await axios.post(
    "/api/wishlist",
    { productId, action },
    { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
  )
  return { wishlisted: Boolean(res.data?.wishlisted) }
}
