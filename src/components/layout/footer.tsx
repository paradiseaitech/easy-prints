import Link from "next/link"
import Image from "next/image"
import { SITE, PRODUCTS } from "@/lib/constants"
import { MessageCircle, Phone, Mail, MapPin, Camera, Video } from "lucide-react"

const CATEGORIES = [
  { label: "Apparel", href: "/category/apparel" },
  { label: "Stationery", href: "/category/stationery" },
  { label: "Signage", href: "/category/signage" },
  { label: "Packaging", href: "/category/packaging" },
  { label: "Gifts", href: "/category/gifts" },
  { label: "Wedding", href: "/category/wedding" },
]

export function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Image
                src="/images/Easy_Logo.png"
                alt="Easy Prints Logo"
                width={160}
                height={48}
                className="h-10 w-auto object-contain bg-white p-1.5 rounded-lg shadow-sm"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Purnia&apos;s premium printing platform. We deliver exceptional quality across
              all print services — from visiting cards to corporate gifts.
            </p>
            <div className="flex gap-3">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors"
              >
                <Camera className="w-5 h-5" />
              </a>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#FF6B35] transition-colors"
              >
                <Video className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${SITE.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              {PRODUCTS.slice(0, 8).map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/${product.slug}`}
                    className="text-sm text-gray-400 hover:text-[#FF6B35] transition-colors"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-6">
              Categories
            </h3>
            <ul className="space-y-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="text-sm text-gray-400 hover:text-[#FF6B35] transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${SITE.contact.phone}`}
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#FF6B35]" />
                  {SITE.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.contact.email}`}
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#FF6B35]" />
                  {SITE.contact.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-[#FF6B35] mt-0.5 shrink-0" />
                  <span>
                    {SITE.contact.address.street},{" "}
                    {SITE.contact.address.city}, {SITE.contact.address.state} –{" "}
                    {SITE.contact.address.pincode}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/about" className="text-sm text-gray-500 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="text-sm text-gray-500 hover:text-white transition-colors">
              FAQ
            </Link>
            <a
              href="/images/Easy Print_Catelog.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Catalog
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
