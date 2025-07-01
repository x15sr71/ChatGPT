"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Library,
  Sparkles,
  Bot,
  X,
  PanelLeft,
  Trash,
  Pencil,
  Menu,
} from "lucide-react";
import type { Chat } from "@/hooks/use-chat";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onClose: () => void;
  onToggle?: () => void;
  onToggleCollapse?: () => void;
  chats: Chat[];
  onNewChat: () => void;
  onOpenSearch: () => void;
  isMobile: boolean;
  onSelectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
}

export function ResponsiveSidebar({
  isOpen,
  isCollapsed = false,
  onClose,
  onToggle,
  onToggleCollapse,
  chats,
  onNewChat,
  onOpenSearch,
  isMobile,
  onSelectChat,
  deleteChat,
  onRenameChat,
}: SidebarProps) {
  const focusTrapRef = useFocusTrap(isMobile && isOpen);

  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isOpen, onClose]);

  const topItems = [
    { id: "sora", icon: Sparkles, label: "Sora", onClick: () => {} },
    { id: "gpts", icon: Bot, label: "GPTs", onClick: () => {} },
  ];

  const mainItems = [
    { id: "new-chat", icon: Plus, label: "New chat", onClick: onNewChat },
    {
      id: "search",
      icon: Search,
      label: "Search chats",
      onClick: onOpenSearch,
    },
    { id: "library", icon: Library, label: "Library", onClick: () => {} },
  ];

  const ChatItem = ({ chat }: { chat: Chat }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(chat.title);

    const handleEditTitle = async () => {
      const wordCount = newTitle.trim().split(/\s+/).length;
      if (wordCount > 4) {
        alert("Title must be 4 words or fewer.");
        return;
      }

      try {
        const res = await fetch(`/api/chats/${chat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle.trim() }),
        });

        if (!res.ok) throw new Error("Rename failed");

        onRenameChat(chat.id, newTitle.trim());
        setIsEditing(false);
      } catch (err) {
        console.error("Error updating title:", err);
        alert("Failed to update title");
      }
    };

    const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (confirm("Delete this chat?")) deleteChat(chatId);
    };

    return (
      <div
        className="group flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer w-auto"
        onClick={() => onSelectChat(chat.id)}
      >
        <div className="flex-1 overflow-hidden">
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditTitle();
              }}
              className="flex items-center gap-1"
            >
              <input
                autoFocus
                className="text-sm bg-transparent border-b border-white/30 focus:outline-none text-white w-full"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <button type="submit" className="text-xs text-green-400">
                Save
              </button>
            </form>
          ) : (
            <div
              className="truncate text-sm text-white/90 pr-2"
              title={chat.title}
            >
              {chat.title}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="text-white/40 hover:text-blue-500 hover:bg-blue-500/10 p-1 rounded"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditing(true);
                setNewTitle(chat.title);
              }}
              aria-label="Edit chat"
              type="button"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              className="text-white/40 hover:text-red-500 hover:bg-red-500/10 p-1 rounded"
              onClick={(e) => handleDeleteChat(e, chat.id)}
              aria-label="Delete chat"
              type="button"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop reopen button - styled to match original ChatGPT */}
      {!isOpen && !isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 h-10 w-10 bg-[#171717] border border-white/20 rounded-lg text-white/90 hover:text-white hover:bg-[#2a2a2a] transition-colors"
          onClick={onToggle}
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      <div
        className={cn(
          "bg-[#171717] border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out relative w-auto",
          "fixed md:relative z-50 h-full left-0 top-0",
          !isOpen && "hidden"
        )}
        ref={focusTrapRef}
      >
        <div
          className={cn(
            "flex items-center transition-all duration-300",
            isCollapsed ? "p-3 justify-center" : "p-4 justify-between"
          )}
        >
<div className="flex items-center gap-3 relative">
  <img
    src="https://chatgpt.com/images/chatgpt-icon-144x144.png"
    alt="ChatGPT Logo"
    className="w-6 h-6 rounded-sm flex-shrink-0"
  />
  {!isCollapsed && (
    <h1 className="text-lg font-semibold text-white whitespace-nowrap">
      ChatGPT
    </h1>
  )}
</div>


          {!isCollapsed && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8"
                onClick={onToggle}
                aria-label="Close sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="flex flex-col p-2">
            {[...mainItems, ...topItems].map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={item.onClick}
                className="h-10 justify-start gap-3 mb-1 px-3 text-white/70 hover:text-white hover:bg-white/10"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            ))}
          </div>
        )}

        {!isCollapsed && (
          <>
            <div className="px-4 mt-2 mb-1 text-xs font-medium text-white/50 uppercase">
              Chats
            </div>
            <ScrollArea className="flex-1 px-2 pb-4 w-auto">
              <div className="space-y-1">
                {chats.slice(0, 20).map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        {!isCollapsed && (
          <div className="p-3 border-t border-white/10 mt-auto">
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
              <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                U
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium">Upgrade plan</span>
                <div className="text-xs text-white/40">
                  More access to the best models
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}