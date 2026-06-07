import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ProductForm } from "../product-form"

export default async function AddProductPage() {
  const cookieStore = await cookies()
  const authed = cookieStore.get("admin_auth")?.value === "true"
  if (!authed) redirect("/admin/manage/login")

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <a
            href="/admin/manage"
            className="text-sm text-gray-500 hover:text-[#FF6B35] transition-colors"
          >
            ← Back to Dashboard
          </a>
          <h1 className="text-2xl font-bold text-[#1A1A2E] mt-2">Add New Service</h1>
          <p className="text-sm text-gray-500">Create a new printing service</p>
        </div>

        <ProductForm />
      </div>
    </div>
  )
}
