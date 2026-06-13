"use client"

import React, { useState, useEffect } from "react"
import Link from "next/navigation" // Wait! In Next.js, we import Link from 'next/link'. Let's verify that. Yes!
import LinkElement from "next/link"
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
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Navigation Links - Left (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8 text-[11px] uppercase tracking-widest font-semibold">
            <LinkElement
              href="/shop"
              className="hover:text-gold transition-colors duration-300"
            >
              Shop
            </LinkElement>
            <LinkElement
              href="/shop?collection=featured"
              className="hover:text-gold transition-colors duration-300"
            >
              Collections
            </LinkElement>
            <LinkElement
              href="/custom"
              className="hover:text-gold transition-colors duration-300"
            >
              Custom
            </LinkElement>
            <LinkElement
              href="/story"
              className="hover:text-gold transition-colors duration-300"
            >
              Our Story
            </LinkElement>
          </nav>

          {/* Mobile Menu Icon (Left) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-current p-1 hover:text-gold transition-colors duration-300"
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo - Center */}
          <div className="text-center">
            <LinkElement
              href="/"
              className="font-display text-2xl md:text-3xl font-bold tracking-widest text-gold hover:text-gold/85 transition-colors duration-300"
            >
              AARU
            </LinkElement>
            <span className="block text-[7px] tracking-[0.4em] uppercase text-text-secondary">
              Luxury Fashion
            </span>
          </div>

          {/* Utility Icons - Right */}
          <div className="flex items-center space-x-4 md:space-x-6 text-current">
            <LinkElement
              href="/search"
              className="hover:text-gold transition-colors duration-300 p-1"
              aria-label="Search"
            >
              <Search size={18} />
            </LinkElement>

            <LinkElement
              href="/dashboard/wishlist"
              className="hover:text-gold transition-colors duration-300 p-1 relative"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-dark text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </LinkElement>

            <button
              onClick={() => setIsCartOpen(true)}
              className="hover:text-gold transition-colors duration-300 p-1 relative"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-dark text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <LinkElement
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="hover:text-gold transition-colors duration-300 p-1"
              aria-label="Account"
            >
              <User size={18} />
            </LinkElement>

            {isAuthenticated && user?.role === "ADMIN" && (
              <LinkElement
                href="/admin"
                className="hover:text-gold transition-colors duration-300 p-1 text-gold"
                aria-label="Admin Panel"
                title="Admin Dashboard"
              >
                <ShieldCheck size={18} />
              </LinkElement>
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
