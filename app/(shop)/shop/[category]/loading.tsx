import { ProductsLoadingSection } from "@/components/product/ProductsLoadingSection"

export default function CategoryLoading() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-10 space-y-3 animate-pulse">
          <div className="h-3 w-20 bg-border/30 rounded" />
          <div className="h-8 w-48 bg-border/30 rounded" />
        </div>
        <ProductsLoadingSection count={6} message="Loading category..." />
      </div>
    </div>
  )
}
