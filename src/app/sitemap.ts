import { SITE, PRODUCTS } from "@/lib/constants"

export default function sitemap() {
  const staticPages = [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE.url}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE.url}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE.url}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE.url}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
  ]

  const productPages = PRODUCTS.map((product) => ({
    url: `${SITE.url}/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const categoryPages = [
    "/category/apparel",
    "/category/stationery",
    "/category/signage",
    "/category/packaging",
    "/category/gifts",
    "/category/wedding",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}
