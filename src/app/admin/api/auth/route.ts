import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const authed = cookieStore.get("admin_auth")?.value === "true"
  return NextResponse.json({ authenticated: authed })
}

export async function POST(request: Request) {
  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  if (password === adminPassword) {
    const cookieStore = await cookies()
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { error: "Invalid password" },
    { status: 401 }
  )
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_auth")
  return NextResponse.json({ success: true })
}

