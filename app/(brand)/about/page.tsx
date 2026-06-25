"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-24">
        {/* 1. Header Hero Quote */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">
            Who We Are
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide leading-tight text-dark">
            &ldquo;A dialogue between ancient hands and modern silhouettes.&rdquo;
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-6" />
        </div>

        {/* 2. Philosophy Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] bg-dark overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
              alt="Artisan weaving silk"
              fill
              className="object-cover opacity-85"
            />
          </div>
          <div className="space-y-6">
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold block">
              The Atelier
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-dark tracking-wide leading-snug">
              Celebrating the poetry of patience.
            </h2>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide">
              At AARU, we reject the rush of modern manufacture. Every thread is selected for weight and sheen, every print is hand-blocked using traditional wood blocks, and every embroidery needlework is done over weeks by master karigars.
            </p>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide">
              Under the creative direction of Moni, we preserve heritage weaving clusters across Banaras, Chanderi, and Kanchipuram, translating ancient weaves into contemporary luxury.
            </p>
          </div>
        </div>

        {/* 3. Core Values Grid */}
        <div className="border-t border-border pt-24">
          <div className="text-center mb-16">
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">
              Our Pillars
            </span>
            <h3 className="font-display text-3xl text-dark tracking-wide">The House Code</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4 text-center p-6 border border-border/40 bg-white">
              <span className="font-accent text-3xl text-gold font-bold italic">01</span>
              <h4 className="font-display text-base font-semibold uppercase tracking-widest text-dark">
                Preservation
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed tracking-wide">
                Directly supporting and funding master weavers to ensure rare handloom techniques live on.
              </p>
            </div>

            <div className="space-y-4 text-center p-6 border border-border/40 bg-white">
              <span className="font-accent text-3xl text-gold font-bold italic">02</span>
              <h4 className="font-display text-base font-semibold uppercase tracking-widest text-dark">
                Atelier Fit
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed tracking-wide">
                Individually tailored custom sizes ensure every garment sits with bespoke elegance.
              </p>
            </div>

            <div className="space-y-4 text-center p-6 border border-border/40 bg-white">
              <span className="font-accent text-3xl text-gold font-bold italic">03</span>
              <h4 className="font-display text-base font-semibold uppercase tracking-widest text-dark">
                Luxury Standard
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed tracking-wide">
                Ethically sourced premium silks, pure wools, and organic linens made to endure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
