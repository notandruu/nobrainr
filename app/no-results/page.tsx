"use client"

import { Button } from "@/components/ui/button"
import { Brain, Search, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NoResultsPage() {
  const router = useRouter()

  const goBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#0b1120] relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-mega-float"></div>
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-mega-float-reverse"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-violet-500/15 rounded-full blur-2xl animate-pulse-mega"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 md:p-6 backdrop-blur-sm">
        <Button
          onClick={goBack}
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500/40 to-indigo-500/40 rounded-full flex items-center justify-center animate-brain-pulse backdrop-blur-sm border border-purple-400/30">
            <Brain className="w-4 md:w-5 h-4 md:h-5 text-purple-300" />
          </div>
          <span className="text-white font-bold text-lg md:text-xl animate-glow-text cursor-pointer hover:scale-110 transition-transform duration-300">
            nobrainr.app
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="text-center max-w-2xl mx-auto px-4 z-10">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500/40 to-indigo-500/40 rounded-full flex items-center justify-center mx-auto mb-8 animate-brain-pulse backdrop-blur-sm border border-purple-400/30">
          <Search className="w-12 h-12 text-purple-300" />
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold mb-4 animate-text-epic">
          <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            No Results Found
          </span>
        </h1>

        <p className="text-slate-300 text-lg mb-8 animate-text-fade-in">
          Our AI couldn't find enough Reddit discussions about your search.Try different keywords or browse our
          suggestions.
        </p>

        <Button
          onClick={goBack}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white px-8 py-3 rounded-xl font-semibold hover:scale-110 transition-all duration-300 animate-button-glow-epic border border-purple-400/30"
        >
          <Search className="w-5 h-5 mr-2" />
          Try Another Search
        </Button>
      </div>
    </div>
  )
}
