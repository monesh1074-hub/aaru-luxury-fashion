'use client'

import React from 'react'
import { motion } from 'framer-motion'

const timeline = [
  {
    year: '2018',
    title: 'The Beginning',
    body: 'AARU was born from a single conviction — that the dying art of Indian handloom deserved a global stage. Moni began with a single Banarasi weaver in Varanasi, translating 400-year-old patterns into wearable poetry.',
  },
  {
    year: '2020',
    title: 'The Vision',
    body: 'The brand expanded its circle — Chanderi silk from Madhya Pradesh, Kanjivaram from Tamil Nadu, Lucknowi chikankari. Each weave carries the fingerprint of its soil. AARU became the bridge between those hands and the world.',
  },
  {
    year: '2022',
    title: 'The Collections',
    body: 'The first editorial collection launched to critical acclaim. "The Sixth Element" series redefined what Indian luxury fashion could look like — not pastiche, but living dialogue between centuries.',
  },
  {
    year: '2024',
    title: 'The Future',
    body: 'AARU now ships to 30+ countries. Bespoke atelier services let every client wear a garment made entirely for them. The journey continues — one thread, one story at a time.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

export default function StoryPage() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 max-w-2xl mx-auto"
        >
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">
            Our Journey
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide leading-tight text-dark">
            The Journey of AARU
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-sm text-text-secondary leading-relaxed tracking-wide">
            Every house of fashion begins with a moment of clarity — a belief that beauty
            matters, that craft endures, that stories told through fabric outlive their tellers.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative"
        >
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gold/30 hidden md:block" />

          <div className="space-y-16">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex gap-8 md:gap-12 items-start"
              >
                {/* Year bubble */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-dark border-2 border-gold flex items-center justify-center z-10 relative">
                    <span className="text-gold font-accent text-xs font-bold">{item.year}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2 border-b border-border pb-12 last:border-0">
                  <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold block mb-2">
                    {item.year}
                  </span>
                  <h3 className="font-display text-2xl text-dark mb-4">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed tracking-wide">
                    {item.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center border-t border-border pt-16"
        >
          <p className="font-accent text-2xl md:text-3xl text-dark italic font-light leading-relaxed">
            &ldquo;We don&apos;t make clothes. We make heirlooms.&rdquo;
          </p>
          <cite className="text-xs uppercase tracking-[0.3em] text-gold font-semibold mt-4 block not-italic">
            — Moni, Founder of AARU
          </cite>
        </motion.blockquote>
      </div>
    </div>
  )
}
