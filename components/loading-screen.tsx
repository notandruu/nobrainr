"use client"

import { Brain, Search, Zap, TrendingUp } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface LoadingScreenProps {
  searchQuery: string
}

const loadingMessages = [
  "Scanning Reddit for gaming insights...",
  "Analyzing thousands of user reviews...",
  "Processing AI recommendations...",
  "Finding the most upvoted products...",
  "Crunching community feedback...",
  "Discovering hidden gaming gems...",
  "Filtering through expert opinions...",
  "Compiling the best gaming gear...",
]

export default function LoadingScreen({ searchQuery }: LoadingScreenProps) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [dots, setDots] = useState("")
  const containerRef = useRef<HTMLDivElement>(null) // Added ref for mouse position

  useEffect(() => {
    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length)
    }, 800)

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 300)

    return () => {
      clearInterval(messageInterval)
      clearInterval(dotsInterval)
    }
  }, [])

  // Mouse position for radial gradient (if needed, otherwise remove)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0b1120] relative overflow-hidden flex items-center justify-center"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(127, 90, 240, 0.15) 0%, transparent 50%),
          #0b1120
        `,
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-mega-float"></div>
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-mega-float-reverse"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-violet-500/15 rounded-full blur-2xl animate-pulse-mega"></div>
      </div>

      {/* Scanning Animation Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/60 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              scale: 0,
            }}
            animate={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="text-center max-w-2xl mx-auto px-4 z-10">
        {/* AI Brain Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/40 to-indigo-500/40 rounded-full flex items-center justify-center mx-auto animate-brain-pulse backdrop-blur-sm border border-purple-400/30">
            <Brain className="w-12 h-12 text-purple-300" />
          </div>

          {/* Scanning Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-purple-400/30 rounded-full animate-ping"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border border-indigo-400/20 rounded-full animate-pulse"></div>
          </div>

          {/* Floating Icons */}
          <motion.div
            className="absolute -top-4 -right-4"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Search className="w-6 h-6 text-purple-400 animate-zap-glow" />
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-4"
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <Zap className="w-6 h-6 text-indigo-400 animate-zap-glow" />
          </motion.div>

          <motion.div
            className="absolute top-0 -left-8"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            <TrendingUp className="w-5 h-5 text-violet-400 animate-trend-glow" />
          </motion.div>
        </div>

        {/* Search Query Display - Only show if searchQuery exists */}
        {searchQuery && searchQuery.trim() && (
          <div className="mb-6">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-2 animate-text-glow">
              Searching for "{searchQuery}"
            </h2>
          </div>
        )}

        {/* Loading Message */}
        <div className="mb-8">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-slate-300 text-lg"
          >
            {loadingMessages[currentMessage]}
            {dots}
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto mb-6">
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center items-center gap-6 text-slate-400 text-sm">
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Reddit Analysis</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          >
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span>AI Processing</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          >
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
            <span>Ranking Results</span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
