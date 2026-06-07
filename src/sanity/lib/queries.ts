import { groq } from "next-sanity"

export const productsQuery = groq`
  *[_type == "product"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    category,
    description,
    priceStarting,
    "image": image.asset->url,
    keywords,
    deliveryTimeline,
    features,
    materials,
    faqs
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    category,
    description,
    priceStarting,
    "image": image.asset->url,
    "gallery": gallery[].asset->url,
    keywords,
    deliveryTimeline,
    features,
    materials,
    faqs
  }
`

export const categoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "image": image.asset->url
  }
`

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    name,
    company,
    rating,
    text,
    "avatar": avatar.asset->url
  }
`
