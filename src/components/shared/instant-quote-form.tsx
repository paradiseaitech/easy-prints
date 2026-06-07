"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SITE } from "@/lib/constants"
import { Send, Loader2 } from "lucide-react"

interface QuoteFormProps {
  productName?: string
}

export function InstantQuoteForm({ productName }: QuoteFormProps) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: productName || "",
    quantity: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const text = `Hi Easy Prints! I need a quotation for:

Service: ${form.service || "Not specified"}
Quantity: ${form.quantity || "Not specified"}
Name: ${form.name}
Message: ${form.message}`

    const url = `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
    setLoading(false)
    setSent(true)
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Your Name *</Label>
        <Input
          id="name"
          required
          placeholder="Enter your name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          required
          placeholder="Enter your phone number"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="service">Service Needed</Label>
          <Input
            id="service"
            placeholder="e.g. Visiting Cards"
            value={form.service}
            onChange={(e) => handleChange("service", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            placeholder="e.g. 500 pcs"
            value={form.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Tell us about your requirements..."
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
        {sent ? "Sent! Check WhatsApp" : "Send via WhatsApp"}
      </Button>
    </form>
  )
}
