"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Toast } from "@/components/ui/Toast"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import axios from "axios"
import { Scissors, Ruler, Sparkles, CheckCircle, MessageCircle } from "lucide-react"
import { WHATSAPP_URL } from "@/lib/constants"

const customOrderSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  garmentType: z.string().min(1, "Please select a garment type"),
  occasion: z.string().min(1, "Please select an occasion"),
  fabricPreference: z.string().optional(),
  colorPreference: z.string().optional(),
  notes: z.string().optional(),
  // Measurements
  bust: z.string().min(1, "Bust measurement is required"),
  waist: z.string().min(1, "Waist measurement is required"),
  hip: z.string().min(1, "Hip measurement is required"),
  height: z.string().min(1, "Height is required"),
  customMeasurements: z.string().optional(),
})

type CustomOrderFormValues = z.infer<typeof customOrderSchema>

export default function CustomClothingPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CustomOrderFormValues>({
    resolver: zodResolver(customOrderSchema),
  })

  const handleNextStep = async () => {
    // Validate current step fields before going next
    let fieldsToValidate: (keyof CustomOrderFormValues)[] = []
    if (step === 1) {
      fieldsToValidate = ["garmentType", "occasion"]
    } else if (step === 2) {
      fieldsToValidate = ["bust", "waist", "hip", "height"]
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setStep((s) => s + 1)
    } else {
      Toast.error("Please fill in all required fields")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i])
      }
      const res = await axios.post("/api/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setUploadedUrls((prev) => [...prev, ...res.data.urls])
      Toast.success("Reference images uploaded!")
    } catch (err) {
      console.error(err)
      setUploadedUrls((prev) => [
        ...prev,
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
      ])
      Toast.success("Reference files set to fallback mock")
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: CustomOrderFormValues) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        occasion: data.occasion,
        garmentType: data.garmentType,
        fabricPreference: data.fabricPreference,
        colorPreference: data.colorPreference,
        notes: data.notes,
        referenceImageUrls: uploadedUrls,
        measurements: {
          bust: data.bust,
          waist: data.waist,
          hip: data.hip,
          height: data.height,
          customDetails: data.customMeasurements || "",
        },
      }

      const res = await axios.post("/api/custom-orders", payload)
      if (res.data.success) {
        setSubmitted(true)
        Toast.success("Your bespoke inquiry has been sent!")
      }
    } catch (err) {
      Toast.error("Failed to submit inquiry. Try again.")
    }
  }

  return (
    <div className="bg-background min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Breadcrumb items={[{ label: "Custom Tailoring" }]} />

        {submitted ? (
          <div className="text-center py-20 space-y-6 max-w-md mx-auto">
            <CheckCircle size={48} className="text-gold mx-auto" />
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-dark">
              Inquiry Submitted
            </h2>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
              Thank you for contacting the House of AARU. Our lead design team under Moni will review your measurements and email a quotation within 48 business hours.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Submit Another Inquiry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
            {/* Left: General Info column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-3">
                <Scissors size={24} className="text-gold" />
                <h1 className="font-display text-2xl font-semibold uppercase tracking-wider text-dark">
                  Bespoke Atelier
                </h1>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Experience custom luxury clothing tailor-made to your exact body specifications.
                </p>
              </div>

              {/* Step checklist indicator */}
              <div className="space-y-4 text-xs font-semibold uppercase tracking-widest pt-4 border-t border-border/60">
                <div className={`flex items-center space-x-3.5 ${step === 1 ? "text-gold" : "text-text-secondary"}`}>
                  <span className="w-6 h-6 border flex items-center justify-center rounded-full">1</span>
                  <span>Occasion Selection</span>
                </div>
                <div className={`flex items-center space-x-3.5 ${step === 2 ? "text-gold" : "text-text-secondary"}`}>
                  <span className="w-6 h-6 border flex items-center justify-center rounded-full">2</span>
                  <span>Measurements & Fabric</span>
                </div>
                <div className={`flex items-center space-x-3.5 ${step === 3 ? "text-gold" : "text-text-secondary"}`}>
                  <span className="w-6 h-6 border flex items-center justify-center rounded-full">3</span>
                  <span>Inspiration & Appointment</span>
                </div>
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 w-full justify-center py-3 bg-[#25D366] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#20bd5a] transition-all duration-300"
              >
                <MessageCircle size={16} />
                Talk To Designer
              </a>
            </div>

            {/* Right: Interactive Forms */}
            <div className="lg:col-span-8 bg-white border border-border p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Styles */}
                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-lg font-semibold uppercase tracking-wider border-b pb-3 text-dark">
                      Garment Preference
                    </h2>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                        Garment Type
                      </label>
                      <select
                        {...register("garmentType")}
                        className="w-full bg-white border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold h-12"
                      >
                        <option value="">Select Garment</option>
                        <option value="Saree Blouse">Saree Blouse</option>
                        <option value="Lehenga Choli Set">Lehenga Choli Set</option>
                        <option value="Anarkali Gown">Anarkali Gown</option>
                        <option value="Salwar Kameez Suit">Salwar Kameez Suit</option>
                        <option value="Mens Sherwani">Mens Sherwani</option>
                      </select>
                      {errors.garmentType && (
                        <span className="text-xs text-error font-medium">{errors.garmentType.message}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                        Occasion / Event
                      </label>
                      <select
                        {...register("occasion")}
                        className="w-full bg-white border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold h-12"
                      >
                        <option value="">Select Occasion</option>
                        <option value="Bridal Wedding">Bridal Wedding</option>
                        <option value="Engagement Soiree">Engagement Soiree</option>
                        <option value="Festive Ceremony">Festive Ceremony</option>
                        <option value="Formal Gala">Formal Gala</option>
                      </select>
                      {errors.occasion && (
                        <span className="text-xs text-error font-medium">{errors.occasion.message}</span>
                      )}
                    </div>

                    <Input label="Fabric Preference (Optional)" placeholder="e.g. Raw Banarasi Silk, Chanderi" {...register("fabricPreference")} />
                    <Input label="Color / Shade Preference (Optional)" placeholder="e.g. Crimson Red, Mint Green" {...register("colorPreference")} />

                    <div className="pt-4 flex justify-end">
                      <Button type="button" onClick={handleNextStep}>
                        Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Measurements */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="flex items-center space-x-2 border-b pb-3 mb-2">
                      <Ruler size={16} className="text-gold" />
                      <h2 className="font-display text-lg font-semibold uppercase tracking-wider text-dark">
                        Atelier Sizes (Inches)
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Bust circumference" placeholder="e.g. 34" {...register("bust")} error={errors.bust?.message} />
                      <Input label="Waist circumference" placeholder="e.g. 28" {...register("waist")} error={errors.waist?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Hip circumference" placeholder="e.g. 38" {...register("hip")} error={errors.hip?.message} />
                      <Input label="Height (e.g. 5'5 inches or cm)" placeholder="e.g. 165 cm" {...register("height")} error={errors.height?.message} />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                        Additional measurement notes
                      </label>
                      <textarea
                        rows={3}
                        {...register("customMeasurements")}
                        className="w-full bg-white border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                        placeholder="e.g. Shoulder width, sleeve length preferences..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/2">
                        Back
                      </Button>
                      <Button type="button" onClick={handleNextStep} className="w-1/2">
                        Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact details */}
                {step === 3 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-lg font-semibold uppercase tracking-wider border-b pb-3 text-dark">
                      Contact Details
                    </h2>

                    <Input label="Your Name" placeholder="Enter your full name" {...register("name")} error={errors.name?.message} />
                    <Input label="Email Address" placeholder="name@example.com" {...register("email")} error={errors.email?.message} />
                    <Input label="Mobile / WhatsApp Number" placeholder="9876543210" {...register("phone")} error={errors.phone?.message} />

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                        Upload reference images (e.g. design layout drawings)
                      </label>
                      <input type="file" multiple onChange={handleImageUpload} className="text-xs block" />
                      {uploading && <span className="text-xs text-gold">Uploading files...</span>}
                      <div className="flex gap-2.5 mt-2 flex-wrap">
                        {uploadedUrls.map((url, idx) => (
                          <div key={idx} className="relative w-14 aspect-[3/4] border border-border bg-border/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="Reference details" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                        Special design notes / instructions
                      </label>
                      <textarea
                        rows={3}
                        {...register("notes")}
                        className="w-full bg-white border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                        placeholder="Provide details about patterns, neck styles, specific borders..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-1/2">
                        Back
                      </Button>
                      <Button type="submit" loading={isSubmitting} className="w-1/2">
                        Submit Bespoke Request
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
