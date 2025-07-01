// "use client";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Plus,
//   Search,
//   Library,
//   Sparkles,
//   Bot,
//   PanelLeft,
//   X,
//   Trash,
// } from "lucide-react";
// import type { Chat } from "@/hooks/use-chat";
// import { useState } from "react";

// interface EnhancedSidebarProps {
//   isOpen: boolean;
//   isCollapsed: boolean;
//   onClose: () => void;
//   onToggle: () => void;
//   onToggleCollapse: () => void;
//   chats: Chat[];
//   onNewChat: () => void;
//   onOpenSearch: () => void;
//   isMobile: boolean;
//   onSelectChat: (chatId: string) => void;
//   deleteChat: (chatId: string) => void; // ✅ Added
// }

// export function EnhancedSidebar({
//   isOpen,
//   isCollapsed,
//   onClose,
//   onToggle,
//   onToggleCollapse,
//   chats,
//   onNewChat,
//   onOpenSearch,
//   isMobile,
//   onSelectChat,
//   deleteChat, // ✅ Added
// }: EnhancedSidebarProps) {
//   const [isLogoHovered, setIsLogoHovered] = useState(false);

//   const topItems = [
//     { id: "sora", icon: Sparkles, label: "Sora", onClick: () => {} },
//     { id: "gpts", icon: Bot, label: "GPTs", onClick: () => {} },
//   ];

//   const mainItems = [
//     { id: "new-chat", icon: Plus, label: "New chat", onClick: onNewChat },
//     {
//       id: "search",
//       icon: Search,
//       label: "Search chats",
//       onClick: onOpenSearch,
//     },
//     { id: "library", icon: Library, label: "Library", onClick: () => {} },
//   ];

//   return (
//     <>
//       <div
//         className={cn(
//           "bg-[#171717] border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out relative",
//           isOpen ? (isCollapsed ? "w-16" : "w-64") : "w-0",
//           "fixed md:relative z-50 h-full left-0 top-0",
//           isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "",
//           !isMobile && !isOpen && "md:w-0 md:border-r-0"
//         )}
//       >
//         {/* Header */}
//         <div
//           className={cn(
//             "border-b border-white/10 flex items-center transition-all duration-300",
//             isCollapsed ? "p-3 justify-center" : "p-4 justify-between"
//           )}
//         >
//           <div
//             className="flex items-center gap-3 relative"
//             onMouseEnter={() => setIsLogoHovered(true)}
//             onMouseLeave={() => setIsLogoHovered(false)}
//           >
//             <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center flex-shrink-0">
//               <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
//                 <div className="w-2 h-2 bg-white rounded-full" />
//               </div>
//             </div>

//             {!isCollapsed && (
//               <div className="flex items-center gap-2 overflow-hidden">
//                 <h1 className="text-lg font-semibold text-white whitespace-nowrap">
//                   ChatGPT
//                 </h1>
//               </div>
//             )}

//             {isCollapsed && !isMobile && (
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className={cn(
//                   "absolute -right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 transition-all duration-200",
//                   isLogoHovered
//                     ? "opacity-100 translate-x-0"
//                     : "opacity-0 -translate-x-2 pointer-events-none"
//                 )}
//                 onClick={onToggleCollapse}
//                 aria-label="Expand sidebar"
//               >
//                 <PanelLeft className="h-4 w-4 rotate-180" />
//               </Button>
//             )}
//           </div>

//           {!isCollapsed && !isMobile && (
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 flex-shrink-0"
//               onClick={onToggleCollapse}
//               aria-label="Collapse sidebar"
//             >
//               <PanelLeft className="h-4 w-4" />
//             </Button>
//           )}

//           {isMobile && !isCollapsed && (
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8"
//               onClick={onClose}
//               aria-label="Close sidebar"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           )}
//         </div>

//         {/* Top Items */}
//         {!isCollapsed && (
//           <div className="flex flex-col p-2 border-b border-white/10">
//             {topItems.map((item) => (
//               <Button
//                 key={item.id}
//                 variant="ghost"
//                 onClick={item.onClick}
//                 className="h-10 justify-start gap-3 mb-1 px-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
//                 aria-label={item.label}
//               >
//                 <item.icon className="h-5 w-5 flex-shrink-0" />
//                 <span className="text-sm font-medium overflow-hidden whitespace-nowrap">
//                   {item.label}
//                 </span>
//               </Button>
//             ))}
//           </div>
//         )}

//         {/* Collapsed State */}
//         {isCollapsed && (
//           <div className="flex flex-col p-2">
//             {topItems.map((item) => (
//               <Button
//                 key={item.id}
//                 variant="ghost"
//                 onClick={item.onClick}
//                 className="h-12 w-12 p-0 justify-center mb-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
//                 aria-label={item.label}
//                 title={item.label}
//               >
//                 <item.icon className="h-5 w-5 flex-shrink-0" />
//               </Button>
//             ))}

//             <div className="h-px bg-white/10 mx-2 mb-2" />

//             {mainItems.map((item) => (
//               <Button
//                 key={item.id}
//                 variant="ghost"
//                 onClick={item.onClick}
//                 className="h-12 w-12 p-0 justify-center mb-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
//                 aria-label={item.label}
//                 title={item.label}
//               >
//                 <item.icon className="h-5 w-5 flex-shrink-0" />
//               </Button>
//             ))}
//           </div>
//         )}

//         {/* Main Items */}
//         {!isCollapsed && (
//           <div className="flex flex-col p-2">
//             {mainItems.map((item) => (
//               <Button
//                 key={item.id}
//                 variant="ghost"
//                 onClick={item.onClick}
//                 className="h-10 justify-start gap-3 mb-1 px-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
//                 aria-label={item.label}
//               >
//                 <item.icon className="h-5 w-5 flex-shrink-0" />
//                 <span className="text-sm font-medium overflow-hidden whitespace-nowrap">
//                   {item.label}
//                 </span>
//               </Button>
//             ))}
//           </div>
//         )}

//         {/* Chat List */}
//         {!isCollapsed && (
//           <>
//             <div className="px-4 mb-2">
//               <div className="text-xs font-medium text-white/50 uppercase tracking-wider">
//                 Recent
//               </div>
//             </div>

//             <ScrollArea className="flex-1 px-2">
//               <div className="space-y-1 pb-4">
//                 {chats.slice(0, 10).map((chat) => (
// <div
//   key={chat.id}
//   className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition"
// >
//   <div
//     className="text-sm text-white/70 group-hover:text-white truncate cursor-pointer"
//     onClick={() => {
//       onSelectChat(chat.id);
//       if (isMobile) onClose();
//     }}
//   >
//     {chat.title}
//   </div>

//   <button
//     className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-500 transition-opacity duration-200 ml-2"
//     onClick={(e) => {
//       e.stopPropagation();
//       if (confirm("Delete this chat?")) deleteChat(chat.id);
//     }}
//     aria-label="Delete chat"
//   >
//     <Trash className="w-4 h-4" />
//   </button>
// </div>

//                 ))}
//               </div>
//             </ScrollArea>
//           </>
//         )}

//         {/* Upgrade CTA */}
//         {!isCollapsed && (
//           <div className="p-3 border-t border-white/10 mt-auto">
//             <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
//               <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
//                 U
//               </div>
//               <div className="flex-1 min-w-0">
//                 <span className="text-xs font-medium">Upgrade plan</span>
//                 <div className="text-xs text-white/40 leading-tight">
//                   More access to the best models
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {isOpen && isMobile && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
//           onClick={onClose}
//           aria-hidden="true"
//         />
//       )}
//     </>
//   );
// }
