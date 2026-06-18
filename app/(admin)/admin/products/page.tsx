"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import ProductForm from "@/components/admin/ProductForm"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Toast } from "@/components/ui/Toast"
import { formatPrice } from "@/lib/utils"
import { clearClientProductsCache } from "@/lib/clientProductsCache"
import { Edit, Trash, Plus } from "lucide-react"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get("/api/admin/products?limit=100"),
        axios.get("/api/categories"),
      ])
      setProducts(prodRes.data?.data || prodRes.data?.products || [])
      setCategories(catRes.data?.categories || catRes.data?.data || (Array.isArray(catRes.data) ? catRes.data : []))
    } catch (err) {
      console.error(err)
      Toast.error("Failed to load products and categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this product?")) return
    try {
      await axios.delete(`/api/admin/products/${id}`)
      clearClientProductsCache()
      Toast.success("Product deactivated successfully")
      fetchData()
    } catch (err) {
      Toast.error("Failed to deactivate product")
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className="space-y-6 animate-pulse font-body">
        <div className="h-8 w-40 bg-border/40" />
        <div className="h-64 bg-border/20" />
      </div>
    )
  }

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-gold text-xs uppercase tracking-[0.4em] font-semibold block mb-1.5">
            Catalog
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-wide text-dark">
            Manage Products
          </h1>
        </div>
        {!showForm && (
          <Button
            onClick={() => {
              setEditingProduct(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Add New Product</span>
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white border border-border p-8 max-w-3xl mx-auto shadow-sm">
          <h3 className="font-display text-lg font-semibold uppercase tracking-wider text-dark mb-6 border-b border-border pb-3">
            {editingProduct ? "Edit Product" : "Create New Product"}
          </h3>
          <ProductForm
            product={editingProduct}
            onSuccess={() => {
              setShowForm(false)
              setEditingProduct(null)
              fetchData()
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        </div>
      ) : (
        <div className="bg-white border border-border shadow-sm overflow-x-auto">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xs text-text-secondary uppercase tracking-widest mb-4">
                No products found in the catalog.
              </p>
              <Button onClick={() => setShowForm(true)}>Add Your First Product</Button>
            </div>
          ) : (
            <table className="w-full text-left text-xs uppercase tracking-wider border-collapse">
              <thead>
                <tr className="bg-border/10 text-dark border-b border-border font-bold text-[10px]">
                  <th className="p-4 w-16">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Sale Price</th>
                  <th className="p-4">Custom?</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-primary">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-border/5 transition-colors">
                    <td className="p-4">
                      {product.images && product.images.length > 0 ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={product.images[0].imageUrl}
                          alt={product.name}
                          className="w-10 h-12 object-cover border border-border bg-border/20"
                        />
                      ) : (
                        <div className="w-10 h-12 bg-border/20 border border-border" />
                      )}
                    </td>
                    <td className="p-4 font-semibold text-dark normal-case">
                      <span className="block font-medium font-body">{product.name}</span>
                      <span className="text-[9px] text-text-secondary font-mono lowercase block mt-0.5">
                        {product.slug}
                      </span>
                    </td>
                    <td className="p-4 font-medium normal-case text-text-secondary">
                      {product.category?.name || "Uncategorized"}
                    </td>
                    <td className="p-4 font-bold text-dark">{formatPrice(product.basePrice)}</td>
                    <td className="p-4 font-bold text-success">
                      {product.salePrice ? formatPrice(product.salePrice) : "-"}
                    </td>
                    <td className="p-4">
                      {product.isCustomizable ? (
                        <Badge variant="gold">Bespoke</Badge>
                      ) : (
                        <span className="text-[10px] text-text-secondary">No</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setEditingProduct(product)
                            setShowForm(true)
                          }}
                          className="p-2 border border-border text-text-secondary hover:text-gold hover:border-gold transition-colors bg-white shadow-sm"
                          title="Edit Product"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeactivate(product.id)}
                          className="p-2 border border-border text-error hover:bg-error/10 hover:border-error transition-all bg-white shadow-sm"
                          title="Deactivate Product"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
