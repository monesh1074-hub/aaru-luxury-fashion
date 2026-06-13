import React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "gold" | "dark" | "success" | "error" | "outline" | "blush"
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "gold", className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase rounded-none",
        {
          "bg-gold/15 text-gold border border-gold/30": variant === "gold",
          "bg-dark text-background": variant === "dark",
          "bg-success/15 text-success border border-success/30": variant === "success",
          "bg-error/15 text-error border border-error/30": variant === "error",
          "bg-blush/15 text-text-primary border border-blush/30": variant === "blush",
          "border border-border text-text-secondary bg-transparent": variant === "outline",
        },
        className
      )}
    >
      {children}
    </span>
  )
}
