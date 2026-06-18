import { ProductsLoadingSection } from "@/components/product/ProductsLoadingSection"

export default function Loading() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-10 space-y-3 animate-pulse">
          <div className="h-3 w-24 bg-border/30 rounded" />
          <div className="h-8 w-64 bg-border/30 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3 hidden lg:block space-y-4 animate-pulse">
            <div className="h-4 w-20 bg-border/30 rounded" />
            <div className="h-3 w-full bg-border/20 rounded" />
            <div className="h-3 w-4/5 bg-border/20 rounded" />
            <div className="h-3 w-3/5 bg-border/20 rounded" />
          </div>
          <div className="lg:col-span-9">
            <ProductsLoadingSection count={6} message="Loading collections..." />
          </div>
        </div>
      </div>
    </div>
  )
}
