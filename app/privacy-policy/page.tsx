import React from "react"
import { Breadcrumb } from "@/components/ui/Breadcrumb"

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-10">
        <Breadcrumb items={[{ label: "Privacy Policy" }]} />

        <div className="space-y-4">
          <h1 className="font-display text-3xl font-semibold text-dark">Privacy Policy</h1>
          <p className="text-xs text-text-secondary uppercase tracking-widest">
            Last Updated: June 12, 2026
          </p>
          <div className="w-12 h-0.5 bg-gold mt-2" />
        </div>

        <div className="space-y-6 text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide">
          <p>
            At AARU Luxury, accessible from aaru.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AARU and how we use it.
          </p>

          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark mt-6">
            1. Information We Collect
          </h3>
          <p>
            When you register for an account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number. If you use our bespoke custom clothing service, we also collect measurement parameters (bust, waist, hips, height) to tailor products specifically for you.
          </p>

          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-dark mt-6">
            2. How We Use Your Information
          </h3>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide, operate, and maintain our website and account configurations.</li>
            <li>Improve, personalize, and expand our clothing offerings.</li>
            <li>Understand and analyze how you interact with our catalog items.</li>
            <li>Develop new products, custom designs, services, and features.</li>
            <li>Process payments and transactions securely via Razorpay gateway channels.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
