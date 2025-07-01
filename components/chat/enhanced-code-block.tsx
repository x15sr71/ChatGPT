// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Copy, Check, Edit, Save, X } from "lucide-react"
// import { SyntaxHighlighter } from "@/components/syntax-highlighter/syntax-highlighter"
// import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea"

// interface EnhancedCodeBlockProps {
//   code: string
//   language: string
//   onCopy?: () => void
//   onEdit?: (newCode: string) => void
//   isTyping?: boolean
//   title?: string
// }

// export function EnhancedCodeBlock({ code, language, onCopy, onEdit, isTyping = false, title }: EnhancedCodeBlockProps) {
//   const [copied, setCopied] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [editedCode, setEditedCode] = useState(code)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   useEffect(() => {
//     setEditedCode(code)
//   }, [code])

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(code)
//       setCopied(true)
//       onCopy?.()
//       setTimeout(() => setCopied(false), 2000)
//     } catch (err) {
//       console.error("Failed to copy code:", err)
//     }
//   }

//   const handleEdit = () => {
//     setIsEditing(true)
//     setTimeout(() => {
//       textareaRef.current?.focus()
//     }, 0)
//   }

//   const handleSave = () => {
//     onEdit?.(editedCode)
//     setIsEditing(false)
//   }

//   const handleCancel = () => {
//     setEditedCode(code)
//     setIsEditing(false)
//   }

//   return (
//     <div className="relative bg-black/40 rounded-lg border border-white/10 overflow-hidden my-4">
//       {/* Header */}
//       {title && (
//         <div className="px-4 py-3 bg-white/5 border-b border-white/10">
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
//               <Check className="h-2.5 w-2.5 text-white" />
//             </div>
//             <span className="text-sm font-medium text-white">{title}</span>
//           </div>
//         </div>
//       )}

//       <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
//         <span className="text-xs text-white/70 font-mono">{language}</span>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-white/70 hover:text-white hover:bg-white/10 h-7 px-2 text-xs"
//             onClick={handleCopy}
//           >
//             {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
//             {copied ? "Copied" : "Copy"}
//           </Button>
//           {!isTyping && (
//             <>
//               {isEditing ? (
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-green-400 hover:text-green-300 hover:bg-white/10 h-7 px-2 text-xs"
//                     onClick={handleSave}
//                   >
//                     <Save className="h-3 w-3 mr-1" />
//                     Save
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-red-400 hover:text-red-300 hover:bg-white/10 h-7 px-2 text-xs"
//                     onClick={handleCancel}
//                   >
//                     <X className="h-3 w-3 mr-1" />
//                     Cancel
//                   </Button>
//                 </div>
//               ) : (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-white/70 hover:text-white hover:bg-white/10 h-7 px-2 text-xs"
//                   onClick={handleEdit}
//                 >
//                   <Edit className="h-3 w-3 mr-1" />
//                   Edit
//                 </Button>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Code Content */}
//       <div className="p-4 overflow-x-auto">
//         {isEditing ? (
//           <AutoResizeTextarea
//             ref={textareaRef}
//             value={editedCode}
//             onChange={(e) => setEditedCode(e.target.value)}
//             className="w-full bg-transparent text-white font-mono text-sm leading-relaxed border-none resize-none focus:outline-none min-h-[200px]"
//             placeholder="Enter your code here..."
//           />
//         ) : (
//           <SyntaxHighlighter code={code} language={language} isTyping={isTyping} />
//         )}
//       </div>
//     </div>
//   )
// }
