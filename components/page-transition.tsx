"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Brain } from "lucide-react"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  // Mouse position for radial gradient (if needed, otherwise remove)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    // Start loading animation
    setIsLoading(true)
    setIsVisible(false)

    // Simulate loading time and then show content
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsVisible(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [pathname])

  if (isLoading) {
    return (
      <div
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

        {/* Loading Content */}
        <div className="text-center z-10">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/40 to-indigo-500/40 rounded-full flex items-center justify-center mx-auto animate-brain-pulse backdrop-blur-sm border border-purple-400/30">
              <Brain className="w-10 h-10 text-purple-300" />
            </div>

            {/* Scanning Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 border-2 border-purple-400/30 rounded-full animate-ping"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-36 h-36 border border-indigo-400/20 rounded-full animate-pulse"></div>
            </div>
          </div>

          <p className="text-white text-lg animate-glow-text">Loading...</p>

          {/* Progress Bar */}
          <div className="w-64 mx-auto mt-6">
            <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse"
                style={{ width: "100%", animation: "loadingBarFillEpic 0.8s ease-out forwards" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      {children}
    </div>
  )
}
