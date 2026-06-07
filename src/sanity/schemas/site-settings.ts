const siteSettingsSchema = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    {
      name: "siteName",
      title: "Site Name",
      type: "string",
    },
    {
      name: "tagline",
      title: "Tagline",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
    },
    {
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
    },
    {
      name: "address",
      title: "Address",
      type: "text",
    },
    {
      name: "logo",
      title: "Logo",
      type: "image",
    },
    {
      name: "heroImages",
      title: "Hero Images",
      type: "array",
      of: [{ type: "image" }],
    },
  ],
}

export default siteSettingsSchema
