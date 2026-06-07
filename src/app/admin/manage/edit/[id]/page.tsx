import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { getProduct } from "@/lib/admin-actions"
import { ProductForm } from "../../product-form"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const cookieStore = await cookies()
  const authed = cookieStore.get("admin_auth")?.value === "true"
  if (!authed) redirect("/admin/manage/login")

  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

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
          <h1 className="text-2xl font-bold text-[#1A1A2E] mt-2">Edit Service</h1>
          <p className="text-sm text-gray-500">Update &quot;{product.name}&quot;</p>
        </div>

        <ProductForm product={product} />
      </div>
    </div>
  )
}
