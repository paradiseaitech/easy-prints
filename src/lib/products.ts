import { supabase } from "@/lib/supabase"

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
  isBestSeller?: boolean
  isFeatured?: boolean
  sizes?: string[]
  materials?: string[]
  specs?: { key: string; value: string }[]
  variations?: ProductVariation[]
}

export interface CategoryData {
  id: string
  name: string
  slug: string
  icon: string
  image: string
  description: string
}

// Product Helpers
export async function getAllProducts(): Promise<ProductData[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products from Supabase:", error)
      return []
    }
    return data || []
  } catch (err) {
    console.error("Failed to get all products:", err)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<ProductData | undefined> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("available", true)
      .maybeSingle()

    if (error) {
      console.error(`Error fetching product by slug ${slug}:`, error)
      return undefined
    }
    return data || undefined
  } catch (err) {
    console.error("Failed to get product by slug:", err)
    return undefined
  }
}

export async function getVariationBySlugs(categorySlug: string, variationSlug: string) {
  const product = await getProductBySlug(categorySlug)
  if (!product || !product.variations) return undefined
  const variation = product.variations.find((v) => v.slug === variationSlug)
  if (!variation) return undefined
  return { product, variation }
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductData[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", categorySlug)
      .eq("available", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(`Error fetching products by category ${categorySlug}:`, error)
      return []
    }
    return data || []
  } catch (err) {
    console.error("Failed to get products by category:", err)
    return []
  }
}

export async function getBestSellers(): Promise<ProductData[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("isBestSeller", true)
      .eq("available", true)

    if (error) {
      console.error("Error fetching best sellers:", error)
      return []
    }
    return data || []
  } catch (err) {
    console.error("Failed to get best sellers:", err)
    return []
  }
}

export async function getFeaturedProducts(): Promise<ProductData[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("isFeatured", true)
      .eq("available", true)

    if (error) {
      console.error("Error fetching featured products:", error)
      return []
    }
    return data || []
  } catch (err) {
    console.error("Failed to get featured products:", err)
    return []
  }
}

// Category Helpers
export async function getCategories(): Promise<CategoryData[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }
    return data || []
  } catch (err) {
    console.error("Failed to get categories:", err)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryData | undefined> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()

    if (error) {
      console.error(`Error fetching category ${slug}:`, error)
      return undefined
    }
    return data || undefined
  } catch (err) {
    console.error("Failed to get category by slug:", err)
    return undefined
  }
}
