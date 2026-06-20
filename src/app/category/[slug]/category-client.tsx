"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnquiryModal } from "@/components/shared/enquiry-modal"
import type { ProductData } from "@/lib/products"

interface CategoryPageClientProps {
  categoryName: string
  products: ProductData[]
}

export function CategoryPageClient({ categoryName, products }: CategoryPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")

  const openQuoteModal = (productName: string) => {
    setSelectedProduct(productName)
    setIsModalOpen(true)
  }

  return (
    <section className="py-16 md:py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 max-w-xl mx-auto">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#1A1A2E]">No Products Available</h3>
            <p className="text-sm text-gray-500 mt-2">
              We are currently updating our catalog for {categoryName}. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col justify-between bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden h-full"
              >
                {/* Image Panel */}
                <div className="aspect-[4/3] relative bg-gray-50/50 p-6 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Content Panel */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-heading font-extrabold text-xl text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>

                    {/* Features list snapshot */}
                    {product.features && product.features.length > 0 && (
                      <ul className="pt-3 space-y-1 text-xs text-gray-400">
                        {product.features.slice(0, 2).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-[#FF6B35]" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="text-2xl font-black text-[#FF6B35]">₹{product.priceStarting}+</span>
                      <span className="text-xs text-gray-400 font-medium">starting price</span>
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
        )}
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={selectedProduct}
        categoryName={categoryName}
      />
    </section>
  )
}
