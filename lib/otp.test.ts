import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { isOtpBypassAllowed } from "./otp"

describe("isOtpBypassAllowed", () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("is disabled in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("ALLOW_OTP_BYPASS", "true")
    expect(isOtpBypassAllowed("123456")).toBe(false)
  })

  it("requires ALLOW_OTP_BYPASS in non-production", () => {
    vi.stubEnv("NODE_ENV", "development")
    vi.stubEnv("ALLOW_OTP_BYPASS", undefined)
    expect(isOtpBypassAllowed("123456")).toBe(false)
  })

  it("allows bypass when explicitly enabled in dev", () => {
    vi.stubEnv("NODE_ENV", "development")
    vi.stubEnv("ALLOW_OTP_BYPASS", "true")
    expect(isOtpBypassAllowed("123456")).toBe(true)
    expect(isOtpBypassAllowed("654321")).toBe(false)
  })
})
