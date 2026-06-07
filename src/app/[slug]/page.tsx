import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getAllProducts, getProductBySlug } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StructuredData } from "@/components/seo/structured-data"
import { productSchema, breadcrumbSchema } from "@/lib/schema/product"
import { faqSchema } from "@/lib/schema/faq"
import { generateProductMetadata } from "@/lib/metadata/product"
import { SITE, FAQ_DATA } from "@/lib/constants"
import { MessageCircle, Phone, ArrowRight, Check, Clock, Shield } from "lucide-react"
import { VariationShowcase } from "@/components/product/variation-showcase"


export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}

  const keywords = product.keywords.split(",").map((k) => k.trim())
  return generateProductMetadata({
    name: product.name,
    description: product.description,
    slug: product.slug,
    keywords,
    city: "Purnia",
  })
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: product.name, url: `/${product.slug}` },
  ]

  const productFAQs = FAQ_DATA.slice(0, 4)
  const allProducts = getAllProducts()

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const features = product.features?.length
    ? product.features
    : ["Premium quality printing", "Free design assistance", "Fast delivery in Purnia", "Bulk order discounts"]

  return (
    <>
      <StructuredData data={productSchema({
        name: product.name,
        description: product.description,
        image: product.image,
        slug: product.slug,
        price: product.priceStarting,
      })} />
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <StructuredData data={faqSchema(productFAQs)} />

      <div className="bg-gray-50 pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#FF6B35] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#FF6B35]">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 overflow-hidden">
              <Image
                src={product.image}
                alt={`${product.name} - Easy Prints Purnia`}
                fill
                className="object-contain p-12"
                priority
              />
              <div className="absolute top-4 left-4">
                <Badge variant="primary">Popular</Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-[#FF6B35] uppercase tracking-wider">
                  {product.category}
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A2E] mt-2 font-heading">
                  {product.name} in Purnia
                </h1>
              </div>

              <p className="text-lg text-gray-500 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#FF6B35]">
                  ₹{product.priceStarting}+
                </span>
                <span className="text-sm text-gray-400">Starting price</span>
              </div>

              <div className="space-y-3 py-4 border-y border-gray-100">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(`Hi Easy Prints! I need a quote for ${product.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Get Instant Quote
                  </Button>
                </a>
                <a href={`tel:${SITE.contact.phone}`}>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Phone className="w-5 h-5" />
                    Call Now
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF6B35]" />
                  24-48 hrs delivery
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#FF6B35]" />
                  Quality assured
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VariationShowcase
        variations={product.variations}
        categorySlug={product.slug}
        categoryName={product.name}
      />

      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-8 font-heading">
              Related Printing Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/${related.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-square relative bg-gray-50">
                    <Image
                      src={related.image}
                      alt={related.name}
                      fill
                      className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors">
                      {related.name}
                    </h3>
                    <span className="text-sm font-bold text-[#FF6B35]">
                      ₹{related.priceStarting}+
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-8 font-heading text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {productFAQs.map((faq, index) => (
              <details
                key={index}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden group"
              >
                <summary className="p-5 font-semibold text-[#1A1A2E] cursor-pointer hover:text-[#FF6B35] transition-colors list-none flex items-center justify-between">
                  {faq.question}
                  <ArrowRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#FF6B35] to-[#FF8F65]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to Order {product.name}?
          </h2>
          <p className="mt-3 text-white/80">
            Get a free quote within minutes. Our team is here to help.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(`Hi Easy Prints! I want to order ${product.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-white text-[#FF6B35] hover:bg-gray-100 gap-2">
                <MessageCircle className="w-5 h-5" />
                Order on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
