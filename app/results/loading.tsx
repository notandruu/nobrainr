export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/40 to-indigo-500/40 rounded-full flex items-center justify-center mx-auto mb-4 animate-brain-pulse">
          <div className="w-8 h-8 text-purple-300" />
        </div>
        <p className="text-white text-lg animate-glow-text">Finding Reddit's most upvoted gear...</p>
      </div>
    </div>
  )
}
