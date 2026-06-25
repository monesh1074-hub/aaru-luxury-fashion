"use client"

import React from "react"
import Link from "next/link"
import { Instagram } from "lucide-react"
import { INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/constants"

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export const Footer = () => {
  return (
    <footer className="bg-dark text-[#D9D1C7] border-t border-[#262422] font-body pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
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
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-300 p-1"
              aria-label="AARU on Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-300 p-1"
              aria-label="Chat with AARU on WhatsApp"
            >
              <WhatsAppIcon size={18} />
            </a>
          </div>
        </div>

        <div>
          <h5 className="font-display text-xs uppercase font-semibold tracking-widest text-gold mb-6">
            Collections
          </h5>
          <ul className="space-y-3.5 text-xs text-[#A69E94]">
            <li><Link href="/shop/sarees" className="hover:text-gold transition-colors duration-300">Heritage Sarees</Link></li>
            <li><Link href="/shop/designer-sarees" className="hover:text-gold transition-colors duration-300">Designer Wear</Link></li>
            <li><Link href="/shop/occasion-wear" className="hover:text-gold transition-colors duration-300">Lehengas & Occasion</Link></li>
            <li><Link href="/shop?readyToShip=true" className="hover:text-gold transition-colors duration-300">Ready To Ship</Link></li>
            <li><Link href="/custom" className="hover:text-gold transition-colors duration-300">Bespoke Tailoring</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-display text-xs uppercase font-semibold tracking-widest text-gold mb-6">
            The House of Aaru
          </h5>
          <ul className="space-y-3.5 text-xs text-[#A69E94]">
            <li><Link href="/story" className="hover:text-gold transition-colors duration-300">Our Story</Link></li>
            <li><Link href="/aaru-by-moni" className="hover:text-gold transition-colors duration-300">Aaru by Moni</Link></li>
            <li><Link href="/sixth-element" className="hover:text-gold transition-colors duration-300">The Sixth Element</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors duration-300">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-gold transition-colors duration-300">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-display text-xs uppercase font-semibold tracking-widest text-gold mb-6">
            Customer Care
          </h5>
          <ul className="space-y-3.5 text-xs text-[#A69E94]">
            <li><Link href="/shipping-policy" className="hover:text-gold transition-colors duration-300">Shipping Policy</Link></li>
            <li><Link href="/returns-policy" className="hover:text-gold transition-colors duration-300">Returns Policy</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-gold transition-colors duration-300">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold transition-colors duration-300">Terms of Use</Link></li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-300 inline-flex items-center gap-2">
                <WhatsAppIcon size={14} />
                WhatsApp Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-[#262422] flex flex-col md:flex-row items-center justify-between text-[10px] text-[#736C63] uppercase tracking-wider gap-4">
        <div>&copy; {new Date().getFullYear()} AARU Luxury Fashion. All Rights Reserved.</div>
        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
          <Link href="/privacy-policy" className="hover:text-gold transition-colors duration-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gold transition-colors duration-300">Terms of Use</Link>
          <Link href="/faq" className="hover:text-gold transition-colors duration-300">FAQ</Link>
        </div>
      </div>
    </footer>
  )
}
