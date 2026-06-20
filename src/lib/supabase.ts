import { createClient } from "@supabase/supabase-js"

// Use placeholder credentials during build time if environment variables are not yet loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project-id.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key"

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn("WARNING: NEXT_PUBLIC_SUPABASE_URL is not set. Using placeholder URL for compilation.")
}

// Client for general public query operations (respects Row Level Security)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client using service role key to bypass RLS for dashboard actions (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
