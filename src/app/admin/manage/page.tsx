import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAllProducts } from "@/lib/products"
import { AdminDashboard } from "./admin-dashboard"

export default async function ManagePage() {
  const cookieStore = await cookies()
  const authed = cookieStore.get("admin_auth")?.value === "true"

  if (!authed) {
    redirect("/admin/manage/login")
  }

  const products = getAllProducts()
  return <AdminDashboard products={products} />
}
