"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      onClose()
      setQuery("")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="relative w-full bg-background border-b border-border shadow-xl z-10 pt-24 pb-8 px-4 md:px-8"
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg uppercase tracking-wider text-dark">Search</h2>
                <button onClick={onClose} className="p-1 hover:text-gold transition-colors" aria-label="Close search">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSearch} className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sarees, lehengas, designers..."
                  autoFocus
                  className="w-full bg-white border border-border pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </form>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider mt-4">
                Press Enter to search our entire collection
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
