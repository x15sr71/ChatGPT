"use client"

import { Button } from "@/components/ui/button"
import { PanelLeft, ChevronDown, Settings } from "lucide-react"

interface HeaderProps {
  onToggleSidebar: () => void
  onOpenSettings: () => void
}

export function Header({ onToggleSidebar, onOpenSettings }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[#212121]">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={onToggleSidebar}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-white">ChatGPT</h1>
          <ChevronDown className="h-4 w-4 text-white/70" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full items-center gap-2">
          Saved memory full
          <Button size="sm" className="chatgpt-button text-white text-xs px-3 py-1 h-6">
            Get Plus
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={onOpenSettings}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
