"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, MessageCircle, Sparkles, Search, Check, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE } from "@/lib/constants"
import { EnquiryModal } from "@/components/shared/enquiry-modal"
import type { ProductData } from "@/lib/products"

const floatingProducts = [
  { emoji: "🪪", delay: 0, x: "-10%", y: "10%" },
  { emoji: "👕", delay: 0.3, x: "25%", y: "5%" },
  { emoji: "🖼️", delay: 0.6, x: "-12%", y: "60%" },
  { emoji: "🎁", delay: 0.9, x: "20%", y: "55%" },
  { emoji: "☕", delay: 1.2, x: "0%", y: "30%" },
]

const trustIndicators = [
  { text: "Fast Delivery" },
  { text: "Premium Quality" },
  { text: "Bulk Orders" },
  { text: "Design Support" },
]

interface HeroSectionProps {
  products: ProductData[]
}

export function HeroSection({ products }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProductForModal, setSelectedProductForModal] = useState("Custom Printing")
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle clicking outside search suggestions to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredProducts = searchQuery.trim() === "" 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (filteredProducts.length > 0) {
      router.push(`/${filteredProducts[0].slug}`)
    }
  }

  const openQuoteModal = (productName: string) => {
    setSelectedProductForModal(productName)
    setIsModalOpen(true)
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,107,53,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating Product Emojis */}
      {floatingProducts.map((product) => (
        <motion.div
          key={product.emoji}
          className="absolute text-4xl md:text-6xl opacity-20 hidden md:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.2,
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { delay: product.delay, duration: 1 },
            scale: { delay: product.delay, duration: 1 },
            y: {
              delay: product.delay,
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{ left: product.x, top: product.y }}
        >
          {product.emoji}
        </motion.div>
      ))}

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#FF6B35]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#FF8F65]/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                <span className="text-xs md:text-sm text-white/90 font-semibold">
                  India&apos;s Premium Printing & Branding Platform
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight font-heading"
            >
              Everything <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8F65]">Prints</span> Here.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed"
            >
              Create high-quality visiting cards, banners, t-shirts, packaging boxes, and sign boards. Premium printing solutions delivered across Purnia and Bihar.
            </motion.p>

            {/* Interactive Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative max-w-md w-full"
              ref={searchRef}
            >
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <div className="absolute left-4 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search products (e.g. visiting cards, folders)..."
                  className="w-full h-14 bg-white/95 text-gray-800 placeholder-gray-400 pl-12 pr-4 rounded-2xl border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white shadow-xl transition-all font-medium"
                />
              </form>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && searchQuery.trim() !== "" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-72 overflow-y-auto"
                  >
                    {filteredProducts.length > 0 ? (
                      <div className="py-2 divide-y divide-gray-50">
                        {filteredProducts.map((product) => (
                          <Link
                            key={product.id}
                            href={`/${product.slug}`}
                            onClick={() => setShowSuggestions(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50/50 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden relative shrink-0 border border-gray-100">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-[#FF6B35] transition-colors truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-400 truncate capitalize">
                                {product.category.replace("-", " ")}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-bold text-[#FF6B35]">Starting</p>
                              <p className="text-xs font-bold text-gray-900">₹{product.priceStarting}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-400 font-medium">
                        No products match your search.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button
                size="xl"
                onClick={() => openQuoteModal("Custom Print Design")}
                className="gap-2 bg-[#FF6B35] text-white hover:bg-[#E55A2B] shadow-lg shadow-orange-500/20 font-bold"
              >
                Order Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="white"
                size="xl"
                onClick={() => openQuoteModal("Instant Quotation")}
                className="gap-2 font-bold text-[#1A1A2E]"
              >
                Get Quote
              </Button>
              <a
                href="/images/Easy Print_Catelog.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button
                  variant="outline"
                  size="xl"
                  className="gap-2 text-white border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <FileText className="w-5 h-5 text-[#FF8F65]" />
                  View Catalog (PDF)
                </Button>
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-white/10 max-w-xl"
            >
              {trustIndicators.map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-white/90">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-semibold tracking-wide">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual (Interactive design) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:col-span-5 lg:flex items-center justify-center relative"
          >
            <div className="relative w-full max-w-sm aspect-square">
              {/* Product Cards Showcase */}
              <div className="absolute top-0 right-0 w-56 h-72 bg-gradient-to-br from-[#FF6B35] to-[#FF8F65] rounded-3xl shadow-2xl overflow-hidden hover:rotate-2 transition-transform duration-500 cursor-pointer">
                <div className="p-5 text-white h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-white/20 rounded-xl mb-3 flex items-center justify-center text-xl shadow-inner">
                      🪪
                    </div>
                    <h3 className="font-bold text-lg mb-1 leading-snug">Premium Cards</h3>
                    <p className="text-white/80 text-xs leading-relaxed">Starting at just ₹199 for 100 matte cards.</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-xs">
                    <div className="flex justify-between text-white/90 mb-1"><span>Matte</span> <span>₹199</span></div>
                    <div className="flex justify-between text-white/90 mb-1"><span>Glossy</span> <span>₹249</span></div>
                    <div className="flex justify-between text-white/90"><span>Spot UV</span> <span>₹499</span></div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-48 h-64 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-3xl shadow-2xl border border-white/10 overflow-hidden text-white hover:-rotate-2 transition-transform duration-500 cursor-pointer">
                <div className="p-5 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-[#FF6B35]/20 text-[#FF6B35] rounded-xl mb-3 flex items-center justify-center text-xl">
                      👕
                    </div>
                    <h3 className="font-bold text-base mb-1">Custom Apparel</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">Vibrant, stretchable and machine washable prints.</p>
                  </div>
                  <div className="bg-white/5 rounded-xl py-2 px-3 border border-white/10 text-center hover:bg-white/10 transition-colors">
                    <span className="text-xs font-bold text-[#FF6B35]">Order Bulk & Save</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 right-8 w-44 h-52 bg-gradient-to-br from-[#0F3460] to-[#16213E] rounded-3xl shadow-2xl border border-white/10 text-white flex flex-col p-5 justify-between hover:scale-105 transition-transform duration-500 cursor-pointer">
                 <div>
                   <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full mb-3 flex items-center justify-center text-xl">
                     🚚
                   </div>
                   <h4 className="font-bold text-sm mb-1 leading-snug">Fast Delivery</h4>
                   <p className="text-gray-400 text-[11px] leading-snug">Same day printing & express delivery in Purnia.</p>
                 </div>
                 <div className="flex items-center gap-2 bg-[#1A1A2E] py-1.5 px-2.5 rounded-lg border border-white/5 w-fit">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-gray-300">Active Now</span>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={selectedProductForModal}
      />
    </section>
  )
}
