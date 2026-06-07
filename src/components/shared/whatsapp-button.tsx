"use client"

import { MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { SITE } from "@/lib/constants"

export function WhatsAppButton() {
  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 300 }}
      href={`https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent("Hello, I want printing quotation from Easy Prints.")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-full shadow-xl hover:bg-green-600 hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
    </motion.a>
  )
}
