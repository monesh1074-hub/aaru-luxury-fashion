"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SECONDARY_NAV } from "@/lib/constants"
import { prefetchProducts } from "@/lib/prefetchProducts"
import { cn } from "@/lib/utils"

interface SecondaryNavProps {
  isScrolled?: boolean
  isHeroPage?: boolean
  useLightHeader?: boolean
}

export const SecondaryNav: React.FC<SecondaryNavProps> = ({
  isScrolled = false,
  isHeroPage = false,
  useLightHeader = true,
}) => {
  const pathname = usePathname()

  // Header height: desktop ~64px, mobile ~108px (with search row)
  const topClass = isHeroPage && !isScrolled
    ? "top-[108px] md:top-[64px]"
    : "top-[108px] md:top-[64px]"

  return (
    <nav
      className={cn(
        "hidden lg:block fixed left-0 w-full z-30 transition-all duration-500 border-b font-body",
        topClass,
        useLightHeader || !isHeroPage || isScrolled
          ? "bg-background/95 backdrop-blur-md border-border text-text-primary"
          : "bg-dark/80 backdrop-blur-md border-[#262422]/50 text-background"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ul className="flex items-center justify-center gap-5 xl:gap-8 py-3 overflow-x-auto scrollbar-hide">
          {SECONDARY_NAV.map((item) => (
            <li key={item.label} className="flex-shrink-0">
              <Link
                href={item.href}
                onMouseEnter={() => {
                  if (item.href.startsWith("/shop/") && !item.href.includes("?")) {
                    const slug = item.href.replace("/shop/", "")
                    prefetchProducts({ category: slug })
                  } else if (item.href.includes("readyToShip=true")) {
                    prefetchProducts({ readyToShip: true })
                  } else if (item.href.includes("sale=true")) {
                    prefetchProducts({ sale: true })
                  } else if (item.href.includes("sort=newest")) {
                    prefetchProducts({ sort: "newest" })
                  }
                }}
                className={cn(
                  "text-[10px] uppercase tracking-[0.2em] font-semibold whitespace-nowrap transition-colors duration-300 hover:text-gold",
                  pathname === item.href.split("?")[0] && "text-gold"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
