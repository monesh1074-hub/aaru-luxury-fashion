"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function SixthElementPage() {
  return (
    <div className="bg-dark text-background min-h-screen font-body pt-32 pb-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-24">
        {/* 1. Immersive Concept Intro */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="text-gold text-xs uppercase tracking-[0.5em] font-semibold block">
            The Concept Collection
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-extralight tracking-widest text-white uppercase">
            The Sixth Element
          </h1>
          <p className="text-xs md:text-sm text-[#A69E94] leading-relaxed tracking-[0.2em] max-w-xl mx-auto uppercase">
            Beyond Earth, Water, Fire, Air, and Space. The sixth element is human craft, structure, and drape.
          </p>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-6" />
        </div>

        {/* 2. Visual Split Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold block">
              The Aesthetic
            </span>
            <h2 className="font-display text-3xl text-white font-light tracking-wide leading-snug">
              Stripped of color. Focused on drape.
            </h2>
            <p className="text-xs md:text-sm text-[#A69E94] leading-relaxed tracking-wide">
              The Sixth Element collection is crafted from raw handloom silks, un-dyed organic kora cottons, and structural linen layers in charcoal, slate, and bone.
            </p>
            <p className="text-xs md:text-sm text-[#A69E94] leading-relaxed tracking-wide">
              We look past heavy colors to explore shadow lines, silhouette shapes, and the natural weights of raw hand-spun yarns.
            </p>
            <div className="pt-4">
              <Link
                href="/shop?collection=sixth-element"
                className="bg-gold text-dark px-8 py-3.5 text-xs font-semibold tracking-widest uppercase hover:bg-white hover:text-dark transition-all duration-300 font-body inline-block"
              >
                Explore The Outfits
              </Link>
            </div>
          </div>
          <div className="relative aspect-[3/4] bg-[#1a1917] overflow-hidden border border-[#262422]">
            <Image
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
              alt="Sixth Element visual layout"
              fill
              className="object-cover opacity-75 grayscale"
            />
          </div>
        </div>

        {/* 3. Concept Quotes */}
        <div className="border-t border-[#262422] pt-20 text-center space-y-6 max-w-2xl mx-auto">
          <span className="font-display text-4xl text-gold font-light italic">
            "Structure is the language of silence."
          </span>
          <p className="text-xs text-[#736C63] tracking-widest uppercase">
            — Moni, Creative Director
          </p>
        </div>
      </div>
    </div>
  )
}
