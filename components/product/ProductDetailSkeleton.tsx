export function ProductDetailSkeleton() {
  return (
    <div className="bg-background min-h-screen pt-20 sm:pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24 animate-pulse">
        <div className="flex gap-2 mb-8">
          <div className="h-3 w-12 bg-border/25 rounded" />
          <div className="h-3 w-3 bg-border/20 rounded" />
          <div className="h-3 w-20 bg-border/25 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
          <div className="space-y-4">
            <div className="aspect-[3/4] w-full bg-border/20 rounded-sm" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 sm:w-20 aspect-[3/4] bg-border/15 rounded-sm" />
              ))}
            </div>
          </div>

          <div className="space-y-6 py-2 lg:py-4">
            <div className="h-3 w-28 bg-border/25 rounded" />
            <div className="h-9 w-4/5 max-w-md bg-border/25 rounded" />
            <div className="h-7 w-32 bg-border/20 rounded" />
            <div className="h-px w-full bg-border/15" />
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div className="h-11 bg-border/15 rounded" />
              <div className="h-11 bg-border/15 rounded" />
            </div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-11 h-11 bg-border/15 rounded-full" />
              ))}
            </div>
            <div className="h-12 w-full max-w-md bg-border/25 rounded" />
            <div className="h-12 w-full max-w-md bg-border/15 rounded" />
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full bg-border/15 rounded" />
              <div className="h-3 w-11/12 bg-border/15 rounded" />
              <div className="h-3 w-4/5 bg-border/15 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
