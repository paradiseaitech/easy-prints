"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Phone, MessageCircle, Sparkles, User, Bot, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SITE } from "@/lib/constants"
import productsData from "@/data/products.json"
import type { ProductData } from "@/lib/products"
import { cn } from "@/lib/utils"

interface Message {
  sender: "user" | "bot"
  text: string
  timestamp: Date
  suggestions?: string[]
  isQuoteForm?: boolean
  quoteStep?: "name" | "phone" | "product" | "done"
  quoteData?: {
    name?: string
    phone?: string
    product?: string
  }
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [products, setProducts] = useState<ProductData[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load products and initialize chat history
  useEffect(() => {
    setProducts(productsData as ProductData[])
    
    const savedChat = localStorage.getItem("ep_chat_history")
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat)
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })))
      } catch {
        initializeWelcomeChat()
      }
    } else {
      initializeWelcomeChat()
    }
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    if (messages.length > 0) {
      localStorage.setItem("ep_chat_history", JSON.stringify(messages))
    }
  }, [messages, isTyping])

  const initializeWelcomeChat = () => {
    setMessages([
      {
        sender: "bot",
        text: `👋 Welcome to Easy Prints!\n\nHow can we help you today?\n\nYou can ask about:\n• Visiting Cards\n• Packaging\n• Stickers\n• Banners\n• T-Shirt Printing\n• Custom Printing Solutions`,
        timestamp: new Date(),
        suggestions: ["Visiting Cards", "Packaging Options", "Stickers & Labels", "T-Shirt Printing", "Get Quote", "Talk to Expert"],
      },
    ])
  }

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return

    // 1. Add User message
    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")

    // Check if we are in the middle of a lead generation/quote flow
    const lastMsg = messages[messages.length - 1]
    if (lastMsg && lastMsg.isQuoteForm && lastMsg.quoteStep !== "done") {
      handleQuoteFlow(textToSend, lastMsg)
      return
    }

    // 2. Simulate Bot typing
    setIsTyping(true)
    setTimeout(() => {
      respondToQuery(textToSend.toLowerCase())
      setIsTyping(false)
    }, 800)
  }

  const startQuoteFlow = (initialProduct = "") => {
    const nextMsg: Message = {
      sender: "bot",
      text: "Sure! Let's get a free quote for your printing project. What is your name? 😊",
      timestamp: new Date(),
      isQuoteForm: true,
      quoteStep: "name",
      quoteData: { product: initialProduct },
    }
    setMessages((prev) => [...prev, nextMsg])
  }

  const handleQuoteFlow = (userInput: string, lastMsg: Message) => {
    const currentStep = lastMsg.quoteStep
    const currentData = lastMsg.quoteData || {}

    if (currentStep === "name") {
      // Name received, ask for phone
      const nextMsg: Message = {
        sender: "bot",
        text: `Nice to meet you, ${userInput}! Can you please share your 10-digit mobile number? 📞`,
        timestamp: new Date(),
        isQuoteForm: true,
        quoteStep: "phone",
        quoteData: { ...currentData, name: userInput },
      }
      setMessages((prev) => [...prev, nextMsg])
    } else if (currentStep === "phone") {
      // Validate phone format
      const cleanedPhone = userInput.replace(/\D/g, "")
      if (cleanedPhone.length !== 10) {
        const retryMsg: Message = {
          sender: "bot",
          text: "Hmm, that doesn't look like a valid 10-digit mobile number. Please share your correct number: 📱",
          timestamp: new Date(),
          isQuoteForm: true,
          quoteStep: "phone",
          quoteData: currentData,
        }
        setMessages((prev) => [...prev, retryMsg])
        return
      }

      // If product was already prefilled, skip to done
      if (currentData.product) {
        completeQuoteFlow({ ...currentData, phone: userInput })
      } else {
        const nextMsg: Message = {
          sender: "bot",
          text: "Perfect! What product or service are you looking to print? (e.g. Visiting Cards, Food Packaging, Custom Stickers) 📦",
          timestamp: new Date(),
          isQuoteForm: true,
          quoteStep: "product",
          quoteData: { ...currentData, phone: userInput },
        }
        setMessages((prev) => [...prev, nextMsg])
      }
    } else if (currentStep === "product") {
      // Product received, complete flow
      completeQuoteFlow({ ...currentData, product: userInput })
    }
  }

  const completeQuoteFlow = (finalData: { name?: string; phone?: string; product?: string }) => {
    const finalMsg: Message = {
      sender: "bot",
      text: `Thank you, ${finalData.name}! I've collected your request:\n\n• *Name:* ${finalData.name}\n• *Mobile:* ${finalData.phone}\n• *Requirement:* ${finalData.product}\n\nI am opening WhatsApp to connect you directly with our printing expert to finalize your custom quote!`,
      timestamp: new Date(),
      isQuoteForm: true,
      quoteStep: "done",
      quoteData: finalData,
    }
    setMessages((prev) => [...prev, finalMsg])

    // Generate WhatsApp URL and redirect
    const waText = `Hello Easy Prints! I need a quote:
    
*Product/Service:* ${finalData.product}
*Name:* ${finalData.name}
*Mobile:* ${finalData.phone}

Please let me know the details.`
    const url = `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(waText)}`
    setTimeout(() => {
      window.open(url, "_blank")
    }, 1500)
  }

  const respondToQuery = (query: string) => {
    // 1. Check if user wants to speak to expert / fallback
    if (query.includes("expert") || query.includes("talk") || query.includes("call") || query.includes("speak") || query.includes("phone") || query.includes("contact")) {
      sendFallbackResponse("Here's our direct contact info:")
      return
    }

    // 2. Check if user wants a quote
    if (query.includes("quote") || query.includes("pricing") || query.includes("cost") || query.includes("enquiry")) {
      startQuoteFlow()
      return
    }

    // 3. Search database for category or product matching
    let matchedProduct: ProductData | undefined = undefined
    let matchedVariationName = ""

    for (const p of products) {
      if (query.includes(p.name.toLowerCase()) || query.includes(p.slug.replace(/-/g, " "))) {
        matchedProduct = p
        break
      }
      // Check variations
      if (p.variations) {
        for (const v of p.variations) {
          if (query.includes(v.name.toLowerCase()) || query.includes(v.slug.replace(/-/g, " "))) {
            matchedProduct = p
            matchedVariationName = v.name
            break
          }
        }
      }
    }

    // 4. Custom context answering
    if (matchedProduct) {
      const prodName = matchedVariationName ? `${matchedVariationName} (${matchedProduct.name})` : matchedProduct.name
      const text = `Yes! We offer premium *${prodName}*.\n\n${matchedProduct.description}\n\n• *Starting Price:* ₹${matchedProduct.priceStarting}+\n• *Features:* ${matchedProduct.features.slice(0, 3).join(", ")}\n\nWould you like to get a customized quote for this?`
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text,
          timestamp: new Date(),
          suggestions: [`Get quote for ${matchedProduct?.name}`, "Explore options", "Talk to Expert"],
        },
      ])
      return
    }

    // General query fallbacks
    if (query.includes("delivery") || query.includes("time") || query.includes("speed")) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "🚚 *Delivery Details:*\nOur standard delivery timeframe across Purnia is 24-48 hours. Express same-day production is available for select items. For other regions in Bihar, shipping takes 2-4 days.",
          timestamp: new Date(),
          suggestions: ["Get Quote", "Talk to Expert"],
        },
      ])
      return
    }

    if (query.includes("design") || query.includes("artwork") || query.includes("help")) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "🎨 *Design Support:*\nDon't worry if you don't have a design ready! We offer free design assistance with every printing order. Our professional design team will coordinate with you to create the perfect print files.",
          timestamp: new Date(),
          suggestions: ["Get Quote", "Talk to Expert"],
        },
      ])
      return
    }

    if (query.includes("bulk") || query.includes("wholesale") || query.includes("discount")) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "📈 *Bulk Orders:*\nWe offer special discounted rates for corporate bulk printing and events. Let me know what you'd like to print, or request a custom quote to discuss bulk volume discounts!",
          timestamp: new Date(),
          suggestions: ["Get Quote", "Talk to Expert"],
        },
      ])
      return
    }

    // No confident matches, execute RAG fallback requirement
    sendFallbackResponse()
  }

  const sendFallbackResponse = (introText = "I’d recommend speaking directly with our printing expert for accurate assistance.") => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: `${introText}\n\n📞 *Call Now:* ${SITE.contact.phone}\n💬 *WhatsApp:* ${SITE.contact.phone}`,
        timestamp: new Date(),
        suggestions: ["Get Quote", "Start Over"],
      },
    ])
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Start Over") {
      initializeWelcomeChat()
      return
    }
    if (suggestion === "Talk to Expert") {
      sendFallbackResponse()
      return
    }
    if (suggestion === "Get Quote") {
      startQuoteFlow()
      return
    }
    if (suggestion.startsWith("Get quote for ")) {
      const pName = suggestion.replace("Get quote for ", "")
      startQuoteFlow(pName)
      return
    }
    handleSend(suggestion)
  }

  const clearChat = () => {
    localStorage.removeItem("ep_chat_history")
    initializeWelcomeChat()
  }

  return (
    <>
      {/* Floating Button (Bottom Left) */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center gap-2 bg-[#1A1A2E] text-white px-5 py-3 rounded-full shadow-2xl hover:bg-[#FF6B35] transition-all duration-300 hover:scale-105 border border-white/10"
      >
        <MessageSquare className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-semibold hidden sm:inline">Ask AI Consultant</span>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-0 left-0 right-0 top-1/2 sm:top-auto sm:bottom-20 sm:left-6 z-50 w-full sm:w-[400px] h-auto sm:h-[550px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
            {/* Header */}
            <div className="bg-[#1A1A2E] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B35] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm">Print AI Consultant</h3>
                  <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping" />
                    Online &amp; Active
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearChat}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                  title="Clear conversation history"
                >
                  Clear Chat
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, index) => {
                const isBot = msg.sender === "bot"
                return (
                  <div key={index} className="space-y-2">
                    <div className={cn("flex items-start gap-2 max-w-[85%]", isBot ? "mr-auto" : "ml-auto flex-row-reverse")}>
                      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm", isBot ? "bg-[#1A1A2E] text-[#FF6B35]" : "bg-[#FF6B35] text-white")}>
                        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      
                      <div className="space-y-2 w-full">
                        <div className={cn(
                          "px-4 py-3 rounded-2xl text-xs md:text-sm shadow-sm whitespace-pre-wrap leading-relaxed border",
                          isBot 
                            ? "bg-white text-gray-800 border-gray-100 rounded-tl-none" 
                            : "bg-[#1A1A2E] text-white border-transparent rounded-tr-none"
                        )}>
                          {msg.text}

                          {/* Render dynamic CTA call actions if fallback matches */}
                          {msg.text.includes("Call Now:") && (
                            <div className="mt-4 flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                              <a
                                href={`tel:${SITE.contact.phone}`}
                                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1A1A2E] hover:bg-[#FF6B35] text-white rounded-xl font-bold text-xs transition-colors text-center w-full"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                Call Direct
                              </a>
                              <a
                                href={`https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent("Hello, I need assistance regarding printing services.")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-xs transition-colors text-center w-full"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Suggestions buttons */}
                    {isBot && msg.suggestions && (
                      <div className="flex flex-wrap gap-2 pl-9">
                        {msg.suggestions.map((sug) => (
                          <button
                            key={sug}
                            onClick={() => handleSuggestionClick(sug)}
                            className="px-3 py-1.5 bg-white hover:bg-[#FF6B35] border border-gray-200 hover:border-transparent text-gray-700 hover:text-white rounded-full text-xs font-semibold shadow-sm transition-all"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {isTyping && (
                <div className="flex items-center gap-2 max-w-[80%] mr-auto">
                  <div className="w-7 h-7 rounded-full bg-[#1A1A2E] text-[#FF6B35] flex items-center justify-center shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(inputValue)
              }}
              className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2 items-center"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask something (e.g. Matte cards pricing)..."
                className="flex-grow border-gray-200 focus:border-[#FF6B35] focus:ring-[#FF6B35] rounded-xl text-xs md:text-sm"
              />
              <button
                type="submit"
                className="p-3 bg-[#FF6B35] hover:bg-[#E55A2B] text-white rounded-xl shadow-md transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
