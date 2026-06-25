"use client"

import React from "react"
import { Star } from "lucide-react"
import { TESTIMONIALS } from "@/lib/constants"

export const Testimonials = () => {
  return (
    <section className="py-20 md:py-28 bg-dark text-background font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">
            Client Voices
          </span>
          <h2 className="font-display text-3xl md:text-4xl tracking-wide">
            Customer Reviews
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.name}
              className="border border-[#262422] p-8 space-y-5 hover:border-gold/40 transition-colors duration-500"
            >
              <div className="flex gap-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-base text-[#D9D1C7]/90 leading-relaxed italic font-accent">
                &ldquo;{item.review}&rdquo;
              </p>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gold">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
