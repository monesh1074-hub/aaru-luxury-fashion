"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { X, ArrowRight, Search } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { SECONDARY_NAV, WHATSAPP_URL } from "@/lib/constants"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="relative w-4/5 max-w-sm h-full bg-dark text-background flex flex-col p-6 sm:p-8 justify-between border-r border-[#262422] z-10 overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#262422] pb-6 mb-6">
                <span className="font-display text-xl font-bold tracking-widest text-gold">AARU</span>
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-gold transition-colors duration-200 p-2"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <Link
                href="/search"
                onClick={onClose}
                className="w-full flex items-center gap-3 border border-[#262422] px-4 py-3 mb-8 text-sm text-text-secondary hover:border-gold hover:text-gold transition-colors"
              >
                <Search size={16} />
                Search collections...
              </Link>

              <nav className="flex flex-col space-y-5 text-sm uppercase tracking-[0.15em] font-semibold">
                {SECONDARY_NAV.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    className="hover:text-gold transition-colors duration-300 flex items-center justify-between group py-1"
                  >
                    <span>{link.label}</span>
                    <ArrowRight
                      size={14}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gold"
                    />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-[#262422] pt-6 flex flex-col space-y-3 mt-8">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full text-center py-3 bg-[#25D366] text-white font-body font-semibold text-xs tracking-widest uppercase hover:bg-[#20bd5a] transition-all duration-300"
              >
                Chat on WhatsApp
              </a>
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                onClick={onClose}
                className="w-full text-center py-3 border border-gold text-gold font-body font-semibold text-xs tracking-widest uppercase hover:bg-gold hover:text-dark transition-all duration-300"
              >
                {isAuthenticated ? "My Dashboard" : "Sign In"}
              </Link>
              {isAuthenticated && user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="w-full text-center py-3 border border-error text-error font-body font-semibold text-xs tracking-widest uppercase hover:bg-error hover:text-white transition-all duration-300"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
