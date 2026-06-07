"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { deleteProduct } from "@/lib/admin-actions"
import { Plus, Pencil, Trash2, ExternalLink, Package } from "lucide-react"
import type { ProductData } from "@/lib/products"

interface Props {
  products: ProductData[]
}

export function AdminDashboard({ products }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A1A2E] rounded-xl flex items-center justify-center">
                <span className="text-[#FF6B35] font-black">EP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1A1A2E]">Admin Panel</h1>
                <p className="text-sm text-gray-500">Manage your printing services</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-[#FF6B35] transition-colors"
              >
                View Site
              </Link>
              <Link
                href="/admin/manage/add"
                className="inline-flex items-center gap-2 bg-[#FF6B35] text-white px-5 py-2.5 rounded-xl hover:bg-[#E55A2B] transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-2xl font-bold text-[#1A1A2E]">{products.length}</p>
            <p className="text-sm text-gray-500">Total Services</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-2xl font-bold text-[#1A1A2E]">
              {products.filter((p) => p.available).length}
            </p>
            <p className="text-sm text-gray-500">Active Services</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-2xl font-bold text-[#FF6B35]">
              ₹{Math.min(...products.map((p) => p.priceStarting))}
            </p>
            <p className="text-sm text-gray-500">Starting From</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-2xl font-bold text-[#1A1A2E]">
              {new Set(products.map((p) => p.category)).size}
            </p>
            <p className="text-sm text-gray-500">Categories</p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Package className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                      <p className="text-gray-400 font-medium">No services yet</p>
                      <p className="text-sm text-gray-300 mt-1">Add your first printing service</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[#1A1A2E]">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">/{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#FF6B35]">
                          ₹{product.priceStarting}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            product.available
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {product.available ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${product.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View on site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/manage/edit/${product.id}`}
                            className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <form
                            action={async () => {
                              setDeleting(product.id)
                              await deleteProduct(product.id)
                            }}
                            onSubmit={(e) => {
                              if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) {
                                e.preventDefault()
                              }
                            }}
                          >
                            <button
                              type="submit"
                              disabled={deleting === product.id}
                              className="p-2 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
