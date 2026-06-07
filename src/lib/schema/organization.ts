import { SITE } from "@/lib/constants"

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}${SITE.logo}`,
    description: SITE.description,
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.contact.phone,
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.contact.address.street,
      addressLocality: SITE.contact.address.city,
      addressRegion: SITE.contact.address.state,
      postalCode: SITE.contact.address.pincode,
      addressCountry: SITE.contact.address.country,
    },
    sameAs: Object.values(SITE.social),
  }
}
