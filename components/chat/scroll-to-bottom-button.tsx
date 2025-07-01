"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScrollToBottomButtonProps {
  containerRef: React.RefObject<HTMLElement | null>; // ✅ updated
  threshold?: number;
}


export function ScrollToBottomButton({ containerRef, threshold = 100 }: ScrollToBottomButtonProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      setIsVisible(distanceFromBottom > threshold)
    }

    container.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial state

    return () => container.removeEventListener("scroll", handleScroll)
  }, [containerRef, threshold])

  const scrollToBottom = () => {
    const container = containerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  return (
    <Button
      onClick={scrollToBottom}
      size="icon"
      className={cn(
        "fixed bottom-20 right-6 z-50 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
      )}
    >
      <ChevronDown className="h-5 w-5" />
    </Button>
  )
}
