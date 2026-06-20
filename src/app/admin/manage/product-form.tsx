"use client"

import { useRef, useState } from "react"
import { addProduct, updateProduct } from "@/lib/admin-actions"
import { ImagePlus, Trash2, Plus, Sparkles } from "lucide-react"
import type { ProductData, CategoryData, ProductVariation } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { compressImage, fileToBase64 } from "@/lib/compress-image"

interface Props {
  product?: ProductData
  categories: CategoryData[]
}

export function ProductForm({ product, categories }: Props) {
  const isEditing = !!product
  const [preview, setPreview] = useState(product?.image || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Product Variations State
  const [variations, setVariations] = useState<ProductVariation[]>(product?.variations || [])
  
  // New Variation Form State
  const [newVarName, setNewVarName] = useState("")
  const [newVarDesc, setNewVarDesc] = useState("")
  const [newVarPrice, setNewVarPrice] = useState("")
  const [newVarImageBase64, setNewVarImageBase64] = useState("")
  const [newVarPreview, setNewVarPreview] = useState("")
  const varFileInputRef = useRef<HTMLInputElement>(null)
  
  // File compression state indicator
  const [compressing, setCompressing] = useState(false)

  const handleImageClick = () => fileInputRef.current?.click()

  // Compress and Preview Product Cover Image
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setCompressing(true)
        const compressed = await compressImage(file, 1000, 1000, 0.75)
        
        const reader = new FileReader()
        reader.onload = (ev) => setPreview(ev.target?.result as string)
        reader.readAsDataURL(compressed)

        // Replace file in input list using DataTransfer
        const dt = new DataTransfer()
        dt.items.add(compressed)
        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files
        }
      } catch (err) {
        console.error("Image compression error:", err)
      } finally {
        setCompressing(false)
      }
    }
  }

  // Compress and store new variation image
  const handleVarImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setCompressing(true)
        // Compress variation image smaller (400px is perfect for thumbnails)
        const compressed = await compressImage(file, 400, 400, 0.7)
        
        // Convert to Base64 for database serialization
        const base64 = await fileToBase64(compressed)
        setNewVarImageBase64(base64)
        setNewVarPreview(base64)
      } catch (err) {
        console.error("Variation image compression error:", err)
      } finally {
        setCompressing(false)
      }
    }
  }

  // Add variation handler
  const handleAddVariation = () => {
    if (!newVarName || !newVarPrice) {
      alert("Please fill in Variation Name and Price.")
      return
    }

    const varSlug = newVarName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const newVar: ProductVariation = {
      id: `var-${Date.now()}`,
      name: newVarName,
      slug: varSlug,
      description: newVarDesc,
      priceStarting: parseInt(newVarPrice) || 0,
      image: newVarImageBase64 || "/images/placeholder-card.svg",
    }

    setVariations((prev) => [...prev, newVar])
    
    // Reset forms
    setNewVarName("")
    setNewVarDesc("")
    setNewVarPrice("")
    setNewVarImageBase64("")
    setNewVarPreview("")
    if (varFileInputRef.current) varFileInputRef.current.value = ""
  }

  // Delete variation handler
  const handleDeleteVariation = (id: string) => {
    setVariations((prev) => prev.filter((v) => v.id !== id))
  }

  const sizesString = product?.sizes?.join(", ") || ""
  const materialsString = product?.materials?.join(", ") || ""
  const specsString = product?.specs?.map(s => `${s.key}: ${s.value}`).join("\n") || ""

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-8">
      <form
        action={isEditing ? updateProduct.bind(null, product!.id) : addProduct}
        className="space-y-6"
      >
        {/* Hidden variations payload */}
        <input type="hidden" name="variationsJson" value={JSON.stringify(variations)} />

        {/* Image Upload */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Product Cover Image</label>
            {compressing && <span className="text-xs text-orange-500 font-semibold animate-pulse">Compressing image...</span>}
          </div>
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
            className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#FF6B35] cursor-pointer transition-colors overflow-hidden bg-gray-50/50"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ImagePlus className="w-8 h-8 mb-2" />
                <span className="text-xs font-bold">Click to upload product image</span>
              </div>
            )}
          </div>
        </div>

        {/* Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
              Service Name *
            </label>
            <input
              name="name"
              required
              defaultValue={product?.name}
              placeholder="e.g. Premium Business Cards"
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
              Category *
            </label>
            <select
              name="category"
              required
              defaultValue={product?.category || categories[0]?.slug}
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & SEO Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
              Starting Price (₹) *
            </label>
            <input
              type="number"
              name="priceStarting"
              required
              min={0}
              defaultValue={product?.priceStarting}
              placeholder="e.g. 199"
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
              SEO Keywords
            </label>
            <input
              name="keywords"
              defaultValue={product?.keywords}
              placeholder="visiting card printing, business cards"
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
            Short Description *
          </label>
          <textarea
            name="description"
            required
            rows={3}
            defaultValue={product?.description}
            placeholder="Describe this printing service..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none resize-none"
          />
        </div>

        {/* Sizing and Materials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
              Size Options
            </label>
            <input
              name="sizes"
              defaultValue={sizesString}
              placeholder="Standard (3.5&quot; x 2&quot;), Square (2&quot; x 2&quot;)"
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-gray-400">Comma-separated options</p>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
              Material Options
            </label>
            <input
              name="materials"
              defaultValue={materialsString}
              placeholder="350 GSM Art Card, Velvet Matte Laminated"
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-gray-400">Comma-separated options</p>
          </div>
        </div>

        {/* Features & Technical Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
              Key Features (one per line)
            </label>
            <textarea
              name="features"
              rows={4}
              defaultValue={product?.features?.join("\n")}
              placeholder="Premium quality printing&#10;Free design assistance&#10;Fast delivery in Purnia"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
              Technical Specs (Format: Key: Value)
            </label>
            <textarea
              name="specs"
              rows={4}
              defaultValue={specsString}
              placeholder="Minimum Order: 100&#10;Dimensions: 3.5&quot; x 2.0&quot;&#10;Resolution: 300+ DPI"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Promotion Toggles */}
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isBestSeller"
              id="isBestSeller"
              value="true"
              defaultChecked={product?.isBestSeller}
              className="w-4 h-4 rounded text-[#FF6B35] focus:ring-[#FF6B35]"
            />
            <label htmlFor="isBestSeller" className="text-xs font-bold text-gray-600 cursor-pointer">
              Mark as Best Seller
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              value="true"
              defaultChecked={product?.isFeatured}
              className="w-4 h-4 rounded text-[#FF6B35] focus:ring-[#FF6B35]"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-gray-600 cursor-pointer">
              Feature on Homepage
            </label>
          </div>
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
              className="w-4.5 h-4.5 rounded text-[#FF6B35] focus:ring-[#FF6B35] border-gray-300"
            />
            <label htmlFor="available" className="text-xs font-bold text-gray-600 cursor-pointer">
              Service is active and visible on website
            </label>
          </div>
        )}

        {/* Variations (Sub-categories / Finishes) CRUD Management section */}
        <div className="border-t border-gray-100 pt-6 space-y-6">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-[#1A1A2E]">
              Product Variations (Sub-categories / Finishes)
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Add specialized options (e.g. Matte, Glossy, Foil cards) that appear on the product page.
            </p>
          </div>

          {/* List existing variations */}
          {variations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variations.map((v) => (
                <div key={v.id} className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-white overflow-hidden relative shrink-0 border border-gray-100">
                    <img src={v.image} alt={v.name} className="object-contain w-full h-full p-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{v.name}</h4>
                    <p className="text-[10px] text-[#FF6B35] font-black">Starting ₹{v.priceStarting}</p>
                    <p className="text-[9px] text-gray-400 truncate mt-0.5">{v.description || "No description"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteVariation(v.id)}
                    className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all shrink-0"
                    title="Delete variation"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-400 font-semibold">No variations added yet.</p>
            </div>
          )}

          {/* Inline Add Variation Form Card */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF6B35]" />
              Add New Finish / Variation
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Variation Name *</label>
                <input
                  type="text"
                  value={newVarName}
                  onChange={(e) => setNewVarName(e.target.value)}
                  placeholder="e.g. Spot UV & Gold Foil"
                  className="w-full h-10 rounded-xl border border-gray-200 px-3 text-xs focus:ring-2 focus:ring-[#FF6B35] focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Starting Price (₹) *</label>
                <input
                  type="number"
                  value={newVarPrice}
                  onChange={(e) => setNewVarPrice(e.target.value)}
                  placeholder="e.g. 499"
                  className="w-full h-10 rounded-xl border border-gray-200 px-3 text-xs focus:ring-2 focus:ring-[#FF6B35] focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Variation Description</label>
              <textarea
                value={newVarDesc}
                onChange={(e) => setNewVarDesc(e.target.value)}
                rows={2}
                placeholder="Explain the texture, materials, and suitability of this finish..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:ring-2 focus:ring-[#FF6B35] focus:outline-none resize-none bg-white"
              />
            </div>

            {/* Variation Image upload */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Variation Image</label>
                <input
                  ref={varFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleVarImageChange}
                  className="text-xs w-full"
                />
                <p className="text-[9px] text-gray-400 mt-1">Image will be compressed and embedded as Base64.</p>
              </div>
              {newVarPreview && (
                <div className="w-16 h-16 rounded-xl border border-gray-200 bg-white relative overflow-hidden shrink-0">
                  <img src={newVarPreview} alt="Preview" className="object-contain w-full h-full p-1" />
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={handleAddVariation}
              className="w-full h-10 bg-[#1A1A2E] hover:bg-[#FF6B35] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Variation
            </Button>
          </div>
        </div>

        {/* Submit Product Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-100">
          <Button
            type="submit"
            disabled={compressing}
            className="flex-1 h-12 bg-[#FF6B35] text-white hover:bg-[#E55A2B] font-bold rounded-xl disabled:opacity-50"
          >
            {compressing ? "Compressing..." : isEditing ? "Update Product" : "Create Product"}
          </Button>
          <a
            href="/admin/manage"
            className="flex-1 h-12 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center text-xs"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
