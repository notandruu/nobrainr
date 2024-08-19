"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function useSmoothNavigation() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const navigateTo = (path: string) => {
    setIsNavigating(true)

    // Small delay to show loading state
    setTimeout(() => {
      router.push(path)
      setIsNavigating(false)
    }, 100)
  }

  const navigateBack = () => {
    setIsNavigating(true)

    setTimeout(() => {
      router.back()
      setIsNavigating(false)
    }, 100)
  }

  return {
    navigateTo,
    navigateBack,
    isNavigating,
  }
}
