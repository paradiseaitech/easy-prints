"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE } from "@/lib/constants"

const floatingProducts = [
  { emoji: "🪪", delay: 0, x: "-20%", y: "10%" },
  { emoji: "👕", delay: 0.3, x: "25%", y: "5%" },
  { emoji: "🖼️", delay: 0.6, x: "-15%", y: "60%" },
  { emoji: "🎁", delay: 0.9, x: "20%", y: "55%" },
  { emoji: "☕", delay: 1.2, x: "0%", y: "30%" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,107,53,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating Product Emojis */}
      {floatingProducts.map((product) => (
        <motion.div
          key={product.emoji}
          className="absolute text-4xl md:text-6xl opacity-20 hidden md:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.2,
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { delay: product.delay, duration: 1 },
            scale: { delay: product.delay, duration: 1 },
            y: {
              delay: product.delay,
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{ left: product.x, top: product.y }}
        >
          {product.emoji}
        </motion.div>
      ))}

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#FF6B35]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#FF8F65]/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                <span className="text-sm text-white/80 font-medium">
                  India&apos;s Premium Printing Platform
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
            >
              Everything{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8F65]">
                Prints
              </span>{" "}
              Here.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed"
            >
              From visiting cards to corporate gifts — premium quality printing
              delivered to your doorstep in Purnia and across Bihar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-4 w-full sm:w-auto"
            >
              <Link href="/visiting-card-printing" className="w-full sm:w-auto">
                <Button size="xl" className="w-full justify-center gap-2 text-base shadow-xl shadow-orange-500/30">
                  Explore Products
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a
                href={`https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent("Hello, I want printing quotation from Easy Prints.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="white" size="xl" className="w-full justify-center gap-2 text-base">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  WhatsApp Now
                </Button>
              </a>
              <a
                href="/images/Easy Print_Catelog.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="xl" className="w-full justify-center gap-2 text-base text-white border-white/20 hover:bg-white/10 hover:text-white">
                  View Catalog (PDF)
                </Button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-wrap gap-8"
            >
              {[
                { label: "Products", value: "50+" },
                { label: "Happy Clients", value: "10,000+" },
                { label: "Cities Served", value: "25+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Product Cards Showcase */}
              <div className="absolute top-0 right-0 w-64 h-80 bg-gradient-to-br from-[#FF6B35] to-[#FF8F65] rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 text-white h-full flex flex-col">
                  <div className="w-12 h-12 bg-white/20 rounded-xl mb-4 flex items-center justify-center text-2xl shadow-inner">
                    🪪
                  </div>
                  <h3 className="font-bold text-xl mb-1">Premium Cards</h3>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">Starting at just ₹250 for 100 matte visiting cards.</p>
                  <div className="flex-1 bg-white/10 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between text-sm font-medium mb-3 pb-2 border-b border-white/10">
                      <span>Options</span>
                      <span>Price</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white/90"><span>Matte</span> <span>₹250</span></div>
                      <div className="flex justify-between text-sm text-white/90"><span>Glossy</span> <span>₹300</span></div>
                      <div className="flex justify-between text-sm text-white/90"><span>Velvet</span> <span>₹450</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-56 h-72 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-3xl shadow-2xl border border-white/10 overflow-hidden text-white">
                <div className="p-6 h-full flex flex-col">
                  <div className="w-12 h-12 bg-[#FF6B35]/20 text-[#FF6B35] rounded-xl mb-4 flex items-center justify-center text-2xl">
                    👕
                  </div>
                  <h3 className="font-bold text-lg mb-1">Custom Apparel</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">High quality T-shirts with vibrant, durable prints.</p>
                  <div className="mt-auto bg-white/5 rounded-xl p-3 border border-white/10 text-center hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="text-sm font-semibold text-[#FF6B35]">Order Bulk & Save</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 right-10 w-48 h-60 bg-gradient-to-br from-[#0F3460] to-[#16213E] rounded-3xl shadow-2xl border border-white/10 text-white flex flex-col p-6">
                 <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full mb-4 flex items-center justify-center text-2xl">
                   🚚
                 </div>
                 <h4 className="font-bold text-md mb-2">Fast Delivery</h4>
                 <p className="text-gray-400 text-sm leading-relaxed mb-4">Same day printing & fast delivery across Purnia.</p>
                 <div className="mt-auto flex items-center gap-2 bg-[#1A1A2E] py-2 px-3 rounded-lg border border-white/5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                    <span className="text-xs font-medium text-gray-300">Active Now</span>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
