import fs from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "src", "data", "products.json")

export interface ProductVariation {
  id: string
  name: string
  slug: string
  description: string
  priceStarting: number
  image: string
  keywords?: string
  features?: string[]
}

export interface ProductData {
  id: string
  name: string
  slug: string
  category: string
  description: string
  priceStarting: number
  image: string
  keywords: string
  features: string[]
  available: boolean
  variations?: ProductVariation[]
}

export function getAllProducts(): ProductData[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function getProductBySlug(slug: string): ProductData | undefined {
  const products = getAllProducts()
  return products.find((p) => p.slug === slug && p.available)
}

export function getVariationBySlugs(categorySlug: string, variationSlug: string): { product: ProductData, variation: ProductVariation } | undefined {
  const product = getProductBySlug(categorySlug)
  if (!product || !product.variations) return undefined
  const variation = product.variations.find((v) => v.slug === variationSlug)
  if (!variation) return undefined
  return { product, variation }
}

