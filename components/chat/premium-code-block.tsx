"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Edit, Save, X, ChevronDown } from "lucide-react"
import { AdvancedSyntaxHighlighter } from "@/components/syntax-highlighter/advanced-syntax-highlighter"
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea"
import { cn } from "@/lib/utils"

interface PremiumCodeBlockProps {
  code: string
  language: string
  onCopy?: () => void
  onEdit?: (newCode: string) => void
  isTyping?: boolean
  title?: string
  typingSpeed?: number
}

export function PremiumCodeBlock({
  code,
  language,
  onCopy,
  onEdit,
  isTyping = false,
  title,
  typingSpeed = 25,
}: PremiumCodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCode, setEditedCode] = useState(code)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [typingComplete, setTypingComplete] = useState(!isTyping)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const codeContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEditedCode(code)
  }, [code])

  useEffect(() => {
    const container = codeContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      setShowScrollButton(distanceFromBottom > 50)
    }

    container.addEventListener("scroll", handleScroll)
    // Check initial state after a short delay to ensure content is rendered
    setTimeout(handleScroll, 100)

    return () => container.removeEventListener("scroll", handleScroll)
  }, [code, typingComplete])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }

  const handleSave = () => {
    onEdit?.(editedCode)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedCode(code)
    setIsEditing(false)
  }

  const scrollToBottom = () => {
    const container = codeContainerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  const handleTypingComplete = () => {
    setTypingComplete(true)
  }

  return (
    <div className="relative bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden my-4 shadow-2xl">
      {/* Title Section */}
      {title && (
        <div className="px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="text-sm font-medium text-white">{title}</span>
          </div>
        </div>
      )}

      {/* Header with Language and Actions */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/10">
        <span className="text-xs text-white/70 font-mono font-medium">{language}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 h-7 px-2 text-xs font-medium transition-colors"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          {!isTyping && (
            <>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-400 hover:text-green-300 hover:bg-white/10 h-7 px-2 text-xs font-medium"
                    onClick={handleSave}
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-white/10 h-7 px-2 text-xs font-medium"
                    onClick={handleCancel}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 h-7 px-2 text-xs font-medium transition-colors"
                  onClick={handleEdit}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Code Content with Enhanced Mobile Scrolling */}
      <div
        ref={codeContainerRef}
        className={cn(
          "relative p-4 bg-[#0d1117]",
          // Enhanced scrolling for mobile
          "overflow-auto max-h-96",
          // Custom scrollbar styling
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30",
          // Mobile-specific improvements
          "touch-pan-x touch-pan-y",
          // Ensure horizontal scroll is always available on mobile
          "md:overflow-auto overflow-x-auto overflow-y-auto",
        )}
        style={{
          // Ensure minimum width for horizontal scrolling on mobile
          minWidth: "100%",
        }}
      >
        {isEditing ? (
          <AutoResizeTextarea
            ref={textareaRef}
            value={editedCode}
            onChange={(e) => setEditedCode(e.target.value)}
            className="w-full bg-transparent text-white font-mono text-sm leading-relaxed border-none resize-none focus:outline-none min-h-[200px] placeholder:text-white/40"
            placeholder="Enter your code here..."
          />
        ) : (
          <div className="min-w-max">
            <AdvancedSyntaxHighlighter
              code={code}
              language={language}
              isTyping={isTyping}
              typingSpeed={typingSpeed}
              onTypingComplete={handleTypingComplete}
            />
          </div>
        )}

        {/* Scroll to Bottom Button */}
        <Button
          onClick={scrollToBottom}
          size="icon"
          className={cn(
            "absolute bottom-4 right-4 h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg",
            showScrollButton && typingComplete
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none",
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
