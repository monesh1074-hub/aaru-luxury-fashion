"use client"

import React, { useState } from "react"
import { Menu } from "lucide-react"
import { AdminSidebar } from "./AdminSidebar"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Mobile admin header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-dark text-background border-b border-[#262422] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:text-gold transition-colors"
          aria-label="Open admin menu"
        >
          <Menu size={20} />
        </button>
        <span className="font-display text-lg font-bold tracking-widest text-gold">AARU Admin</span>
        <div className="w-9" />
      </div>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-dark/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 pt-16 lg:pt-8 p-4 sm:p-6 lg:p-8 min-h-screen font-body text-text-primary">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
