"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Section, SectionHeader } from "@/components/ui/section"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import type { TestimonialData } from "@/lib/testimonials"

const stats = [
  { label: "Orders Delivered", value: "10,000+" },
  { label: "Products Available", value: "50+" },
  { label: "Happy Customers", value: "4,500+" },
  { label: "Cities Served", value: "25+" },
]

interface SocialProofProps {
  testimonials: TestimonialData[]
}

export function SocialProof({ testimonials }: SocialProofProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right

  useEffect(() => {
    if (testimonials.length === 0) return
    const timer = setInterval(() => {
      handleNext()
    }, 6000)
    return () => clearInterval(timer)
  }, [activeIndex, testimonials.length])

  if (testimonials.length === 0) return null

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  const current = testimonials[activeIndex]

  // Default avatars if none provided
  const avatarColors = ["bg-[#FF6B35]/20 text-[#FF6B35]", "bg-blue-500/20 text-blue-500", "bg-green-500/20 text-green-500", "bg-purple-500/20 text-purple-500"]
  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase()

  return (
    <Section className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] text-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.1}>
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-black text-[#FF6B35] mb-1 font-heading">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <SectionHeader
          title="What Our Customers Say"
          subtitle="Real reviews from local businesses and retail clients in Purnia and Bihar."
          light
        />

        <div className="max-w-4xl mx-auto relative px-4 md:px-12">
          {/* Quote Card Container */}
          <div className="relative min-h-[300px] md:min-h-[260px] bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl flex flex-col justify-between">
            <div className="absolute top-6 right-8 opacity-10">
              <Quote className="w-20 h-20 text-white fill-white" />
            </div>

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < current.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-medium italic">
                    &ldquo;{current.text}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${avatarColors[activeIndex % avatarColors.length]}`}>
                    {getInitials(current.name)}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-white">{current.name}</h4>
                    <p className="text-xs text-gray-400 font-semibold">{current.company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots Pagination */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1)
                    setActiveIndex(index)
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-8 bg-[#FF6B35]" : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:bg-[#FF6B35] hover:border-transparent text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:bg-[#FF6B35] hover:border-transparent text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
