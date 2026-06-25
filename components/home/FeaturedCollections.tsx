import React from "react"
import Link from "next/link"
import { FEATURED_COLLECTIONS } from "@/lib/constants"

export const FeaturedCollections = () => {
  return (
    <section className="py-20 md:py-32 bg-background font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">
            The Curated Folders
          </span>
          <h2 className="font-display text-3xl md:text-5xl text-text-primary tracking-wide font-light">
            Featured Collections
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURED_COLLECTIONS.map((col) => (
            <Link
              key={col.title}
              href={col.href}
              className="group relative block h-[380px] sm:h-[460px] lg:h-[540px] overflow-hidden bg-dark"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-85"
                style={{ backgroundImage: `url('${col.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/30 to-transparent transition-opacity duration-500 group-hover:from-dark" />

              <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col text-left justify-end">
                <span className="text-gold text-[10px] uppercase tracking-[0.25em] font-semibold mb-2 block">
                  {col.tagline}
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-background font-light tracking-wide mb-4">
                  {col.title}
                </h3>
                <span className="text-xs uppercase tracking-widest text-background font-semibold flex items-center gap-2 group-hover:text-gold transition-colors duration-300">
                  Explore Now <span className="text-gold">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
