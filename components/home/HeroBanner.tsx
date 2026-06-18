"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export const HeroBanner = () => {
  return (
    <section className="relative min-h-[100dvh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-dark">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-65 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      {/* Dark Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />

      {/* Hero Contents */}
      <div className="relative max-w-4xl mx-auto text-center px-4 z-10 flex flex-col items-center">
        {/* Subtitle Accent */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[10px] md:text-xs font-semibold mb-4 block"
        >
          AARU LUXURY ET ENSEMBLES
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-background font-semibold tracking-wide leading-tight mb-6"
        >
          Wear the Story. <br />
          <span className="italic font-light text-gold">Live the Art.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="text-xs md:text-sm text-[#D9D1C7]/80 max-w-xl leading-relaxed tracking-wider mb-10 font-body"
        >
          Discover curated handloom collections woven with royal zari brocades, sheer Chanderi silks, and bespoke tailoring designed to celebrate heritage.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-gold text-dark px-8 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-white hover:text-dark transition-all duration-300 font-body shadow-lg text-center"
          >
            Explore Collections
          </Link>
          <Link
            href="/story"
            className="w-full sm:w-auto bg-transparent border border-white text-white px-8 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-white hover:text-dark transition-all duration-300 font-body text-center"
          >
            Our Story
          </Link>
        </motion.div>
      </div>

      {/* Ambient Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-70">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#D9D1C7]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1.5 h-1.5 bg-gold rounded-full"
        />
      </div>
    </section>
  )
}
