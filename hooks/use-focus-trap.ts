"use client"

import { useEffect, useRef } from "react"

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    if (!container) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      return container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) as NodeListOf<HTMLElement>
    }

    const focusableElements = getFocusableElements()
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus the first element
    if (firstElement) {
      firstElement.focus()
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener("keydown", handleTabKey)

    return () => {
      document.removeEventListener("keydown", handleTabKey)

      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isActive])

  return containerRef
}
