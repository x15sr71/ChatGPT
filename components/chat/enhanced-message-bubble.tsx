"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit3, User, Bot, Check, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "@/hooks/use-chat"
import { TypingIndicator } from "./typing-indicator"
import { PremiumCodeBlock } from "./premium-code-block"
import { MessageActions } from "./message-actions"

function renderAttachment(url: string) {
  const extension = url.split(".").pop()?.toLowerCase()
  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(extension || "")
  const isDoc = ["docx", "pdf", "txt"].includes(extension || "")

  if (isImage) {
    return (
      <div className="my-3">
        <img src={url} alt="Uploaded" className="rounded-lg max-w-xs border border-white/10" />
      </div>
    )
  }

  if (isDoc) {
    return (
      <div className="my-3 inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-lg w-fit">
        <FileText className="h-4 w-4" />
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
          Open uploaded file
        </a>
      </div>
    )
  }

  return null
}

function parseContent(
  content: string | { type: string; text?: string; image?: { url: string } }[]
): { type: "text" | "image"; content: string }[] {
  if (typeof content === "string") {
    return [{ type: "text", content: content.trim() }]
  }

  return (content ?? [])
    .map((part) => {
      if (part.type === "text") {
        let raw = part.text

        if (typeof raw !== "string") {
          try {
            raw = Array.isArray(raw)
              ? raw.join("")
              : typeof raw === "object"
              ? Object.values(raw).join("")
              : ""
          } catch {
            raw = ""
          }
        }

        return { type: "text", content: (raw as string).trim() }
      }

      if (part.type === "image" && part.image?.url) {
        return { type: "image", content: part.image.url }
      }

      return null
    })
    .filter(Boolean) as { type: "text" | "image"; content: string }[]
}


function getOnlyTextParts(
  content: string | { type: string; text?: string; image?: { url: string } }[]
): string | { type: "text"; text: string }[] {
  if (typeof content === "string") return content

  return content
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => ({ type: "text", text: part.text as string }))
}

interface EnhancedMessageBubbleProps {
  message: Message
  isEditing: boolean
  editContent: string
  onEdit: (messageId: string, content: string) => void
  onSaveEdit: (messageId: string) => void
  onCancelEdit: () => void
  onRegenerate: (messageId: string) => void
  onEditContentChange: (content: string) => void
  onCodeEdit?: (messageId: string, newCode: string, blockIndex: number) => void
}

export function EnhancedMessageBubble({
  message,
  isEditing,
  editContent,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onRegenerate,
  onEditContentChange,
}: EnhancedMessageBubbleProps) {
  const contentParts = parseContent(message.content)

  const formatTextContent = (text: string) => {
    return text
      .split("\n")
      .map((line, index) => {
        const key = `${line.slice(0, 10)}-${index}`

        if (line.trim().match(/^[•\-*]\s/)) {
          const content = line.replace(/^[•\-*]\s/, "").trim()
          return (
            <div key={key} className="flex items-start gap-2 my-1">
              <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center mt-0.5 flex-shrink-0">
                <Check className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-white/90">{content}</span>
            </div>
          )
        }

        return line ? (
          <p key={key} className="text-white/90 leading-relaxed my-1">
            {line}
          </p>
        ) : (
          <br key={`br-${index}`} />
        )
      })
      .filter(Boolean)
  }

  return (
    <div
      className={cn(
        "group flex gap-4 p-4 sm:p-6 rounded-2xl transition-all duration-300",
        message.role === "user" ? "bg-white/5" : "bg-white/10"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white",
          message.role === "user" ? "bg-blue-500" : "bg-green-600"
        )}
      >
        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => onEditContentChange(e.target.value)}
              className="bg-white/10 border-white/20 text-white min-h-[100px] resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" className="bg-white text-black hover:bg-white/90" onClick={() => onSaveEdit(message.id)}>
                Save & Submit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 bg-transparent"
                onClick={onCancelEdit}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="prose prose-invert max-w-none">
              {message.isTyping && !message.content ? (
                <TypingIndicator />
              ) : (
                <div>
                  {contentParts.map((part, index) => {
                    const isLast = index === contentParts.length - 1
                    const displayContent = part.content + (message.isTyping && isLast ? "|" : "")

                    return (
                      <div
                        key={`${part.type}-${index}-${part.content.length}-${part.content.slice(0, 8)}`}
                        className="mb-4 last:mb-0"
                      >
                        {part.type === "text" && formatTextContent(displayContent)}
                        {part.type === "image" && renderAttachment(part.content)}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {message.role === "user" && !message.isTyping && (
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/50 hover:text-white hover:bg-white/10 h-8 px-3"
                  onClick={() => {
                    const onlyText = getOnlyTextParts(message.content)
                    const text =
                      typeof onlyText === "string"
                        ? onlyText
                        : onlyText.map((part) => part.text).join("\n")
                    onEdit(message.id, text)
                  }}
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            )}

            {message.role === "assistant" && !message.isTyping && (
              <MessageActions
                content={getOnlyTextParts(message.content)}
                onRegenerate={() => onRegenerate(message.id)}
                onCopy={() => console.log("Message copied")}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
