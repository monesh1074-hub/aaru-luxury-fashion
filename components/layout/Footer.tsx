"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, ArrowRight } from "lucide-react"

export const Footer = () => {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail("")
    setTimeout(() => setSubscribed(false), 5000)
  }

  return (
    <footer className="bg-dark text-[#D9D1C7] border-t border-[#262422] font-body pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-6">
          <div>
            <h4 className="font-display text-2xl font-bold tracking-widest text-gold">AARU</h4>
            <span className="block text-[8px] tracking-[0.4em] uppercase text-text-secondary">
              Luxury Fashion
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#A69E94]">
            Celebrating the timeless essence of Indian heritage through premium handlooms, royal brocades, and modern couture aesthetics.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/aaru_luxury_fashion"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-300"
              aria-label="AARU on Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/aarulyxuryfashion"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-300"
              aria-label="AARU on Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://twitter.com/aaru_luxury"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-300"
              aria-label="AARU on Twitter / X"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://wa.me/919999999999?text=Hi%20AARU%20Luxury%20Fashion%2C%20I%20would%20like%20to%20know%20more%20about%20your%20collections."
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-300"
              aria-label="Chat with AARU on WhatsApp"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="font-display text-xs uppercase font-semibold tracking-widest text-gold mb-6">
            Collections
          </h5>
          <ul className="space-y-3.5 text-xs text-[#A69E94]">
            <li>
              <Link href="/shop/sarees" className="hover:text-gold transition-colors duration-300">
                Heritage Sarees
              </Link>
            </li>
            <li>
              <Link href="/shop/designer-sarees" className="hover:text-gold transition-colors duration-300">
                Designer Couture
              </Link>
            </li>
            <li>
              <Link href="/shop/occasion-wear" className="hover:text-gold transition-colors duration-300">
                Bridal & Occasion
              </Link>
            </li>
            <li>
              <Link href="/custom" className="hover:text-gold transition-colors duration-300">
                Custom Tailoring
              </Link>
            </li>
          </ul>
        </div>

        {/* Brand Editorial Links */}
        <div>
          <h5 className="font-display text-xs uppercase font-semibold tracking-widest text-gold mb-6">
            The House of Aaru
          </h5>
          <ul className="space-y-3.5 text-xs text-[#A69E94]">
            <li>
              <Link href="/about" className="hover:text-gold transition-colors duration-300">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/aaru-by-moni" className="hover:text-gold transition-colors duration-300">
                Aaru by Moni
              </Link>
            </li>
            <li>
              <Link href="/sixth-element" className="hover:text-gold transition-colors duration-300">
                The Sixth Element
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold transition-colors duration-300">
                Contact & Bespoke Inquiries
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-6">
          <h5 className="font-display text-xs uppercase font-semibold tracking-widest text-gold mb-2">
            The Chronicle
          </h5>
          <p className="text-xs text-[#A69E94] leading-relaxed">
            Subscribe to receive private invitations to new collections, editorial lookbooks, and seasonal shows.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex border-b border-[#4D4842] py-2 focus-within:border-gold transition-colors duration-300">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL"
              className="bg-transparent text-sm text-white placeholder-text-secondary/60 focus:outline-none w-full pr-10 uppercase tracking-widest text-xs font-semibold"
              required
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gold hover:text-white transition-colors duration-300"
              aria-label="Submit newsletter subscription"
            >
              <ArrowRight size={16} />
            </button>
          </form>
          {subscribed && (
            <p className="text-[10px] text-gold tracking-wider uppercase font-semibold">
              Thank you for subscribing.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-[#262422] flex flex-col md:flex-row items-center justify-between text-[10px] text-[#736C63] uppercase tracking-wider gap-4">
        <div>
          &copy; {new Date().getFullYear()} AARU Luxury Fashion. All Rights Reserved.
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
          <Link href="/privacy-policy" className="hover:text-gold transition-colors duration-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gold transition-colors duration-300">
            Terms of Use
          </Link>
          <Link href="/faq" className="hover:text-gold transition-colors duration-300">
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  )
}
