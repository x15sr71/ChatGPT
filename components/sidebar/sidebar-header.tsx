// "use client"

// import { Button } from "@/components/ui/button"
// import { Plus, X } from "lucide-react"

// interface SidebarHeaderProps {
//   onClose: () => void
//   isMobile: boolean
// }

// export function SidebarHeader({ onClose, isMobile }: SidebarHeaderProps) {
//   return (
//     <div className="p-4 border-b border-white/10">
//       <div className="flex items-center justify-between">
//         <Button
//           variant="ghost"
//           size="sm"
//           className="text-white/70 hover:text-white hover:bg-white/10 gap-2 justify-start flex-1"
//         >
//           <Plus className="h-4 w-4" />
//           New chat
//         </Button>
//         {isMobile && (
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8"
//             onClick={onClose}
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//     </div>
//   )
// }
