import { supabase } from "@/lib/supabase"

export interface BusinessNeedProduct {
  name: string
  description: string
  priceStarting: number
  image: string
  slug: string
}

export interface BusinessNeedSection {
  title: string
  products: BusinessNeedProduct[]
}

export interface BusinessNeed {
  title: string
  slug: string
  tagline: string
  description: string
  bannerImage: string
  sections: BusinessNeedSection[]
}

export async function getBusinessNeedsData(): Promise<Record<string, BusinessNeed>> {
  try {
    const { data, error } = await supabase
      .from("business_needs")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Failed to read business_needs from Supabase:", error)
      return {}
    }

    const result: Record<string, BusinessNeed> = {}
    data?.forEach((item: any) => {
      result[item.slug] = {
        title: item.title,
        slug: item.slug,
        tagline: item.tagline,
        description: item.description,
        bannerImage: item.bannerImage,
        sections: item.sections || []
      }
    })
    return result
  } catch (error) {
    console.error("Failed to get business needs data:", error)
    return {}
  }
}
