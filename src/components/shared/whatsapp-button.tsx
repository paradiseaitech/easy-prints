"use client"

import { MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { SITE } from "@/lib/constants"

export function WhatsAppButton() {
  const pathname = usePathname()
  
  let text = "Hello, I want printing quotation from Easy Prints."
  
  if (pathname && pathname !== "/" && !pathname.startsWith("/admin") && !pathname.startsWith("/category")) {
    const slug = pathname.replace(/^\//, "")
    const productTitle = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    text = `Hi Easy Print,\n\nI am interested in ${productTitle}.\n\nPlease share quotation.`
  }

  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 300 }}
      href={`https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-full shadow-xl hover:bg-green-600 hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
    </motion.a>
  )
}
