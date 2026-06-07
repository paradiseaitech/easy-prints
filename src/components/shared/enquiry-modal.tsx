"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Phone, MessageCircle, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SITE } from "@/lib/constants"

interface EnquiryModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  categoryName?: string
}

export function EnquiryModal({ isOpen, onClose, productName, categoryName }: EnquiryModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    product: productName || "",
  })

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        product: productName,
      }))
      setSuccess(false)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen, productName])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate short network request for UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    const message = `Hello Easy Prints! I would like to enquire about:
    
*Product/Service:* ${formData.product}
${categoryName ? `*Category:* ${categoryName}` : ""}
*Name:* ${formData.name}
*Mobile:* ${formData.mobile}

Please share the pricing, MOQ, and timeline details.`

    const whatsappUrl = `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(message)}`
    
    setLoading(false)
    setSuccess(true)
    
    // Open WhatsApp in a new tab/window
    window.open(whatsappUrl, "_blank")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {!success ? (
              <>
                <div className="mb-6">
                  <h3 className="font-heading text-xl font-bold text-[#1A1A2E]">
                    Get a Quote
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Submit your details and get instant pricing for your print project.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="product" className="text-gray-700 font-medium">
                      Product Interested In
                    </Label>
                    <Input
                      id="product"
                      value={formData.product}
                      disabled
                      className="bg-gray-50 text-gray-500 font-medium border-gray-200 mt-1 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Your Name *
                    </Label>
                    <Input
                      id="name"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="mt-1 border-gray-200 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile" className="text-gray-700 font-medium">
                      Mobile Number *
                    </Label>
                    <Input
                      id="mobile"
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={(e) => handleChange("mobile", e.target.value)}
                      className="mt-1 border-gray-200 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full gap-2 bg-[#FF6B35] hover:bg-[#E55A2B] text-white" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-5 w-5" />
                          Submit &amp; Enquire on WhatsApp
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Phone className="h-3 w-3" />
                  <span>Or call us directly at {SITE.contact.phone}</span>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-8"
              >
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4 animate-bounce" />
                <h3 className="font-heading text-2xl font-bold text-[#1A1A2E]">
                  Enquiry Submitted!
                </h3>
                <p className="mt-2 text-sm text-gray-500 max-w-xs">
                  We have opened WhatsApp to connect you with our printing experts. Feel free to send the prefilled message.
                </p>
                <Button onClick={onClose} className="mt-6 bg-[#1A1A2E] hover:bg-[#111] text-white">
                  Close Window
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
