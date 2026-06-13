import React from "react"
import { Breadcrumb } from "@/components/ui/Breadcrumb"

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-10">
        <Breadcrumb items={[{ label: "Terms of Use" }]} />

        <div className="space-y-4">
          <h1 className="font-display text-3xl font-semibold text-dark">Terms of Use</h1>
          <p className="text-xs text-text-secondary uppercase tracking-widest">
            Last Updated: June 12, 2026
          </p>
          <div className="w-12 h-0.5 bg-gold mt-2" />
        </div>

        <div className="space-y-6 text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide">
          <p>
            Welcome to AARU Luxury. These terms and conditions outline the rules and regulations for the use of AARU Luxury Fashion Website.
          </p>

          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark mt-6">
            1. Bespoke Orders and Tailoring
          </h3>
          <p>
            By submitting body measurements on our customized clothing platform, you represent that the measurements provided are accurate. Sizing adjustments requested after completion may be subject to additional fabric costs if the sizing variance exceeds standard tolerances.
          </p>

          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark mt-6">
            2. Payment and Transactions
          </h3>
          <p>
            We process transaction charges in INR (Indian Rupees) using Secure Razorpay APIs. Orders are confirmed only upon receipt of payment authorization confirmation from the gateway merchant.
          </p>

          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark mt-6">
            3. Limitation of Liability
          </h3>
          <p>
            AARU Luxury, including its designers and weavers, shall not be held liable for delayed shipments caused by logistics delays, transport strikes, or weather conditions affecting fabric production clusters.
          </p>
        </div>
      </div>
    </div>
  )
}
