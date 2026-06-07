"use client"

import { useRef, useState } from "react"
import { addProduct, updateProduct } from "@/lib/admin-actions"
import { ImagePlus } from "lucide-react"
import type { ProductData } from "@/lib/products"

interface Props {
  product?: ProductData
}

export function ProductForm({ product }: Props) {
  const isEditing = !!product
  const [preview, setPreview] = useState(product?.image || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => fileInputRef.current?.click()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
      <form
        action={isEditing ? updateProduct.bind(null, product!.id) : addProduct}
        className="space-y-6"
      >
        {/* Image Upload */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Image</label>
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div
            onClick={handleImageClick}
            className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#FF6B35] cursor-pointer transition-colors overflow-hidden bg-gray-50"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ImagePlus className="w-10 h-10 mb-2" />
                <span className="text-sm">Click to upload image</span>
              </div>
            )}
          </div>
        </div>

        {/* Name & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Service Name *
            </label>
            <input
              name="name"
              required
              defaultValue={product?.name}
              placeholder="e.g. Premium Visiting Cards"
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Category *
            </label>
            <select
              name="category"
              required
              defaultValue={product?.category || "Stationery"}
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all bg-white"
            >
              <option value="Stationery">Stationery</option>
              <option value="Apparel">Apparel</option>
              <option value="Signage">Signage</option>
              <option value="Packaging">Packaging</option>
              <option value="Gifts">Gifts</option>
              <option value="Wedding">Wedding</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Starting Price (₹) *
          </label>
          <input
            type="number"
            name="priceStarting"
            required
            min={0}
            defaultValue={product?.priceStarting}
            placeholder="e.g. 199"
            className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Description *
          </label>
          <textarea
            name="description"
            required
            rows={3}
            defaultValue={product?.description}
            placeholder="Describe this printing service..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            SEO Keywords
          </label>
          <input
            name="keywords"
            defaultValue={product?.keywords}
            placeholder="visiting card printing, business cards, premium cards"
            className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
          />
          <p className="mt-1 text-xs text-gray-400">Comma-separated keywords</p>
        </div>

        {/* Features */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Features (one per line)
          </label>
          <textarea
            name="features"
            rows={4}
            defaultValue={product?.features?.join("\n")}
            placeholder="Premium quality printing&#10;Free design assistance&#10;Fast delivery in Purnia&#10;Bulk order discounts"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Status */}
        {isEditing && (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="available"
              id="available"
              value="true"
              defaultChecked={product?.available}
              className="w-5 h-5 rounded-lg border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
            />
            <label htmlFor="available" className="text-sm text-gray-700">
              Service is active and visible on website
            </label>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 h-12 bg-[#FF6B35] text-white rounded-xl font-medium hover:bg-[#E55A2B] transition-colors"
          >
            {isEditing ? "Update Service" : "Add Service"}
          </button>
          <a
            href="/admin/manage"
            className="flex-1 h-12 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center text-sm"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
