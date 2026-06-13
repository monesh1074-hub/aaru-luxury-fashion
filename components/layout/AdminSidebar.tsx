"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Landmark, Users, Scissors, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

export const AdminSidebar = () => {
  const pathname = usePathname()
  const { logout } = useAuth()

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Orders", href: "/admin/orders", icon: Landmark },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Custom Orders", href: "/admin/custom-orders", icon: Scissors },
  ]

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-dark text-background border-r border-[#262422] flex flex-col justify-between font-body z-30 pt-24 pb-8 px-6">
      <div className="space-y-8">
        <div>
          <h4 className="font-display text-lg font-bold tracking-widest text-gold uppercase">
            AARU Admin
          </h4>
          <span className="block text-[7px] tracking-[0.3em] uppercase text-text-secondary">
            Management Panel
          </span>
        </div>

        <nav className="flex flex-col space-y-2">
          {links.map((link, idx) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={idx}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                  {
                    "bg-gold text-dark font-bold": isActive,
                    "text-[#A69E94] hover:bg-border/10 hover:text-white": !isActive,
                  }
                )}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <button
        onClick={logout}
        className="flex items-center space-x-3 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-error hover:bg-error/10 transition-all duration-300 w-full"
      >
        <LogOut size={16} />
        <span>Exit Panel</span>
      </button>
    </aside>
  )
}
