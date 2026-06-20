const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")

// Load .env.local
const envPath = path.join(process.cwd(), ".env.local")
const env = {}

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8")
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) return
    const parts = trimmed.split("=")
    if (parts.length >= 2) {
      const key = parts[0].trim()
      const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "")
      env[key] = value
    }
  })
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  console.log("Please create a .env.local file with the following variables:")
  console.log("NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url")
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key")
  console.log("SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase()
  switch (ext) {
    case ".png": return "image/png"
    case ".jpg":
    case ".jpeg": return "image/jpeg"
    case ".svg": return "image/svg+xml"
    case ".webp": return "image/webp"
    default: return "application/octet-stream"
  }
}

// Upload a local file inside public/images to Supabase storage bucket
async function uploadLocalFile(localPath, supabaseFolder) {
  if (!localPath) return ""
  // If the path is already a remote URL (like a supabase url or external link), don't touch it
  if (localPath.startsWith("http://") || localPath.startsWith("https://") || localPath.startsWith("data:")) {
    return localPath
  }

  const relativePath = localPath.startsWith("/") ? localPath.slice(1) : localPath
  const fullLocalPath = path.join(process.cwd(), "public", relativePath)

  if (!fs.existsSync(fullLocalPath)) {
    console.warn(`[WARN] Local file not found: ${fullLocalPath}. Retaining original reference path.`)
    return localPath
  }

  const fileBuffer = fs.readFileSync(fullLocalPath)
  const filename = path.basename(fullLocalPath)
  const supabasePath = `${supabaseFolder}/${filename}`

  console.log(`[STORAGE] Uploading public/${relativePath} -> easy-prints/${supabasePath}...`)
  
  const { data, error } = await supabase.storage
    .from("easy-prints")
    .upload(supabasePath, fileBuffer, {
      contentType: getMimeType(filename),
      upsert: true
    })

  if (error) {
    console.error(`[ERROR] Failed to upload ${filename} to Supabase:`, error.message)
    return localPath
  }

  const { data: urlData } = supabase.storage
    .from("easy-prints")
    .getPublicUrl(supabasePath)

  return urlData.publicUrl
}

async function migrate() {
  console.log("=== STARTING SUPABASE MIGRATION & SEEDING ===")

  // 1. Migrate Categories
  console.log("\n--- Migrating Categories ---")
  const categoriesPath = path.join(process.cwd(), "src", "data", "categories.json")
  if (fs.existsSync(categoriesPath)) {
    const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"))
    for (const cat of categories) {
      console.log(`Processing category: ${cat.name}`)
      cat.image = await uploadLocalFile(cat.image, "categories")
      
      const { error } = await supabase
        .from("categories")
        .upsert({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          image: cat.image,
          description: cat.description
        }, { onConflict: "slug" })

      if (error) console.error(`[DB ERROR] Inserting category ${cat.name}:`, error.message)
      else console.log(`[DB] Successfully migrated category: ${cat.name}`)
    }
  } else {
    console.log("categories.json not found, skipping.")
  }

  // 2. Migrate Testimonials
  console.log("\n--- Migrating Testimonials ---")
  const testimonialsPath = path.join(process.cwd(), "src", "data", "testimonials.json")
  if (fs.existsSync(testimonialsPath)) {
    const testimonials = JSON.parse(fs.readFileSync(testimonialsPath, "utf-8"))
    for (const test of testimonials) {
      console.log(`Processing testimonial: ${test.name}`)
      test.image = await uploadLocalFile(test.image, "testimonials")

      const { error } = await supabase
        .from("testimonials")
        .upsert({
          id: test.id,
          name: test.name,
          company: test.company,
          rating: test.rating,
          text: test.text,
          image: test.image
        }, { onConflict: "id" })

      if (error) console.error(`[DB ERROR] Inserting testimonial ${test.name}:`, error.message)
      else console.log(`[DB] Successfully migrated testimonial: ${test.name}`)
    }
  } else {
    console.log("testimonials.json not found, skipping.")
  }

  // 3. Migrate Products
  console.log("\n--- Migrating Products ---")
  const productsPath = path.join(process.cwd(), "src", "data", "products.json")
  if (fs.existsSync(productsPath)) {
    const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"))
    for (const prod of products) {
      console.log(`Processing product: ${prod.name}`)
      prod.image = await uploadLocalFile(prod.image, "products")

      // Process product variations images
      if (prod.variations && Array.isArray(prod.variations)) {
        for (const variation of prod.variations) {
          variation.image = await uploadLocalFile(variation.image, "products")
        }
      }

      const { error } = await supabase
        .from("products")
        .upsert({
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          category: prod.category,
          description: prod.description,
          priceStarting: prod.priceStarting,
          image: prod.image,
          keywords: prod.keywords || "",
          features: prod.features || [],
          available: prod.available !== false,
          isBestSeller: prod.isBestSeller === true,
          isFeatured: prod.isFeatured === true,
          sizes: prod.sizes || [],
          materials: prod.materials || [],
          specs: prod.specs || [],
          variations: prod.variations || []
        }, { onConflict: "slug" })

      if (error) console.error(`[DB ERROR] Inserting product ${prod.name}:`, error.message)
      else console.log(`[DB] Successfully migrated product: ${prod.name}`)
    }
  } else {
    console.log("products.json not found, skipping.")
  }

  // 4. Migrate Business Needs
  console.log("\n--- Migrating Business Needs ---")
  const businessNeedsPath = path.join(process.cwd(), "src", "data", "business-needs.json")
  if (fs.existsSync(businessNeedsPath)) {
    const businessNeedsObj = JSON.parse(fs.readFileSync(businessNeedsPath, "utf-8"))
    for (const slug of Object.keys(businessNeedsObj)) {
      const need = businessNeedsObj[slug]
      console.log(`Processing business need page: ${need.title}`)
      need.bannerImage = await uploadLocalFile(need.bannerImage, "business-needs")

      // Process sections products images
      if (need.sections && Array.isArray(need.sections)) {
        for (const section of need.sections) {
          if (section.products && Array.isArray(section.products)) {
            for (const prod of section.products) {
              prod.image = await uploadLocalFile(prod.image, "business-needs")
            }
          }
        }
      }

      const { error } = await supabase
        .from("business_needs")
        .upsert({
          slug: need.slug,
          title: need.title,
          tagline: need.tagline,
          description: need.description,
          bannerImage: need.bannerImage,
          sections: need.sections || []
        }, { onConflict: "slug" })

      if (error) console.error(`[DB ERROR] Inserting business need ${need.title}:`, error.message)
      else console.log(`[DB] Successfully migrated business need page: ${need.title}`)
    }
  } else {
    console.log("business-needs.json not found, skipping.")
  }

  console.log("\n=== SUPABASE MIGRATION COMPLETED SUCCESSFULLY ===")
}

migrate().catch((err) => {
  console.error("Migration encountered a fatal error:", err)
})
