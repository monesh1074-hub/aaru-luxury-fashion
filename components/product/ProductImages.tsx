"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProductImage {
  id: string
  imageUrl: string
  altText?: string | null
}

interface ProductImagesProps {
  images: ProductImage[]
}

export const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: "none" })

  const list = images.length > 0 ? images : [
    {
      id: "placeholder",
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
      altText: "Placeholder Image",
    },
  ]

  // Optimise Cloudinary URLs: inject auto quality + webp format transformation
  const optimize = (url: string) => {
    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/')
    }
    return url
  }

  const activeImage = optimize(list[activeIndex]?.imageUrl)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${activeImage})`,
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" })
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. Primary Zoom Box */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-[3/4] w-full bg-border/20 border border-border overflow-hidden cursor-zoom-in"
      >
        <Image
          src={activeImage}
          alt={list[activeIndex]?.altText || "Product detail view"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />

        {/* Floating Zoom Panel */}
        <div
          style={zoomStyle}
          className="absolute inset-0 z-10 pointer-events-none bg-no-repeat bg-cover border border-gold scale-105"
        />
      </div>

      {/* 2. Horizontal Thumbnail Strip */}
      {list.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {list.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative w-20 aspect-[3/4] bg-border/20 border transition-all duration-300",
                {
                  "border-gold scale-95 shadow-sm": activeIndex === idx,
                  "border-border hover:border-gold/50": activeIndex !== idx,
                }
              )}
            >
              <Image
                src={optimize(img.imageUrl)}
                alt={img.altText || `Thumbnail ${idx}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
