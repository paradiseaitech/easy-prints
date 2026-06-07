"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Volume2, VolumeX, ShieldCheck, Play } from "lucide-react"
import { Section, SectionHeader } from "@/components/ui/section"
import { ScrollReveal } from "@/components/shared/scroll-reveal"

interface ReelData {
  id: number
  title: string
  description: string
  src: string
  category: string
  gradient: string
}

const reelsData: ReelData[] = [
  {
    id: 1,
    title: "Premium Prints in Action",
    description: "Watch our high-speed digital printing precision.",
    src: "/video/Reel1.mp4",
    category: "Digital Printing",
    gradient: "from-[#FF6B35] to-[#FF8F65]",
  },
  {
    id: 2,
    title: "Custom Apparel Printing",
    description: "Behind the scenes of our premium custom t-shirt prints.",
    src: "/video/Reel2.mp4",
    category: "T-Shirt Print",
    gradient: "from-[#1A1A2E] to-[#16213E]",
  },
  {
    id: 3,
    title: "Eco Box Packaging",
    description: "Creating premium biodegradable carton packages.",
    src: "/video/Reel3.MOV",
    category: "Packaging Box",
    gradient: "from-[#0F3460] to-[#16213E]",
  },
]

function ReelCard({ reel }: { reel: ReelData }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isNearViewport, setIsNearViewport] = useState(false)

  // Phase 1: Near Viewport Observer (for lazy loading source)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const lazyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true)
            lazyObserver.unobserve(container)
          }
        });
      },
      { rootMargin: "400px 0px 400px 0px" } // Load video when user is within 400px scroll distance
    )

    lazyObserver.observe(container)
    return () => {
      lazyObserver.disconnect()
    }
  }, [])

  // Phase 2: Visibility Observer (for playing/pausing)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playbackObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                // Autoplay blocked or interrupted
                setIsPlaying(false)
              })
          } else {
            video.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.4 } // Trigger when 40% of the video card is visible
    )

    playbackObserver.observe(video)
    return () => {
      playbackObserver.disconnect()
    }
  }, [isNearViewport])

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  return (
    <div
      ref={containerRef}
      className="w-full relative aspect-[9/16] rounded-3xl bg-black overflow-hidden shadow-lg border border-gray-800/10 group cursor-pointer"
      onClick={toggleMute}
    >
      {/* Background Gradient Fallback */}
      <div className={`absolute inset-0 bg-gradient-to-br ${reel.gradient} opacity-40`} />

      {/* Lazy Video Component */}
      {isNearViewport && (
        <video
          ref={videoRef}
          src={reel.src}
          className="absolute inset-0 w-full h-full object-cover z-0"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
        />
      )}

      {/* Gloss reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none" />

      {/* Top Details */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF6B35] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          {reel.category}
        </span>
        <div className="flex items-center gap-1.5 text-[10px] text-white/80 font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>Verified Work</span>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
        <h3 className="text-white font-heading font-extrabold text-base leading-tight">
          {reel.title}
        </h3>
        <p className="text-xs text-white/70 mt-1.5 leading-snug line-clamp-2">
          {reel.description}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center text-[10px] text-white font-black">
            EP
          </div>
          <div>
            <p className="text-[10px] text-white/90 font-bold">Easy Prints</p>
            <p className="text-[8px] text-white/40">Purnia, Bihar</p>
          </div>
        </div>
      </div>

      {/* Mute/Play Controls Overlay */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-30 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-[#FF6B35] hover:border-transparent transition-all"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Play state indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-[#FF6B35]/80 backdrop-blur-sm flex items-center justify-center text-white scale-90 opacity-80 group-hover:scale-100 group-hover:opacity-100 transition-all">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      )}
    </div>
  )
}

export function ReelsSection() {
  return (
    <Section className="bg-gray-950 text-white overflow-hidden py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#FF6B35] tracking-widest uppercase px-3 py-1 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20">
            Work Samples
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mt-4">
            See Our Work in Action
          </h2>
          <p className="mt-4 text-gray-400 text-sm md:text-base">
            Watch our high-speed manufacturing processes, precise cutting machinery, and final print products.
          </p>
        </div>

        <ScrollReveal>
          {/* Stacks vertically on mobile (grid-cols-1), and 3-col grid on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-6 md:pb-0">
            {reelsData.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </Section>
  )
}
