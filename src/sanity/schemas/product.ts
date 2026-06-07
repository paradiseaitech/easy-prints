const productSchema = {
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Stationery", value: "stationery" },
          { title: "Apparel", value: "apparel" },
          { title: "Signage", value: "signage" },
          { title: "Packaging", value: "packaging" },
          { title: "Gifts", value: "gifts" },
          { title: "Wedding", value: "wedding" },
        ],
      },
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "priceStarting",
      title: "Starting Price (₹)",
      type: "number",
    },
    {
      name: "image",
      title: "Product Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image" }],
    },
    {
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "materials",
      title: "Materials Available",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Material Name", type: "string" },
            { name: "priceMultiplier", title: "Price Multiplier", type: "number" },
          ],
        },
      ],
    },
    {
      name: "deliveryTimeline",
      title: "Delivery Timeline",
      type: "string",
    },
    {
      name: "keywords",
      title: "SEO Keywords",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "faqs",
      title: "Product FAQs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text" },
          ],
        },
      ],
    },
  ],
}

export default productSchema
