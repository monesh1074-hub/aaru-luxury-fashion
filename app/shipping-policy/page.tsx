import React from "react"
import { Breadcrumb } from "@/components/ui/Breadcrumb"

export default function ShippingPolicyPage() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-8">
        <Breadcrumb items={[{ label: "Shipping Policy" }]} />
        <h1 className="font-display text-3xl md:text-4xl text-dark tracking-wide">Shipping Policy</h1>
        <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-lg text-dark">Domestic Shipping</h2>
            <p>All orders within India are shipped via insured express courier. Standard delivery takes 5–7 business days from dispatch. Ready To Ship items are dispatched within 2–3 business days.</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-lg text-dark">International Shipping</h2>
            <p>AARU ships to 30+ countries worldwide. International delivery typically takes 10–15 business days. Customs duties and taxes may apply based on your country&apos;s regulations.</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-lg text-dark">Shipping Charges</h2>
            <p>Complimentary express shipping on all domestic orders above ₹25,000. Standard shipping rates apply for orders below this threshold and all international orders.</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-lg text-dark">Order Tracking</h2>
            <p>Once your order is dispatched, you will receive a tracking number via email and SMS. Track your shipment through your AARU dashboard or the courier partner&apos;s website.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
