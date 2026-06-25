"use client"

import React, { useState } from "react"
import axios from "@/lib/apiClient"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Toast } from "@/components/ui/Toast"
import { Scissors, FileText, Image as ImageIcon } from "lucide-react"
import { useCachedQuery } from "@/hooks/useCachedQuery"
import { ADMIN_CACHE_TTL } from "@/components/admin/AdminPrefetch"

interface CustomInquiry {
  id: string
  name: string
  email: string
  phone: string
  garmentType: string
  occasion: string
  fabricPreference?: string
  colorPreference?: string
  measurements: Record<string, unknown>
  referenceImageUrls?: string[]
  status: string
}

interface AdminCustomOrdersData {
  inquiries: CustomInquiry[]
}

export default function AdminCustomOrdersPage() {
  const [selectedMeasurements, setSelectedMeasurements] = useState<Record<string, unknown> | null>(null)
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null)

  const { data, loading, refresh } = useCachedQuery<AdminCustomOrdersData>(
    "admin:custom-orders",
    async () => {
      const response = await axios.get("/api/custom-orders")
      return { inquiries: response.data?.inquiries || [] }
    },
    { ttl: ADMIN_CACHE_TTL }
  )

  const inquiries = data?.inquiries || []

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.put("/api/custom-orders", { id, status: newStatus })
      Toast.success(`Inquiry status updated to ${newStatus}`)
      refresh()
    } catch {
      Toast.error("Failed to update inquiry status")
    }
  }

  if (loading && inquiries.length === 0) {
    return (
      <div className="space-y-6 animate-pulse font-body">
        <div className="h-8 w-40 bg-border/40" />
        <div className="h-64 bg-border/20" />
      </div>
    )
  }

  const statuses = ["PENDING", "REVIEWED", "APPROVED", "COMPLETED", "CANCELLED"]

  return (
    <div className="space-y-8 font-body">
      <div>
        <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block mb-1.5">
          Bespoke Atelier
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-wide text-dark flex items-center gap-3">
          <Scissors size={24} className="text-gold" />
          <span>Custom Clothing Requests</span>
        </h1>
        <div className="w-12 h-0.5 bg-gold mt-3" />
      </div>

      <div className="bg-white border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs uppercase tracking-wider border-collapse">
          <thead>
            <tr className="bg-border/10 text-dark border-b border-border font-bold text-[10px]">
              <th className="p-4">Client Contact</th>
              <th className="p-4">Occasion & Type</th>
              <th className="p-4 text-center">Measurements</th>
              <th className="p-4 text-center">References</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-text-primary">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-secondary uppercase tracking-widest">
                  No custom garment requests found.
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-border/5 transition-colors">
                  <td className="p-4 normal-case">
                    <span className="block font-semibold text-dark">{inquiry.name}</span>
                    <span className="block text-[10px] font-mono text-text-secondary">{inquiry.email}</span>
                    <span className="block text-[10px] text-text-secondary mt-0.5 tracking-widest">{inquiry.phone}</span>
                  </td>
                  <td className="p-4 normal-case text-text-secondary font-medium">
                    <span className="block text-dark font-bold uppercase tracking-wider text-[10px]">
                      {inquiry.garmentType}
                    </span>
                    <span>For {inquiry.occasion}</span>
                    {(inquiry.fabricPreference || inquiry.colorPreference) && (
                      <span className="block text-[10px] text-gold mt-0.5 font-bold">
                        {inquiry.fabricPreference || "Any fabric"} &bull; {inquiry.colorPreference || "Any color"}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedMeasurements(inquiry.measurements)}
                      className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-dark hover:text-gold border border-border px-3 py-1.5 bg-white shadow-sm transition-colors"
                    >
                      <FileText size={12} />
                      <span>View Sizes</span>
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    {inquiry.referenceImageUrls && inquiry.referenceImageUrls.length > 0 ? (
                      <button
                        onClick={() => setSelectedImages(inquiry.referenceImageUrls!)}
                        className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-dark hover:text-gold border border-border px-3 py-1.5 bg-white shadow-sm transition-colors"
                      >
                        <ImageIcon size={12} />
                        <span>View ({inquiry.referenceImageUrls.length})</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-text-secondary">None</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        inquiry.status === "COMPLETED"
                          ? "success"
                          : inquiry.status === "CANCELLED"
                          ? "error"
                          : inquiry.status === "PENDING"
                          ? "outline"
                          : "gold"
                      }
                    >
                      {inquiry.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                      className="bg-white border border-border px-2 py-1.5 focus:outline-none focus:border-gold text-[10px] uppercase font-bold tracking-wider"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedMeasurements && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMeasurements(null)}
          title="Custom Sizing Measurements"
        >
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4 text-xs">
              {Object.entries(selectedMeasurements).map(([key, val]) => (
                <div key={key} className="border-b border-border pb-1.5">
                  <span className="font-semibold text-text-secondary uppercase tracking-wider block text-[10px]">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="text-dark font-bold font-accent text-sm">
                    {String(val ?? "-")}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <Button onClick={() => setSelectedMeasurements(null)}>Close View</Button>
            </div>
          </div>
        </Modal>
      )}

      {selectedImages && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedImages(null)}
          title="Reference Style Photos"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {selectedImages.map((url, idx) => (
                <div key={idx} className="border border-border aspect-[3/4] overflow-hidden bg-border/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Reference ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setSelectedImages(null)}>Close View</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
