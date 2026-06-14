"use client"

import React, { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Toast } from "@/components/ui/Toast"
import Link from "next/link"
import axios from "axios"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mobile = searchParams.get("mobile") || ""
  const otp = searchParams.get("otp") || ""

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      Toast.error("Password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      Toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await axios.post("/api/auth/forgot-password", {
        mobile,
        otpCode: otp,
        newPassword,
      })
      Toast.success("Password changed successfully! Please login.")
      setTimeout(() => router.push("/login"), 1500)
    } catch (err: any) {
      Toast.error(err.response?.data?.message || "Failed to reset password. Please try again.")
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
            Set New Password
          </h1>
          <p className="text-xs text-text-secondary tracking-wider max-w-xs mx-auto">
            Enter your new password below to complete the reset.
          </p>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-2" />
        </div>
        <div className="bg-white border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" loading={loading} className="w-full h-12">
              Change Password
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-body text-text-secondary text-sm">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
