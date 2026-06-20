import { SITE } from "@/lib/constants"
import { getAllProducts, getCategories } from "@/lib/products"
import { getBusinessNeedsData } from "@/data/business-needs-data"

export default async function sitemap() {
  const staticPages = [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE.url}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE.url}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE.url}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ]

  const activeProducts = (await getAllProducts()).filter((p) => p.available)
  const productPages = activeProducts.map((product) => ({
    url: `${SITE.url}/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const categories = await getCategories()
  const categoryPages = categories.map((cat) => ({
    url: `${SITE.url}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const businessNeedsData = await getBusinessNeedsData()
  const businessNeedsKeys = Object.keys(businessNeedsData)
  const businessNeedsPages = businessNeedsKeys.map((slug) => ({
    url: `${SITE.url}/business-needs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }))

  return [...staticPages, ...productPages, ...categoryPages, ...businessNeedsPages]
}
