'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().length(10, 'Enter valid 10-digit phone number'),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
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
  country: string
  isDefault: boolean
}

interface AddressStepProps {
  onNext: (addressId: string) => void
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
]

export function AddressStep({ onNext }: AddressStepProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { isDefault: false }
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  async function fetchAddresses() {
    try {
      setLoading(true)
      const res = await fetch('/api/addresses', { credentials: 'include' })
      const data = await res.json()
      console.log('Fetched addresses:', data)
      if (data.success) {
        setAddresses(data.data)
        const def = data.data.find((a: Address) => a.isDefault)
        if (def) setSelectedId(def.id)
        else if (data.data.length > 0) setSelectedId(data.data[0].id)
        // If no addresses, show the form automatically
        if (data.data.length === 0) setShowForm(true)
      }
    } catch (err) {
      console.error('Fetch addresses error:', err)
      setError('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(values: AddressForm) {
    try {
      setSaving(true)
      setError('')
      console.log('Submitting address:', values)

      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      })

      const data = await res.json()
      console.log('Save address response:', data)

      if (data.success) {
        setShowForm(false)
        reset()
        await fetchAddresses()
        setSelectedId(data.data.id)
      } else {
        setError(data.message || 'Failed to save address')
      }
    } catch (err) {
      console.error('Save address error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this address?')) return
    try {
      await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      await fetchAddresses()
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-widest uppercase text-primary">
          Shipping Address
        </h2>
        <p className="text-sm text-secondary mt-1">
          Select your delivery address or add a new one.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <label
              key={address.id}
              className={`flex items-start gap-4 p-4 border rounded cursor-pointer transition-all ${
                selectedId === address.id
                  ? 'border-gold bg-gold/5'
                  : 'border-border hover:border-gold/50'
              }`}
            >
              <input
                type="radio"
                name="address"
                value={address.id}
                checked={selectedId === address.id}
                onChange={() => setSelectedId(address.id)}
                className="mt-1 accent-gold"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">
                    {address.fullName}
                  </span>
                  {address.isDefault && (
                    <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-secondary mt-1">
                  {address.addressLine1}
                  {address.addressLine2 && `, ${address.addressLine2}`}
                </p>
                <p className="text-sm text-secondary">
                  {address.city}, {address.state} — {address.pincode}
                </p>
                <p className="text-sm text-secondary">{address.phone}</p>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="text-xs text-red-500 hover:text-red-700 mt-2"
                >
                  Remove
                </button>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Add New Address Toggle */}
      {!showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-gold text-sm font-medium tracking-widest uppercase hover:text-gold/80 transition"
        >
          + Add New Address
        </button>
      )}

      {/* Address Form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border border-border rounded p-6">
          <h3 className="font-medium text-primary tracking-wide">New Address</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">
                Full Name *
              </label>
              <input
                {...register('fullName')}
                placeholder="Enter full name"
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">
                Phone Number *
              </label>
              <input
                {...register('phone')}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">
              Address Line 1 *
            </label>
            <input
              {...register('addressLine1')}
              placeholder="House no, Street, Area"
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">
              Address Line 2
            </label>
            <input
              {...register('addressLine2')}
              placeholder="Landmark, Colony (optional)"
              className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">
                City *
              </label>
              <input
                {...register('city')}
                placeholder="City"
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">
                State *
              </label>
              <select
                {...register('state')}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold bg-white"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-secondary mb-1 uppercase tracking-widest">
                Pincode *
              </label>
              <input
                {...register('pincode')}
                placeholder="6-digit pincode"
                maxLength={6}
                className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              {...register('isDefault')}
              className="accent-gold"
            />
            <label htmlFor="isDefault" className="text-sm text-secondary">
              Set as default address
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-dark text-white px-6 py-2 text-sm tracking-widest uppercase hover:bg-gold transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Address'}
            </button>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => { setShowForm(false); reset() }}
                className="border border-border px-6 py-2 text-sm tracking-widest uppercase hover:border-dark transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Continue Button */}
      {addresses.length > 0 && !showForm && (
        <button
          type="button"
          disabled={!selectedId}
          onClick={() => selectedId && onNext(selectedId)}
          className="w-full bg-dark text-white py-3 text-sm tracking-widest uppercase hover:bg-gold transition disabled:opacity-40"
        >
          Continue to Payment
        </button>
      )}
    </div>
  )
}

export default AddressStep;
