import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="chatgpt-bg border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">General</h3>
            <div className="space-y-2 text-sm text-white/70">
              <p>Theme: Dark</p>
              <p>Language: English</p>
              <p>Data controls: Manage your data</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Speech</h3>
            <div className="space-y-2 text-sm text-white/70">
              <p>Voice: Default</p>
              <p>Speed: Normal</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
