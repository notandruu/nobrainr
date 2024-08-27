"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowLeft, Users, TrendingUp, CheckCircle } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useSmoothNavigation } from "@/hooks/use-smooth-navigation"

export default function HowWeRatePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>(
    [],
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const { navigateBack, navigateTo } = useSmoothNavigation()

  useEffect(() => {
    setIsLoaded(true)

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
    }
  }, [])

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
        className={`flex justify-between items-center p-4 md:p-6 transition-all duration-1000 backdrop-blur-sm ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <Button
          onClick={navigateBack}
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-2 md:gap-4">
          <div
            className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500/40 to-indigo-500/40 rounded-full flex items-center justify-center animate-brain-pulse backdrop-blur-sm border border-purple-400/30 cursor-pointer"
            onClick={() => navigateTo("/")}
          >
            <Brain className="w-4 md:w-5 h-4 md:h-5 text-purple-300" />
          </div>
          <span
            className="text-white font-bold text-lg md:text-xl animate-glow-text cursor-pointer hover:scale-110 transition-transform duration-300"
            onClick={() => navigateTo("/")}
          >
            nobrainr.app
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-start px-4 md:px-6 lg:px-12 xl:px-16 py-8 lg:py-12 gap-8 md:gap-12 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div
          className={`text-center max-w-3xl ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{
            transition: "opacity 1s ease-out 0.5s, transform 1s ease-out 0.5s",
          }}
        >
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8 animate-text-epic">
            <span className="inline-block animate-slide-up-epic delay-600 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
              How We Rate
            </span>
            <br />
            <span className="inline-block animate-slide-up-epic delay-800 bg-gradient-to-r from-indigo-200 via-purple-200 to-violet-200 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
        </div>

        {/* Main Content Cards */}
        <div
          className={`w-full max-w-4xl space-y-8 transition-all duration-500 delay-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Our Solution */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50 hover:border-purple-400/50 hover:bg-slate-800/80 transition-all duration-500 hover:scale-[1.02] group animate-card-float delay-200">
            <CardHeader>
              <CardTitle className="text-white text-2xl group-hover:text-purple-200 transition-colors duration-300 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center animate-icon-glow">
                  <Brain className="w-5 h-5 text-white animate-brain-pulse" />
                </div>
                How We Find the Good Stuff
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 mt-1 animate-zap-glow" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Reddit Analysis</h4>
                    <p className="text-slate-300 group-hover:text-white transition-colors duration-300">
                      We scan thousands of Reddit comments across gaming, tech, and product subreddits to find what
                      people actually recommend.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 mt-1 animate-zap-glow" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Sentiment Processing</h4>
                    <p className="text-slate-300 group-hover:text-white transition-colors duration-300">
                      Our AI analyzes the tone, context, and authenticity of reviews to filter out fake or sponsored
                      content.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 mt-1 animate-zap-glow" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Community Validation</h4>
                    <p className="text-slate-300 group-hover:text-white transition-colors duration-300">
                      We look at upvotes, replies, and follow-up comments to see which recommendations actually help
                      people.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transparency */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50 hover:border-indigo-400/50 hover:bg-slate-800/80 transition-all duration-500 hover:scale-[1.02] group animate-card-float delay-400">
            <CardHeader>
              <CardTitle className="text-white text-2xl group-hover:text-indigo-200 transition-colors duration-300 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center animate-icon-glow">
                  <Users className="w-5 h-5 text-white animate-users-glow" />
                </div>
                Full Transparency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                <strong className="text-white">Yes, we use Amazon affiliate links.</strong> If you buy something and
                keep it, we may earn a small commission. This helps us cover the bare minimum to keep the site running.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                That’s why we focus on recommending products you’ll actually love, trust, and want to keep. If you
                return it, we don’t earn anything.
              </p>
              <div className="bg-slate-700/40 rounded-lg p-4 border-l-4 border-indigo-400/50">
                <p className="text-slate-200 font-medium">
                  We never accept paid placements, sponsored posts, or money from brands to feature their products. Our
                  recommendations come from community data, period.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Scoring System */}
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50 hover:border-violet-400/50 hover:bg-slate-800/80 transition-all duration-500 hover:scale-[1.02] group animate-card-float delay-600">
            <CardHeader>
              <CardTitle className="text-white text-2xl group-hover:text-violet-200 transition-colors duration-300 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center animate-icon-glow">
                  <TrendingUp className="w-5 h-5 text-white animate-trend-glow" />
                </div>
                Our Scoring System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                Our scores (like the 9.4 you see on product cards) combine several factors:
              </p>
              <ul className="space-y-2 text-slate-300 group-hover:text-white transition-colors duration-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>
                    <strong>Mention frequency</strong> — How often people recommend it
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>
                    <strong>Sentiment analysis</strong> — How positive the language is
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>
                    <strong>Community engagement</strong> — Upvotes and helpful replies
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>
                    <strong>Long-term satisfaction</strong> — Follow-up posts about durability
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div
          className={`transition-all duration-500 delay-1200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Button
            onClick={navigateBack}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white px-8 py-4 text-lg rounded-xl font-semibold hover:scale-110 transition-all duration-300 animate-button-glow-epic border border-purple-400/30"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Results
          </Button>
        </div>
      </div>
    </div>
  )
}
