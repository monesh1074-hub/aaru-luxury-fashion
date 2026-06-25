"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, ShoppingBag, User, Menu, ShieldCheck } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { useAuthStore } from "@/store/authStore"
import { CartDrawer } from "../cart/CartDrawer"
import { MobileMenu } from "./MobileMenu"
import { SecondaryNav } from "./SecondaryNav"
import { MobileStickyBar } from "./MobileStickyBar"
import { NavbarSearch } from "./NavbarSearch"
import { WHATSAPP_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export const Navbar = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const cartCount = useCartStore((state) => state.totalItems)
  const wishlistCount = useWishlistStore((state) => state.count)
  const { isAuthenticated, user } = useAuthStore()

  const isHeroPage = pathname === "/"
  const useLightHeader = !isHeroPage || isScrolled

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-40 transition-all duration-500 font-body border-b",
          useLightHeader
            ? "bg-background text-text-primary border-border shadow-sm"
            : "bg-dark/90 backdrop-blur-md text-background border-[#262422]/50"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Main row: logo left | search center | icons right */}
          <div className="flex items-center gap-3 md:gap-6 py-3 md:py-4">
            {/* Left: mobile menu + logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:text-gold transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Open mobile menu"
              >
                <Menu size={20} />
              </button>
              <Link href="/" className="flex flex-col leading-none">
                <span
                  className={cn(
                    "font-display text-xl sm:text-2xl md:text-[1.75rem] font-bold tracking-[0.25em] transition-colors",
                    useLightHeader ? "text-dark" : "text-gold"
                  )}
                >
                  AARU
                </span>
                <span
                  className={cn(
                    "hidden sm:block text-[7px] tracking-[0.35em] uppercase mt-1",
                    useLightHeader ? "text-text-secondary" : "text-background/60"
                  )}
                >
                  Luxury Fashion
                </span>
              </Link>
            </div>

            {/* Center: search bar (desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-auto">
              <NavbarSearch variant={useLightHeader ? "light" : "dark"} />
            </div>

            {/* Right: utility icons */}
            <div className="flex items-center gap-0.5 sm:gap-1 ml-auto flex-shrink-0">
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="hover:text-gold transition-colors p-2 min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Account"
              >
                <User size={18} />
              </Link>
              <Link
                href="/dashboard/wishlist"
                className="hover:text-gold transition-colors p-2 relative min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-gold text-dark text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="hover:text-gold transition-colors p-2 relative min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-gold text-dark text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors p-2 min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon size={20} />
            </a>
              {isAuthenticated && user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="hidden sm:flex hover:text-gold transition-colors p-2 text-gold min-w-[40px] min-h-[40px] items-center justify-center"
                  aria-label="Admin Panel"
                  title="Admin Dashboard"
                >
                  <ShieldCheck size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile search row */}
          <div className="md:hidden pb-3">
            <NavbarSearch variant={useLightHeader ? "light" : "dark"} />
          </div>
        </div>
      </header>

      <SecondaryNav isScrolled={isScrolled} isHeroPage={isHeroPage} useLightHeader={useLightHeader} />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <MobileStickyBar onCartOpen={() => setIsCartOpen(true)} />
    </>
  )
}
