import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, Clock, Shield, MessageCircle, Phone, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StructuredData } from "@/components/seo/structured-data"
import { productSchema, breadcrumbSchema } from "@/lib/schema/product"
import { faqSchema } from "@/lib/schema/faq"
import { generateProductMetadata } from "@/lib/metadata/product"
import { SITE, FAQ_DATA } from "@/lib/constants"
import { getAllProducts, getVariationBySlugs } from "@/lib/products"
import { InstantQuoteForm } from "@/components/shared/instant-quote-form"

export async function generateStaticParams() {
  const products = getAllProducts()
  const params: Array<{ slug: string; variationSlug: string }> = []
  for (const p of products) {
    if (p.variations) {
      for (const v of p.variations) {
        params.push({
          slug: p.slug,
          variationSlug: v.slug,
        })
      }
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; variationSlug: string }>
}) {
  const { slug, variationSlug } = await params
  const result = getVariationBySlugs(slug, variationSlug)
  if (!result) return {}

  const { product, variation } = result
  const keywords = (variation.keywords || product.keywords).split(",").map((k) => k.trim())

  return generateProductMetadata({
    name: `${variation.name} (${product.name})`,
    description: variation.description,
    slug: `${product.slug}/${variation.slug}`,
    keywords,
    city: "Purnia",
  })
}

export default async function VariationPage({
  params,
}: {
  params: Promise<{ slug: string; variationSlug: string }>
}) {
  const { slug, variationSlug } = await params
  const result = getVariationBySlugs(slug, variationSlug)
  if (!result) notFound()

  const { product, variation } = result

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: product.name, url: `/${product.slug}` },
    { name: variation.name, url: `/${product.slug}/${variation.slug}` },
  ]

  const productFAQs = FAQ_DATA.slice(0, 4)

  // Other variations in same category
  const otherFinishes = (product.variations || [])
    .filter((v) => v.slug !== variation.slug)
    .slice(0, 4)

  const features = variation.features?.length
    ? variation.features
    : product.features || ["Premium quality printing", "Free design assistance", "Fast delivery in Purnia", "Bulk order discounts"]

  return (
    <>
      <StructuredData data={productSchema({
        name: `${variation.name} - ${product.name}`,
        description: variation.description,
        image: variation.image,
        slug: `${product.slug}/${variation.slug}`,
        price: variation.priceStarting,
      })} />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <StructuredData data={faqSchema(productFAQs)} />

      {/* Breadcrumbs Section */}
      <div className="bg-gray-50 pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#FF6B35] transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${product.slug}`} className="hover:text-[#FF6B35] transition-colors">{product.name}</Link>
            <span>/</span>
            <span className="text-[#FF6B35] font-medium">{variation.name}</span>
          </nav>
        </div>
      </div>

      <section className="pb-16 md:pb-24 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link href={`/${product.slug}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF6B35] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to all {product.name}
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left: Product Image Showcase */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 overflow-hidden shadow-sm">
                <Image
                  src={variation.image}
                  alt={`${variation.name} - ${product.name} Easy Prints`}
                  fill
                  className="object-contain p-12 hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="primary">Premium</Badge>
                  <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">Quality Guaranteed</Badge>
                </div>
              </div>

              {/* Perks Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-50 text-center space-y-1">
                  <Clock className="w-5 h-5 text-[#FF6B35] mx-auto" />
                  <p className="text-xs font-bold text-[#1A1A2E]">Fast Delivery</p>
                  <p className="text-[10px] text-gray-400">24-48 hrs turn</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-50 text-center space-y-1">
                  <Shield className="w-5 h-5 text-[#FF6B35] mx-auto" />
                  <p className="text-xs font-bold text-[#1A1A2E]">Quality Assured</p>
                  <p className="text-[10px] text-gray-400">Premium checks</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-50 text-center space-y-1">
                  <Sparkles className="w-5 h-5 text-[#FF6B35] mx-auto" />
                  <p className="text-xs font-bold text-[#1A1A2E]">Design Support</p>
                  <p className="text-[10px] text-gray-400">Free assistance</p>
                </div>
              </div>
            </div>

            {/* Right: Specifications & Quick Quote Form */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
                  {product.category} &bull; {product.name}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mt-2 font-heading">
                  {variation.name}
                </h1>
                
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#FF6B35]">
                    ₹{variation.priceStarting}+
                  </span>
                  <span className="text-xs text-gray-400">Starting price per unit / min order</span>
                </div>
              </div>

              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                {variation.description}
              </p>

              {/* Key Features Checkmark */}
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Specifications &amp; Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-600 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Gen Form Block */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-[#1A1A2E] font-heading">Request a Free Quote</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Fill in your information and we will finalize details on WhatsApp.</p>
                </div>
                <InstantQuoteForm productName={`${variation.name} (${product.name})`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Finishes Showcase */}
      {otherFinishes.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#1A1A2E] font-heading">
                  Other {product.name} Finishes
                </h2>
                <p className="text-xs text-gray-400 mt-1">Explore different textures and custom print options.</p>
              </div>
              <Link href={`/${product.slug}`} className="text-sm font-bold text-[#FF6B35] hover:underline flex items-center gap-1">
                View All
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherFinishes.map((other) => (
                <Link
                  key={other.id}
                  href={`/${product.slug}/${other.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="aspect-[4/3] relative bg-gray-50 overflow-hidden">
                    <Image
                      src={other.image}
                      alt={other.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <h3 className="font-semibold text-xs text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors line-clamp-1">
                      {other.name}
                    </h3>
                    <span className="text-xs font-bold text-[#FF6B35] mt-1">
                      ₹{other.priceStarting}+
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
