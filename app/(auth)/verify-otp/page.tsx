"use client"

import React, { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { OTPInput } from "@/components/auth/OTPInput"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/hooks/useAuth"
import { Toast } from "@/components/ui/Toast"

function VerifyOTPContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { verifyOtp, sendOtp } = useAuth()
  const mobile = searchParams.get("mobile") || ""
  const purpose = searchParams.get("purpose") || "REGISTER"
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Toast.error("Please enter the complete 6-digit OTP")
      return
    }
    setLoading(true)
    try {
      const res = await verifyOtp(mobile, otp, purpose)
      if (res.success) {
        Toast.success("Mobile number verified successfully!")
        setTimeout(() => {
          router.push(res.user?.role === "ADMIN" ? "/admin" : "/")
        }, 1000)
      }
    } catch (err: any) {
      Toast.error(err.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await sendOtp(mobile, purpose)
      Toast.success("New OTP sent to your mobile")
    } catch (err: any) {
      Toast.error(err.message || "Failed to resend OTP")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="bg-background min-h-screen font-body text-text-primary flex items-center justify-center pt-24 pb-16 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">
            Verification
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-wide text-dark">
            Enter OTP Code
          </h1>
          <p className="text-xs text-text-secondary tracking-wider">
            A 6-digit verification code has been sent to{" "}
            <span className="text-dark font-semibold">{"your mobile or Email id"}</span>
          </p>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-2" />
        </div>
        <div className="bg-white border border-border p-8 space-y-6">
          <OTPInput onComplete={(code) => setOtp(code)} />
          <Button onClick={handleVerify} loading={loading} className="w-full h-12">
            Verify & Continue
          </Button>
          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[10px] uppercase tracking-wider text-text-secondary hover:text-gold transition-colors font-bold"
            >
              {resending ? "Sending..." : "Resend OTP Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-body text-text-secondary text-sm">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  )
}
