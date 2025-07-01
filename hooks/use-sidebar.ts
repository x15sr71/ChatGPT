"use client"

import { useState, useEffect } from "react"

export function useSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Start closed on mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Always start closed on mobile
      if (mobile) {
        setSidebarOpen(false)
        setSidebarCollapsed(false)
      } else {
        // Desktop behavior
        setSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    console.log("Toggle sidebar called, current state:", sidebarOpen)
    setSidebarOpen((prev) => {
      const newState = !prev
      console.log("Setting sidebar to:", newState)

      // Announce state change to screen readers
      const announcement = newState ? "Navigation menu opened" : "Navigation menu closed"
      const ariaLiveRegion = document.getElementById("aria-live-region")
      if (ariaLiveRegion) {
        ariaLiveRegion.textContent = announcement
      }

      return newState
    })
  }

  const toggleSidebarCollapse = () => {
    if (!isMobile) {
      setSidebarCollapsed((prev) => !prev)
    }
  }

  const closeSidebar = () => {
    console.log("Close sidebar called")
    setSidebarOpen(false)

    // Announce closure to screen readers
    const ariaLiveRegion = document.getElementById("aria-live-region")
    if (ariaLiveRegion) {
      ariaLiveRegion.textContent = "Navigation menu closed"
    }
  }

  const openSidebar = () => {
    console.log("Open sidebar called")
    setSidebarOpen(true)

    // Announce opening to screen readers
    const ariaLiveRegion = document.getElementById("aria-live-region")
    if (ariaLiveRegion) {
      ariaLiveRegion.textContent = "Navigation menu opened"
    }
  }

  const expandSidebar = () => {
    setSidebarCollapsed(false)
  }

  const collapseSidebar = () => {
    if (!isMobile) {
      setSidebarCollapsed(true)
    }
  }

  return {
    sidebarOpen,
    sidebarCollapsed,
    isMobile,
    toggleSidebar,
    toggleSidebarCollapse,
    closeSidebar,
    openSidebar,
    expandSidebar,
    collapseSidebar,
  }
}
