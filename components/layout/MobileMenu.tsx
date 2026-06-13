import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { X, ArrowRight } from "lucide-react"
import { useAuthStore } from "@/store/authStore"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuthStore()

  const links = [
    { label: "Shop All", href: "/shop" },
    { label: "Heritage Sarees", href: "/shop/sarees" },
    { label: "Designer Couture", href: "/shop/designer-sarees" },
    { label: "Bespoke Custom", href: "/custom" },
    { label: "The Sixth Element", href: "/sixth-element" },
    { label: "Our Story", href: "/story" },
    { label: "About Moni", href: "/aaru-by-moni" },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="relative w-4/5 max-w-sm h-full bg-dark text-background flex flex-col p-8 justify-between border-r border-[#262422] z-10"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#262422] pb-6 mb-8">
                <span className="font-display text-xl font-bold tracking-widest text-gold">AARU</span>
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-gold transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex flex-col space-y-6 text-sm uppercase tracking-[0.2em] font-semibold">
                {links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    onClick={onClose}
                    className="hover:text-gold transition-colors duration-300 flex items-center justify-between group"
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

            {/* Bottom Account Action */}
            <div className="border-t border-[#262422] pt-6 flex flex-col space-y-4">
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
