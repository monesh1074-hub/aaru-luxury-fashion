"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Toast } from "@/components/ui/Toast"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      Toast.success("Thank you. We will contact you shortly.")
      setFormData({ name: "", email: "", message: "" })
      setLoading(false)
    }, 500)
  }

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl font-semibold tracking-wide text-dark">
            Contact Aaru Atelier
          </h1>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
          {/* Left Column: Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold uppercase tracking-wider text-dark">
                The Indore Showroom
              </h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed tracking-wide">
                Visit our design flagship studio for custom measurements, bridal consult sessions, and to inspect fabrics in person.
              </p>
            </div>

            <div className="space-y-4 text-xs tracking-wider uppercase text-text-secondary">
              <div className="flex items-start space-x-3.5">
                <MapPin size={16} className="text-gold flex-shrink-0" />
                <span>
                  101-A, Gold Leaf Arcade, <br />
                  Palasia Main Road, Indore - 452001 <br />
                  Madhya Pradesh, India
                </span>
              </div>
              <div className="flex items-center space-x-3.5">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <a href="mailto:info@aaru.com" className="hover:text-dark">
                  info@aaru.com
                </a>
              </div>
              <div className="flex items-center space-x-3.5">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-dark">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-start space-x-3.5">
                <Clock size={16} className="text-gold flex-shrink-0" />
                <span>
                  Monday - Saturday <br />
                  11:00 AM - 08:00 PM IST
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-border p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-display text-lg font-semibold uppercase tracking-wider border-b pb-3 text-dark">
                Send An Inquiry
              </h3>
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                placeholder="name@example.com"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="How can our designer assist you?"
                  required
                />
              </div>

              <Button type="submit" loading={loading} className="w-full h-12">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
