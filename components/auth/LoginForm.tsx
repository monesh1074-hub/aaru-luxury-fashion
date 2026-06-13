"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Toast } from "../ui/Toast"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Email or mobile number is required")
    .refine((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
      const isMobile = /^[6-9]\d{9}$/.test(val)
      return isEmail || isMobile
    }, "Must be a valid email or 10-digit mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const { login } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login({
        emailOrMobile: data.identifier,
        password: data.password,
      })

      if (res.success) {
        Toast.success("Logged in successfully!")
        if (!res.user.isVerified) {
          router.push(`/verify-otp?mobile=${res.user.mobile}&purpose=REGISTER`)
        } else {
          router.push(res.user.role === "ADMIN" ? "/admin" : "/")
        }
      }
    } catch (err: any) {
      Toast.error(err.message || "Login failed")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-body text-text-primary">
      <Input
        label="Email or Mobile Number"
        placeholder="Enter email or 10-digit mobile"
        {...register("identifier")}
        error={errors.identifier?.message}
      />

      <div className="space-y-1">
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-[10px] uppercase tracking-wider text-text-secondary hover:text-gold transition-colors font-bold"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full h-12 mt-2">
        Sign In
      </Button>

      <p className="text-center text-xs text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-gold uppercase tracking-wider font-bold hover:underline"
        >
          Create One
        </Link>
      </p>
    </form>
  )
}
