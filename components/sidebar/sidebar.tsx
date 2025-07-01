// "use client"

// import { cn } from "@/lib/utils"
// import { SidebarHeader } from "./sidebar-header"
// import { SidebarContent } from "./sidebar-content"
// import { SidebarFooter } from "./sidebar-footer"
// import type { Chat } from "@/hooks/use-chat"

// interface SidebarProps {
//   isOpen: boolean
//   onClose: () => void
//   chats: Chat[]
// }

// export function Sidebar({ isOpen, onClose, chats }: SidebarProps) {
//   return (
//     <>
//       {/* Sidebar */}
//       <div
//         className={cn(
//           "chatgpt-sidebar border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out",
//           "fixed md:relative z-50 h-full left-0 top-0",
//           isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full",
//           "md:static md:translate-x-0",
//           !isOpen && "md:w-0 md:border-r-0",
//         )}
//       >
//         <SidebarHeader onClose={onClose} isMobile={window?.innerWidth < 768} />
//         <SidebarContent chats={chats} />
//         <SidebarFooter />
//       </div>

//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300" onClick={onClose} />
//       )}
//     </>
//   )
// }
