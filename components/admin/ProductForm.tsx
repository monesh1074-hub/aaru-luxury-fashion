'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUploader, { UploadedImage } from './ImageUploader'
import { clearClientProductsCache } from '@/lib/clientProductsCache'

const schema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().optional().default(''),
  categoryId: z.string().min(1, 'Please select a category'),
  basePrice: z.string().min(1, 'Price is required'),
  salePrice: z.string().optional(),
  fabric: z.string().optional(),
  occasion: z.string().optional(),
  isCustomizable: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
})

type FormData = z.infer<typeof schema>

interface Variant {
  size: string
  color: string
  stockQty: number
  sku: string
  additionalPrice: number
}

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  product?: any
  onSuccess: () => void
  onCancel: () => void
}

const SIZE_OPTIONS = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom']
const OCCASION_OPTIONS = ['All', 'Wedding', 'Festival', 'Casual', 'Party', 'Daily', 'Office']
const FABRIC_OPTIONS = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Linen', 'Velvet', 'Net', 'Crepe', 'Other']

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [variants, setVariants] = useState<Variant[]>([
    { size: 'Free Size', color: '', stockQty: 10, sku: '', additionalPrice: 0 }
  ])
  const [categories, setCategories] = useState<Category[]>([])
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: product ? {
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      basePrice: String(product.basePrice),
      salePrice: product.salePrice ? String(product.salePrice) : '',
      fabric: product.fabric || '',
      occasion: product.occasion || '',
      isCustomizable: product.isCustomizable,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isActive: product.isActive
    } : {
      isActive: true,
      isNewArrival: true,
      isFeatured: false,
      isCustomizable: false
    }
  })

  useEffect(() => {
    fetchCategories()
    if (product) {
      // Pre-load existing images
      if (product.images?.length > 0) {
        setImages(product.images.map((img: any) => ({
          url: img.imageUrl,
          publicId: img.publicId || ''
        })))
      }
      // Pre-load existing variants
      if (product.variants?.length > 0) {
        setVariants(product.variants.map((v: any) => ({
          size: v.size,
          color: v.color || '',
          stockQty: v.stockQty,
          sku: v.sku || '',
          additionalPrice: v.additionalPrice || 0
        })))
      }
    }
  }, [product])

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setCategories(data.categories || data.data || [])
      }
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  function addVariant() {
    setVariants(prev => [
      ...prev,
      { size: 'M', color: '', stockQty: 0, sku: '', additionalPrice: 0 }
    ])
  }

  function removeVariant(index: number) {
    if (variants.length === 1) return
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  function updateVariant(index: number, field: keyof Variant, value: string | number) {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v))
  }

  async function onSubmit(data: FormData) {
    setError('')

    // Validate images
    const validImages = images.filter(img => img.url && img.publicId && !img.uploading && !img.error)
    if (validImages.length === 0) {
      setError('Please upload at least one product photo before saving')
      setStep(2)
      return
    }

    // Check if any image is still uploading
    const uploading = images.some(img => img.uploading)
    if (uploading) {
      setError('Please wait for all photos to finish uploading')
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        name: data.name,
        description: data.description || '',
        categoryId: data.categoryId,
        basePrice: parseFloat(data.basePrice),
        salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
        fabric: data.fabric || '',
        occasion: data.occasion || '',
        isCustomizable: data.isCustomizable,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isActive: data.isActive,
        metaTitle: data.metaTitle || data.name,
        metaDescription: data.metaDescription || data.description || '',
        images: validImages.map((img, idx) => ({
          url: img.url,
          publicId: img.publicId,
          isPrimary: idx === 0,
          altText: data.name
        })),
        variants: variants.filter(v => v.size)
      }

      console.log('Submitting product payload:', JSON.stringify(payload, null, 2))

      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      console.log('Product save result:', result)

      if (result.success) {
        clearClientProductsCache()
        onSuccess()
      } else {
        setError(result.message || 'Failed to save product')
      }

    } catch (err) {
      console.error('Submit error:', err)
      setError('Something went wrong. Check console for details.')
    } finally {
      setSubmitting(false)
    }
  }

  const basePrice = watch('basePrice')
  const salePrice = watch('salePrice')
  const discountPercent = basePrice && salePrice
    ? Math.round(((parseFloat(basePrice) - parseFloat(salePrice)) / parseFloat(basePrice)) * 100)
    : 0

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Fill in the details to {product ? 'update' : 'publish'} your product
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ✕
        </button>
      </div>

      {/* Step Progress */}
      <div className="px-8 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {[
            { n: 1, label: 'Basic Info' },
            { n: 2, label: 'Photos' },
            { n: 3, label: 'Pricing' },
            { n: 4, label: 'Sizes & Stock' },
            { n: 5, label: 'Publish' }
          ].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(n)}
                className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                  step === n
                    ? 'bg-yellow-500 text-white shadow'
                    : step > n
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > n ? '✓' : n}
              </button>
              <span className={`text-xs hidden sm:block ${step === n ? 'text-yellow-600 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
              {n < 5 && <div className="w-8 h-px bg-gray-300 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-8 py-6 space-y-6">

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-800 text-lg">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  {...register('name')}
                  placeholder="e.g., Kanchipuram Silk Saree in Royal Gold"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  {...register('categoryId')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe the product — fabric, craftsmanship, styling tips..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                  <select
                    {...register('fabric')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                  >
                    <option value="">Select fabric</option>
                    {FABRIC_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                  <select
                    {...register('occasion')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                  >
                    <option value="">Select occasion</option>
                    {OCCASION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Next: Add Photos →
              </button>
            </div>
          )}

          {/* STEP 2: Photos */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-800 text-lg">Product Photos</h3>
              <p className="text-sm text-gray-500">
                Upload beautiful photos of your product. These will be shown to customers.
                Tip: Use good lighting and a plain background.
              </p>
              <ImageUploader
                images={images}
                onChange={setImages}
                maxImages={10}
              />
              {images.filter(i => i.url && !i.uploading).length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-green-700 text-sm font-medium">
                    {images.filter(i => i.url && !i.uploading).length} photo(s) uploaded to cloud successfully
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50">
                  ← Back
                </button>
                <button type="button" onClick={() => setStep(3)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition">
                  Next: Pricing →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Pricing */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-800 text-lg">Pricing</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 font-medium">₹</span>
                    <input
                      {...register('basePrice')}
                      type="number"
                      placeholder="e.g., 5000"
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price (₹) <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 font-medium">₹</span>
                    <input
                      {...register('salePrice')}
                      type="number"
                      placeholder="Leave empty if no discount"
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  {discountPercent > 0 && (
                    <p className="text-green-600 text-xs mt-1 font-medium">
                      🎉 {discountPercent}% discount — Customers save ₹{(parseFloat(basePrice) - parseFloat(salePrice || '0')).toFixed(0)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50">
                  ← Back
                </button>
                <button type="button" onClick={() => setStep(4)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition">
                  Next: Sizes & Stock →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Sizes & Stock */}
          {step === 4 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-800 text-lg">Sizes & Stock</h3>
              <p className="text-sm text-gray-500">
                Add all available sizes and how many pieces you have in stock.
              </p>

              <div className="space-y-3">
                {variants.map((variant, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-start bg-gray-50 p-3 rounded-lg">
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-500 mb-1">Size</label>
                      <select
                        value={variant.size}
                        onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-sm"
                      >
                        <option value="">Select Size</option>
                        {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-500 mb-1">Color (opt)</label>
                      <input
                        type="text"
                        value={variant.color}
                        onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                        placeholder="e.g. Red"
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Stock</label>
                      <input
                        type="number"
                        value={variant.stockQty}
                        onChange={(e) => updateVariant(idx, 'stockQty', parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-500 mb-1">+ Price (₹)</label>
                      <input
                        type="number"
                        value={variant.additionalPrice}
                        onChange={(e) => updateVariant(idx, 'additionalPrice', parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex items-end justify-center pb-2">
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        disabled={variants.length === 1}
                        className={`text-red-500 hover:text-red-700 p-1 ${variants.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Remove Variant"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="text-sm text-yellow-600 font-semibold hover:text-yellow-700 flex items-center gap-1"
              >
                <span>+</span> Add another size/variant
              </button>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(3)} className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50">
                  ← Back
                </button>
                <button type="button" onClick={() => setStep(5)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition">
                  Next: Publish Settings →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Publish Settings */}
          {step === 5 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-800 text-lg">Publish Settings</h3>
              
              <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400"
                  />
                  <div>
                    <span className="block font-medium text-gray-800">Active</span>
                    <span className="text-xs text-gray-500">Show this product in the store</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400"
                  />
                  <div>
                    <span className="block font-medium text-gray-800">Featured Product</span>
                    <span className="text-xs text-gray-500">Show on the homepage</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isNewArrival')}
                    className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400"
                  />
                  <div>
                    <span className="block font-medium text-gray-800">New Arrival</span>
                    <span className="text-xs text-gray-500">Add a "New" badge to this product</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isCustomizable')}
                    className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400"
                  />
                  <div>
                    <span className="block font-medium text-gray-800">Customizable</span>
                    <span className="text-xs text-gray-500">Allow users to request custom measurements</span>
                  </div>
                </label>
              </div>

              {/* SEO Settings */}
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-3">SEO Details (Optional)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                    <input
                      {...register('metaTitle')}
                      placeholder="Leave blank to use product name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                    <textarea
                      {...register('metaDescription')}
                      rows={2}
                      placeholder="Brief description for Google search results"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setStep(4)} className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50">
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{product ? 'Update Product' : 'Publish Product'} ✓</>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </form>
    </div>
  )
}
