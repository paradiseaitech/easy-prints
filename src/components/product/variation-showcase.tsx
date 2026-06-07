"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check, MessageCircle, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnquiryModal } from "@/components/shared/enquiry-modal"
import { SITE } from "@/lib/constants"
import type { ProductVariation } from "@/lib/products"

interface Props {
  variations?: ProductVariation[]
  categorySlug: string
  categoryName: string
}

export function VariationShowcase({ variations, categorySlug, categoryName }: Props) {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!variations || variations.length === 0) return null

  const handleOpenQuote = (variation: ProductVariation) => {
    setSelectedVariation(variation)
    setIsModalOpen(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#FF6B35] tracking-widest uppercase px-3 py-1 rounded-full bg-[#FF6B35]/10">
            Premium Varieties
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-[#1A1A2E] mt-3">
            Explore {categoryName} Finishes
          </h2>
          <p className="mt-4 text-gray-500 text-base md:text-lg">
            Choose from our curated selection of premium textures, materials, and styles to elevate your print branding.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {variations.map((variation) => (
            <motion.div
              key={variation.id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container with Zoom Effect */}
              <div className="aspect-[4/3] relative bg-gray-50 overflow-hidden">
                <Image
                  src={variation.image}
                  alt={`${variation.name} mockup - Easy Prints`}
                  fill
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-bold bg-[#1A1A2E] text-white px-3 py-1 rounded-full">
                    Starting ₹{variation.priceStarting}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold font-heading text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors">
                  {variation.name}
                </h3>
                <p className="text-gray-500 text-sm mt-2 flex-grow line-clamp-3">
                  {variation.description}
                </p>

                {/* Features list */}
                {variation.features && (
                  <div className="mt-4 space-y-2 pt-4 border-t border-gray-50">
                    {variation.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action CTA Block */}
                <div className="mt-6 space-y-3 pt-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpenQuote(variation)}
                      className="flex-1 bg-[#1A1A2E] hover:bg-[#FF6B35] text-white hover:text-white transition-all font-semibold rounded-xl text-sm"
                    >
                      Get Quote
                    </Button>
                    <a
                      href={`https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(
                        `Hi Easy Prints! I am interested in ${variation.name} (${categoryName}). Please share details.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-11 h-11 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-colors shrink-0"
                      title="Enquire on WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  </div>

                  <Link
                    href={`/${categorySlug}/${variation.slug}`}
                    className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-[#FF6B35] font-semibold transition-colors py-1"
                  >
                    <span>View Specifications &amp; Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {selectedVariation && (
        <EnquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productName={selectedVariation.name}
          categoryName={categoryName}
        />
      )}
    </section>
  )
}
