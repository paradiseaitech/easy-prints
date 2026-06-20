import { HeroSection } from "@/components/sections/hero"
import { ReelsSection } from "@/components/sections/reels"
import { TopBusinessNeeds } from "@/components/sections/top-business-needs"
import { PopularCategories } from "@/components/sections/popular-categories"
import { BestSellers } from "@/components/sections/best-sellers"
import { WhyUs } from "@/components/sections/why-us"
import { SocialProof } from "@/components/sections/social-proof"
import { FAQSection } from "@/components/sections/faq-section"
import { CTASection } from "@/components/sections/cta-section"
import { StructuredData } from "@/components/seo/structured-data"
import { localBusinessSchema } from "@/lib/schema/local-business"
import { getAllProducts, getCategories, getBestSellers } from "@/lib/products"
import { getAllTestimonials } from "@/lib/testimonials"

export default async function HomePage() {
  const allProducts = await getAllProducts()
  const categories = await getCategories()
  const bestSellers = await getBestSellers()
  const testimonials = await getAllTestimonials()

  return (
    <>
      <StructuredData data={localBusinessSchema()} />
      <HeroSection products={allProducts} />
      <ReelsSection />
      <TopBusinessNeeds />
      <PopularCategories categories={categories} />
      <BestSellers products={bestSellers} />
      <WhyUs />
      <SocialProof testimonials={testimonials} />
      <FAQSection />
      <CTASection />
    </>
  )
}
