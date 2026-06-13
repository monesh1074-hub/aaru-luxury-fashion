"use client"

import React, { useRef } from "react"
import { ProductCard } from "../product/ProductCard"
import { Product } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NewArrivalsProps {
  products: Product[]
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ products }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 340
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className="py-24 bg-background border-t border-border font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header Grid */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
          <div className="text-left">
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">
              The Season's Best
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-text-primary tracking-wide">
              New Arrivals
            </h2>
          </div>
          {/* Slider Controllers */}
          <div className="flex space-x-3 mt-6 sm:mt-0">
            <button
              onClick={() => handleScroll("left")}
              className="w-12 h-12 border border-border flex items-center justify-center hover:bg-dark hover:text-white hover:border-dark transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="w-12 h-12 border border-border flex items-center justify-center hover:bg-dark hover:text-white hover:border-dark transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Containers */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-8 select-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((prod) => (
            <div key={prod.id} className="min-w-[280px] md:min-w-[320px] max-w-[320px] snap-start">
              <ProductCard product={prod} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
