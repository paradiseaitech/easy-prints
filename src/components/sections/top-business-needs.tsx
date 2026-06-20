"use client"

import Link from "next/link"
import Image from "next/image"
import { 
  Rocket, Coffee, GraduationCap, Gift, 
  ShoppingBag, Briefcase, BedDouble, Scissors, 
  Globe, ArrowRight 
} from "lucide-react"
import { Section, SectionHeader } from "@/components/ui/section"
import { ScrollReveal } from "@/components/shared/scroll-reveal"

const businessNeeds = [
  {
    title: "Startup Branding",
    icon: <Rocket className="w-5 h-5" />,
    slug: "startup-branding",
    image: "/images/Startup_Building.png",
    products: "Visiting Cards, Letterheads, Custom Stickers, Logo Mugs"
  },
  {
    title: "Cafés & Restaurants",
    icon: <Coffee className="w-5 h-5" />,
    slug: "cafes-restaurants",
    image: "/images/Cafes&Restaurants.png",
    products: "Menu Cards, Food Box Packaging, Bill Books, Staff T-Shirts"
  },
  {
    title: "Education & Campus Needs",
    icon: <GraduationCap className="w-5 h-5" />,
    slug: "education-campus",
    image: "/images/Education&Campus_Needs.png",
    products: "ID Cards, Certificates, Prospectus, Standees, Flyers"
  },
  {
    title: "Events & Promotions",
    icon: <Gift className="w-5 h-5" />,
    slug: "events-promotions",
    image: "/images/Events&Promotions.png",
    products: "Flex Banners, Flyers, Standees, Custom T-Shirts, Awards"
  },
  {
    title: "E-commerce Business",
    icon: <ShoppingBag className="w-5 h-5" />,
    slug: "ecommerce-business",
    image: "/images/Ecommerce_Business.png",
    products: "Custom Box Packaging, Shipping Labels, Brand Stickers"
  },
  {
    title: "Corporate Business Promotions",
    icon: <Briefcase className="w-5 h-5" />,
    slug: "corporate-promotions",
    image: "/images/Corporate_Promotions.png",
    products: "Premium Cards, Doctor Files, Diaries, Metal Laser Pens"
  },
  {
    title: "Hotels & Hospitality",
    icon: <BedDouble className="w-5 h-5" />,
    slug: "hotels-hospitality",
    image: "/images/Hotels&Hospitality.png",
    products: "Key Card Folders, Brochures, Bill Books, Sign Board LED"
  },
  {
    title: "Boutiques & Salons",
    icon: <Scissors className="w-5 h-5" />,
    slug: "boutiques-salons",
    image: "/images/Botiques&Saloons.png",
    products: "Tag Cards, Catalog Booklets, Packaging Bags, Flex Banners"
  },
  {
    title: "International Brands",
    icon: <Globe className="w-5 h-5" />,
    slug: "international-brands",
    image: "/images/International_Brands.png",
    products: "High Definition UV Printing, SS 3D Letters, ACP Facades"
  }
]

export function TopBusinessNeeds() {
  return (
    <Section className="bg-white py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Top Business Needs"
          subtitle="Explore tailored printing bundles, signage, and marketing collaterals matched to your industry."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessNeeds.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.05}>
              <Link 
                href={`/business-needs/${item.slug}`}
                className="group flex flex-col justify-between rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer h-full"
              >
                {/* Image Cover Panel */}
                <div className="aspect-[16/10] w-full relative overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3}
                  />
                  {/* Subtle Gradient Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-65" />
                  
                  {/* Floating Glassmorphic Icon Badge */}
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200/50 flex items-center justify-center shadow-md">
                    <div className="text-gray-800">
                      {item.icon}
                    </div>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-[#1A1A2E] text-lg group-hover:text-[#FF6B35] transition-colors leading-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      <span className="font-bold text-gray-700">Recommended:</span> {item.products}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-[#FF6B35] group-hover:text-[#E55A2B]">
                    <span>Explore Solutions</span>
                    <span className="w-6 h-6 rounded-full bg-[#FF6B35]/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
