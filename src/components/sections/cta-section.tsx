"use client"

import { MessageCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { SITE } from "@/lib/constants"

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-r from-[#FF6B35] to-[#FF8F65]">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Need Custom Printing?
          </h2>
          <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Talk to our print experts. Get a free quote in minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent("Hello, I want printing quotation from Easy Prints.")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="xl"
                className="bg-white text-[#FF6B35] hover:bg-gray-100 gap-2 text-base shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Now
              </Button>
            </a>
            <a href={`tel:${SITE.contact.phone}`}>
              <Button
                variant="outline"
                size="xl"
                className="border-white text-white hover:bg-white/10 gap-2 text-base"
              >
                Call Us
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/60">
            <span>✓ Free Quote</span>
            <span>✓ Design Support</span>
            <span>✓ Fast Delivery</span>
            <span>✓ Pan India Shipping</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
