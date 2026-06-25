import React from "react"
import Link from "next/link"

export const BrandStorySection = () => {
  return (
    <section className="py-20 md:py-32 bg-background font-body">
      <div className="max-w-3xl mx-auto px-4 md:px-8 text-center space-y-8">
        <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">
          The House of AARU
        </span>
        <h2 className="font-display text-3xl md:text-5xl text-text-primary font-light tracking-wide leading-tight">
          AARU – Women&apos;s Sixth Element
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto" />
        <p className="text-sm md:text-base text-text-secondary leading-relaxed tracking-wide max-w-2xl mx-auto">
          Born from a conviction that Indian handloom deserves a global stage, AARU weaves together
          royal brocades, sheer Chanderi silks, and bespoke couture into garments that carry the
          fingerprints of master artisans. Every piece is a dialogue between centuries of craft
          and the modern woman who wears her heritage with quiet confidence.
        </p>
        <Link
          href="/story"
          className="inline-block text-xs uppercase tracking-[0.3em] font-semibold border-b-2 border-gold pb-1 text-dark hover:text-gold transition-colors duration-300"
        >
          See More
        </Link>
      </div>
    </section>
  )
}
