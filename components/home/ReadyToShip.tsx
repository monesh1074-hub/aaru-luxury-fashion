"use client"

import React from "react"
import Link from "next/link"
import { ProductCard } from "../product/ProductCard"
import { Product } from "@/types"
import { Zap } from "lucide-react"

interface ReadyToShipProps {
  products: Product[]
}

export const ReadyToShip: React.FC<ReadyToShipProps> = ({ products }) => {
  const displayProducts = products.slice(0, 4)

  if (displayProducts.length === 0) return null

  return (
    <section className="py-20 md:py-28 bg-[#F5F0EA] border-t border-border font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2">
              <Zap size={14} />
              Fast Dispatch
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-text-primary tracking-wide">
              Ready To Ship
            </h2>
            <p className="text-sm text-text-secondary mt-3 max-w-md">
              Curated pieces in stock and ready for dispatch within 48 hours.
            </p>
          </div>
          <Link
            href="/shop?readyToShip=true"
            className="text-xs uppercase tracking-widest font-semibold border-b border-dark pb-1 hover:border-gold hover:text-gold transition-all duration-300 self-start md:self-auto"
          >
            View All Ready To Ship
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((prod) => (
            <div key={prod.id} className="relative">
              <span className="absolute top-6 left-6 z-20 bg-success text-white text-[8px] font-bold tracking-widest uppercase px-2 py-1 flex items-center gap-1">
                <Zap size={10} />
                Ready To Ship
              </span>
              <ProductCard product={prod} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
