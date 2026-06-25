"use client"

import { useEffect, useRef } from "react"
import { useAuthStore } from "@/store/authStore"
import { useWishlist } from "@/hooks/useWishlist"

/** Syncs wishlist from server once per login session. */
export function WishlistBootstrap() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { refreshWishlist } = useWishlist()
  const syncedRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      syncedRef.current = false
      return
    }
    if (syncedRef.current) return
    syncedRef.current = true
    refreshWishlist()
  }, [isAuthenticated, refreshWishlist])

  return null
}
