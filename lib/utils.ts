import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(1000 + Math.random() * 9000)
  return `AARU-${timestamp}-${random}`
}
