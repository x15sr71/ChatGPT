"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search, MessageSquare, Clock } from "lucide-react"
import type { Chat } from "@/hooks/use-chat"
import { DialogTitle } from "@radix-ui/react-dialog"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  chats: Chat[]
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
}

export function SearchModal({ isOpen, onClose, chats, onSelectChat, onNewChat }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredChats, setFilteredChats] = useState<Chat[]>(chats)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter chats based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats)
    } else {
      const filtered = chats.filter(
        (chat) =>
          chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredChats(filtered)
    }
  }, [searchQuery, chats])

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      setSearchQuery("")
    }
  }, [isOpen])

  // Group chats by date
  const groupChatsByDate = (chats: Chat[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const groups = {
      today: [] as Chat[],
      yesterday: [] as Chat[],
      lastWeek: [] as Chat[],
      older: [] as Chat[],
    }

    chats.forEach((chat) => {
      const chatDate = new Date(chat.timestamp)
      const chatDateOnly = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate())

      if (chatDateOnly.getTime() === today.getTime()) {
        groups.today.push(chat)
      } else if (chatDateOnly.getTime() === yesterday.getTime()) {
        groups.yesterday.push(chat)
      } else if (chatDate >= lastWeek) {
        groups.lastWeek.push(chat)
      } else {
        groups.older.push(chat)
      }
    })

    return groups
  }

  const chatGroups = groupChatsByDate(filteredChats)

  const handleChatSelect = (chatId: string) => {
    onSelectChat(chatId)
    onClose()
  }

  const handleNewChat = () => {
    onNewChat()
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#2a2a2a] border-white/10 text-white max-w-md p-0 gap-0 rounded-xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
      <DialogHeader>
        <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        {/* Header with Search Input */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 h-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 flex-shrink-0"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* New Chat Option */}
        <div className="p-2 border-b border-white/10">
          <Button
            variant="ghost"
            onClick={handleNewChat}
            className="w-full h-12 justify-start gap-3 px-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <MessageSquare className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">New chat</span>
          </Button>
        </div>

        {/* Chat Results */}
        <ScrollArea className="max-h-96">
          <div className="p-2">
            {searchQuery && filteredChats.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chats found for "{searchQuery}"</p>
              </div>
            ) : (
              <>
                {/* Today */}
                {chatGroups.today.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
                      <Clock className="h-3 w-3" />
                      Today
                    </div>
                    <div className="space-y-1">
                      {chatGroups.today.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} onSelect={handleChatSelect} searchQuery={searchQuery} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Yesterday */}
                {chatGroups.yesterday.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
                      <Clock className="h-3 w-3" />
                      Yesterday
                    </div>
                    <div className="space-y-1">
                      {chatGroups.yesterday.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} onSelect={handleChatSelect} searchQuery={searchQuery} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Last 7 days */}
                {chatGroups.lastWeek.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
                      <Clock className="h-3 w-3" />
                      Last 7 days
                    </div>
                    <div className="space-y-1">
                      {chatGroups.lastWeek.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} onSelect={handleChatSelect} searchQuery={searchQuery} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Older */}
                {chatGroups.older.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
                      <Clock className="h-3 w-3" />
                      Older
                    </div>
                    <div className="space-y-1">
                      {chatGroups.older.map((chat) => (
                        <ChatItem key={chat.id} chat={chat} onSelect={handleChatSelect} searchQuery={searchQuery} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
        
      </DialogContent>
    </Dialog>
  )
}

interface ChatItemProps {
  chat: Chat
  onSelect: (chatId: string) => void
  searchQuery: string
}

function ChatItem({ chat, onSelect, searchQuery }: ChatItemProps) {
  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-400/30 text-yellow-200">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <Button
      variant="ghost"
      onClick={() => onSelect(chat.id)}
      className="w-full h-auto p-3 justify-start text-left hover:bg-white/10 rounded-lg transition-colors group"
    >
      <div className="flex items-start gap-3 w-full">
        <MessageSquare className="h-4 w-4 text-white/50 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white/90 truncate mb-1">
            {highlightText(chat.title, searchQuery)}
          </div>
          <div className="text-xs text-white/50 truncate">{highlightText(chat.lastMessage, searchQuery)}</div>
        </div>
      </div>
    </Button>
  )
}
