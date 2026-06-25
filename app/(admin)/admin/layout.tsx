import React from "react"
import { AdminShell } from "@/components/layout/AdminShell"
import { AdminPrefetch } from "@/components/admin/AdminPrefetch"
import "@/lib/apiClient"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminPrefetch />
      <AdminShell>{children}</AdminShell>
    </>
  )
}
