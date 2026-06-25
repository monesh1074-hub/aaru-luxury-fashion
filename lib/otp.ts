/** OTP bypass is disabled in production unless explicitly enabled for local dev. */
export function isOtpBypassAllowed(otp: string): boolean {
  if (process.env.NODE_ENV === "production") return false
  if (process.env.ALLOW_OTP_BYPASS !== "true") return false
  return otp.trim() === "123456"
}
