"use client"

import { Button } from "@/components/ui/button"
import { Copy, RefreshCcw } from "lucide-react"
import { toast } from "sonner"

type ChatPart =
  | { type: "text"; text: string }
  | { type: "image"; image: { url: string } }

export interface MessageActionsProps {
  content: string | ChatPart[]
  onRegenerate: () => void
  onCopy: () => void
}

export function MessageActions({ content, onRegenerate, onCopy }: MessageActionsProps) {
  const extractText = () => {
    if (typeof content === "string") return content
    return content
      .map((part) => {
        if (part.type === "text") return part.text
        if (part.type === "image") return `[Image: ${part.image.url}]`
        return ""
      })
      .filter(Boolean)
      .join(" ")
  }

  const handleCopy = () => {
    const text = extractText()
    navigator.clipboard.writeText(text)
    toast.success("Message copied to clipboard")
    onCopy()
  }

  return (
    <div className="flex gap-2 mt-4">
      <Button
        size="sm"
        variant="ghost"
        className="text-white/50 hover:text-white hover:bg-white/10 h-8 px-3"
        onClick={handleCopy}
      >
        <Copy className="h-3 w-3 mr-1" />
        Copy
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className="text-white/50 hover:text-white hover:bg-white/10 h-8 px-3"
        onClick={onRegenerate}
      >
        <RefreshCcw className="h-3 w-3 mr-1" />
        Regenerate
      </Button>
    </div>
  )
}
