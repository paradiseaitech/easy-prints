"use client"

import Link from "next/link"
import Image from "next/image"
import { Printer, Layers, Image as ImageIcon, Tv, ArrowRight } from "lucide-react"
import { Section, SectionHeader } from "@/components/ui/section"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { getCategories, CategoryData } from "@/lib/products"

const iconMap: Record<string, React.ReactNode> = {
  Printer: <Printer className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Image: <ImageIcon className="w-5 h-5" />,
  Tv: <Tv className="w-5 h-5" />,
}

interface PopularCategoriesProps {
  categories: CategoryData[]
}

export function PopularCategories({ categories }: PopularCategoriesProps) {
  return (
    <Section className="bg-gray-50/50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Popular Categories"
          subtitle="Explore our specialized corporate and retail printing solutions."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <ScrollReveal key={cat.id} delay={index * 0.1}>
              <Link
                href={`/category/${cat.slug}`}
                className="group relative block rounded-2xl bg-white border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full"
              >
                {/* Category Image Cover */}
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-gray-100">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Floating Icon Badge (Glassmorphic) */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg">
                    {iconMap[cat.icon] || <Printer className="w-5 h-5" />}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 relative flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors leading-tight">
                      {cat.name}
                    </h3>
                    <p className="mt-2 text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-[#FF6B35] group-hover:text-[#E55A2B]">
                    <span>Explore Products</span>
                    <span className="w-6 h-6 rounded-full bg-[#FF6B35]/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-3.5 h-3.5" />
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
