import type { Metadata } from "next"
import { SITE } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { InstantQuoteForm } from "@/components/shared/instant-quote-form"
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Easy Prints | Printing Services in Purnia",
  description:
    "Get in touch with Easy Prints for premium printing services in Purnia, Bihar. Visit our studio, call us, or WhatsApp for instant quotes.",
}

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-heading">
              Contact <span className="text-[#FF6B35]">Easy Prints</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Get a free quote within minutes. We&apos;re here to help with all your printing needs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E] font-heading mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-5">
                  <a
                    href={`tel:${SITE.contact.phone}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35] group-hover:bg-[#FF6B35] group-hover:text-white transition-colors">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="font-semibold text-[#1A1A2E]">{SITE.contact.phone}</p>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${SITE.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-green-50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">WhatsApp</p>
                      <p className="font-semibold text-[#1A1A2E]">{SITE.contact.phone}</p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${SITE.contact.email}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-semibold text-[#1A1A2E]">{SITE.contact.email}</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Address</p>
                      <p className="font-semibold text-[#1A1A2E]">
                        {SITE.contact.address.street}<br />
                        {SITE.contact.address.city}, {SITE.contact.address.state} – {SITE.contact.address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Business Hours</p>
                      <p className="font-semibold text-[#1A1A2E]">
                        Mon – Sat: 9:00 AM – 8:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Form */}
            <div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
                <h2 className="text-2xl font-bold text-[#1A1A2E] font-heading mb-6">
                  Get Instant Quote
                </h2>
                <InstantQuoteForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
