import React from "react"
import Link from "next/link"

export const FeaturedCollections = () => {
  const collections = [
    {
      title: "Heritage Sarees",
      tagline: "Timeless handloom brocades",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      href: "/shop/sarees",
    },
    {
      title: "Bespoke Couture",
      tagline: "Customized heritage tailoring",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
      href: "/custom",
    },
    {
      title: "Designer Coordinates",
      tagline: "Vibrant ethnic ensembles",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
      href: "/shop/designer-sarees",
    },
  ]

  return (
    <section className="py-24 bg-background font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2 block">
            The Curated Folders
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-text-primary tracking-wide">
            Featured Collections
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col, idx) => (
            <Link
              key={idx}
              href={col.href}
              className="group relative block h-[480px] overflow-hidden bg-dark"
            >
              {/* Card Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80"
                style={{ backgroundImage: `url('${col.image}')` }}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

              {/* Text Layout */}
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col text-left justify-end">
                <span className="text-gold text-[10px] uppercase tracking-[0.25em] font-semibold mb-2 block">
                  {col.tagline}
                </span>
                <h3 className="font-display text-xl text-background font-medium tracking-wide mb-4">
                  {col.title}
                </h3>
                <span className="text-xs uppercase tracking-widest text-background font-semibold flex items-center gap-2 mt-2 group-hover:text-gold transition-colors duration-300">
                  Explore Now <span className="text-gold">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
