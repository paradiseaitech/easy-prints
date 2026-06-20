import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  // Test queries using anon client
  const categoriesRes = await supabase.from("categories").select("id, name")
  const productsRes = await supabase.from("products").select("id, name")
  const testimonialsRes = await supabase.from("testimonials").select("id, name")
  const businessNeedsRes = await supabase.from("business_needs").select("slug, title")

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL: {
        exists: !!url,
        length: url.length,
        prefix: url ? url.substring(0, 25) + "..." : ""
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        exists: !!anon,
        length: anon.length,
        prefix: anon ? anon.substring(0, 15) + "..." : ""
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        exists: !!service,
        length: service.length
      }
    },
    queries: {
      categories: {
        count: categoriesRes.data?.length || 0,
        error: categoriesRes.error
      },
      products: {
        count: productsRes.data?.length || 0,
        error: productsRes.error
      },
      testimonials: {
        count: testimonialsRes.data?.length || 0,
        error: testimonialsRes.error
      },
      businessNeeds: {
        count: businessNeedsRes.data?.length || 0,
        error: businessNeedsRes.error
      }
    },
    nodeEnv: process.env.NODE_ENV
  })
}
