"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { 
  deleteProduct, 
  toggleBestSeller, 
  toggleFeatured,
  addCategory,
  updateCategory,
  deleteCategory,
  addTestimonial,
  deleteTestimonial,
  updateBusinessNeed
} from "@/lib/admin-actions"
import { 
  Plus, Pencil, Trash2, ExternalLink, Package, 
  Layers, MessageCircle, Star, ImagePlus, CheckCircle, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProductData, CategoryData } from "@/lib/products"
import type { TestimonialData } from "@/lib/testimonials"
import type { BusinessNeed, BusinessNeedSection } from "@/data/business-needs-data"
import { compressImage, fileToBase64 } from "@/lib/compress-image"

interface Props {
  products: ProductData[]
  categories: CategoryData[]
  testimonials: TestimonialData[]
  businessNeeds: BusinessNeed[]
}

export function AdminDashboard({ products, categories, testimonials, businessNeeds }: Props) {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "testimonials" | "businessNeeds">("products")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Inline Category Form State
  const [showCatForm, setShowCatForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null)
  const [catImagePreview, setCatImagePreview] = useState("")
  const [compressingCat, setCompressingCat] = useState(false)
  const catFileInputRef = useRef<HTMLInputElement>(null)

  // Inline Testimonial Form State
  const [showTestForm, setShowTestForm] = useState(false)
  const [testImagePreview, setTestImagePreview] = useState("")
  const [compressingTest, setCompressingTest] = useState(false)
  const testFileInputRef = useRef<HTMLInputElement>(null)

  // Business Needs Form State
  const [editingNeed, setEditingNeed] = useState<BusinessNeed | null>(null)
  const [needBannerPreview, setNeedBannerPreview] = useState("")
  const [compressingNeedBanner, setCompressingNeedBanner] = useState(false)
  const needBannerInputRef = useRef<HTMLInputElement>(null)
  const [needSections, setNeedSections] = useState<BusinessNeedSection[]>([])

  // Section product add form state
  const [addingProductToSecIdx, setAddingProductToSecIdx] = useState<number | null>(null)
  const [newNpName, setNewNpName] = useState("")
  const [newNpDesc, setNewNpDesc] = useState("")
  const [newNpPrice, setNewNpPrice] = useState("")
  const [newNpSlug, setNewNpSlug] = useState("")
  const [newNpImageBase64, setNewNpImageBase64] = useState("")
  const [newNpPreview, setNewNpPreview] = useState("")
  const npFileInputRef = useRef<HTMLInputElement>(null)
  const [compressingNp, setCompressingNp] = useState(false)

  const handleCatImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setCompressingCat(true)
        const compressed = await compressImage(file, 1200, 800, 0.75)
        
        const reader = new FileReader()
        reader.onload = (ev) => setCatImagePreview(ev.target?.result as string)
        reader.readAsDataURL(compressed)

        const dt = new DataTransfer()
        dt.items.add(compressed)
        if (catFileInputRef.current) {
          catFileInputRef.current.files = dt.files
        }
      } catch (err) {
        console.error("Category image compression error:", err)
      } finally {
        setCompressingCat(false)
      }
    }
  }

  const handleTestImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setCompressingTest(true)
        const compressed = await compressImage(file, 300, 300, 0.75)
        
        const reader = new FileReader()
        reader.onload = (ev) => setTestImagePreview(ev.target?.result as string)
        reader.readAsDataURL(compressed)

        const dt = new DataTransfer()
        dt.items.add(compressed)
        if (testFileInputRef.current) {
          testFileInputRef.current.files = dt.files
        }
      } catch (err) {
        console.error("Testimonial image compression error:", err)
      } finally {
        setCompressingTest(false)
      }
    }
  }

  const handleNeedBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setCompressingNeedBanner(true)
        const compressed = await compressImage(file, 1200, 800, 0.75)
        
        const reader = new FileReader()
        reader.onload = (ev) => setNeedBannerPreview(ev.target?.result as string)
        reader.readAsDataURL(compressed)

        const dt = new DataTransfer()
        dt.items.add(compressed)
        if (needBannerInputRef.current) {
          needBannerInputRef.current.files = dt.files
        }
      } catch (err) {
        console.error("Need banner image compression error:", err)
      } finally {
        setCompressingNeedBanner(false)
      }
    }
  }

  const handleNpImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setCompressingNp(true)
        const compressed = await compressImage(file, 400, 300, 0.7)
        const base64 = await fileToBase64(compressed)
        setNewNpImageBase64(base64)
        setNewNpPreview(base64)
      } catch (err) {
        console.error("Section product image compression error:", err)
      } finally {
        setCompressingNp(false)
      }
    }
  }

  const handleToggleBestSeller = async (id: string) => {
    await toggleBestSeller(id)
    router.refresh()
  }

  const handleToggleFeatured = async (id: string) => {
    await toggleFeatured(id)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1A1A2E] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-[#FF6B35] font-black text-xl">EP</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1A1A2E] font-heading">Easy Prints Dashboard</h1>
                <p className="text-xs text-gray-500">Manage products, categories, reviews, and client inquiries</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-[#FF6B35] transition-colors px-3 py-2">
                View Website
              </Link>
              {activeTab === "products" && (
                <Link
                  href="/admin/manage/add"
                  className="inline-flex items-center justify-center gap-2 bg-[#FF6B35] text-white px-5 py-2.5 rounded-xl hover:bg-[#E55A2B] transition-colors text-sm font-semibold shadow-md shadow-orange-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-t border-gray-100 mt-6 pt-2 gap-4 overflow-x-auto whitespace-nowrap scrollbar-none flex-nowrap">
            {(["products", "categories", "testimonials", "businessNeeds"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-bold border-b-2 capitalize transition-all duration-300 shrink-0 ${
                  activeTab === tab
                    ? "border-[#FF6B35] text-[#FF6B35]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "businessNeeds" ? "Business Needs" : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Statistics Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-3xl font-extrabold text-[#1A1A2E] font-heading">{products.length}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Total Products</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-3xl font-extrabold text-green-600 font-heading">
              {products.filter((p) => p.isBestSeller).length}
            </p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Best Sellers</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-3xl font-extrabold text-blue-600 font-heading">
              {categories.length}
            </p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Categories</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-3xl font-extrabold text-yellow-500 font-heading">
              {testimonials.length}
            </p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Reviews</p>
          </div>
        </div>
      </div>

      {/* Dynamic Tab Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Tab 1: Products */}
        {activeTab === "products" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Starting Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Promotions</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden relative shrink-0 border border-gray-100">
                            <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#1A1A2E]">{product.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">/{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize text-sm text-gray-600">
                        {product.category.replace("-", " ")}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-sm text-[#FF6B35]">
                        ₹{product.priceStarting}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleToggleBestSeller(product.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                              product.isBestSeller 
                                ? "bg-orange-50 border-orange-200 text-[#FF6B35]" 
                                : "bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300"
                            }`}
                          >
                            Best Seller
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(product.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                              product.isFeatured 
                                ? "bg-blue-50 border-blue-200 text-blue-600" 
                                : "bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300"
                            }`}
                          >
                            Featured
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          product.available 
                            ? "bg-green-50 text-green-700" 
                            : "bg-red-50 text-red-700"
                        }`}>
                          {product.available ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/${product.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-gray-600" title="View details">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/manage/edit/${product.id}`} className="p-2 text-blue-500 hover:text-blue-600" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <form
                            action={async () => {
                              setDeleting(product.id)
                              await deleteProduct(product.id)
                            }}
                            onSubmit={(e) => {
                              if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) {
                                e.preventDefault()
                              }
                            }}
                          >
                            <button type="submit" disabled={deleting === product.id} className="p-2 text-red-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Categories */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#1A1A2E]">All Print Categories</h2>
              <button
                onClick={() => {
                  if (showCatForm && !editingCategory) {
                    setShowCatForm(false)
                  } else {
                    setEditingCategory(null)
                    setCatImagePreview("")
                    setShowCatForm(true)
                  }
                }}
                className="bg-[#1A1A2E] text-white hover:bg-[#FF6B35] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {showCatForm && !editingCategory ? "Close Form" : "Add New Category"}
              </button>
            </div>

            {/* Inline Add/Edit Category Form */}
            {showCatForm && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider">
                    {editingCategory ? `Edit Category: ${editingCategory.name}` : "Add New Category"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowCatForm(false)
                      setEditingCategory(null)
                      setCatImagePreview("")
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 font-bold"
                  >
                    Cancel
                  </button>
                </div>
                <form
                  key={editingCategory ? editingCategory.id : "new-category"}
                  action={async (formData) => {
                    setLoading(true)
                    try {
                      if (editingCategory) {
                        await updateCategory(editingCategory.id, formData)
                      } else {
                        await addCategory(formData)
                      }
                      setShowCatForm(false)
                      setEditingCategory(null)
                      setCatImagePreview("")
                      router.refresh()
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "An error occurred")
                    } finally {
                      setLoading(false)
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Category Name *</label>
                      <input 
                        name="name" 
                        required 
                        defaultValue={editingCategory?.name || ""} 
                        placeholder="e.g. UV Flatbed Printing" 
                        className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Lucide Icon name *</label>
                      <select 
                        name="icon" 
                        required 
                        defaultValue={editingCategory?.icon || "Printer"} 
                        className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                      >
                        <option value="Printer">Printer (Digital)</option>
                        <option value="Layers">Layers (Offset)</option>
                        <option value="Image">Image (Flex/UV)</option>
                        <option value="Tv">Tv (Signage)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Short Description *</label>
                    <textarea 
                      name="description" 
                      required 
                      rows={2} 
                      defaultValue={editingCategory?.description || ""} 
                      placeholder="Explain this category..." 
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none resize-none" 
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
                        Category Image Banner {editingCategory ? "(Optional)" : "*"}
                      </label>
                      {compressingCat && <span className="text-xs text-orange-500 font-semibold animate-pulse">Compressing...</span>}
                    </div>
                    <input
                      ref={catFileInputRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      required={!editingCategory}
                      onChange={handleCatImageChange}
                      className="text-xs"
                    />
                    {catImagePreview && (
                      <div className="mt-3 relative w-32 aspect-video bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <img src={catImagePreview} alt="Preview" className="object-cover w-full h-full" />
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={loading || compressingCat} className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white py-2.5 rounded-xl font-bold text-xs mt-2">
                    {loading ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
                  </Button>
                </form>
              </div>
            )}

            {/* Categories Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Image Banner</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Slug</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Icon Tag</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-24 aspect-video rounded-xl bg-gray-50 overflow-hidden relative border border-gray-100">
                            <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-sm text-[#1A1A2E]">{cat.name}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">/category/{cat.slug}</td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                            {cat.icon}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/category/${cat.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-gray-600" title="View Category">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategory(cat)
                                setCatImagePreview(cat.image)
                                setShowCatForm(true)
                              }}
                              className="p-2 text-blue-500 hover:text-blue-600"
                              title="Edit Category"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <form
                              action={async () => {
                                await deleteCategory(cat.id)
                                router.refresh()
                              }}
                              onSubmit={(e) => {
                                if (!confirm(`Delete category "${cat.name}"? Products under it will not be deleted but won't belong to any category.`)) {
                                  e.preventDefault()
                                }
                              }}
                            >
                              <button type="submit" className="p-2 text-red-400 hover:text-red-600" title="Delete Category">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Testimonials */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#1A1A2E]">Customer Testimonials</h2>
              <button
                onClick={() => setShowTestForm(!showTestForm)}
                className="bg-[#1A1A2E] text-white hover:bg-[#FF6B35] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {showTestForm ? "Close Form" : "Add Review"}
              </button>
            </div>

            {/* Inline Add Testimonial Form */}
            {showTestForm && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 max-w-2xl">
                <form
                  action={async (formData) => {
                    setLoading(true)
                    try {
                      await addTestimonial(formData)
                      setShowTestForm(false)
                      setTestImagePreview("")
                      router.refresh()
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "An error occurred")
                    } finally {
                      setLoading(false)
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Customer Name *</label>
                      <input name="name" required placeholder="e.g. John Doe" className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Business / Designation *</label>
                      <input name="company" required placeholder="e.g. Purnia Hospital" className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Star Rating *</label>
                      <select name="rating" required className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm bg-white focus:ring-2 focus:ring-[#FF6B35] focus:outline-none">
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Customer Photo (Optional)</label>
                        {compressingTest && <span className="text-xs text-orange-500 font-semibold animate-pulse">Compressing...</span>}
                      </div>
                      <input
                        ref={testFileInputRef}
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleTestImageChange}
                        className="text-xs mt-1"
                      />
                      {testImagePreview && (
                        <div className="mt-3 relative w-16 h-16 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                          <img src={testImagePreview} alt="Preview" className="object-cover w-full h-full" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Review Content *</label>
                    <textarea name="text" required rows={3} placeholder="Write customer review..." className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none resize-none" />
                  </div>

                  <Button type="submit" disabled={loading || compressingTest} className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white py-2.5 rounded-xl font-bold text-xs mt-2">
                    {loading ? "Adding..." : "Add Review"}
                  </Button>
                </form>
              </div>
            )}

            {/* Testimonials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((test) => (
                <div key={test.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <form
                        action={async () => {
                          await deleteTestimonial(test.id)
                          router.refresh()
                        }}
                      >
                        <button type="submit" className="text-red-400 hover:text-red-600 p-1" title="Delete Review">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic mb-6">
                      &ldquo;{test.text}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B35]/15 text-[#FF6B35] flex items-center justify-center font-bold text-xs shrink-0 relative overflow-hidden">
                      {test.image.startsWith("/images/avatar") ? (
                        test.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                      ) : (
                        <Image src={test.image} alt={test.name} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1A1A2E]">{test.name}</h4>
                      <p className="text-xs text-gray-400 font-semibold">{test.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Business Needs */}
        {activeTab === "businessNeeds" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#1A1A2E]">Top Business Needs Landing Pages</h2>
            </div>

            {/* Editing Form */}
            {editingNeed && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-[#1A1A2E]">
                      Edit Landing Page: {editingNeed.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Route: /business-needs/{editingNeed.slug}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingNeed(null)
                      setNeedBannerPreview("")
                      setNeedSections([])
                    }}
                    className="text-sm font-bold text-gray-400 hover:text-gray-600"
                  >
                    Close Editor
                  </button>
                </div>

                <form
                  key={editingNeed.slug}
                  action={async (formData) => {
                    setLoading(true)
                    try {
                      await updateBusinessNeed(editingNeed.slug, formData)
                      setEditingNeed(null)
                      setNeedBannerPreview("")
                      setNeedSections([])
                      router.refresh()
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Failed to update business need")
                    } finally {
                      setLoading(false)
                    }
                  }}
                  className="space-y-6"
                >
                  <input type="hidden" name="sectionsJson" value={JSON.stringify(needSections)} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Title *</label>
                      <input
                        name="title"
                        required
                        defaultValue={editingNeed.title}
                        className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Tagline *</label>
                      <input
                        name="tagline"
                        required
                        defaultValue={editingNeed.tagline}
                        className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Description *</label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      defaultValue={editingNeed.description}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#FF6B35] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Banner Image */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
                        Page Banner Image (Optional)
                      </label>
                      {compressingNeedBanner && (
                        <span className="text-xs text-orange-500 font-semibold animate-pulse">Compressing...</span>
                      )}
                    </div>
                    <input
                      ref={needBannerInputRef}
                      type="file"
                      name="bannerImage"
                      accept="image/*"
                      onChange={handleNeedBannerChange}
                      className="text-xs"
                    />
                    {needBannerPreview && (
                      <div className="mt-3 relative w-60 aspect-[3/1] bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <img src={needBannerPreview} alt="Preview" className="object-cover w-full h-full" />
                      </div>
                    )}
                  </div>

                  {/* Sections Manager */}
                  <div className="border-t border-gray-100 pt-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-heading font-extrabold text-base text-[#1A1A2E]">Sections & Products</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Customize the product lists shown to customers.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const title = prompt("Enter new section name (e.g. Office Stationery):")
                          if (title && title.trim()) {
                            setNeedSections((prev) => [...prev, { title: title.trim(), products: [] }])
                          }
                        }}
                        className="bg-[#1A1A2E] text-white hover:bg-[#FF6B35] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Section
                      </button>
                    </div>

                    {needSections.length > 0 ? (
                      <div className="space-y-6">
                        {needSections.map((sec, sIdx) => (
                          <div key={sIdx} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-xs text-gray-400 font-bold shrink-0">Section title:</span>
                                <input
                                  type="text"
                                  value={sec.title}
                                  onChange={(e) => {
                                    const newSecs = [...needSections]
                                    newSecs[sIdx].title = e.target.value
                                    setNeedSections(newSecs)
                                  }}
                                  className="font-bold text-sm text-gray-800 bg-white border border-gray-200 px-2 py-1 rounded focus:border-[#FF6B35] focus:outline-none w-full sm:w-auto"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove section "${sec.title}" and all its recommended products?`)) {
                                    setNeedSections((prev) => prev.filter((_, idx) => idx !== sIdx))
                                  }
                                }}
                                className="text-xs text-red-500 hover:text-red-600 font-bold self-end sm:self-auto"
                              >
                                Delete Section
                              </button>
                            </div>

                            {/* Section Products List */}
                            {sec.products.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sec.products.map((p, pIdx) => (
                                  <div key={pIdx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden relative shrink-0 border border-gray-100">
                                      <img src={p.image} alt={p.name} className="object-contain w-full h-full p-0.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="text-xs font-bold text-gray-900 truncate">{p.name}</h5>
                                      <p className="text-[10px] text-[#FF6B35] font-black">₹{p.priceStarting}+</p>
                                      <p className="text-[9px] text-gray-400 truncate">Links to: /{p.slug}</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newSecs = [...needSections]
                                        newSecs[sIdx].products = newSecs[sIdx].products.filter((_, idx) => idx !== pIdx)
                                        setNeedSections(newSecs)
                                      }}
                                      className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 shrink-0"
                                      title="Remove from recommendations"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 text-center py-2 italic">No recommended products in this section yet.</p>
                            )}

                            {/* Add Product Inline Trigger */}
                            {addingProductToSecIdx === sIdx ? (
                              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
                                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
                                  Add Product Recommendation
                                </h5>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="md:col-span-2">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Product Title *</label>
                                    <input
                                      type="text"
                                      value={newNpName}
                                      onChange={(e) => setNewNpName(e.target.value)}
                                      placeholder="e.g. Standard Visiting Cards"
                                      className="w-full h-9 rounded-lg border border-gray-200 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Starting Price (₹) *</label>
                                    <input
                                      type="number"
                                      value={newNpPrice}
                                      onChange={(e) => setNewNpPrice(e.target.value)}
                                      placeholder="e.g. 199"
                                      className="w-full h-9 rounded-lg border border-gray-200 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Brief Description *</label>
                                  <textarea
                                    value={newNpDesc}
                                    onChange={(e) => setNewNpDesc(e.target.value)}
                                    rows={2}
                                    placeholder="Brief description for this page layout..."
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B35] resize-none"
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Link to Primary Product *</label>
                                    <select
                                      value={newNpSlug}
                                      onChange={(e) => setNewNpSlug(e.target.value)}
                                      className="w-full h-9 rounded-lg border border-gray-200 px-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                                    >
                                      <option value="">-- Select Product --</option>
                                      {products.map((prod) => (
                                        <option key={prod.id} value={prod.slug}>
                                          {prod.name} (/{prod.slug})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Image *</label>
                                      {compressingNp && (
                                        <span className="text-[9px] text-orange-500 font-semibold animate-pulse">Compressing...</span>
                                      )}
                                    </div>
                                    <input
                                      ref={npFileInputRef}
                                      type="file"
                                      accept="image/*"
                                      onChange={handleNpImageChange}
                                      className="text-[10px] w-full"
                                    />
                                  </div>
                                </div>

                                {newNpPreview && (
                                  <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden relative bg-gray-50">
                                    <img src={newNpPreview} alt="Preview" className="object-contain w-full h-full" />
                                  </div>
                                )}

                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setAddingProductToSecIdx(null)}
                                    className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    disabled={compressingNp}
                                    onClick={() => {
                                      if (!newNpName || !newNpPrice || !newNpSlug) {
                                        alert("Name, Price, and Link Slug are required.")
                                        return
                                      }
                                      const newProduct = {
                                        name: newNpName,
                                        description: newNpDesc,
                                        priceStarting: parseInt(newNpPrice) || 0,
                                        image: newNpImageBase64 || "/images/placeholder-card.svg",
                                        slug: newNpSlug
                                      }
                                      const newSecs = [...needSections]
                                      newSecs[sIdx].products.push(newProduct)
                                      setNeedSections(newSecs)
                                      
                                      // Reset
                                      setNewNpName("")
                                      setNewNpDesc("")
                                      setNewNpPrice("")
                                      setNewNpSlug("")
                                      setNewNpImageBase64("")
                                      setNewNpPreview("")
                                      setAddingProductToSecIdx(null)
                                    }}
                                    className="px-3 py-1.5 bg-[#FF6B35] text-white hover:bg-[#E55A2B] rounded-lg text-xs font-bold flex items-center gap-1"
                                  >
                                    Add Recommendation
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAddingProductToSecIdx(sIdx)}
                                className="w-full py-2 border-2 border-dashed border-gray-200 hover:border-[#FF6B35] rounded-xl text-xs font-bold text-gray-400 hover:text-[#FF6B35] flex items-center justify-center gap-1 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Recommended Product
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-xs text-gray-400 font-semibold">No sections added to this landing page yet.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                    <Button
                      type="submit"
                      disabled={loading || compressingNeedBanner}
                      className="w-full sm:flex-1 h-12 bg-[#FF6B35] text-white hover:bg-[#E55A2B] font-bold rounded-xl disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Update Landing Page"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNeed(null)
                        setNeedBannerPreview("")
                        setNeedSections([])
                      }}
                      className="w-full sm:flex-1 h-12 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Business Needs List Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Banner Image</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tagline</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {businessNeeds.map((need) => (
                      <tr key={need.slug} className="hover:bg-gray-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-24 aspect-[3/1] rounded-xl bg-gray-50 overflow-hidden relative border border-gray-100">
                            <Image src={need.bannerImage} alt={need.title} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-sm text-[#1A1A2E]">{need.title}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{need.tagline}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">/business-needs/{need.slug}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/business-needs/${need.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-gray-600" title="View Page">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => {
                                setEditingNeed(need)
                                setNeedBannerPreview(need.bannerImage)
                                setNeedSections(need.sections || [])
                                setShowCatForm(false) // Close category form if open
                                window.scrollTo({ top: 300, behavior: "smooth" })
                              }}
                              className="p-2 text-blue-500 hover:text-blue-600"
                              title="Edit Page Content"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
