"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      console.log("Mobile check:", { width: window.innerWidth, isMobile: mobile })
    }

    // Check on mount
    checkMobile()

    // Listen for resize events with debouncing for performance
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 150)
    }

    window.addEventListener("resize", debouncedResize)

    return () => {
      window.removeEventListener("resize", debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [])

  // Return false during SSR to prevent hydration mismatch
  return isClient ? isMobile : false
}
