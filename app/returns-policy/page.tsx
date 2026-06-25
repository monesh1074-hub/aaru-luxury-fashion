import React from "react"
import { Breadcrumb } from "@/components/ui/Breadcrumb"

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-8">
        <Breadcrumb items={[{ label: "Returns Policy" }]} />
        <h1 className="font-display text-3xl md:text-4xl text-dark tracking-wide">Returns Policy</h1>
        <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-lg text-dark">Return Eligibility</h2>
            <p>Ready To Ship items may be returned within 7 days of delivery, provided they are unworn, unwashed, and in original packaging with all tags attached. Bespoke and customized garments are non-returnable.</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-lg text-dark">Return Process</h2>
            <p>Contact our customer care team via WhatsApp or email to initiate a return. Once approved, we will arrange a pickup from your registered address. Refunds are processed within 7–10 business days after quality inspection.</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-lg text-dark">Exchanges</h2>
            <p>Size exchanges are available for eligible ready-to-wear items subject to stock availability. Contact us within 7 days of delivery to request an exchange.</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-lg text-dark">Damaged Items</h2>
            <p>If your order arrives damaged, please contact us within 48 hours with photographs. We will arrange a replacement or full refund at no additional cost.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
