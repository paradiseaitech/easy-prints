"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search, ChevronDown, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NAV_ITEMS, SITE } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isDarkNavbar = isHomePage && !isScrolled

  const linkClass = cn(
    "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
    isDarkNavbar
      ? "text-white/80 hover:text-white hover:bg-white/10"
      : "text-gray-700 hover:text-[#FF6B35] hover:bg-gray-50"
  )

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-2">
            <Image
              src="/images/Easy_Logo.png"
              alt="Easy Prints Logo"
              width={160}
              height={48}
              className="h-10 md:h-12 w-auto object-contain bg-white p-1.5 rounded-lg shadow-sm"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <button
                    className={cn("flex items-center gap-1", linkClass)}
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : item.href.endsWith(".pdf") ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={linkClass}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Mega Menu */}
                <AnimatePresence>
                  {item.children && openDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-max max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
                    >
                      <div className="grid grid-cols-3 gap-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 group transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B35]/10 to-[#FF8F65]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <div className="w-5 h-5 rounded bg-[#FF6B35]/20" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-[#FF6B35] transition-colors">
                              {child.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className={cn("p-2 transition-colors", isDarkNavbar ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-[#FF6B35]")}>
              <Search className="w-5 h-5" />
            </button>
            <a
              href={`tel:${SITE.contact.phone}`}
              className={cn("p-2 transition-colors", isDarkNavbar ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-green-600")}
            >
              <Phone className="w-5 h-5" />
            </a>
            <a
              href={`https://wa.me/${SITE.contact.whatsapp}?text=Hello%2C%20I%20want%20printing%20quotation%20from%20Easy%20Prints.`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" size="sm" className={cn(isDarkNavbar && "border-white/20 text-white hover:bg-white hover:text-black")}>
                Get Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={cn(
              "lg:hidden relative z-10 p-2 transition-colors",
              isDarkNavbar ? "text-white hover:text-[#FF6B35]" : "text-gray-700 hover:text-[#FF6B35]"
            )}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-2xl overflow-y-auto"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute right-4 top-4 p-2 text-gray-500 hover:text-[#FF6B35] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="p-6 pt-20">
                <div className="space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <div key={item.label}>
                      {item.children ? (
                        <>
                          <div className="px-4 py-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            {item.label}
                          </div>
                          <div className="ml-2 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={() => setIsMobileOpen(false)}
                                className="block px-4 py-3 text-sm text-gray-700 hover:text-[#FF6B35] hover:bg-gray-50 rounded-xl transition-colors"
                              >
                                {child.label}
                              </Link>
                            ))}
                            <div className="border-t border-gray-100 my-2" />
                          </div>
                        </>
                      ) : item.href.endsWith(".pdf") ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMobileOpen(false)}
                          className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#FF6B35] hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#FF6B35] hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <a
                    href={`https://wa.me/${SITE.contact.whatsapp}?text=Hello%2C%20I%20want%20printing%20quotation%20from%20Easy%20Prints.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Now
                  </a>
                  <a
                    href={`tel:${SITE.contact.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#1A1A2E] text-white rounded-xl font-medium hover:bg-[#16213E] transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
