"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FAQPage() {
  const faqs = [
    {
      q: "How does the customized clothing service work?",
      a: "Navigate to our 'Custom' page, choose your desired garment structure and occasion, and fill in your body measurements (bust, waist, hip, height). Our designer Moni reviews the details, uploads fabric drafts, and emails a link to authorize payment once the design outline matches your fit.",
    },
    {
      q: "How long does shipping take?",
      a: "Standard delivery for pre-crafted catalog orders takes 3-7 business days across India. Custom bespoke pieces are handcrafted sequentially and generally ship in 2-4 weeks depending on the heavy embroidery complexity.",
    },
    {
      q: "What is your return policy?",
      a: "Due to the exclusive nature of handlooms and custom pieces made to measurements, AARU does not accept standard returns. However, we offer free sizing adjustments on custom garments within 14 days of delivery if they do not sit with absolute perfection.",
    },
    {
      q: "Do you ship internationally?",
      a: "Yes. We offer express international shipping via DHL and FedEx. Custom customs clearance procedures and international shipping rates are computed at checkout based on destination country.",
    },
  ]

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">
            Help Center
          </span>
          <h1 className="font-display text-4xl font-semibold tracking-wide text-dark">
            Frequently Asked Questions
          </h1>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        {/* Accordions */}
        <div className="space-y-4 pt-6">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx
            return (
              <div key={idx} className="border border-border bg-white">
                <button
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-display text-sm font-semibold tracking-wide uppercase text-dark hover:text-gold transition-colors duration-200"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={cn("text-text-secondary transition-transform duration-300", {
                      "rotate-180 text-gold": isOpen,
                    })}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
