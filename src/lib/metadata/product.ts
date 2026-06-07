import { SITE } from "@/lib/constants"
import type { Metadata } from "next"

interface ProductMetadataProps {
  name: string
  description: string
  slug: string
  keywords: string[]
  city?: string
}

export function generateProductMetadata({
  name,
  description,
  slug,
  keywords,
  city = "Purnia",
}: ProductMetadataProps): Metadata {
  const fullDescription = `${description} Premium ${name.toLowerCase()} in ${city}, Bihar. ✓ Best Prices ✓ Fast Delivery ✓ Free Design Support. Order online today!`
  const title = `${name} in ${city} | Best Printing Services | Easy Prints`
  const canonicalUrl = `${SITE.url}/${slug}`

  return {
    title,
    description: fullDescription,
    keywords: [...keywords, `${name.toLowerCase()} in ${city}`, `printing shop in ${city}`, `printers in ${city}`].join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: fullDescription,
      url: canonicalUrl,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: [
        {
          url: `${SITE.url}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${name} - ${SITE.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: fullDescription,
      images: [`${SITE.url}/images/og-image.jpg`],
    },
  }
}
