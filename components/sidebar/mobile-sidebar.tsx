// "use client";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Plus, Search, Library, Bot, X, Sparkles, Trash } from "lucide-react";
// import type { Chat } from "@/hooks/use-chat";
// import { useFocusTrap } from "@/hooks/use-focus-trap";
// import { useEffect } from "react";

// interface MobileSidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   chats: Chat[];
//   onNewChat: () => void;
//   onOpenSearch: () => void;
//   onSelectChat: (chatId: string) => void;
//   deleteChat: (chatId: string) => void;
// }

// export function MobileSidebar({
//   isOpen,
//   onClose,
//   chats,
//   onNewChat,
//   onOpenSearch,
//   onSelectChat,
//   deleteChat,
// }: MobileSidebarProps) {
//   const focusTrapRef = useFocusTrap(isOpen);

//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && isOpen) onClose();
//     };

//     if (isOpen) {
//       document.addEventListener("keydown", handleEscape);
//       document.body.style.overflow = "hidden";
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen, onClose]);

//   return (
//     <>
//       <nav
//         ref={focusTrapRef}
//         className={cn(
//           "fixed inset-y-0 left-0 z-50 bg-[#171717] w-[85%] max-w-[320px] transform transition-transform duration-300 ease-in-out",
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         )}
//       >
//         <header className="flex items-center justify-between p-4 border-b border-white/10">
//           <div className="w-8 h-8 flex items-center justify-center">
//             <svg
//               className="w-6 h-6 text-white"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
//             </svg>
//           </div>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-white/70 hover:text-white hover:bg-white/10"
//             onClick={onClose}
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         </header>

//         <section className="px-3 py-2">
//           <ul className="space-y-1">
//             {[
//               { id: "new", icon: Plus, label: "New chat", onClick: onNewChat },
//               {
//                 id: "search",
//                 icon: Search,
//                 label: "Search chats",
//                 onClick: onOpenSearch,
//               },
//               {
//                 id: "library",
//                 icon: Library,
//                 label: "Library",
//                 onClick: () => {},
//               },
//             ].map((item) => (
//               <li key={item.id}>
//                 <Button
//                   variant="ghost"
//                   onClick={() => {
//                     item.onClick();
//                     onClose();
//                   }}
//                   className="w-full h-12 justify-start gap-3 px-3 text-white/90 hover:text-white hover:bg-white/10"
//                 >
//                   <item.icon className="h-5 w-5" />
//                   <span>{item.label}</span>
//                 </Button>
//               </li>
//             ))}
//           </ul>
//         </section>

//         <div className="h-px bg-white/10 mx-3 my-2" />

//         <section className="px-3 py-2">
//           <ul>
//             {[
//               { id: "sora", icon: Sparkles, label: "Sora" },
//               { id: "gpts", icon: Bot, label: "GPTs" },
//             ].map((item) => (
//               <li key={item.id}>
//                 <Button
//                   variant="ghost"
//                   onClick={() => {}}
//                   className="w-full h-12 justify-start gap-3 px-3 text-white/90 hover:text-white hover:bg-white/10"
//                 >
//                   <item.icon className="h-5 w-5" />
//                   <span className="flex-1 text-left">{item.label}</span>
//                 </Button>
//               </li>
//             ))}
//           </ul>
//         </section>

//         {/* CHAT LIST */}
//         <section className="flex-1 flex flex-col">
//           <header className="px-3 py-3">
//             <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider">
//               Chats
//             </h2>
//           </header>
//           <ScrollArea className="flex-1 px-3 pb-4">
//             <ul className="space-y-1">
//               {chats.map((chat) => (
//                 <li key={chat.id}>
//                   <div className="group flex items-center justify-between px-3 py-2 text-white/90 hover:bg-white/10 rounded-lg transition cursor-pointer">
//                     <div
//                       className="flex-1 truncate"
//                       onClick={() => {
//                         onSelectChat(chat.id);
//                         onClose();
//                       }}
//                     >
//                       {chat.title}
//                     </div>
//                     <button
//                       className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-500 transition-opacity duration-200 ml-2"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (confirm("Delete this chat?")) deleteChat(chat.id);
//                       }}
//                       aria-label="Delete chat"
//                     >
//                       <Trash className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </ScrollArea>
//         </section>
//       </nav>

//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
//           onClick={onClose}
//         />
//       )}
//     </>
//   );
// }
