import { ProductsLoadingSection } from "@/components/product/ProductsLoadingSection"

export default function SearchLoading() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-4 animate-pulse">
          <div className="h-3 w-24 bg-border/30 rounded mx-auto" />
          <div className="h-8 w-56 bg-border/30 rounded mx-auto" />
        </div>
        <div className="max-w-xl mx-auto h-12 bg-border/20 animate-pulse" />
        <ProductsLoadingSection count={6} message="Searching collections..." />
      </div>
    </div>
  )
}
