import React from "react"
import Link from "next/link"
import { FEATURED_DESIGNERS } from "@/lib/constants"

export const DesignerShowcase = () => {
  return (
    <section className="py-20 md:py-28 bg-dark text-background font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">
            Curated Creators
          </span>
          <h2 className="font-display text-3xl md:text-4xl tracking-wide">
            Featured Designers
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {FEATURED_DESIGNERS.map((designer) => (
            <Link
              key={designer.name}
              href={designer.href}
              className="group text-center space-y-5"
            >
              <div className="relative mx-auto w-48 h-48 md:w-56 md:h-56 overflow-hidden rounded-full border-2 border-gold/40 group-hover:border-gold transition-colors duration-500">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${designer.image}')` }}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl md:text-2xl tracking-wide">{designer.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#A69E94]">
                  {designer.collectionCount} Collections
                </p>
                <span className="inline-block text-xs uppercase tracking-widest font-semibold text-gold group-hover:text-white transition-colors duration-300 pt-2">
                  Explore Collection &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
