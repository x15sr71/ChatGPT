// import type React from "react"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { MessageBubble } from "./message-bubble"
// import { TypingIndicator } from "./typing-indicator"
// import { Bot } from "lucide-react"
// import type { Message } from "@/hooks/use-chat"

// interface MessageListProps {
//   messages: Message[]
//   isTyping: boolean
//   editingMessageId: string | null
//   editContent: string
//   messagesEndRef: React.RefObject<HTMLDivElement>
//   onEdit: (messageId: string, content: string) => void
//   onSaveEdit: (messageId: string) => void
//   onCancelEdit: () => void
//   onRegenerate: (messageId: string) => void
//   onEditContentChange: (content: string) => void
// }

// export function MessageList({
//   messages,
//   isTyping,
//   editingMessageId,
//   editContent,
//   messagesEndRef,
//   onEdit,
//   onSaveEdit,
//   onCancelEdit,
//   onRegenerate,
//   onEditContentChange,
// }: MessageListProps) {
//   if (messages.length === 0) {
//     return (
//       <div className="h-full flex flex-col items-center justify-center px-4">
//         <div className="max-w-2xl w-full text-center space-y-8">
//           <h2 className="text-2xl sm:text-3xl font-medium text-white">What can I help with?</h2>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <ScrollArea className="h-full">
//       <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
//         {messages.map((message) => (
//           <MessageBubble
//             key={message.id}
//             message={message}
//             isEditing={editingMessageId === message.id}
//             editContent={editContent}
//             onEdit={onEdit}
//             onSaveEdit={onSaveEdit}
//             onCancelEdit={onCancelEdit}
//             onRegenerate={onRegenerate}
//             onEditContentChange={onEditContentChange}
//           />
//         ))}

//         {isTyping && (
//           <div className="group flex gap-4 p-4 sm:p-6 rounded-2xl message-assistant">
//             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
//               <Bot className="h-4 w-4" />
//             </div>
//             <div className="flex-1">
//               <TypingIndicator />
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>
//     </ScrollArea>
//   )
// }
