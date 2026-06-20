import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getCategoryBySlug, getProductsByCategory, getCategories } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { StructuredData } from "@/components/seo/structured-data"
import { breadcrumbSchema } from "@/lib/schema/product"
import { SITE } from "@/lib/constants"
import { CategoryPageClient } from "./category-client"
import { ChevronRight } from "lucide-react"

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((cat) => ({
    slug: cat.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}

  return {
    title: `${category.name} | Easy Prints Purnia`,
    description: category.description,
    keywords: [category.name.toLowerCase(), `printing category`, `print shop Purnia`],
    openGraph: {
      title: category.name,
      description: category.description,
      images: [{ url: category.image }],
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const products = await getProductsByCategory(slug)

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: category.name, url: `/category/${category.slug}` },
  ]

  return (
    <>
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />

      {/* Category Hero Header */}
      <div className="relative bg-gradient-to-br from-[#1A1A2E] to-[#16213E] text-white pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,107,53,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#FF6B35]/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-[#FF6B35] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#FF8F65] font-semibold">{category.name}</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {category.name}
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-300 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Product Catalog Grid (Client-side interactive for Quote modal) */}
      <CategoryPageClient categoryName={category.name} products={products} />
    </>
  )
}
