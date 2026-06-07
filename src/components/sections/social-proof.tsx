"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Section, SectionHeader } from "@/components/ui/section"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { TESTIMONIALS } from "@/lib/constants"

const stats = [
  { label: "Orders Delivered", value: "10,000+" },
  { label: "Products Available", value: "50+" },
  { label: "Happy Customers", value: "4,500+" },
  { label: "Cities Served", value: "25+" },
]

export function SocialProof() {
  return (
    <Section className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.1}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#FF6B35] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <SectionHeader
          title="What Our Customers Say"
          subtitle="Real reviews from our clients in Purnia and across Bihar."
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <ScrollReveal key={testimonial.name} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full"
              >
                <Quote className="w-8 h-8 text-[#FF6B35]/40 mb-4" />
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.company}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
