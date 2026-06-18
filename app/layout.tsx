import React from "react"
import type { Metadata } from "next"
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google"
import { Toaster } from "react-hot-toast"
import { SiteShell } from "@/components/layout/SiteShell"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const dmsans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "AARU | Luxury Indian Fashion",
  description: "Celebrated handloom sarees, bespoke lehengas, and designer couture.",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmsans.variable} ${cormorant.variable}`}>
      <body className="bg-background text-text-primary antialiased font-body min-h-screen flex flex-col justify-between">
        <Toaster position="bottom-right" />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
