const testimonialSchema = {
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Customer Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "company",
      title: "Company",
      type: "string",
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      options: {
        list: [1, 2, 3, 4, 5],
      },
    },
    {
      name: "text",
      title: "Testimonial Text",
      type: "text",
    },
    {
      name: "avatar",
      title: "Avatar",
      type: "image",
    },
  ],
}

export default testimonialSchema
