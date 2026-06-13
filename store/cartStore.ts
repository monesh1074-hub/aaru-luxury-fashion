import { create } from "zustand"
import { persist } from "zustand/middleware"
import { CartItem } from "@/types"

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  clearCart: () => void
  syncWithServer: (itemsFromServer: CartItem[]) => void
}

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.basePrice
    const itemPrice = price + item.variant.additionalPrice
    return sum + itemPrice * item.quantity
  }, 0)
  return { totalItems, totalPrice }
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
          )
          const newItems = [...state.items]
          if (existingIndex > -1) {
            newItems[existingIndex].quantity += newItem.quantity
          } else {
            newItems.push(newItem)
          }
          return { items: newItems, ...calculateTotals(newItems) }
        }),
      removeItem: (productId, variantId) =>
        set((state) => {
          const newItems = state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          )
          return { items: newItems, ...calculateTotals(newItems) }
        }),
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => {
          const newItems = state.items.map((i) =>
            i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
          )
          return { items: newItems, ...calculateTotals(newItems) }
        }),
      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
      syncWithServer: (itemsFromServer) =>
        set(() => ({ items: itemsFromServer, ...calculateTotals(itemsFromServer) })),
    }),
    {
      name: "aaru-cart-storage",
    }
  )
)
