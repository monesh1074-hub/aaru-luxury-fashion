/** JWT secret — required in production; dev-only fallback otherwise. */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET environment variable is required in production")
  }
  return "dev-only-jwt-secret-change-me"
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production"
}
