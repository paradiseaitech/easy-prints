import type { Metadata } from "next"
import { FAQSection } from "@/components/sections/faq-section"
import { CTASection } from "@/components/sections/cta-section"

export const metadata: Metadata = {
  title: "FAQ | Printing Services in Purnia — Easy Prints",
  description:
    "Find answers to common questions about printing services in Purnia. Learn about pricing, delivery, design assistance, and more at Easy Prints.",
}

export default function FAQPage() {
  return (
    <>
      <section className="pt-32 pb-8 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">
            Frequently Asked <span className="text-[#FF6B35]">Questions</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about our printing services in Purnia.
          </p>
        </div>
      </section>
      <FAQSection />
      <CTASection />
    </>
  )
}
