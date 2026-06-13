// Simple in-memory rate limiter
// In production, use Redis for distributed rate limiting
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 3600000 // 1 hour default
): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  // Create new record or reset if window expired
  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  // Increment and check limit
  if (record.count >= maxAttempts) {
    return false
  }

  record.count++
  return true
}

export function getRateLimitTimeRemaining(
  key: string,
  windowMs: number = 3600000
): number {
  const record = rateLimitStore.get(key)
  if (!record) return 0
  
  const remaining = record.resetAt - Date.now()
  return remaining > 0 ? remaining : 0
}

export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key)
}
