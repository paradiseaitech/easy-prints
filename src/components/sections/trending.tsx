"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, ArrowRight } from "lucide-react"
import { Section, SectionHeader } from "@/components/ui/section"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import type { ProductData } from "@/lib/products"

interface Props {
  products: ProductData[]
}

export function TrendingProducts({ products }: Props) {
  const trending = products.slice(0, 6)
  if (trending.length === 0) return null

  return (
    <Section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Trending Products"
          subtitle="Most ordered printing services by our customers in Purnia."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 0.1}>
              <Link
                href={`/${product.slug}`}
                className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="trending">Trending</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">(4.9)</span>
                  </div>
                  <h3 className="font-heading font-bold text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#FF6B35]">
                      ₹{product.priceStarting}+
                    </span>
                    <span className="text-sm text-[#FF6B35] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Get Quote <ArrowRight className="w-4 h-4" />
                    </span>
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
