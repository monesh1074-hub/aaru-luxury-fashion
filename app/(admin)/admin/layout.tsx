import React from "react"
import { AdminSidebar } from "@/components/layout/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Fixed Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content Area */}
      <main className="flex-1 ml-64 p-8 min-h-screen pt-24 font-body text-text-primary">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
