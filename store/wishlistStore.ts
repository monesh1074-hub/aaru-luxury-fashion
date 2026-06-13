import { create } from "zustand"
import { persist } from "zustand/middleware"
import { WishlistItem } from "@/types"

interface WishlistState {
  items: WishlistItem[]
  count: number
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  toggleItem: (item: WishlistItem) => void
  syncWithServer: (itemsFromServer: WishlistItem[]) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      count: 0,
      addItem: (newItem) =>
        set((state) => {
          const alreadyExists = state.items.some((i) => i.productId === newItem.productId)
          if (alreadyExists) return {}
          const newItems = [...state.items, newItem]
          return { items: newItems, count: newItems.length }
        }),
      removeItem: (productId) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId)
          return { items: newItems, count: newItems.length }
        }),
      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId)
          const newItems = exists
            ? state.items.filter((i) => i.productId !== item.productId)
            : [...state.items, item]
          return { items: newItems, count: newItems.length }
        }),
      syncWithServer: (itemsFromServer) =>
        set(() => ({ items: itemsFromServer, count: itemsFromServer.length })),
    }),
    {
      name: "aaru-wishlist-storage",
    }
  )
)
