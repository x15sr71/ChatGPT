// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Search, Library, Sparkles, Bot } from "lucide-react"
// import type { Chat } from "@/hooks/use-chat"

// interface SidebarContentProps {
//   chats: Chat[]
// }

// export function SidebarContent({ chats }: SidebarContentProps) {
//   return (
//     <div className="flex-1 overflow-hidden flex flex-col">
//       <div className="p-2">
//         <div className="space-y-1 mb-4">
//           <div className="sidebar-item">
//             <Search className="h-4 w-4" />
//             Search chats
//           </div>
//           <div className="sidebar-item">
//             <Library className="h-4 w-4" />
//             Library
//           </div>
//         </div>

//         <div className="space-y-1 mb-4">
//           <div className="sidebar-item">
//             <Sparkles className="h-4 w-4" />
//             Sora
//           </div>
//           <div className="sidebar-item">
//             <Bot className="h-4 w-4" />
//             GPTs
//           </div>
//         </div>

//         <div className="mb-2">
//           <div className="px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">Chats</div>
//         </div>
//       </div>

//       <ScrollArea className="flex-1 px-2">
//         <div className="space-y-1 pb-4">
//           {chats.map((chat) => (
//             <div key={chat.id} className="chat-item group">
//               <div className="flex-1 min-w-0">
//                 <div className="text-sm font-medium truncate">{chat.title}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </ScrollArea>
//     </div>
//   )
// }
