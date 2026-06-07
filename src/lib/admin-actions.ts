"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import fs from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "src", "data", "products.json")

interface ProductData {
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
}

function readProducts(): ProductData[] {
  const raw = fs.readFileSync(DATA_FILE, "utf-8")
  return JSON.parse(raw)
}

function writeProducts(products: ProductData[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8")
}

export async function authenticateAdmin(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"
  return password === adminPassword
}

export async function getProducts(): Promise<ProductData[]> {
  return readProducts()
}

export async function getProduct(id: string): Promise<ProductData | undefined> {
  const products = readProducts()
  return products.find((p) => p.id === id)
}

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const priceStarting = parseInt(formData.get("priceStarting") as string) || 0
  const keywords = formData.get("keywords") as string
  const featuresRaw = formData.get("features") as string
  const imageFile = formData.get("image") as File

  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  let imagePath = "/images/placeholder-card.svg"

  // Handle image upload
  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const ext = imageFile.name.split(".").pop() || "png"
    const filename = `custom-${slug}-${Date.now()}.${ext}`
    const filepath = path.join(process.cwd(), "public", "images", filename)
    fs.writeFileSync(filepath, buffer)
    imagePath = `/images/${filename}`
  }

  const features = featuresRaw
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)

  const products = readProducts()

  const id = slug

  // Check if slug already exists
  if (products.some((p) => p.id === id)) {
    throw new Error("A product with this name already exists")
  }

  const newProduct: ProductData = {
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
  }

  products.push(newProduct)
  writeProducts(products)
  revalidatePath("/")
  revalidatePath("/admin/manage")
  revalidatePath(`/${slug}`)
  redirect("/admin/manage")
}

export async function updateProduct(id: string, formData: FormData) {
  const products = readProducts()
  const index = products.findIndex((p) => p.id === id)

  if (index === -1) throw new Error("Product not found")

  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const priceStarting = parseInt(formData.get("priceStarting") as string) || 0
  const keywords = formData.get("keywords") as string
  const featuresRaw = formData.get("features") as string
  const imageFile = formData.get("image") as File
  const available = formData.get("available") === "true"

  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  let imagePath = products[index].image

  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const ext = imageFile.name.split(".").pop() || "png"
    const filename = `custom-${slug}-${Date.now()}.${ext}`
    const filepath = path.join(process.cwd(), "public", "images", filename)
    fs.writeFileSync(filepath, buffer)
    imagePath = `/images/${filename}`
  }

  const features = featuresRaw
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)

  products[index] = {
    ...products[index],
    name,
    slug,
    category,
    description,
    priceStarting,
    image: imagePath,
    keywords,
    features,
    available,
  }

  writeProducts(products)
  revalidatePath("/")
  revalidatePath("/admin/manage")
  revalidatePath(`/${slug}`)
  revalidatePath(`/${products[index].slug}`)
  redirect("/admin/manage")
}

export async function deleteProduct(id: string) {
  const products = readProducts()
  const filtered = products.filter((p) => p.id !== id)
  writeProducts(filtered)
  revalidatePath("/")
  revalidatePath("/admin/manage")
  redirect("/admin/manage")
}
