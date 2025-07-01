"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Check } from "lucide-react"

interface TempChatModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TempChatModal({ isOpen, onClose }: TempChatModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2a2a2a] border-white/10 text-white max-w-md p-6">
        <div className="space-y-4">
          {/* ChatGPT Plus Option */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">ChatGPT Plus</h3>
                <p className="text-sm text-white/70">Our smartest model & more</p>
              </div>
              <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium px-4">
                Upgrade
              </Button>
            </div>
          </div>

          {/* ChatGPT Option */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">ChatGPT</h3>
                <p className="text-sm text-white/70">Great for everyday tasks</p>
              </div>
              <Check className="h-5 w-5 text-green-400" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
