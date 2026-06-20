"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnquiryModal } from "@/components/shared/enquiry-modal"
import type { BusinessNeed } from "@/data/business-needs-data"

interface BusinessNeedsClientProps {
  businessNeed: BusinessNeed
}

export function BusinessNeedsClient({ businessNeed }: BusinessNeedsClientProps) {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")

  // Scroll Spy using IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null, // relative to viewport
      rootMargin: "-160px 0px -60% 0px", // triggers when section is in the top-middle of viewport (accounts for sticky headers)
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          const index = parseInt(id.replace("section-", ""))
          if (!isNaN(index)) {
            setActiveSectionIdx(index)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe each section element
    businessNeed.sections.forEach((_, index) => {
      const el = document.getElementById(`section-${index}`)
      if (el) observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [businessNeed.sections])

  const openQuoteModal = (productName: string) => {
    setSelectedProduct(productName)
    setIsModalOpen(true)
  }

  // Anchor scroll utility
  const scrollToSection = (index: number) => {
    setActiveSectionIdx(index)
    const element = document.getElementById(`section-${index}`)
    if (element) {
      const offset = 140 // offset for sticky headers (navbar + tab nav)
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <section className="bg-white min-h-screen pb-24">
      {/* Sticky Tab Navigation bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {businessNeed.sections.map((sec, index) => (
              <button
                key={sec.title}
                onClick={() => scrollToSection(index)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border ${
                  activeSectionIdx === index
                    ? "bg-[#1A1A2E] text-white border-transparent shadow-md"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stacked Product Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {businessNeed.sections.map((section, sIdx) => (
          <div
            key={section.title}
            id={`section-${sIdx}`}
            className="scroll-mt-36 space-y-8"
          >
            <div className="border-l-4 border-[#FF6B35] pl-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A2E] font-heading">
                {section.title}
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                Recommended for {businessNeed.title}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.products.map((product) => (
                <div
                  key={product.name}
                  className="group flex flex-col justify-between bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden h-full"
                >
                  {/* Image Display */}
                  <div className="aspect-[4/3] relative bg-gray-50/50 p-6 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Content Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-heading font-extrabold text-lg text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-lg font-black text-[#FF6B35]">₹{product.priceStarting}+</span>
                        <span className="text-[10px] text-gray-400 font-medium">Starting Price</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Link href={`/${product.slug}`} className="w-full">
                          <Button className="w-full bg-[#1A1A2E] text-white hover:bg-[#FF6B35] rounded-xl text-xs font-bold py-3 transition-colors">
                            Customize
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={() => openQuoteModal(product.name)}
                          className="w-full border-gray-200 hover:border-[#FF6B35] hover:text-[#FF6B35] rounded-xl text-xs font-bold py-3 transition-all gap-1.5"
                        >
                          <MessageCircle className="w-4 h-4 text-green-500" />
                          Get Quote
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={selectedProduct}
        categoryName={businessNeed.title}
      />
    </section>
  )
}
