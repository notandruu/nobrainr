"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Brain, Search, TrendingUp, Users, Star, ArrowRight } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import LoadingScreen from "@/components/loading-screen"
import { getPopularSearchTerms } from "@/utils/search"
import { useSmoothNavigation } from "@/hooks/use-smooth-navigation" // Import useSmoothNavigation

export default function NobrainrHome() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [currentSearchQuery, setCurrentSearchQuery] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>(
    [],
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { navigateTo } = useSmoothNavigation() // Use the hook

  const suggestedSearches = getPopularSearchTerms().slice(0, 3)

  // Clear any existing search timeout
  const clearSearchTimeout = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
    }
  }, [])

  // Reset search state
  const resetSearchState = useCallback(() => {
    setIsSearching(false)
    setCurrentSearchQuery("")
    clearSearchTimeout()
  }, [clearSearchTimeout])

  useEffect(() => {
    setIsLoaded(true)

    // Reset search state when component mounts
    resetSearchState()

    // Initialize particles
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 1.5 + 0.3,
    }))
    setParticles(newParticles)

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Particle animation
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y - particle.speed,
          x: particle.x + Math.sin(particle.y * 0.008) * 0.3,
          ...(particle.y < -10 && {
            y: window.innerHeight + 10,
            x: Math.random() * window.innerWidth,
          }),
        })),
      )
    }

    window.addEventListener("mousemove", handleMouseMove)
    const particleInterval = setInterval(animateParticles, 60)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(particleInterval)
      clearSearchTimeout()
    }
  }, [resetSearchState, clearSearchTimeout])

  const performSearch = useCallback(
    async (searchTerm: string) => {
      const trimmedQuery = searchTerm.trim()

      if (!trimmedQuery) return

      // Clear any existing timeout
      clearSearchTimeout()

      setCurrentSearchQuery(trimmedQuery)
      setIsSearching(true)

      // Random loading time between 2.5-5 seconds
      const loadingTime = Math.random() * 2500 + 2500

      searchTimeoutRef.current = setTimeout(() => {
        try {
          router.push(`/results?q=${encodeURIComponent(trimmedQuery)}`)
        } catch (error) {
          console.error("Navigation error:", error)
          // Reset state if navigation fails
          resetSearchState()
        }
      }, loadingTime)

      // Failsafe timeout to prevent infinite loading (10 seconds max)
      setTimeout(() => {
        if (searchTimeoutRef.current) {
          console.warn("Search timeout exceeded, resetting state")
          resetSearchState()
        }
      }, 10000)
    },
    [router, clearSearchTimeout, resetSearchState],
  )

  const handleSearch = useCallback(
    async (query: string = searchQuery) => {
      await performSearch(query)
    },
    [searchQuery, performSearch],
  )

  const handleSuggestedSearch = useCallback(
    async (suggestion: string) => {
      // Update the search input to match the suggestion
      setSearchQuery(suggestion)
      // Immediately trigger the search
      await performSearch(suggestion)
    },
    [performSearch],
  )

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    },
    [handleSearch],
  )

  // Show loading screen when searching
  if (isSearching) {
    return (
      <div>
        <LoadingScreen searchQuery={currentSearchQuery} />
        {/* Emergency cancel button */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={resetSearchState}
            variant="outline"
            className="bg-slate-800/80 backdrop-blur-sm border-slate-600/50 hover:border-red-400/50 text-slate-300 hover:text-red-300 px-4 py-2 rounded-lg transition-all duration-300"
          >
            Cancel Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0b1120] relative overflow-hidden"
      style={{
        background: `
        radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(127, 90, 240, 0.15) 0%, transparent 50%),
        #0b1120
      `,
      }}
    >
      {/* Dynamic Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-purple-400/30 animate-pulse"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              boxShadow: `0 0 ${particle.size * 3}px rgba(127, 90, 240, 0.4)`,
            }}
          />
        ))}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-mega-float"></div>
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-mega-float-reverse"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-violet-500/15 rounded-full blur-2xl animate-pulse-mega"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-purple-400/15 rounded-full blur-2xl animate-bounce-mega"></div>

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-purple-400/40 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-indigo-400/40 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-violet-400/50 animate-ping"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-purple-500/40 rotate-45 animate-spin-reverse"></div>
      </div>

      {/* Header */}
      <header
        className={`flex justify-center items-center p-4 md:p-6 transition-all duration-1000 backdrop-blur-sm ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <div className="flex items-center gap-2 md:gap-4">
          <div
            className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500/40 to-indigo-500/40 rounded-full flex items-center justify-center animate-brain-pulse backdrop-blur-sm border border-purple-400/30 cursor-pointer"
            onClick={() => navigateTo("/")} // Added onClick
          >
            <Brain className="w-4 md:w-5 h-4 md:h-5 text-purple-300" />
          </div>
          <span
            className="text-white font-bold text-lg md:text-xl animate-glow-text cursor-pointer hover:scale-110 transition-transform duration-300"
            onClick={() => navigateTo("/")} // Added onClick
          >
            nobrainr.app
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 md:px-6 lg:px-12 xl:px-16 py-8 lg:py-12 gap-8 md:gap-12 max-w-4xl mx-auto min-h-[calc(100vh-120px)]">
        {/* Hero Content */}
        <div className="text-center max-w-3xl opacity-0 animate-smooth-fade-up delay-300">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 md:mb-8">
            <span className="inline-block opacity-0 animate-smooth-hero-text delay-500 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
              Find the Best Gaming{" "}
            <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-violet-200 bg-clip-text text-transparent">
              Products{" "}
            <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent pb-1 inline-block">
              Instantly.
              </span>
            </span>
          </span>
          </h1>

          <p className="text-slate-300 text-lg md:text-xl mb-8 md:mb-12 opacity-0 animate-smooth-fade-in delay-900">
            <span className="text-slate-300 font-semibold">Analyzed by AI.</span>{" "}
            <span className="text-slate-300 font-semibold">Trusted by Reddit.</span>{" "}
            <span className="text-slate-300 font-semibold">Built for gamers.</span>
          </p>

          {/* Search Section */}
          <div className="w-full max-w-2xl mx-auto space-y-6 opacity-0 animate-smooth-search-bar delay-1100">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-indigo-500/40 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 animate-phone-glow"></div>
              <div className="relative flex items-center bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 hover:border-purple-400/50 transition-all duration-300 group-hover:scale-[1.02]">
                <Search className="w-5 h-5 text-slate-400 ml-4 mr-3 animate-zap-glow" />
                <Input
                  type="text"
                  placeholder="best gaming mouse"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent border-none text-white placeholder:text-slate-400 focus:ring-0 focus:outline-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                  autoFocus
                />
                <Button
                  onClick={() => handleSearch()}
                  size="lg"
                  disabled={isSearching}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white px-6 py-3 rounded-xl font-semibold hover:scale-110 transition-all duration-300 animate-button-glow-epic border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Suggested Searches */}
            <div className="flex flex-wrap justify-center gap-3">
              {suggestedSearches.map((suggestion, index) => (
                <Button
                  key={index}
                  onClick={() => handleSuggestedSearch(suggestion)}
                  variant="outline"
                  disabled={isSearching}
                  className={`bg-slate-800/40 backdrop-blur-sm border-slate-600/50 hover:border-purple-400/50 text-slate-300 hover:text-white px-4 py-2 rounded-full text-sm hover:scale-110 transition-all duration-300 hover:bg-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 opacity-0 animate-smooth-slide-up delay-${1300 + index * 100}`}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 w-full max-w-4xl">
          {/* --- Card 1 ------------------------------------------------------- */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50 hover:border-purple-400/50 hover:bg-slate-800/80 transition-all duration-500 hover:scale-105 hover:rotate-1 group animate-card-float opacity-0 animate-smooth-card-entrance delay-1600">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 animate-icon-glow">
                <Users className="w-6 h-6 text-white animate-users-glow" />
              </div>
              <CardTitle className="text-white group-hover:text-purple-200 transition-colors duration-300">
                Reddit Approved Picks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 group-hover:text-white transition-colors duration-300">
                Real reviews from real gamers. We crunch thousands of Reddit comments to surface the most up-voted gear.
              </p>
            </CardContent>
          </Card>

          {/* --- Card 2 ------------------------------------------------------- */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50 hover:border-indigo-400/50 hover:bg-slate-800/80 transition-all duration-500 hover:scale-105 hover:rotate-1 group animate-card-float delay-200 opacity-0 animate-smooth-card-entrance delay-1800">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 animate-icon-glow">
                <Brain className="w-6 h-6 text-white animate-brain-pulse" />
              </div>
              <CardTitle className="text-white group-hover:text-indigo-200 transition-colors duration-300">
                AI Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 group-hover:text-white transition-colors duration-300">
                Our AI processes long threads into short, no-brainer takeaways so you can decide in seconds, not hours.
              </p>
            </CardContent>
          </Card>

          {/* --- Card 3 ------------------------------------------------------- */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50 hover:border-violet-400/50 hover:bg-slate-800/80 transition-all duration-500 hover:scale-105 hover:rotate-1 group animate-card-float delay-400 opacity-0 animate-smooth-card-entrance delay-2000">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 animate-icon-glow">
                <TrendingUp className="w-6 h-6 text-white animate-trend-glow" />
              </div>
              <CardTitle className="text-white group-hover:text-violet-200 transition-colors duration-300">
                Game Changing Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 group-hover:text-white transition-colors duration-300">
                Curated for gamers, affordable, high-quality picks that boost performance and actually deliver value.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-slate-400 opacity-0 animate-smooth-fade-in delay-2200">
          <div className="flex items-center gap-2 hover:text-purple-300 transition-colors duration-300">
            <Star className="w-4 h-4 animate-star-glow" />
            <span className="text-sm">10M+ Reddit Comments Analyzed</span>
          </div>
          <div className="flex items-center gap-2 hover:text-indigo-300 transition-colors duration-300">
            <Users className="w-4 h-4 animate-users-glow" />
            <span className="text-sm">Trusted by 50K+ Gamers</span>
          </div>
          <div className="flex items-center gap-2 hover:text-violet-300 transition-colors duration-300">
            <TrendingUp className="w-4 h-4 animate-trend-glow" />
            <span className="text-sm">Updated Daily</span>
          </div>
        </div>
      </div>
    </div>
  )
}
