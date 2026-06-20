"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Check, Clock, Shield, MessageCircle, Phone, 
  Upload, FileText, ShoppingBag, Plus, Minus, 
  Calendar, CheckCircle2, ArrowRight, Sparkles 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SITE } from "@/lib/constants"
import { EnquiryModal } from "@/components/shared/enquiry-modal"
import type { ProductData } from "@/lib/products"

interface ProductDetailInteractiveProps {
  product: ProductData
}

export function ProductDetailInteractive({ product }: ProductDetailInteractiveProps) {
  // Option state selectors
  const sizes = product.sizes || ["Standard"]
  const [selectedSize, setSelectedSize] = useState(sizes[0])

  const materials = product.materials || ["Standard Material"]
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0])

  // Quantity stepper
  const moqString = product.specs?.find(s => s.key === "Minimum Order" || s.key === "MOQ")?.value || "1"
  const moqNum = parseInt(moqString.replace(/[^0-9]/g, "")) || 1
  const [quantity, setQuantity] = useState(moqNum)

  // Upload file state
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Quote Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate pricing
  const [price, setPrice] = useState(product.priceStarting)

  useEffect(() => {
    const sizeIndex = sizes.indexOf(selectedSize)
    const sizeMult = 1 + (sizeIndex >= 0 ? sizeIndex * 0.25 : 0)

    const matIndex = materials.indexOf(selectedMaterial)
    const matMult = 1 + (matIndex >= 0 ? matIndex * 0.35 : 0)

    const basePrice = product.priceStarting
    
    let computedPrice = basePrice * sizeMult * matMult
    
    // Proportional quantity factor
    if (quantity > moqNum) {
      const ratio = quantity / moqNum
      // Bulk discount: 15% discount for 2x MOQ, 30% discount for 5x MOQ
      const discount = ratio >= 5 ? 0.70 : ratio >= 2 ? 0.85 : 0.95
      computedPrice = computedPrice * ratio * discount
    } else {
      // Stepping below MOQ is prevented by UI, but handle just in case
      computedPrice = computedPrice * (quantity / moqNum)
    }

    setPrice(Math.round(computedPrice))
  }, [selectedSize, selectedMaterial, quantity, product.priceStarting, sizes, materials, moqNum])

  // Calculate delivery date (24-48 hrs in Purnia, let's say 2 days from today)
  const getDeliveryDateStr = () => {
    const delivery = new Date()
    delivery.setDate(delivery.getDate() + 2)
    return delivery.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  // Handle file drop/upload simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploading(true)
      setUploadSuccess(false)
      setUploadProgress(0)

      // Simulate network file upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setUploading(false)
            setUploadSuccess(true)
            return 100
          }
          return prev + 20
        })
      }, 150)
    }
  }

  // WhatsApp Message Generator
  const getWhatsAppMessage = () => {
    const specsText = `
*Product:* ${product.name}
*Size:* ${selectedSize}
*Material:* ${selectedMaterial}
*Quantity:* ${quantity} units
*Estimated Quote:* ₹${price}/-
${uploadSuccess && file ? `*Design File:* ${file.name} (Uploaded)` : "*Design File:* Will upload/share during discussion"}`

    const template = `Hi Easy Print,

I am interested in ordering:
${specsText}

Please review and share the official quotation and payment details.`

    return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(template)}`
  }

  const features = product.features?.length
    ? product.features
    : ["Premium quality printing", "Free design assistance", "Fast delivery in Purnia", "Bulk order discounts"]

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start mt-6">
      {/* Left: Product Images & Gallery */}
      <div className="lg:col-span-6 space-y-6">
        <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 overflow-hidden shadow-sm">
          <Image
            src={product.image}
            alt={`${product.name} - Easy Prints Purnia`}
            fill
            className="object-contain p-12 hover:scale-105 transition-transform duration-500"
            priority
          />
          <div className="absolute top-4 left-4">
            <Badge variant="primary" className="bg-[#FF6B35] text-white border-none shadow-sm">Popular</Badge>
          </div>
        </div>

        {/* Gallery Thumbnails (Static demonstrations since we have one image, but styled nicely) */}
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-2xl border-2 border-[#FF6B35] bg-gray-50 p-2 relative overflow-hidden cursor-pointer">
            <Image src={product.image} alt="Thumbnail 1" fill className="object-contain p-2" />
          </div>
          <div className="w-20 h-20 rounded-2xl border border-gray-100 bg-gray-50 p-2 relative overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
            <Image src={product.image} alt="Thumbnail 2" fill className="object-contain p-2 blur-[1px]" />
          </div>
        </div>

        {/* Brand/Trust guarantees list */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
          <h4 className="font-heading font-bold text-[#1A1A2E] text-sm">Easy Prints Guarantees</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-600">100% Quality Assured</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B35] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-600">24-48 Hr Production</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-600">Secure Packaging</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-gray-600">Free Design Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Customization Controls Panel */}
      <div className="lg:col-span-6 space-y-8">
        {/* Header Title & Pricing */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-100 w-fit block">
            {product.category.replace("-", " ")}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] leading-tight font-heading">
            {product.name} in Purnia
          </h1>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Interactive Customizer Panel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 space-y-6">
          <h3 className="font-heading font-extrabold text-lg text-[#1A1A2E] border-b border-gray-100 pb-3">
            Configure Your Print Order
          </h3>

          {/* Size Options */}
          {sizes.length > 0 && sizes[0] !== "Standard" && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-300 ${
                      selectedSize === sz
                        ? "bg-[#FF6B35] text-white border-transparent shadow-md shadow-orange-500/20"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Material Options */}
          {materials.length > 0 && materials[0] !== "Standard Material" && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                Select Paper / Material Stock
              </label>
              <div className="flex flex-wrap gap-2.5">
                {materials.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-300 ${
                      selectedMaterial === mat
                        ? "bg-[#FF6B35] text-white border-transparent shadow-md shadow-orange-500/20"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                Order Quantity
              </label>
              <span className="text-xs font-bold text-gray-400">
                MOQ: {moqNum} units
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-12">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(moqNum, q - (moqNum >= 50 ? 50 : 1)))}
                  className="px-4 h-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors flex items-center justify-center disabled:opacity-50"
                  disabled={quantity <= moqNum}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(moqNum, parseInt(e.target.value) || moqNum))}
                  className="w-16 h-full text-center text-sm font-bold text-[#1A1A2E] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + (moqNum >= 50 ? 50 : 1))}
                  className="px-4 h-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bulk discount tag */}
              {quantity >= moqNum * 2 && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-3.5 py-2 text-xs font-bold text-green-700 flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  Bulk Discount Applied!
                </div>
              )}
            </div>
          </div>

          {/* Design Upload Section */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
              Upload Your Artwork (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 hover:bg-gray-100/50 hover:border-orange-200 transition-all text-center relative cursor-pointer">
              <input
                type="file"
                id="designFile"
                accept=".pdf,.ai,.cdr,.psd,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              {!file ? (
                <div className="space-y-1">
                  <Upload className="w-7 h-7 text-gray-400 mx-auto" />
                  <p className="text-xs font-bold text-gray-700">Click or drag print-ready file here</p>
                  <p className="text-[10px] text-gray-400">PDF, AI, CDR, PSD, PNG, JPG (Max 50MB)</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center shrink-0">
                    {uploading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#FF6B35] border-t-transparent animate-spin" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-left max-w-xs min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{file.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {uploading ? `Uploading... ${uploadProgress}%` : "File attached successfully"}
                    </p>
                  </div>
                  {uploadSuccess && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto shrink-0" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pricing Box & Checkout CTAs */}
          <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Estimated Quote</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-[#FF6B35] tracking-tight">₹{price}/-</span>
                <span className="text-xs text-gray-400 font-medium">all-inclusive price</span>
              </div>
              
              {/* Dynamic Delivery Date */}
              <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 font-semibold">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>Estimated dispatch: {getDeliveryDateStr()}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 shrink-0 w-full md:w-auto">
              <a href={getWhatsAppMessage()} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full h-12 bg-[#FF6B35] hover:bg-[#E55A2B] text-white rounded-xl font-bold flex items-center justify-center gap-2 px-6 shadow-lg shadow-orange-500/20">
                  <MessageCircle className="w-5 h-5" />
                  Order on WhatsApp
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="w-full h-12 border-gray-200 hover:border-[#1A1A2E] hover:text-[#1A1A2E] rounded-xl font-bold text-xs"
              >
                Request Custom Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
      />
    </div>
  )
}
