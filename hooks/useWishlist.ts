import { useCallback } from "react"
import { useWishlistStore } from "@/store/wishlistStore"
import { useAuthStore } from "@/store/authStore"
import { Product, WishlistItem } from "@/types"
import { fetchWishlistFromApi, setWishlistOnServer } from "@/lib/wishlistApi"
import { Toast } from "@/components/ui/Toast"

function toWishlistItem(product: Product): WishlistItem {
  return {
    id: `local-${product.id}`,
    userId: "",
    productId: product.id,
    product,
    createdAt: new Date().toISOString(),
  }
}

export function useWishlist() {
  const { items, addItem, removeItem, syncWithServer } = useWishlistStore()
  const { isAuthenticated, token } = useAuthStore()

  const isWishlisted = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  )

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const serverItems = await fetchWishlistFromApi(token)
      syncWithServer(serverItems)
      return serverItems
    } catch (err) {
      console.error("Failed to fetch wishlist:", err)
    }
  }, [isAuthenticated, token, syncWithServer])

  const toggleWishlist = useCallback(
    async (product: Product) => {
      const productId = product.id
      const wasWishlisted = items.some((item) => item.productId === productId)
      const nextWishlisted = !wasWishlisted

      if (nextWishlisted) {
        addItem(toWishlistItem(product))
        Toast.success("Added to wishlist")
      } else {
        removeItem(productId)
        Toast.success("Removed from wishlist")
      }

      if (!isAuthenticated) return nextWishlisted

      try {
        const { wishlisted } = await setWishlistOnServer(
          productId,
          nextWishlisted ? "add" : "remove",
          token
        )

        if (wishlisted !== nextWishlisted) {
          if (wishlisted) {
            addItem(toWishlistItem(product))
          } else {
            removeItem(productId)
          }
        }
        return wishlisted
      } catch (err) {
        if (nextWishlisted) {
          removeItem(productId)
        } else {
          addItem(toWishlistItem(product))
        }
        Toast.error("Could not update wishlist. Please try again.")
        console.error("Wishlist sync failed:", err)
        return wasWishlisted
      }
    },
    [items, isAuthenticated, token, addItem, removeItem]
  )

  return {
    items,
    count: items.length,
    isWishlisted,
    toggleWishlist,
    refreshWishlist,
  }
}
