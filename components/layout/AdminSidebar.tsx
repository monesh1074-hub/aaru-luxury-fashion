"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Landmark, Users, Scissors, LogOut, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { prefetchAdminPage } from "@/components/admin/AdminPrefetch"

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export const AdminSidebar = ({ isOpen = false, onClose }: AdminSidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, cacheKey: "admin:dashboard" },
    { label: "Products", href: "/admin/products", icon: ShoppingBag, cacheKey: "admin:products" },
    { label: "Orders", href: "/admin/orders", icon: Landmark, cacheKey: "admin:orders" },
    { label: "Customers", href: "/admin/customers", icon: Users, cacheKey: "admin:customers" },
    { label: "Custom Orders", href: "/admin/custom-orders", icon: Scissors, cacheKey: "admin:custom-orders" },
  ]

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen w-64 bg-dark text-background border-r border-[#262422] flex flex-col justify-between font-body z-50 transition-transform duration-300",
        "lg:translate-x-0 lg:pt-8",
        isOpen ? "translate-x-0 pt-16" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="space-y-8 px-6 overflow-y-auto flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-display text-lg font-bold tracking-widest text-gold uppercase">
              AARU Admin
            </h4>
            <span className="block text-[7px] tracking-[0.3em] uppercase text-text-secondary">
              Management Panel
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-text-secondary hover:text-gold"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="flex flex-col space-y-2">
          {links.map((link, idx) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={idx}
                href={link.href}
                prefetch={true}
                onMouseEnter={() => {
                  router.prefetch(link.href)
                  prefetchAdminPage(link.cacheKey)
                }}
                onClick={onClose}
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

      <div className="px-6 pb-8">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-error hover:bg-error/10 transition-all duration-300 w-full"
        >
          <LogOut size={16} />
          <span>Exit Panel</span>
        </button>
      </div>
    </aside>
  )
}
