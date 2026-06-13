"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Toast } from "@/components/ui/Toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [mobile, setMobile] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      Toast.error("Please enter a valid 10-digit mobile number")
      return
    }
    setLoading(true)
    try {
      await axios.post("/api/auth/send-otp", { mobile, purpose: "FORGOT_PASSWORD" })
      Toast.success("OTP sent to your mobile number")
      router.push(`/verify-otp?mobile=${mobile}&purpose=FORGOT_PASSWORD`)
    } catch (err: any) {
      Toast.error(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen font-body text-text-primary flex items-center justify-center pt-24 pb-16 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">
            Account Recovery
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-wide text-dark">
            Forgot Password
          </h1>
          <p className="text-xs text-text-secondary tracking-wider max-w-xs mx-auto">
            Enter your registered mobile number. We will send a verification code to reset your password.
          </p>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-2" />
        </div>
        <div className="bg-white border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Registered Mobile Number"
              placeholder="9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <Button type="submit" loading={loading} className="w-full h-12">
              Send Reset OTP
            </Button>
            <p className="text-center text-xs text-text-secondary">
              Remember your password?{" "}
              <Link href="/login" className="text-gold uppercase tracking-wider font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
