"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { WishlistBootstrap } from "./WishlistBootstrap"
import { NavigationProgress } from "./NavigationProgress"
import "@/lib/apiClient"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  return (
    <>
      {!isAdmin && <NavigationProgress />}
      {!isAdmin && <WishlistBootstrap />}
      {!isAdmin && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdmin && <Footer />}
    </>
  )
}
