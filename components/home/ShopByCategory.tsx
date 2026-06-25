"use client"

import React, { useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SHOP_CATEGORIES } from "@/lib/constants"
import { prefetchProducts } from "@/lib/prefetchProducts"

export const ShopByCategory = () => {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" })
  }

  const warmCategory = (slug: string, href: string) => {
    prefetchProducts({ category: slug, sort: "newest" })
    router.prefetch(href)
  }

  return (
    <section className="py-20 md:py-28 bg-background border-t border-border font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">
              Browse By Style
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-text-primary tracking-wide">
              Shop By Category
            </h2>
          </div>
          <div className="flex space-x-3 mt-6 sm:mt-0">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 border border-border flex items-center justify-center hover:bg-dark hover:text-white transition-all duration-300"
              aria-label="Scroll categories left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 border border-border flex items-center justify-center hover:bg-dark hover:text-white transition-all duration-300"
              aria-label="Scroll categories right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        >
          {SHOP_CATEGORIES.map((cat) => {
            const href = `/shop/${cat.slug}`
            return (
              <Link
                key={cat.name}
                href={href}
                prefetch
                onMouseEnter={() => warmCategory(cat.slug, href)}
                onFocus={() => warmCategory(cat.slug, href)}
                className="group flex-shrink-0 w-[160px] sm:w-[180px] snap-start text-center"
              >
                <div className="relative aspect-square overflow-hidden bg-dark mb-4 rounded-full border-2 border-border group-hover:border-gold transition-colors duration-500">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-85"
                    style={{ backgroundImage: `url('${cat.image}')` }}
                  />
                </div>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-text-primary group-hover:text-gold transition-colors duration-300">
                  {cat.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
