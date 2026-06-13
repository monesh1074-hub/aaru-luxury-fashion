'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#FAF8F5] px-4">
      <div className="text-center space-y-3">
        <span className="text-error text-xs uppercase tracking-widest font-semibold block">Admin Error</span>
        <h2 className="font-display text-2xl text-dark">Something went wrong</h2>
        <p className="text-sm text-text-secondary max-w-sm">{error.message || 'An unexpected error occurred in the admin panel.'}</p>
      </div>
      <button
        onClick={reset}
        className="bg-gold text-dark px-8 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-dark hover:text-background transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  )
}
