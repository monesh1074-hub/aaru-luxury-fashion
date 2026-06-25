import React from "react"
import { Instagram } from "lucide-react"
import { INSTAGRAM_URL, INSTAGRAM_POSTS } from "@/lib/constants"

export const InstagramFeed = () => {
  return (
    <section className="py-20 md:py-28 bg-background border-t border-border font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">
            @houseofaaru6
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-text-primary tracking-wide">
            Follow Our Journey
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          {INSTAGRAM_POSTS.map((url, idx) => (
            <a
              key={idx}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-dark"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${url}')` }}
              />
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold border-b border-dark pb-1 hover:border-gold hover:text-gold transition-all duration-300"
          >
            <Instagram size={14} />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
