export default function AdminDashboardLoading() {
  return (
    <div className="space-y-10 font-body animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-20 bg-gold/30 rounded" />
        <div className="h-8 w-56 bg-border/40 rounded" />
        <div className="w-12 h-0.5 bg-gold/40 mt-3" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-border bg-white p-6 space-y-3">
            <div className="h-3 w-20 bg-border/40 rounded" />
            <div className="h-7 w-28 bg-border/30 rounded" />
            <div className="h-2 w-16 bg-border/20 rounded" />
          </div>
        ))}
      </div>

      {/* Orders + Stock skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent orders */}
        <div className="lg:col-span-8 space-y-4">
          <div className="h-4 w-32 bg-border/40 rounded" />
          <div className="border border-border bg-white divide-y divide-border">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-border/40 rounded" />
                  <div className="h-2 w-36 bg-border/20 rounded" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="h-4 w-16 bg-border/30 rounded" />
                  <div className="h-5 w-20 bg-gold/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="lg:col-span-4 space-y-4">
          <div className="h-4 w-40 bg-border/40 rounded" />
          <div className="border border-border bg-white divide-y divide-border">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-28 bg-border/40 rounded" />
                  <div className="h-5 w-12 bg-error/20 rounded" />
                </div>
                <div className="h-2 w-full bg-border/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gold spinner overlay */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-white border border-border shadow-lg px-4 py-3 rounded-full">
        <div className="relative w-5 h-5">
          <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
          Loading dashboard…
        </span>
      </div>
    </div>
  )
}
