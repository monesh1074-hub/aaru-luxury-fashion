"use client"

import React from "react"
import { Modal } from "../ui/Modal"

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

const SIZE_CHART = [
  { size: "XS", bust: "32", waist: "26", hip: "34" },
  { size: "S", bust: "34", waist: "28", hip: "36" },
  { size: "M", bust: "36", waist: "30", hip: "38" },
  { size: "L", bust: "38", waist: "32", hip: "40" },
  { size: "XL", bust: "40", waist: "34", hip: "42" },
  { size: "XXL", bust: "42", waist: "36", hip: "44" },
]

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Size Guide">
      <div className="space-y-6 font-body text-text-primary">
        <p className="text-xs text-text-secondary leading-relaxed">
          All measurements are in inches. For the best fit, measure yourself wearing light clothing and compare with the chart below.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 uppercase tracking-wider font-semibold text-text-secondary">Size</th>
                <th className="text-left py-3 pr-4 uppercase tracking-wider font-semibold text-text-secondary">Bust</th>
                <th className="text-left py-3 pr-4 uppercase tracking-wider font-semibold text-text-secondary">Waist</th>
                <th className="text-left py-3 uppercase tracking-wider font-semibold text-text-secondary">Hip</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-semibold text-dark">{row.size}</td>
                  <td className="py-3 pr-4 text-text-secondary">{row.bust}&quot;</td>
                  <td className="py-3 pr-4 text-text-secondary">{row.waist}&quot;</td>
                  <td className="py-3 text-text-secondary">{row.hip}&quot;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-border/10 p-4 space-y-2 text-[10px] uppercase tracking-wider text-text-secondary">
          <p className="font-bold text-dark">How to Measure</p>
          <p><strong>Bust:</strong> Measure around the fullest part of your chest.</p>
          <p><strong>Waist:</strong> Measure around your natural waistline.</p>
          <p><strong>Hip:</strong> Measure around the fullest part of your hips.</p>
        </div>
      </div>
    </Modal>
  )
}
