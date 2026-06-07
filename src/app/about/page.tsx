import type { Metadata } from "next"
import { SITE } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { WhyUs } from "@/components/sections/why-us"
import { CTASection } from "@/components/sections/cta-section"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Easy Prints | Premium Printing Services in Purnia",
  description:
    "Learn about Easy Prints — Purnia's most trusted printing service. Premium quality, fast delivery, and 500+ happy businesses.",
}

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">
            About <span className="text-[#FF6B35]">Easy Prints</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Purnia&apos;s premium printing platform — delivering exceptional quality
            across all print services since 2024.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#1A1A2E] font-heading">Our Story</h2>
            <p className="text-gray-500 leading-relaxed">
              Easy Prints was founded with a simple mission — to make premium printing
              accessible to everyone in Purnia and across Bihar. We realized that businesses
              and individuals in our region deserved better quality, faster delivery, and
              modern printing solutions without having to look outside the city.
            </p>
            <p className="text-gray-500 leading-relaxed mt-4">
              Today, we operate a state-of-the-art printing facility equipped with the latest
              digital and offset printing technology. From visiting cards to corporate gifts,
              we handle every project with precision, care, and attention to detail.
            </p>
          </div>
        </div>
      </section>

      <WhyUs />

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E] font-heading">Visit Our Studio</h2>
          <p className="mt-3 text-gray-500">
            {SITE.contact.address.street}, {SITE.contact.address.city}, {SITE.contact.address.state}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
            <a href={`tel:${SITE.contact.phone}`}>
              <Button variant="outline" size="lg">Call Now</Button>
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
