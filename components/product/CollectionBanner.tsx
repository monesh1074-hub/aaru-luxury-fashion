import React from "react"

interface CollectionBannerProps {
  title: string
  description: string
  image: string
}

export const CollectionBanner: React.FC<CollectionBannerProps> = ({ title, description, image }) => {
  return (
    <div className="relative w-full h-[200px] sm:h-[260px] md:h-[320px] overflow-hidden mb-10 md:mb-14">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/85 via-dark/60 to-dark/30" />
      <div className="relative h-full flex flex-col justify-center px-6 md:px-10 max-w-2xl">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-background font-light tracking-wide mb-3">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-[#D9D1C7]/85 leading-relaxed tracking-wide max-w-lg">
          {description}
        </p>
      </div>
    </div>
  )
}
