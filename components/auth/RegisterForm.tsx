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

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const { register: authRegister } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await authRegister(data)
      if (res.success) {
        Toast.success("Registration initiated. OTP sent to mobile.")
        router.push(`/verify-otp?mobile=${data.mobile}&purpose=REGISTER`)
      }
    } catch (err: any) {
      Toast.error(err.message || "Registration failed")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-body text-text-primary">
      <Input
        label="Full Name"
        placeholder="Enter your name"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        label="Email Address"
        placeholder="name@example.com"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Mobile Number (10 digits)"
        placeholder="9876543210"
        {...register("mobile")}
        error={errors.mobile?.message}
      />
      <Input
        type="password"
        label="Password"
        placeholder="••••••••"
        {...register("password")}
        error={errors.password?.message}
      />

      <Button type="submit" loading={isSubmitting} className="w-full h-12 mt-2">
        Create Account
      </Button>

      <p className="text-center text-xs text-text-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-gold uppercase tracking-wider font-bold hover:underline"
        >
          Sign In
        </Link>
      </p>
    </form>
  )
}
