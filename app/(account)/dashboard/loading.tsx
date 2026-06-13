export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-text-secondary font-body">Loading your account...</p>
      </div>
    </div>
  )
}
