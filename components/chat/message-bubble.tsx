// "use client"

// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Edit3, User, Bot } from "lucide-react"
// import { cn } from "@/lib/utils"
// import type { Message } from "@/hooks/use-chat"
// import { TypingIndicator } from "./typing-indicator"
// import { CodeBlock } from "./code-block"
// import { MessageActions } from "./message-actions"

// interface MessageBubbleProps {
//   message: Message
//   isEditing: boolean
//   editContent: string
//   onEdit: (messageId: string, content: string) => void
//   onSaveEdit: (messageId: string) => void
//   onCancelEdit: () => void
//   onRegenerate: (messageId: string) => void
//   onEditContentChange: (content: string) => void
// }

// export function MessageBubble({
//   message,
//   isEditing,
//   editContent,
//   onEdit,
//   onSaveEdit,
//   onCancelEdit,
//   onRegenerate,
//   onEditContentChange,
// }: MessageBubbleProps) {
//   const parseContent = (content: string) => {
//     const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
//     const parts = []
//     let lastIndex = 0
//     let match

//     while ((match = codeBlockRegex.exec(content)) !== null) {
//       // Add text before code block
//       if (match.index > lastIndex) {
//         parts.push({
//           type: "text",
//           content: content.slice(lastIndex, match.index),
//         })
//       }

//       // Add code block
//       parts.push({
//         type: "code",
//         language: match[1] || "text",
//         content: match[2].trim(),
//       })

//       lastIndex = match.index + match[0].length
//     }

//     // Add remaining text
//     if (lastIndex < content.length) {
//       parts.push({
//         type: "text",
//         content: content.slice(lastIndex),
//       })
//     }

//     return parts.length > 0 ? parts : [{ type: "text", content }]
//   }

//   const contentParts = parseContent(message.content)

//   return (
//     <div
//       className={cn(
//         "group flex gap-4 p-4 sm:p-6 rounded-2xl transition-all duration-300",
//         message.role === "user" ? "bg-white/5" : "bg-white/10",
//       )}
//     >
//       <div
//         className={cn(
//           "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white",
//           message.role === "user" ? "bg-blue-500" : "bg-green-600",
//         )}
//       >
//         {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
//       </div>

//       <div className="flex-1 min-w-0">
//         {isEditing ? (
//           <div className="space-y-3">
//             <Textarea
//               value={editContent}
//               onChange={(e) => onEditContentChange(e.target.value)}
//               className="bg-white/10 border-white/20 text-white min-h-[100px] resize-none"
//               autoFocus
//             />
//             <div className="flex gap-2">
//               <Button
//                 size="sm"
//                 className="bg-white text-black hover:bg-white/90"
//                 onClick={() => onSaveEdit(message.id)}
//               >
//                 Save & Submit
//               </Button>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 bg-transparent"
//                 onClick={onCancelEdit}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="prose prose-invert max-w-none">
//               {message.isTyping && !message.content ? (
//                 <TypingIndicator />
//               ) : (
//                 <div>
//                   {contentParts.map((part, index) => {
//                     if (part.type === "code") {
//                       return (
//                         <CodeBlock
//                           key={index}
//                           code={part.content}
//                           language={part.language}
//                           onCopy={() => console.log("Code copied")}
//                         />
//                       )
//                     } else {
//                       return (
//                         <p key={index} className="text-white/90 whitespace-pre-wrap leading-relaxed mb-4 last:mb-0">
//                           {part.content}
//                           {message.isTyping && index === contentParts.length - 1 && (
//                             <span className="animate-pulse">|</span>
//                           )}
//                         </p>
//                       )
//                     }
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Action buttons for user messages */}
//             {message.role === "user" && !message.isTyping && (
//               <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   className="text-white/50 hover:text-white hover:bg-white/10 h-8 px-3"
//                   onClick={() => onEdit(message.id, message.content)}
//                 >
//                   <Edit3 className="h-3 w-3 mr-1" />
//                   Edit
//                 </Button>
//               </div>
//             )}

//             {/* Action buttons for assistant messages */}
//             {message.role === "assistant" && !message.isTyping && (
//               <MessageActions
//                 content={message.content}
//                 onRegenerate={() => onRegenerate(message.id)}
//                 onCopy={() => console.log("Message copied")}
//               />
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   )
// }
