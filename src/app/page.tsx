import { HeroSection } from "@/components/sections/hero"
import { CategoryShowcase } from "@/components/sections/categories"
import { ReelsSection } from "@/components/sections/reels"
import { TrendingProducts } from "@/components/sections/trending"
import { WhyUs } from "@/components/sections/why-us"
import { SocialProof } from "@/components/sections/social-proof"
import { FAQSection } from "@/components/sections/faq-section"
import { CTASection } from "@/components/sections/cta-section"
import { StructuredData } from "@/components/seo/structured-data"
import { localBusinessSchema } from "@/lib/schema/local-business"
import { getAllProducts } from "@/lib/products"

export default function HomePage() {
  const products = getAllProducts()

  return (
    <>
      <StructuredData data={localBusinessSchema()} />
      <HeroSection />
      <CategoryShowcase products={products} />
      <ReelsSection />
      <TrendingProducts products={products} />
      <WhyUs />
      <SocialProof />
      <FAQSection />
      <CTASection />
    </>
  )
}
