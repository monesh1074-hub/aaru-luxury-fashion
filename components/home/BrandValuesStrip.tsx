"use client"

import React from "react"
import { BRAND_VALUES } from "@/lib/constants"

export const BrandValuesStrip = () => {
  const items = [...BRAND_VALUES, ...BRAND_VALUES]

  return (
    <section className="bg-dark border-y border-[#262422] overflow-hidden py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((value, idx) => (
          <span
            key={`${value}-${idx}`}
            className="inline-flex items-center mx-8 md:mx-12 text-[10px] md:text-xs uppercase tracking-[0.35em] font-semibold text-gold/90"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold mr-4 opacity-60" />
            {value}
          </span>
        ))}
      </div>
    </section>
  )

}
