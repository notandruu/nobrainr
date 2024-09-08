"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Brain,
  Search,
  ArrowLeft,
  ExternalLink,
  Star,
  MessageCircle,
  TrendingUp,
  ShoppingCart,
  ArrowRight,
} from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import LoadingScreen from "@/components/loading-screen"
import { useSmoothNavigation } from "@/hooks/use-smooth-navigation"
import { type SearchResult, getPopularSearchTerms } from "@/utils/search"

function ResultsContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [currentSearchQuery, setCurrentSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>(
    [],
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { navigateTo, navigateBack } = useSmoothNavigation()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

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
    setSearchQuery(query)

    // Reset search state when component mounts or query changes
    resetSearchState()

    // Fetch results from Gemini via API route
    if (query.trim()) {
      setIsFetching(true)
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.results) setSearchResults(data.results)
          setIsFetching(false)
        })
        .catch(() => {
          setSearchResults([])
          setIsFetching(false)
        })
    }

    // Initialize particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
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
  }, [query, resetSearchState, clearSearchTimeout])

  const performSearch = useCallback(
    async (searchTerm: string) => {
      const trimmedQuery = searchTerm.trim()

      // Don't search if empty or same as current query
      if (!trimmedQuery || trimmedQuery === query.trim()) {
        return
      }

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
    [query, router, clearSearchTimeout, resetSearchState],
  )

  const handleSearch = useCallback(
    async (newQuery: string = searchQuery) => {
      await performSearch(newQuery)
    },
    [searchQuery, performSearch],
  )

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    },
    [handleSearch],
  )

  const handleRedditClick = useCallback((redditLink: string) => {
    window.open(redditLink, "_blank", "noopener,noreferrer")
  }, [])

  const handleAmazonClick = useCallback((amazonLink: string) => {
    window.open(amazonLink, "_blank", "noopener,noreferrer")
  }, [])

  const goBack = useCallback(() => {
    resetSearchState()
    navigateTo("/")
  }, [navigateTo, resetSearchState])

  const handleSuggestedSearch = useCallback(
    (suggestion: string) => {
      setSearchQuery(suggestion)
      handleSearch(suggestion)
    },
    [handleSearch],
  )

  // Emergency escape hatch - if user clicks anywhere while searching, allow them to cancel

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
    radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    #0b1120
  `,
      }}
    >
      {/* Dynamic Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.slice(0, 15).map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-purple-400/20 animate-pulse"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-mega-float"></div>
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-mega-float-reverse"></div>
      </div>

      {/* Header */}
      <header
        className={`flex justify-between items-center p-4 md:p-6 transition-all duration-1000 backdrop-blur-sm ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <Button
          onClick={goBack}
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

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

      {/* Search Bar */}
      <div className="px-4 md:px-6 lg:px-12 xl:px-16 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative flex items-center bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 hover:border-purple-400/50 transition-all duration-300 group-hover:scale-[1.02]">
              <Search className="w-5 h-5 text-slate-400 ml-4 mr-3 animate-zap-glow" />
              <Input
                type="text"
                placeholder="best gaming mouse"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-none text-white placeholder:text-slate-400 focus:ring-0 focus:outline-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
              />
              <Button
                onClick={() => handleSearch()}
                size="lg"
                disabled={isSearching}
                className="bg-gradient-to-r from-[#7F5AF0] to-[#5D3FD3] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold hover:scale-110 transition-all duration-300 border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="px-4 md:px-6 lg:px-12 xl:px-16 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4 animate-text-epic">
            <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
              {query.trim() ? `Top Reddit Picks for "${query}"` : "Top Rated Products"}
            </span>
          </h1>
          <p className="text-slate-300 text-lg animate-text-fade-in">
            {searchResults.length > 0
              ? `${searchResults.length} highly recommended ${searchResults.length === 1 ? "product" : "products"} from Reddit's gaming community`
              : query.trim()
                ? "No products found for this search. Try different keywords."
                : "Showing all products ranked by rating"}
          </p>
        </div>
      </div>

      {/* Product Cards */}
      <div className="px-4 md:px-6 lg:px-12 xl:px-16 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {isFetching ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-brain-pulse border border-purple-400/30">
                <Brain className="w-8 h-8 text-purple-300 animate-pulse" />
              </div>
              <p className="text-slate-300 text-lg">Scanning Reddit for the best picks...</p>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((result, index) => {
              const { product } = result
              return (
                <Card
                  key={product.id}
                  className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50 hover:border-purple-400/50 hover:bg-slate-800/80 transition-all duration-500 hover:scale-[1.02] group animate-card-float overflow-hidden opacity-0 animate-smooth-product-card"
                  style={{
                    animationDelay: `${0.1 + index * 0.15}s`,
                  }}
                >
                  <div className="md:flex">
                    {/* Product Image */}
                    <div className="md:w-1/3 relative">
                      <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none bg-gradient-to-br from-gray-50 to-white">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="md:w-2/3 p-6">
                      <CardHeader className="p-0 mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <CardTitle className="text-white text-xl transition-colors duration-300 flex-1">
                            {product.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 ml-4">
                            <div
                              className="flex items-center gap-1 bg-gray-700/30 px-3 py-1 rounded-full border border-gray-600/30 cursor-pointer transition-all duration-300 group/rating
                              hover:bg-gradient-to-r hover:from-[#7F5AF0]/30 hover:to-[#5D3FD3]/30 hover:border-purple-400/50"
                              onClick={() => navigateTo("/how-we-rate")}
                            >
                              <Star className="w-4 h-4 text-gray-400 animate-star-spin group-hover/rating:text-white transition-colors duration-300" />
                              <span className="text-gray-300 font-semibold group-hover/rating:text-white transition-colors duration-300">
                                {product.score}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Reddit Quote - Clickable */}
                        <div
                          className="bg-slate-700/40 rounded-lg p-4 border-l-4 border-purple-400/50 mb-4 cursor-pointer hover:bg-slate-700/60 transition-colors duration-300"
                          onClick={() => handleRedditClick(product.redditLink)}
                        >
                          <p className="text-slate-200 italic mb-2">"{product.redditQuote}"</p>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300 text-sm font-medium hover:text-purple-200 transition-colors duration-300">
                              – {product.subreddit}
                            </span>
                            <ExternalLink className="w-3 h-3 text-purple-400 ml-1" />
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-400 text-sm">{product.mentions.toLocaleString()} mentions</span>
                          </div>
                          <div className="flex gap-1">
                            {product.subreddits.slice(0, 3).map((sub, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-transparent text-gray-400 text-xs border-gray-600/50 pointer-events-none"
                              >
                                {sub}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-0">
                        {/* Pricing */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-white text-2xl font-bold">${product.price}</span>
                            {product.savings > 0 && (
                              <>
                                <span className="text-slate-400 line-through">${product.originalPrice}</span>
                                <Badge className="bg-gray-700/30 text-gray-400 border border-gray-600/30">
                                  Save ${product.savings} ({product.savingsPercent}%)
                                </Badge>
                              </>
                            )}
                          </div>
                          <Button
                            className="bg-gradient-to-r from-[#7F5AF0] to-[#5D3FD3] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold hover:scale-110 transition-all duration-300 border border-purple-400/30 w-full sm:w-auto"
                            onClick={() => handleAmazonClick(product.amazonLink)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            View on Amazon
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </div>

                        {/* Affiliate Disclaimer */}
                        <div className="mb-4">
                          <p className="text-slate-400 text-xs italic">
                            This is an affiliate link – we may earn a small commission.
                          </p>
                        </div>

                        {/* Why We Picked This */}
                        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/50">
                          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-gray-400" />
                            Why We Picked This
                          </h4>
                          <p className="text-slate-300 text-sm">{product.whyPicked}</p>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <div className="text-center py-16 opacity-0 animate-smooth-fade-up delay-300">
              <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-brain-pulse backdrop-blur-sm border border-purple-400/30">
                <Search className="w-12 h-12 text-purple-300" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-4">No Results Found</h2>
              <p className="text-slate-300 text-lg mb-8">
                Our AI couldn't find enough Reddit discussions about your search. Try a broader search term!
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {getPopularSearchTerms()
                  .slice(0, 5)
                  .map((suggestion, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSuggestedSearch(suggestion)}
                      variant="outline"
                      className={`bg-gray-800/40 backdrop-blur-sm border-gray-600/50 hover:border-gray-500/50 text-gray-400 hover:text-gray-300 px-4 py-2 rounded-full text-sm hover:scale-110 transition-all duration-300 hover:bg-gray-700/20 opacity-0 animate-smooth-slide-up delay-${500 + index * 100}`}
                    >
                      {suggestion}
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Again */}
        <div className="max-w-2xl mx-auto mt-12 text-center opacity-0 animate-smooth-fade-in delay-1000">
          <p className="text-slate-400 mb-4">Looking for something else?</p>
          <Button
            onClick={goBack}
            variant="outline"
            className="bg-gray-800/40 backdrop-blur-sm border-gray-600/50 hover:border-gray-500/50 text-gray-400 hover:text-gray-300 px-6 py-3 rounded-xl hover:scale-110 transition-all duration-300 hover:bg-gray-700/20"
          >
            <Search className="w-4 h-4 mr-2" />
            Try Another Search
          </Button>
        </div>

        {/* Credits */}
        <div className="max-w-4xl mx-auto mt-8 text-center border-t border-slate-700/50 pt-6 opacity-0 animate-smooth-fade-in delay-1200">
          <p className="text-slate-500 text-sm">© 2025 nobrainr.app · Reddit + AI</p>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return <ResultsContent />
}
