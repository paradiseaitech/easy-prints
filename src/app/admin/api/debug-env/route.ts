import { NextResponse } from "next/server"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

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
    nodeEnv: process.env.NODE_ENV
  })
}
