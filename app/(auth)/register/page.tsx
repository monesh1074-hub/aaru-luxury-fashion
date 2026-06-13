"use client"

import React from "react"
import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary flex items-center justify-center pt-24 pb-16 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">
            Join The House
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-wide text-dark">
            Create Account
          </h1>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-2" />
        </div>
        <div className="bg-white border border-border p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
