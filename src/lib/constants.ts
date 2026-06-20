export const SITE = {
  name: "Easy Prints",
  tagline: "India's Premium Printing Platform",
  description:
    "Purnia's most trusted printing service. Premium quality visiting cards, banners, t-shirts, wedding cards, and more. Fast delivery across Bihar.",
  url: "https://easyprints.in",
  locale: "en_IN",
  logo: "/images/logo.svg",
  ogImage: "/images/og-image.jpg",
  contact: {
    phone: "+91-9876543210",
    whatsapp: "+919876543210",
    email: "hello@easyprints.in",
    address: {
      street: "Main Road, Near Chitragupta Nagar",
      city: "Purnia",
      state: "Bihar",
      pincode: "854301",
      country: "IN",
    },
  },
  social: {
    instagram: "https://instagram.com/easyprints",
    facebook: "https://facebook.com/easyprints",
    youtube: "https://youtube.com/@easyprints",
  },
} as const

export const NAV_ITEMS = [
  {
    label: "Products",
    href: "/",
    children: [
      { label: "Visiting Cards", href: "/visiting-card-printing" },
      { label: "Stickers & Labels", href: "/stickers-labels-printing" },
      { label: "Booklets", href: "/booklet-printing" },
      { label: "Certificates", href: "/certificate-printing" },
      { label: "Pens", href: "/pen-printing" },
      { label: "T-Shirts", href: "/tshirt-printing" },
      { label: "Photo Frames", href: "/photo-frames" },
      { label: "Awards", href: "/awards-trophies" },
      { label: "Envelopes", href: "/envelope-printing" },
      { label: "Flyers & Brochures", href: "/flyers-brochures-printing" },
      { label: "Doctor Files", href: "/doctor-files" },
      { label: "Bill Books", href: "/bill-books" },
    ],
  },
  {
    label: "Business Needs",
    href: "/",
    children: [
      { label: "Startup Branding", href: "/business-needs/startup-branding" },
      { label: "Cafes & Restaurants", href: "/business-needs/cafes-restaurants" },
      { label: "Education & Campus Needs", href: "/business-needs/education-campus" },
      { label: "Events & Promotions", href: "/business-needs/events-promotions" },
      { label: "E-commerce Business", href: "/business-needs/ecommerce-business" },
      { label: "Corporate Business Promotions", href: "/business-needs/corporate-promotions" },
      { label: "Hotels & Hospitality", href: "/business-needs/hotels-hospitality" },
      { label: "Boutiques & Salons", href: "/business-needs/boutiques-salons" },
      { label: "International Brands", href: "/business-needs/international-brands" },
    ]
  },
  { label: "Categories", href: "/", children: [
    { label: "Digital Printing", href: "/category/digital-printing" },
    { label: "Offset Printing", href: "/category/offset-printing" },
    { label: "Flex & UV Printing", href: "/category/flex-uv-printing" },
    { label: "Signage & 3D Letters", href: "/category/signage-3d-letters" },
  ]},
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Catalog", href: "/images/Easy Print_Catelog.pdf" },
]

export const PRODUCTS = [
  {
    id: "visiting-card-printing",
    name: "Visiting Cards",
    slug: "visiting-card-printing",
    category: "Stationery",
    description: "Premium business cards with spot UV, foiling, and matte finish options.",
    priceStarting: 199,
    image: "/images/placeholder-card.svg",
    keywords: ["visiting card printing", "business card printing", "premium visiting cards"],
  },
  {
    id: "custom-tshirt-printing",
    name: "T-Shirt Printing",
    slug: "custom-tshirt-printing",
    category: "Apparel",
    description: "Custom t-shirt printing with DTF, screen printing, and sublimation.",
    priceStarting: 299,
    image: "/images/placeholder-tshirt.svg",
    keywords: ["t-shirt printing", "custom tshirt printing", "apparel printing"],
  },
  {
    id: "banner-printing",
    name: "Banner Printing",
    slug: "banner-printing",
    category: "Signage",
    description: "Large format banner printing for events, promotions, and advertising.",
    priceStarting: 99,
    image: "/images/placeholder-banner.svg",
    keywords: ["banner printing", "flex banner printing", "large format printing"],
  },
  {
    id: "flex-printing",
    name: "Flex Printing",
    slug: "flex-printing",
    category: "Signage",
    description: "High-resolution flex printing for hoardings, banners, and displays.",
    priceStarting: 79,
    image: "/images/placeholder-flex.svg",
    keywords: ["flex printing", "flex banner printing", "vinyl printing"],
  },
  {
    id: "brochure-printing",
    name: "Brochure Printing",
    slug: "brochure-printing",
    category: "Stationery",
    description: "Tri-fold, bi-fold, and multi-page brochure printing with glossy finish.",
    priceStarting: 249,
    image: "/images/placeholder-brochure.svg",
    keywords: ["brochure printing", "brochure printing online", "catalogue printing"],
  },
  {
    id: "flyer-printing",
    name: "Flyer Printing",
    slug: "flyer-printing",
    category: "Stationery",
    description: "Eye-catching flyer and leaflet printing for promotions and events.",
    priceStarting: 149,
    image: "/images/placeholder-flyer.svg",
    keywords: ["flyer printing", "leaflet printing", "pamphlet printing"],
  },
  {
    id: "sticker-printing",
    name: "Sticker Printing",
    slug: "sticker-printing",
    category: "Packaging",
    description: "Custom sticker printing in various shapes, sizes, and materials.",
    priceStarting: 49,
    image: "/images/placeholder-sticker.svg",
    keywords: ["sticker printing", "custom sticker printing", "label printing"],
  },
  {
    id: "mug-printing",
    name: "Mug Printing",
    slug: "mug-printing",
    category: "Gifts",
    description: "Personalized photo mug printing. Great for gifts and promotions.",
    priceStarting: 199,
    image: "/images/placeholder-mug.svg",
    keywords: ["mug printing", "custom mug printing", "photo mug printing"],
  },
  {
    id: "wedding-card-printing",
    name: "Wedding Cards",
    slug: "wedding-card-printing",
    category: "Wedding",
    description: "Elegant wedding card printing with foil stamping and embossing.",
    priceStarting: 25,
    image: "/images/placeholder-wedding.svg",
    keywords: ["wedding card printing", "wedding invitation printing", "card printing"],
  },
  {
    id: "corporate-gifts",
    name: "Corporate Gifts",
    slug: "corporate-gifts",
    category: "Gifts",
    description: "Custom corporate gifts for branding, events, and employee recognition.",
    priceStarting: 99,
    image: "/images/placeholder-gift.svg",
    keywords: ["corporate gifts", "corporate gifting", "branded merchandise"],
  },
  {
    id: "packaging-printing",
    name: "Packaging Printing",
    slug: "packaging-printing",
    category: "Packaging",
    description: "Custom packaging boxes, cartons, and product packaging solutions.",
    priceStarting: 15,
    image: "/images/placeholder-packaging.svg",
    keywords: ["packaging printing", "custom packaging boxes", "product packaging"],
  },
  {
    id: "photo-frames",
    name: "Photo Frames",
    slug: "photo-frames",
    category: "Gifts",
    description: "Premium custom photo frame printing in wood, acrylic, and metal.",
    priceStarting: 399,
    image: "/images/placeholder-frame.svg",
    keywords: ["photo frames", "custom photo frame", "photo frame printing"],
  },
  {
    id: "id-card-printing",
    name: "ID Cards",
    slug: "id-card-printing",
    category: "Stationery",
    description: "PVC and teslin ID card printing with lanyards and accessories.",
    priceStarting: 49,
    image: "/images/placeholder-idcard.svg",
    keywords: ["id card printing", "custom id cards", "identity card printing"],
  },
  {
    id: "poster-printing",
    name: "Poster Printing",
    slug: "poster-printing",
    category: "Signage",
    description: "High-quality poster printing for events, rooms, and advertising.",
    priceStarting: 199,
    image: "/images/placeholder-poster.svg",
    keywords: ["poster printing", "custom poster printing", "poster print"],
  },
  {
    id: "standee-printing",
    name: "Standee Printing",
    slug: "standee-printing",
    category: "Signage",
    description: "Roll-up standees, X-standees, and custom display stands.",
    priceStarting: 599,
    image: "/images/placeholder-standee.svg",
    keywords: ["standee printing", "roll up standee", "display stand printing"],
  },
] as const

export const WHY_US = [
  {
    icon: "Sparkles",
    title: "Premium Print Quality",
    description: "State-of-the-art digital and offset printing machines for flawless output.",
  },
  {
    icon: "Clock",
    title: "Fast Turnaround",
    description: "Same-day manufacturing and express delivery timelines for all products.",
  },
  {
    icon: "IndianRupee",
    title: "Affordable Pricing",
    description: "Best price guarantee. High-quality prints at factory-direct pricing.",
  },
  {
    icon: "PenTool",
    title: "Custom Design Support",
    description: "Expert designers help create or refine your artwork from scratch.",
  },
  {
    icon: "Percent",
    title: "Bulk Order Discounts",
    description: "Get significant wholesale price drops on bulk business or retail orders.",
  },
  {
    icon: "Truck",
    title: "Pan India Delivery",
    description: "Safe, rapid shipping and doorstep delivery across Bihar and all of India.",
  },
]

export const FAQ_DATA = [
  {
    question: "What printing services do you offer in Purnia?",
    answer:
      "Easy Prints offers a comprehensive range of printing services in Purnia including visiting card printing, t-shirt printing, banner and flex printing, brochure printing, sticker printing, mug printing, wedding card printing, corporate gifts, packaging printing, photo frames, ID cards, posters, and standee printing.",
  },
  {
    question: "How long does delivery take in Purnia?",
    answer:
      "Local delivery in Purnia typically takes 24-48 hours. Express same-day delivery is available for select products. We also deliver across Bihar with 2-4 day timelines.",
  },
  {
    question: "Do you offer design assistance for printing?",
    answer:
      "Yes! Our experienced designers can help create your artwork or refine existing designs. We provide up to 2 free design revisions with every order.",
  },
  {
    question: "What is the minimum order quantity?",
    answer:
      "Minimum order quantities vary by product. Visiting cards start from 100 pieces, t-shirts from 1 piece, banners from 1 piece. Contact us for specific product MOQs.",
  },
  {
    question: "Can I order printing services online from Purnia?",
    answer:
      "Absolutely! You can browse our services, get instant quotes, and place orders online. We deliver right to your doorstep in Purnia and across Bihar.",
  },
  {
    question: "What file formats do you accept for printing?",
    answer:
      "We accept PDF, AI, EPS, CDR, PSD, JPEG, and PNG files. Minimum 300 DPI resolution recommended for best print quality.",
  },
  {
    question: "Do you provide bulk order discounts for businesses?",
    answer:
      "Yes, we offer competitive bulk pricing for corporate orders, events, and business promotions. Contact our team for customized quotes.",
  },
  {
    question: "What is the best printing service near me in Purnia?",
    answer:
      "Easy Prints is Purnia's premier printing service. Located on Main Road near Chitragupta Nagar, we offer premium quality printing with fast turnaround times.",
  },
]

export const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    company: "Purnia Enterprises",
    rating: 5,
    text: "Best printing service in Purnia! Their visiting card quality is outstanding. Fast delivery and great design support.",
  },
  {
    name: "Anita Sharma",
    company: "Sharma Wedding Planners",
    rating: 5,
    text: "Ordered wedding cards for 500 guests. The foil work and finish exceeded our expectations. Highly recommend!",
  },
  {
    name: "Vikram Singh",
    company: "Bihari Tiffin Service",
    rating: 5,
    text: "We get all our branding materials from Easy Prints. Banners, flyers, menus — consistently excellent quality.",
  },
  {
    name: "Priya Mishra",
    company: "Mishra & Co.",
    rating: 5,
    text: "Corporate gifts for our clients turned out beautiful. Custom packaging made all the difference.",
  },
]
