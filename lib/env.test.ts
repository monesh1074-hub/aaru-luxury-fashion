import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { getJwtSecret } from "./env"

describe("getJwtSecret", () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("returns configured secret", () => {
    vi.stubEnv("JWT_SECRET", "test-secret")
    expect(getJwtSecret()).toBe("test-secret")
  })

  it("throws in production when missing", () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("JWT_SECRET", undefined)
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/)
  })

  it("uses dev fallback outside production", () => {
    vi.stubEnv("NODE_ENV", "development")
    vi.stubEnv("JWT_SECRET", undefined)
    expect(getJwtSecret()).toContain("dev-only")
  })
})
