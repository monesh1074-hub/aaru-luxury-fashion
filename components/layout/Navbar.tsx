"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Heart, ShoppingBag, User, Menu, X, ShieldCheck } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { useAuthStore } from "@/store/authStore"
import { CartDrawer } from "../cart/CartDrawer"
import { MobileMenu } from "./MobileMenu"
import { cn } from "@/lib/utils"

export const Navbar = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const cartCount = useCartStore((state) => state.totalItems)
  const wishlistCount = useWishlistStore((state) => state.count)
  const { isAuthenticated, user } = useAuthStore()

  const isHeroPage = pathname === "/" || pathname === "/sixth-element"

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-40 transition-all duration-500 font-body",
          {
            "bg-transparent text-white": isHeroPage && !isScrolled,
            "bg-dark text-background shadow-lg py-4": !isHeroPage || isScrolled,
            "py-6": isHeroPage && !isScrolled,
          }
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Left: desktop nav / mobile menu */}
          <div className="flex items-center justify-start">
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[11px] uppercase tracking-widest font-semibold">
              <Link href="/shop" className="hover:text-gold transition-colors duration-300">Shop</Link>
              <Link href="/shop?collection=featured" className="hover:text-gold transition-colors duration-300">Collections</Link>
              <Link href="/custom" className="hover:text-gold transition-colors duration-300">Custom</Link>
              <Link href="/story" className="hover:text-gold transition-colors duration-300">Our Story</Link>
            </nav>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-current p-1 hover:text-gold transition-colors duration-300"
              aria-label="Open mobile menu"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Center: logo */}
          <div className="text-center justify-self-center">
            <Link
              href="/"
              className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-widest text-gold hover:text-gold/85 transition-colors duration-300"
            >
              AARU
            </Link>
            <span className="hidden sm:block text-[8px] tracking-[0.3em] uppercase text-text-secondary">
              Luxury Fashion
            </span>
          </div>

          {/* Right: utility icons */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-3 md:space-x-5 text-current">
            <Link href="/search" className="hover:text-gold transition-colors duration-300 p-1" aria-label="Search">
              <Search size={18} />
            </Link>
            <Link href="/dashboard/wishlist" className="hover:text-gold transition-colors duration-300 p-1 relative hidden sm:flex" aria-label="Wishlist">
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-dark text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="hover:text-gold transition-colors duration-300 p-1 relative" aria-label="Cart">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-dark text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <Link href={isAuthenticated ? "/dashboard" : "/login"} className="hover:text-gold transition-colors duration-300 p-1" aria-label="Account">
              <User size={18} />
            </Link>
            {isAuthenticated && user?.role === "ADMIN" && (
              <Link href="/admin" className="hidden sm:block hover:text-gold transition-colors duration-300 p-1 text-gold" aria-label="Admin Panel" title="Admin Dashboard">
                <ShieldCheck size={18} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
