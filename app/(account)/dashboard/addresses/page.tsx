'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, ShoppingBag, Heart, MapPin, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().length(10, 'Enter valid 10-digit phone'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().length(6, 'Enter valid 6-digit pincode'),
  isDefault: z.boolean().default(false)
})

type AddressForm = z.infer<typeof addressSchema>

interface Address {
  id: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
]

export default function AddressesPage() {
  const { logout, isAuthenticated } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { isDefault: false }
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses()
    }
  }, [isAuthenticated])

  async function fetchAddresses() {
    try {
      setLoading(true)
      const res = await fetch('/api/addresses', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setAddresses(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(values: AddressForm) {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      })
      const data = await res.json()
      if (data.success) {
        setMessage('Address saved successfully!')
        setShowForm(false)
        reset()
        fetchAddresses()
      } else {
        setError(data.message)
      }
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this address?')) return
    try {
      await fetch(`/api/addresses/${id}`, { method: 'DELETE', credentials: 'include' })
      fetchAddresses()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isDefault: true })
      })
      fetchAddresses()
    } catch (err) {
      console.error(err)
    }
  }

  const navigation = [
    { label: 'Overview', href: '/dashboard', icon: User },
    { label: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
    { label: 'Addresses', href: '/dashboard/addresses', icon: MapPin, active: true },
  ]

  return (
    <div className="bg-[#FAF8F5] min-h-screen font-body text-text-primary pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 border-b border-[#E8E0D6] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[#C9A96E] text-xs uppercase tracking-[0.3em] font-semibold block mb-1.5">
              Customer Account
            </span>
            <h1 className="font-display text-3xl font-semibold text-[#0D0D0D]">Manage Addresses</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-red-500 hover:opacity-80 transition-opacity"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Bar */}
          <nav className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border-b lg:border-b-0 lg:border-r border-[#E8E0D6] pb-4 lg:pb-0 lg:pr-6">
            {navigation.map((nav, idx) => {
              const Icon = nav.icon
              return (
                <Link
                  key={idx}
                  href={nav.href}
                  className={`flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors duration-300 w-full ${
                    nav.active
                      ? "bg-[#C9A96E]/10 text-[#C9A96E] border-l border-[#C9A96E] font-bold"
                      : "text-text-secondary hover:text-dark hover:bg-gray-100"
                  }`}
                >
                  <Icon size={14} />
                  <span>{nav.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Details Column */}
          <div className="lg:col-span-9 space-y-6">
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm mb-4">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm mb-4">
                {error}
              </div>
            )}

            {!showForm && (
              <div className="space-y-6">
                <div className="text-right">
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-xs uppercase tracking-widest text-[#C9A96E] font-bold hover:text-[#0D0D0D] transition-colors duration-200"
                  >
                    + Add New Address
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[#E8E0D6] bg-white text-text-secondary">
                    <p className="text-xs uppercase tracking-widest">No saved addresses.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`border rounded p-5 bg-white ${
                          addr.isDefault ? 'border-[#C9A96E] bg-[#C9A96E]/5' : 'border-[#E8E0D6]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-[#0D0D0D] text-sm uppercase tracking-wide">{addr.fullName}</span>
                              {addr.isDefault && (
                                <span className="text-[10px] bg-[#C9A96E] text-white px-2 py-0.5 uppercase font-medium tracking-wider">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary mt-1">{addr.addressLine1}</p>
                            {addr.addressLine2 && (
                              <p className="text-xs text-text-secondary">{addr.addressLine2}</p>
                            )}
                            <p className="text-xs text-text-secondary">
                              {addr.city}, {addr.state} — {addr.pincode}
                            </p>
                            <p className="text-xs text-[#0D0D0D] font-medium mt-1">Phone: {addr.phone}</p>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            {!addr.isDefault && (
                              <button
                                onClick={() => handleSetDefault(addr.id)}
                                className="text-[10px] uppercase font-bold text-[#C9A96E] hover:underline"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(addr.id)}
                              className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showForm && (
              <div className="bg-white border border-[#E8E0D6] p-6 md:p-8">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <h3 className="font-display text-base font-semibold uppercase tracking-wider border-b pb-3 mb-4 text-[#0D0D0D]">
                    New Address Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">
                        Full Name *
                      </label>
                      <input
                        {...register('fullName')}
                        placeholder="Full name"
                        className="w-full border border-[#E8E0D6] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">
                        Phone *
                      </label>
                      <input
                        {...register('phone')}
                        placeholder="10-digit mobile"
                        maxLength={10}
                        className="w-full border border-[#E8E0D6] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">
                      Address Line 1 *
                    </label>
                    <input
                      {...register('addressLine1')}
                      placeholder="House no, Street, Area"
                      className="w-full border border-[#E8E0D6] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                    />
                    {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">
                      Address Line 2
                    </label>
                    <input
                      {...register('addressLine2')}
                      placeholder="Landmark (optional)"
                      className="w-full border border-[#E8E0D6] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">City *</label>
                      <input
                        {...register('city')}
                        placeholder="City"
                        className="w-full border border-[#E8E0D6] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">State *</label>
                      <select
                        {...register('state')}
                        className="w-full border border-[#E8E0D6] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E] bg-white"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">Pincode *</label>
                      <input
                        {...register('pincode')}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        className="w-full border border-[#E8E0D6] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A96E]"
                      />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isDefault" {...register('isDefault')} className="accent-[#C9A96E]" />
                    <label htmlFor="isDefault" className="text-sm text-secondary">
                      Set as default address
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-[#0D0D0D] text-white px-6 py-2 text-sm tracking-widest uppercase hover:bg-[#C9A96E] transition disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); reset() }}
                      className="border border-[#E8E0D6] px-6 py-2 text-sm tracking-widest uppercase hover:border-[#0D0D0D] transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
