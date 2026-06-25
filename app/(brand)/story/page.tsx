'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const timeline = [
  {
    year: '2018',
    title: 'The Beginning',
    body: 'AARU was born from a single conviction — that the dying art of Indian handloom deserved a global stage. Moni began with a single Banarasi weaver in Varanasi, translating 400-year-old patterns into wearable poetry.',
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=80',
  },
  {
    year: '2020',
    title: 'The Vision',
    body: 'The brand expanded its circle — Chanderi silk from Madhya Pradesh, Kanjivaram from Tamil Nadu, Lucknowi chikankari. Each weave carries the fingerprint of its soil. AARU became the bridge between those hands and the world.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  },
  {
    year: '2022',
    title: 'The Collections',
    body: 'The first editorial collection launched to critical acclaim. "The Sixth Element" series redefined what Indian luxury fashion could look like — not pastiche, but living dialogue between centuries.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
  },
  {
    year: '2024',
    title: 'The Future',
    body: 'AARU now ships to 30+ countries. Bespoke atelier services let every client wear a garment made entirely for them. The journey continues — one thread, one story at a time.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
  },
]

const pillars = [
  {
    title: 'Founder Story',
    subtitle: 'Moni & The House of AARU',
    body: 'Moni founded AARU with a vision to preserve India\'s textile heritage while creating garments that speak to the modern woman. Her atelier in Varanasi became the heart of a movement — connecting master weavers with discerning clients worldwide.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Craft Heritage',
    subtitle: 'Centuries of Technique',
    body: 'From Banarasi brocades to Chanderi sheers, every AARU piece carries techniques perfected over generations. We work directly with weaving clusters, ensuring authentic handloom marks and fair compensation for artisans.',
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Artisan Network',
    subtitle: '200+ Master Craftspeople',
    body: 'Our network spans Varanasi, Kanchipuram, Lucknow, and Bhopal — each region contributing its unique textile language. We invest in artisan training, sustainable practices, and preserving dying crafts for future generations.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Brand Vision',
    subtitle: 'Homegrown Luxury',
    body: 'AARU envisions a world where Indian luxury fashion stands alongside global couture houses — not as imitation, but as an authentic expression of heritage, ethics, and slow fashion values.',
    image: 'https://images.unsplash.com/photo-1617629633317-7886a4b4d2f0?auto=format&fit=crop&w=800&q=80',
  },
]

export default function StoryPage() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-24 md:space-y-32">
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

        {pillars.map((pillar, idx) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${idx % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
          >
            <div className={`space-y-5 ${idx % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
              <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold block">
                {pillar.subtitle}
              </span>
              <h2 className="font-display text-2xl md:text-3xl text-dark tracking-wide">{pillar.title}</h2>
              <p className="text-sm text-text-secondary leading-relaxed tracking-wide">{pillar.body}</p>
            </div>
            <div className={`relative h-[280px] md:h-[360px] overflow-hidden bg-dark ${idx % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${pillar.image}')` }}
              />
            </div>
          </motion.div>
        ))}

        <div className="space-y-16">
          <h2 className="font-display text-2xl md:text-3xl text-center text-dark tracking-wide">Our Timeline</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gold/30 hidden md:block" />
            <div className="space-y-16">
              {timeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="flex gap-8 md:gap-12 items-start"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-dark border-2 border-gold flex items-center justify-center z-10 relative">
                      <span className="text-gold font-accent text-xs font-bold">{item.year.slice(2)}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-2 border-b border-border pb-12 last:border-0">
                    <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold block mb-2">
                      {item.year}
                    </span>
                    <h3 className="font-display text-2xl text-dark mb-4">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed tracking-wide mb-6">{item.body}</p>
                    <div className="relative h-40 overflow-hidden bg-dark">
                      <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url('${item.image}')` }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative h-[300px] md:h-[400px] overflow-hidden bg-dark"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=1200&q=80')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent flex items-end p-8 md:p-12">
            <p className="font-accent text-xl md:text-2xl text-background italic font-light leading-relaxed max-w-xl">
              Behind every AARU garment lies hours of handwork — the quiet dedication of artisans who weave not just fabric, but legacy.
            </p>
          </div>
        </motion.div>

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
          <Link
            href="/aaru-by-moni"
            className="inline-block mt-8 text-xs uppercase tracking-widest font-semibold border-b border-gold pb-1 hover:text-gold transition-colors"
          >
            Meet the Founder
          </Link>
        </motion.blockquote>
      </div>
    </div>
  )
}
