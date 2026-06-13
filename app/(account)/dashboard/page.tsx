"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useOrders } from "@/hooks/useOrders"
import { OrderCard } from "@/components/dashboard/OrderCard"
import { User, ShoppingBag, Heart, MapPin, LogOut, ShieldCheck } from "lucide-react"

export default function AccountDashboardPage() {
  const { user, logout } = useAuth()
  const { orders, fetchOrders, loading } = useOrders()

  useEffect(() => {
    fetchOrders()
  }, [])

  const navigation = [
    { label: "Overview", href: "/dashboard", icon: User, active: true },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
  ]

  if (user?.role === "ADMIN") {
    navigation.push({ label: "Admin Panel", href: "/admin", icon: ShieldCheck, active: false })
  }

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">
              Customer Account
            </span>
            <h1 className="font-display text-3xl font-semibold text-dark">
              Welcome, {user?.name || "Kamalesh"}
            </h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-error hover:opacity-80 transition-opacity"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Navigation Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation links (Left) */}
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

          {/* Main Content Area (Right) */}
          <div className="lg:col-span-9 space-y-10">
            {/* User Profile Card */}
            <div className="border border-border p-6 bg-white space-y-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark border-b border-border pb-2.5">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-text-secondary uppercase tracking-wider">
                <div>
                  <span className="font-bold text-dark block mb-0.5">Name</span>
                  <span>{user?.name || "Kamalesh M"}</span>
                </div>
                <div>
                  <span className="font-bold text-dark block mb-0.5">Email</span>
                  <span className="lowercase text-text-primary">{user?.email || "kamalesh@aaru.com"}</span>
                </div>
                <div>
                  <span className="font-bold text-dark block mb-0.5">Mobile</span>
                  <span>{user?.mobile || "9988776655"}</span>
                </div>
              </div>
            </div>

            {/* Recent Orders Card */}
            <div className="space-y-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark border-b border-border pb-2.5">
                Recent Orders
              </h3>
              {loading ? (
                <p className="text-xs text-text-secondary uppercase tracking-widest">
                  Loading order list...
                </p>
              ) : orders.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-border">
                  <p className="text-xs text-text-secondary uppercase tracking-widest">
                    No orders placed yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 2).map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                  {orders.length > 2 && (
                    <div className="pt-2 text-right">
                      <Link
                        href="/dashboard/orders"
                        className="text-xs uppercase tracking-widest text-gold font-bold hover:text-dark transition-colors duration-200"
                      >
                        View All Orders &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
