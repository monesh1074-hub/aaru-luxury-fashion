"use client"

import React, { useState } from "react"
import Link from "next/link"
import { SHOP_THE_LOOK } from "@/lib/constants"

export const ShopTheLook = () => {
  const [activeLook, setActiveLook] = useState(0)
  const look = SHOP_THE_LOOK[activeLook]

  return (
    <section id="shop-the-look" className="py-20 md:py-28 bg-background border-t border-border font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">
            Editorial Styling
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-text-primary tracking-wide">
            Shop The Look
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {SHOP_THE_LOOK.map((item, idx) => (
            <button
              key={item.title}
              onClick={() => setActiveLook(idx)}
              className={`text-xs uppercase tracking-widest font-semibold px-4 py-2 border transition-all duration-300 ${
                activeLook === idx
                  ? "border-dark bg-dark text-background"
                  : "border-border text-text-secondary hover:border-gold"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-dark group">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${look.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />

          {look.products.map((product, idx) => (
            <Link
              key={idx}
              href={product.href}
              className="absolute z-10 group/dot"
              style={{ left: `${product.x}%`, top: `${product.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-40" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-gold border-2 border-white shadow-lg" />
              </span>
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap bg-white text-dark text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-300 shadow-md pointer-events-none">
                {product.name}
              </span>
            </Link>
          ))}

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h3 className="font-display text-xl md:text-2xl text-white tracking-wide">{look.title}</h3>
            <p className="text-xs text-white/70 mt-2 uppercase tracking-wider">
              Tap the dots to shop each piece
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
