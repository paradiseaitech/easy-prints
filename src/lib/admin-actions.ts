"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "./supabase"
import { getAllProducts, ProductData, CategoryData } from "./products"
import { getAllTestimonials, TestimonialData } from "./testimonials"
import { getBusinessNeedsData, BusinessNeed } from "@/data/business-needs-data"

// Authentication
export async function authenticateAdmin(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"
  return password === adminPassword
}

// Upload file to Supabase Storage and return its public URL
async function uploadToSupabase(file: File, folder: string, prefix: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = file.name.split(".").pop() || "png"
  const filename = `${folder}/${prefix}-${Date.now()}.${ext}`

  const { data, error } = await supabaseAdmin.storage
    .from("easy-prints")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (error) {
    throw new Error(`Failed to upload image to Supabase: ${error.message}`)
  }

  const { data: urlData } = supabaseAdmin.storage
    .from("easy-prints")
    .getPublicUrl(filename)

  return urlData.publicUrl
}

// Convert base64 uploaded image data and save to Supabase Storage
async function uploadBase64ToSupabase(base64Str: string, folder: string, prefix: string): Promise<string> {
  if (!base64Str.startsWith("data:image/")) {
    // If it's already a URL, return it directly
    return base64Str
  }

  const matches = base64Str.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/)
  if (!matches || matches.length < 3) {
    throw new Error("Invalid base64 string format")
  }

  const mimeType = matches[1]
  const base64Data = matches[2]
  const buffer = Buffer.from(base64Data, "base64")
  const ext = mimeType.split("/")[1] || "png"
  const filename = `${folder}/${prefix}-${Date.now()}.${ext}`

  const { data, error } = await supabaseAdmin.storage
    .from("easy-prints")
    .upload(filename, buffer, {
      contentType: mimeType,
      upsert: true,
    })

  if (error) {
    throw new Error(`Failed to upload base64 to Supabase: ${error.message}`)
  }

  const { data: urlData } = supabaseAdmin.storage
    .from("easy-prints")
    .getPublicUrl(filename)

  return urlData.publicUrl
}

// Product Actions
export async function getProducts(): Promise<ProductData[]> {
  return getAllProducts()
}

export async function getProduct(id: string): Promise<ProductData | undefined> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) {
      console.error("Error fetching product by ID:", error)
      return undefined
    }
    return data || undefined
  } catch (err) {
    console.error("Failed to get product:", err)
    return undefined
  }
}

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const priceStarting = parseInt(formData.get("priceStarting") as string) || 0
  const keywords = formData.get("keywords") as string
  const featuresRaw = formData.get("features") as string
  const sizesRaw = formData.get("sizes") as string
  const materialsRaw = formData.get("materials") as string
  const specsRaw = formData.get("specs") as string
  const isBestSeller = formData.get("isBestSeller") === "true"
  const isFeatured = formData.get("isFeatured") === "true"
  const imageFile = formData.get("image") as File

  // Variations array parsed from JSON
  const variationsJson = formData.get("variationsJson") as string
  const variations = variationsJson ? JSON.parse(variationsJson) : undefined

  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  let imagePath = "/images/placeholder-card.svg"

  if (imageFile && imageFile.size > 0) {
    imagePath = await uploadToSupabase(imageFile, "products", slug)
  }

  // Handle upload of base64 images inside variations
  if (variations && Array.isArray(variations)) {
    for (const v of variations) {
      if (v.image && v.image.startsWith("data:image/")) {
        v.image = await uploadBase64ToSupabase(v.image, "products", `var-${v.slug}`)
      }
    }
  }

  const features = featuresRaw
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)

  const sizes = sizesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const materials = materialsRaw
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean)

  const specs = specsRaw
    .split("\n")
    .map((line) => {
      const parts = line.split(":")
      if (parts.length >= 2) {
        return { key: parts[0].trim(), value: parts.slice(1).join(":").trim() }
      }
      return null
    })
    .filter((s): s is { key: string; value: string } => s !== null)

  const id = slug

  const { error } = await supabaseAdmin
    .from("products")
    .insert({
      id,
      name,
      slug,
      category,
      description,
      priceStarting,
      image: imagePath,
      keywords,
      features,
      available: true,
      isBestSeller,
      isFeatured,
      sizes: sizes.length > 0 ? sizes : [],
      materials: materials.length > 0 ? materials : [],
      specs: specs.length > 0 ? specs : [],
      variations: variations && variations.length > 0 ? variations : [],
    })

  if (error) {
    throw new Error(`Failed to save product to Supabase: ${error.message}`)
  }

  revalidatePath("/")
  revalidatePath("/admin/manage")
  revalidatePath(`/${slug}`)
  revalidatePath(`/category/${category}`)
  return { success: true, slug }
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const priceStarting = parseInt(formData.get("priceStarting") as string) || 0
  const keywords = formData.get("keywords") as string
  const featuresRaw = formData.get("features") as string
  const sizesRaw = formData.get("sizes") as string
  const materialsRaw = formData.get("materials") as string
  const specsRaw = formData.get("specs") as string
  const isBestSeller = formData.get("isBestSeller") === "true"
  const isFeatured = formData.get("isFeatured") === "true"
  const imageFile = formData.get("image") as File
  const available = formData.get("available") === "true"

  // Variations array parsed from JSON
  const variationsJson = formData.get("variationsJson") as string
  const variations = variationsJson ? JSON.parse(variationsJson) : undefined

  // Fetch current product to check current image path
  const currentProduct = await getProduct(id)
  if (!currentProduct) throw new Error("Product not found")

  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  let imagePath = currentProduct.image

  if (imageFile && imageFile.size > 0) {
    imagePath = await uploadToSupabase(imageFile, "products", slug)
  }

  // Handle upload of base64 images inside variations
  if (variations && Array.isArray(variations)) {
    for (const v of variations) {
      if (v.image && v.image.startsWith("data:image/")) {
        v.image = await uploadBase64ToSupabase(v.image, "products", `var-${v.slug}`)
      }
    }
  }

  const features = featuresRaw
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)

  const sizes = sizesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const materials = materialsRaw
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean)

  const specs = specsRaw
    .split("\n")
    .map((line) => {
      const parts = line.split(":")
      if (parts.length >= 2) {
        return { key: parts[0].trim(), value: parts.slice(1).join(":").trim() }
      }
      return null
    })
    .filter((s): s is { key: string; value: string } => s !== null)

  const oldCategory = currentProduct.category

  const { error } = await supabaseAdmin
    .from("products")
    .update({
      name,
      slug,
      category,
      description,
      priceStarting,
      image: imagePath,
      keywords,
      features,
      available,
      isBestSeller,
      isFeatured,
      sizes: sizes.length > 0 ? sizes : [],
      materials: materials.length > 0 ? materials : [],
      specs: specs.length > 0 ? specs : [],
      variations: variations && variations.length > 0 ? variations : [],
    })
    .eq("id", id)

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`)
  }

  revalidatePath("/")
  revalidatePath("/admin/manage")
  revalidatePath(`/${slug}`)
  revalidatePath(`/${currentProduct.slug}`)
  revalidatePath(`/category/${category}`)
  revalidatePath(`/category/${oldCategory}`)
  return { success: true, slug }
}

export async function deleteProduct(id: string) {
  const currentProduct = await getProduct(id)
  if (!currentProduct) throw new Error("Product not found")

  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`)
  }

  revalidatePath("/")
  revalidatePath("/admin/manage")
  if (currentProduct) {
    revalidatePath(`/${currentProduct.slug}`)
    revalidatePath(`/category/${currentProduct.category}`)
  }
  return { success: true }
}

export async function toggleBestSeller(id: string) {
  const currentProduct = await getProduct(id)
  if (currentProduct) {
    const { error } = await supabaseAdmin
      .from("products")
      .update({ isBestSeller: !currentProduct.isBestSeller })
      .eq("id", id)

    if (error) {
      console.error("Failed to toggle best seller:", error)
      return
    }

    revalidatePath("/")
    revalidatePath("/admin/manage")
  }
}

export async function toggleFeatured(id: string) {
  const currentProduct = await getProduct(id)
  if (currentProduct) {
    const { error } = await supabaseAdmin
      .from("products")
      .update({ isFeatured: !currentProduct.isFeatured })
      .eq("id", id)

    if (error) {
      console.error("Failed to toggle featured:", error)
      return
    }

    revalidatePath("/")
    revalidatePath("/admin/manage")
  }
}

// Category Actions
export async function addCategory(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const icon = formData.get("icon") as string
  const imageFile = formData.get("image") as File

  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  let imagePath = "/images/placeholder-banner.svg"

  if (imageFile && imageFile.size > 0) {
    imagePath = await uploadToSupabase(imageFile, "categories", slug)
  }

  const id = slug

  const { error } = await supabaseAdmin
    .from("categories")
    .insert({
      id,
      name,
      slug,
      icon,
      image: imagePath,
      description,
    })

  if (error) {
    throw new Error(`Failed to add category: ${error.message}`)
  }

  revalidatePath("/")
  revalidatePath("/admin/manage")
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const { data: currentCategory, error: getErr } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (getErr || !currentCategory) throw new Error("Category not found")

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const icon = formData.get("icon") as string
  const imageFile = formData.get("image") as File

  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  let imagePath = currentCategory.image

  if (imageFile && imageFile.size > 0) {
    imagePath = await uploadToSupabase(imageFile, "categories", slug)
  }

  const oldSlug = currentCategory.slug

  const { error } = await supabaseAdmin
    .from("categories")
    .update({
      name,
      slug,
      icon,
      image: imagePath,
      description,
    })
    .eq("id", id)

  if (error) {
    throw new Error(`Failed to update category: ${error.message}`)
  }

  revalidatePath("/")
  revalidatePath("/admin/manage")
  revalidatePath(`/category/${oldSlug}`)
  revalidatePath(`/category/${slug}`)
  return { success: true }
}

export async function deleteCategory(id: string) {
  const { data: currentCategory } = await supabaseAdmin
    .from("categories")
    .select("slug")
    .eq("id", id)
    .maybeSingle()

  const { error } = await supabaseAdmin
    .from("categories")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error(`Failed to delete category: ${error.message}`)
  }

  revalidatePath("/")
  revalidatePath("/admin/manage")
  if (currentCategory) {
    revalidatePath(`/category/${currentCategory.slug}`)
  }
  return { success: true }
}

// Testimonial Actions
export async function addTestimonial(formData: FormData) {
  const name = formData.get("name") as string
  const company = formData.get("company") as string
  const text = formData.get("text") as string
  const rating = parseInt(formData.get("rating") as string) || 5
  const imageFile = formData.get("image") as File

  const id = `test-${Date.now()}`
  let imagePath = "/images/avatar-1.svg"

  if (imageFile && imageFile.size > 0) {
    imagePath = await uploadToSupabase(imageFile, "testimonials", id)
  }

  const { error } = await supabaseAdmin
    .from("testimonials")
    .insert({
      id,
      name,
      company,
      text,
      rating,
      image: imagePath,
    })

  if (error) {
    throw new Error(`Failed to add testimonial: ${error.message}`)
  }

  revalidatePath("/")
  revalidatePath("/admin/manage")
  return { success: true }
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabaseAdmin
    .from("testimonials")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error(`Failed to delete testimonial: ${error.message}`)
  }

  revalidatePath("/")
  revalidatePath("/admin/manage")
  return { success: true }
}

// Business Need Actions
export async function updateBusinessNeed(slug: string, formData: FormData) {
  const { data: need, error: getErr } = await supabaseAdmin
    .from("business_needs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (getErr || !need) throw new Error("Business need not found")

  const title = formData.get("title") as string
  const tagline = formData.get("tagline") as string
  const description = formData.get("description") as string
  const imageFile = formData.get("bannerImage") as File
  const sectionsJson = formData.get("sectionsJson") as string
  const sections = sectionsJson ? JSON.parse(sectionsJson) : need.sections

  let bannerImagePath = need.bannerImage

  if (imageFile && imageFile.size > 0) {
    bannerImagePath = await uploadToSupabase(imageFile, "business-needs", slug)
  }

  // Iterate sections/products to upload base64 images
  if (sections && Array.isArray(sections)) {
    for (const section of sections) {
      if (section.products && Array.isArray(section.products)) {
        for (const prod of section.products) {
          if (prod.image && prod.image.startsWith("data:image/")) {
            prod.image = await uploadBase64ToSupabase(prod.image, "business-needs", `prod-${prod.slug}`)
          }
        }
      }
    }
  }

  const { error } = await supabaseAdmin
    .from("business_needs")
    .update({
      title,
      tagline,
      description,
      bannerImage: bannerImagePath,
      sections,
    })
    .eq("slug", slug)

  if (error) {
    throw new Error(`Failed to update business need: ${error.message}`)
  }

  revalidatePath("/")
  revalidatePath("/admin/manage")
  revalidatePath(`/business-needs/${slug}`)
  return { success: true }
}
