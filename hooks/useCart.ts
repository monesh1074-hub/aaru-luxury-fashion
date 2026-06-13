import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import axios from "axios"
import { useState } from "react"
import { CartItem, Product, ProductVariant } from "@/types"

export function useCart() {
  const {
    items,
    totalItems,
    totalPrice,
    addItem: cartAddItem,
    removeItem: cartRemoveItem,
    updateQuantity: cartUpdateQty,
    clearCart,
  } = useCartStore()

  const { isAuthenticated, token } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const syncCartWithServer = async (currentItems: CartItem[]) => {
    if (!isAuthenticated) return
    try {
      await axios.post(
        "/api/cart",
        {
          items: currentItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    } catch (error) {
      console.error("Cart synchronization failed:", error)
    }
  }

  const addItem = async (product: Product, variant: ProductVariant, quantity: number = 1) => {
    const newItem: CartItem = {
      id: Math.random().toString(),
      productId: product.id,
      variantId: variant.id,
      quantity,
      product,
      variant,
    }
    cartAddItem(newItem)
    if (isAuthenticated) {
      setLoading(true)
      const updatedItems = useCartStore.getState().items
      await syncCartWithServer(updatedItems)
      setLoading(false)
    }
  }

  const removeItem = async (productId: string, variantId: string) => {
    cartRemoveItem(productId, variantId)
    if (isAuthenticated) {
      setLoading(true)
      const updatedItems = useCartStore.getState().items
      await syncCartWithServer(updatedItems)
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId, variantId)
      return
    }
    cartUpdateQty(productId, variantId, quantity)
    if (isAuthenticated) {
      setLoading(true)
      const updatedItems = useCartStore.getState().items
      await syncCartWithServer(updatedItems)
      setLoading(false)
    }
  }

  return {
    items,
    totalItems,
    totalPrice,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
