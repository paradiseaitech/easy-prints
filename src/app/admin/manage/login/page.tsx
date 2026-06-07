"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldAlert } from "lucide-react"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/admin/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push("/admin/manage")
      router.refresh()
    } else {
      setError("Invalid password")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#16213E] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1A1A2E] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-[#FF6B35] font-black text-2xl">EP</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-1">Easy Prints Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-3 rounded-xl">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FF6B35] text-white rounded-xl font-medium hover:bg-[#E55A2B] transition-colors disabled:opacity-50"
            >
              {loading ? "Checking..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-gray-400">
            Default password: admin123 (change via ADMIN_PASSWORD env variable)
          </p>
        </div>
      </div>
    </div>
  )
}
