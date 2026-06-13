"use client"

export default function ProductLoading() {
  return (
    <div className="bg-background min-h-screen pt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        {/* Two column skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 animate-pulse">
          {/* Left – image skeleton */}
          <div className="space-y-4">
            <div className="aspect-[3/4] w-full bg-border/30 rounded-sm" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 aspect-[3/4] bg-border/20 rounded-sm" />
              ))}
            </div>
          </div>
          {/* Right – info skeleton */}
          <div className="space-y-6 py-4">
            <div className="h-3 w-28 bg-border/30 rounded" />
            <div className="h-8 w-3/4 bg-border/30 rounded" />
            <div className="h-6 w-24 bg-border/30 rounded" />
            <div className="h-px w-full bg-border/20" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-border/20 rounded" />
              <div className="h-10 bg-border/20 rounded" />
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-12 h-12 bg-border/20 rounded" />
              ))}
            </div>
            <div className="h-12 w-full bg-border/30 rounded" />
            <div className="h-12 w-full bg-border/20 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-border/15 rounded" />
              <div className="h-3 w-5/6 bg-border/15 rounded" />
              <div className="h-3 w-4/6 bg-border/15 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Centered loading indicator */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
        <div className="flex flex-col items-center gap-5">
          {/* Spinning gold ring */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
          </div>
          {/* Brand logo pulse */}
          <div className="text-center">
            <span className="font-display text-2xl font-bold tracking-widest text-gold block">AARU</span>
            <span className="text-[9px] tracking-[0.4em] uppercase text-text-secondary mt-1 block">Loading product...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
