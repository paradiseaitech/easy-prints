"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Section, SectionHeader } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { EnquiryModal } from "@/components/shared/enquiry-modal"
import type { ProductData } from "@/lib/products"

interface BestSellersProps {
  products: ProductData[]
}

export function BestSellers({ products }: BestSellersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")

  const openQuoteModal = (productName: string) => {
    setSelectedProduct(productName)
    setIsModalOpen(true)
  }

  return (
    <Section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Best Sellers"
          subtitle="Our most popular printing services, trusted by thousands of corporate and retail customers."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.05}>
              <div className="group flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                {/* Product Image Panel */}
                <div className="aspect-[4/3] relative bg-gray-50/50 p-6 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="trending" className="bg-[#FF6B35] text-white border-none shadow-sm">
                      Best Seller
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {product.category.replace("-", " ")}
                    </span>
                    <h3 className="font-heading font-extrabold text-[#1A1A2E] text-lg group-hover:text-[#FF6B35] transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="text-xl font-black text-[#FF6B35]">₹{product.priceStarting}+</span>
                      <span className="text-[10px] text-gray-400 font-medium">starting price</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link href={`/${product.slug}`} className="w-full">
                        <Button className="w-full bg-[#1A1A2E] text-white hover:bg-[#FF6B35] rounded-xl text-xs font-semibold py-2.5 transition-all">
                          Customize Now
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => openQuoteModal(product.name)}
                        className="w-full border-gray-200 hover:border-[#FF6B35] hover:text-[#FF6B35] rounded-xl text-xs font-semibold py-2.5 transition-all gap-1.5"
                      >
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        Get Quote
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={selectedProduct}
      />
    </Section>
  )
}
