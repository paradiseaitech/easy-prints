import { SITE } from "@/lib/constants"

interface ProductSchemaProps {
  name: string
  description: string
  image: string
  slug: string
  price: number
  currency?: string
  sku?: string
}

export function productSchema({
  name,
  description,
  image,
  slug,
  price,
  currency = "INR",
  sku,
}: ProductSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `${SITE.url}${image}`,
    sku: sku || slug,
    brand: {
      "@type": "Brand",
      name: SITE.name,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/${slug}`,
      priceCurrency: currency,
      price: price.toString(),
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE.name,
      },
    },
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  }
}
