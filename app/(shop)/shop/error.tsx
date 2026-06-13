'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-4">
      <div className="text-center space-y-3">
        <span className="text-gold text-xs uppercase tracking-widest font-semibold block">Something Went Wrong</span>
        <h2 className="font-display text-2xl text-dark">An error occurred</h2>
        <p className="text-sm text-text-secondary max-w-sm">{error.message || 'Please try again or contact support if the problem persists.'}</p>
      </div>
      <button
        onClick={reset}
        className="bg-dark text-background px-8 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-gold hover:text-dark transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  )
}
