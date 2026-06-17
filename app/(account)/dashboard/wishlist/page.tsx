"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useWishlistStore } from "@/store/wishlistStore"
import { WishlistGrid } from "@/components/dashboard/WishlistGrid"
import { User, ShoppingBag, Heart, MapPin, LogOut, Settings } from "lucide-react"
import axios from "axios"

export default function WishlistPage() {
  const { logout, isAuthenticated, token } = useAuth()
  const { items, syncWithServer } = useWishlistStore()
  const [loading, setLoading] = useState(false)

  const fetchWishlist = async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const res = await axios.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      syncWithServer(res.data.wishlist || [])
    } catch (err) {
      console.error("Failed to fetch wishlist:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [isAuthenticated])

  const navigation = [
    { label: "Overview", href: "/dashboard", icon: User },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart, active: true },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">
              Customer Account
            </span>
            <h1 className="font-display text-3xl font-semibold text-dark">My Wishlist</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-error hover:opacity-80 transition-opacity"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Bar */}
          <nav className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-6">
            {navigation.map((nav, idx) => {
              const Icon = nav.icon
              return (
                <Link
                  key={idx}
                  href={nav.href}
                  className={`flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors duration-300 w-full ${
                    nav.active
                      ? "bg-gold/10 text-gold border-l border-gold font-bold"
                      : "text-text-secondary hover:text-dark hover:bg-border/20"
                  }`}
                >
                  <Icon size={14} />
                  <span>{nav.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Main content grid */}
          <div className="lg:col-span-9 space-y-6">
            {loading ? (
              <p className="text-xs uppercase tracking-widest text-text-secondary">
                Loading wishlist items...
              </p>
            ) : (
              <WishlistGrid items={items} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
