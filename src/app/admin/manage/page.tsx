import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAllProducts, getCategories } from "@/lib/products"
import { getAllTestimonials } from "@/lib/testimonials"
import { getBusinessNeedsData } from "@/data/business-needs-data"
import { AdminDashboard } from "./admin-dashboard"

export default async function ManagePage() {
  const cookieStore = await cookies()
  const authed = cookieStore.get("admin_auth")?.value === "true"

  if (!authed) {
    redirect("/admin/manage/login")
  }

  const products = await getAllProducts()
  const categories = await getCategories()
  const testimonials = await getAllTestimonials()
  const businessNeeds = Object.values(await getBusinessNeedsData())

  return (
    <AdminDashboard
      products={products}
      categories={categories}
      testimonials={testimonials}
      businessNeeds={businessNeeds}
    />
  )
}
