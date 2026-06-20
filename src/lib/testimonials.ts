import { supabase } from "@/lib/supabase"

export interface TestimonialData {
  id: string
  name: string
  company: string
  rating: number
  text: string
  image: string
}

export async function getAllTestimonials(): Promise<TestimonialData[]> {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching testimonials from Supabase:", error)
      return []
    }
    return data || []
  } catch (err) {
    console.error("Failed to get testimonials:", err)
    return []
  }
}
