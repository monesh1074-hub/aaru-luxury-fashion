"use client"

import React, { useState } from "react"
import { ArrowRight } from "lucide-react"

export const NewsletterSection = () => {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail("")
    setTimeout(() => setSubscribed(false), 5000)
  }

  return (
    <section className="py-20 md:py-24 bg-[#F5F0EA] border-t border-border font-body">
      <div className="max-w-2xl mx-auto px-4 md:px-8 text-center space-y-6">
        <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block">
          Stay Connected
        </span>
        <h2 className="font-display text-3xl md:text-4xl text-text-primary tracking-wide">
          Join The AARU Chronicle
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
          Receive private invitations to new collections, editorial lookbooks, and seasonal shows delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="relative flex max-w-md mx-auto border-b-2 border-dark py-3 focus-within:border-gold transition-colors duration-300">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOUR EMAIL ADDRESS"
            className="bg-transparent text-sm text-dark placeholder-text-secondary/60 focus:outline-none w-full pr-10 uppercase tracking-widest text-xs font-semibold"
            required
          />
          <button
            type="submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gold hover:text-dark transition-colors duration-300"
            aria-label="Subscribe to newsletter"
          >
            <ArrowRight size={18} />
          </button>
        </form>

        {subscribed && (
          <p className="text-xs text-gold tracking-wider uppercase font-semibold">
            Thank you for subscribing to The Chronicle.
          </p>
        )}
      </div>
    </section>
  )
}
