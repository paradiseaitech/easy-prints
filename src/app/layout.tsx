import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans, Outfit } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/shared/whatsapp-button"
import { AIChatbot } from "@/components/layout/ai-chatbot"
import { StructuredData } from "@/components/seo/structured-data"
import { organizationSchema } from "@/lib/schema/organization"
import { SITE } from "@/lib/constants"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["500", "600", "700", "900"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Premium Printing Services in Purnia, Bihar`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  icons: {
    icon: "/images/Easy_Logo.png",
    apple: "/images/Easy_Logo.png",
  },
  keywords: [
    "printing services",
    "online printing",
    "visiting card printing",
    "banner printing",
    "flex printing",
    "t-shirt printing",
    "mug printing",
    "brochure printing",
    "sticker printing",
    "corporate printing",
    "wedding card printing",
    "customized gifts",
    "printing shop near me",
    "digital printing services",
    "printing in Purnia",
    "Purnia printing services",
  ],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: `${SITE.url}/images/og-image.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: [`${SITE.url}/images/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${outfit.variable}`}>
      <head>
        <link rel="canonical" href={SITE.url} />
        <meta name="geo.region" content="IN-BR" />
        <meta name="geo.placename" content="Purnia" />
        <meta name="geo.position" content="25.7771;87.4753" />
        <meta name="ICBM" content="25.7771, 87.4753" />
        <StructuredData data={organizationSchema()} />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <AIChatbot />
      </body>
    </html>
  )
}
