import { notFound } from "next/navigation"
import Link from "next/link"
import { getBusinessNeedsData } from "@/data/business-needs-data"
import { StructuredData } from "@/components/seo/structured-data"
import { breadcrumbSchema } from "@/lib/schema/product"
import { SITE } from "@/lib/constants"
import { BusinessNeedsClient } from "./business-needs-client"
import { ChevronRight } from "lucide-react"

export async function generateStaticParams() {
  const businessNeedsData = await getBusinessNeedsData()
  return Object.keys(businessNeedsData).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const businessNeedsData = await getBusinessNeedsData()
  const data = businessNeedsData[slug]
  if (!data) return {}

  return {
    title: `${data.title} Printing & Branding Solutions | Easy Prints Purnia`,
    description: data.description,
    keywords: [data.title.toLowerCase(), `business printing`, `corporate branding Purnia`, `industry print packs`],
    openGraph: {
      title: `${data.title} Solutions`,
      description: data.description,
      images: [{ url: data.bannerImage }],
    },
  }
}

export default async function BusinessNeedPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const businessNeedsData = await getBusinessNeedsData()
  const businessNeed = businessNeedsData[slug]
  if (!businessNeed) notFound()

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Business Needs", url: "/" },
    { name: businessNeed.title, url: `/business-needs/${businessNeed.slug}` },
  ]

  // Schema for business needs category
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${businessNeed.title} Solutions - Easy Prints`,
    "description": businessNeed.description,
    "numberOfItems": businessNeed.sections.reduce((acc, sec) => acc + sec.products.length, 0),
    "itemListElement": businessNeed.sections.flatMap((sec, sIdx) => 
      sec.products.map((prod, pIdx) => ({
        "@type": "ListItem",
        "position": sIdx * 10 + pIdx + 1,
        "url": `${SITE.url}/${prod.slug}`,
        "name": prod.name
      }))
    )
  }

  return (
    <>
      <StructuredData data={breadcrumbSchema(breadcrumbs)} />
      <StructuredData data={categorySchema} />

      {/* Industry Header Banner */}
      <div className="relative bg-gradient-to-br from-[#1A1A2E] to-[#16213E] text-white pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        {/* Background Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,107,53,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#FF6B35]/15 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-[#FF6B35] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-400">Business Needs</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#FF8F65] font-semibold">{businessNeed.title}</span>
          </nav>

          <div className="max-w-4xl">
            <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-widest bg-[#FF6B35]/10 border border-[#FF6B35]/20 px-3.5 py-1 rounded-full w-fit block mb-4">
              Industry Specific Branding
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
              {businessNeed.title}
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-300 leading-relaxed">
              {businessNeed.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main client component rendering sections and product lists */}
      <BusinessNeedsClient businessNeed={businessNeed} />
    </>
  )
}
