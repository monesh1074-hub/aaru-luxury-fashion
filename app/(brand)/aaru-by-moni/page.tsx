'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AaruByMoniPage() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-24">

        {/* Hero headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center space-y-5 max-w-2xl mx-auto"
        >
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">
            The Maker
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-dark tracking-wide leading-tight">
            AARU by Moni
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </motion.div>

        {/* Editorial spread */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[3/4] bg-dark overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
              alt="AARU Founder Moni — Design Atelier"
              fill
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 text-background/80 text-[10px] uppercase tracking-widest font-semibold">
              Design Atelier — Varanasi
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold block mb-3">
                Behind the Brand
              </span>
              <h2 className="font-display text-3xl text-dark tracking-wide leading-snug">
                A designer who became a curator of endangered beauty.
              </h2>
            </div>

            <div className="space-y-5 text-sm text-text-secondary leading-relaxed tracking-wide">
              <p>
                Moni grew up surrounded by silk — her family lived three streets from a Varanasi
                weaving cluster. As a child, she watched master weavers create impossible
                geometry with nothing but thread and time. That childhood wonder never left her.
              </p>
              <p>
                After studying textile design in Mumbai and apprenticing under European couturiers
                in Paris, she returned to India with a singular mission: to document, preserve,
                and translate India&rsquo;s greatest handloom traditions into modern luxury garments
                that could stand beside anything on the global stage.
              </p>
              <p>
                AARU — meaning &ldquo;six&rdquo; in several Indian classical languages — is her life&rsquo;s work.
                Every collection is a chapter. Every garment, a sentence in an ongoing love letter
                to Indian craft.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Pull quote */}
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative text-center py-16 px-8 border-t border-b border-gold/30"
        >
          <span className="absolute top-6 left-1/2 -translate-x-1/2 text-gold/20 font-accent text-[120px] leading-none select-none">
            &ldquo;
          </span>
          <p className="font-accent text-2xl md:text-4xl italic text-dark leading-relaxed relative z-10">
            Every thread tells a story. My job is to make sure that story is never forgotten.
          </p>
          <cite className="block mt-6 text-xs uppercase tracking-[0.3em] text-gold font-semibold not-italic">
            Moni — Creative Director, AARU
          </cite>
        </motion.blockquote>

        {/* Design Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              num: '01',
              title: 'Slow Fashion',
              text: 'Each AARU piece takes weeks to complete. We believe in the luxury of time — the time given to the weaver, the dyer, the embroideress.',
            },
            {
              num: '02',
              title: 'Living Heritage',
              text: "India has over 3,000 handloom traditions. Moni's mission is to bring the most endangered of them into the modern wardrobe before they disappear.",
            },
            {
              num: '03',
              title: 'Bespoke Spirit',
              text: 'The bespoke programme allows every client to co-design their garment — fabric, silhouette, embroidery motif — until it feels entirely their own.',
            },
          ].map((pillar) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4 p-8 bg-white border border-border/60"
            >
              <span className="font-accent text-4xl text-gold font-bold italic block">
                {pillar.num}
              </span>
              <h4 className="font-display text-lg font-semibold uppercase tracking-widest text-dark">
                {pillar.title}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed tracking-wide">
                {pillar.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
