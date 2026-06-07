export interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  priceStarting: number
  image: string
  keywords: string[]
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface WhyUsItem {
  icon: string
  title: string
  description: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface Testimonial {
  name: string
  company: string
  rating: number
  text: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
}
