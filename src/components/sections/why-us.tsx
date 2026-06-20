"use client"

import { Section, SectionHeader } from "@/components/ui/section"
import { Card } from "@/components/ui/card"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { WHY_US } from "@/lib/constants"
import { Sparkles, Truck, Clock, IndianRupee, PenTool, Percent } from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  IndianRupee: <IndianRupee className="w-6 h-6" />,
  PenTool: <PenTool className="w-6 h-6" />,
  Percent: <Percent className="w-6 h-6" />,
  Truck: <Truck className="w-6 h-6" />,
}

export function WhyUs() {
  return (
    <Section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Why Choose Easy Print?"
          subtitle="We make printing simple, premium, and reliable."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.1}>
              <Card className="p-6 h-full hover:shadow-lg transition-shadow group border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35] group-hover:bg-[#FF6B35] group-hover:text-white transition-all duration-300 mb-4">
                  {iconMap[item.icon] || <Sparkles className="w-6 h-6" />}
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A2E] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
