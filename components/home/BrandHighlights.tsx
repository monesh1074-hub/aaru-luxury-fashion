"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export const BrandHighlights = () => {
  return (
    <section className="bg-background font-body">
      {/* 1. Philosophy Highlight */}
      <div className="py-24 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block">
              The Philosophy
            </span>
            <h3 className="font-display text-3xl md:text-4xl text-text-primary tracking-wide leading-tight">
              Sartorial poetry, handwoven in Indian heartlands.
            </h3>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide">
              Every AARU garment carries the fingerprints of local master weavers. Spun using traditional handloom spindles, detailed with antique borders, and structured for modern elegant silhouettes.
            </p>
            <div className="pt-4">
              <Link
                href="/about"
                className="text-xs uppercase tracking-widest font-semibold border-b border-dark pb-1 hover:border-gold hover:text-gold transition-all duration-300 text-dark"
              >
                Read The Legacy
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden bg-dark">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=80')`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Sixth Element Teaser - Dark Section */}
      <div className="bg-dark text-background py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80')`,
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center px-4 z-10 space-y-8">
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">
            The Concept Collection
          </span>
          <h3 className="font-display text-4xl md:text-5xl text-gold font-light italic leading-tight tracking-wide">
            "The Sixth Element"
          </h3>
          <p className="text-xs md:text-sm text-[#D9D1C7]/80 max-w-xl mx-auto leading-relaxed tracking-wider">
            An exploration of raw silk coords and organic textured linen layers. Stripped of loud colors, celebrating shadow, structure, and drape.
          </p>
          <div className="pt-6">
            <Link
              href="/sixth-element"
              className="bg-transparent border border-gold text-gold px-8 py-3.5 text-xs font-semibold tracking-widest uppercase hover:bg-gold hover:text-dark transition-all duration-300 font-body inline-block"
            >
              Enter The Space
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Bespoke Custom Clothing CTA Banner */}
      <div className="py-24 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative h-[400px] overflow-hidden bg-dark">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80')`,
              }}
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block">
              Bespoke Services
            </span>
            <h3 className="font-display text-3xl md:text-4xl text-text-primary tracking-wide leading-tight">
              Garments made to your exact measurements.
            </h3>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide">
              Participate in our customized clothing experience. Choose from rich silks, hand-painted organzas, and provide custom sizes. Our atelier, supervised by Moni, will handcraft the ensemble to your perfect fit.
            </p>
            <div className="pt-4">
              <Link
                href="/custom"
                className="bg-dark text-background px-8 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-gold hover:text-dark transition-all duration-300 font-body inline-block"
              >
                Inquire Bespoke Fits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
