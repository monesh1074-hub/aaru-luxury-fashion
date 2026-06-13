import React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={loading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center font-body tracking-wider transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none uppercase text-xs font-semibold select-none",
          {
            "bg-dark text-background hover:bg-gold hover:text-dark": variant === "primary",
            "bg-gold text-dark hover:bg-dark hover:text-background": variant === "secondary",
            "border border-dark text-dark bg-transparent hover:bg-dark hover:text-background":
              variant === "outline",
            "text-dark bg-transparent hover:bg-border/30": variant === "ghost",
          },
          {
            "px-4 py-2 text-[10px]": size === "sm",
            "px-6 py-3.5": size === "md",
            "px-8 py-4 text-sm": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
