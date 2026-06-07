"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Section, SectionHeader } from "@/components/ui/section"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import type { ProductData } from "@/lib/products"

const categoryColors = [
  "from-[#FF6B35] to-[#FF8F65]",
  "from-[#1A1A2E] to-[#16213E]",
  "from-[#0F3460] to-[#16213E]",
  "from-[#E55A2B] to-[#FF6B35]",
  "from-[#16213E] to-[#1A1A2E]",
  "from-[#FF8F65] to-[#FFB088]",
  "from-[#2D2D4E] to-[#1A1A2E]",
  "from-[#FF6B35] to-[#E55A2B]",
]

interface Props {
  products: ProductData[]
}

export function CategoryShowcase({ products }: Props) {
  if (products.length === 0) {
    return (
      <Section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center py-12">
          <p className="text-gray-400">No services added yet.</p>
        </div>
      </Section>
    )
  }

  return (
    <Section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Print Services"
          subtitle="From business essentials to creative projects — we print it all with premium quality."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.05}>
              <Link
                href={`/${product.slug}`}
                className="group relative block overflow-hidden rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[index % categoryColors.length]} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <ArrowUpRight className="w-5 h-5 text-[#1A1A2E]" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-bold text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400 font-medium">{product.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#FF6B35]">
                      Starting ₹{product.priceStarting}
                    </span>
                    <span className="text-xs text-gray-400">Get Quote →</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
