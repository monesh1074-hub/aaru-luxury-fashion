import React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="w-full font-body">
        {label && (
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full bg-white border border-border px-4 py-3 text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-gold transition-colors duration-200",
            {
              "border-error focus:border-error": error,
            },
            className
          )}
          {...props}
        />
        {error && <span className="block mt-1 text-xs text-error font-medium">{error}</span>}
      </div>
    )
  }
)

Input.displayName = "Input"
