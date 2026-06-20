import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getAllProducts, getProductBySlug } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { StructuredData } from "@/components/seo/structured-data"
import { productSchema, breadcrumbSchema } from "@/lib/schema/product"
import { faqSchema } from "@/lib/schema/faq"
import { generateProductMetadata } from "@/lib/metadata/product"
import { SITE, FAQ_DATA } from "@/lib/constants"
import { ArrowRight, ChevronRight } from "lucide-react"
import { ProductDetailInteractive } from "@/components/product/product-detail-interactive"

export async function generateStaticParams() {
  const products = await getAllProducts()
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
  const product = await getProductBySlug(slug)
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
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: product.name, url: `/${product.slug}` },
  ]

  const productFAQs = FAQ_DATA.slice(0, 4)
  const allProducts = await getAllProducts()

  // Filter related products by category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

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

      {/* Breadcrumb section */}
      <div className="bg-gray-50 pt-28 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
            <Link href="/" className="hover:text-[#FF6B35] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#FF6B35] font-semibold">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main product overview */}
      <section className="pb-16 md:pb-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDetailInteractive product={product} />
        </div>
      </section>

      {/* Specifications & Technical Details */}
      {product.specs && product.specs.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-[#1A1A2E] mb-8 font-heading">
              Technical Specifications
            </h2>
            <div className="max-w-3xl border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm text-gray-500">
                <tbody className="divide-y divide-gray-100">
                  {product.specs.map((spec) => (
                    <tr key={spec.key} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#1A1A2E] bg-gray-50/50 w-1/3">
                        {spec.key}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-8 font-heading">
              Related Printing Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/${related.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-[4/3] relative bg-gray-50/50">
                    <Image
                      src={related.image}
                      alt={related.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-[#1A1A2E] group-hover:text-[#FF6B35] transition-colors truncate">
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

      {/* Dynamic FAQs */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-8 font-heading text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {productFAQs.map((faq, index) => (
              <details
                key={index}
                className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden group transition-all duration-300"
              >
                <summary className="p-5 font-semibold text-[#1A1A2E] cursor-pointer hover:text-[#FF6B35] transition-colors list-none flex items-center justify-between">
                  {faq.question}
                  <span className="w-5 h-5 rounded-full bg-gray-200/50 flex items-center justify-center group-open:rotate-90 transition-transform">
                    <ArrowRight className="w-3 h-3 text-gray-500" />
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
