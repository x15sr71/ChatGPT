// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Copy, Check, Edit } from "lucide-react"

// interface CodeBlockProps {
//   code: string
//   language: string
//   onCopy?: () => void
// }

// export function CodeBlock({ code, language, onCopy }: CodeBlockProps) {
//   const [copied, setCopied] = useState(false)

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

//   // Simple syntax highlighting for common languages
//   const highlightCode = (code: string, lang: string) => {
//     if (lang === "tsx" || lang === "jsx" || lang === "javascript" || lang === "js") {
//       return code
//         .replace(
//           /\b(import|export|from|function|const|let|var|return|if|else|for|while|class|interface|type)\b/g,
//           '<span class="text-blue-400">$1</span>',
//         )
//         .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
//         .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-purple-400">$1</span>')
//         .replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>')
//         .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500">$&</span>')
//     }
//     return code
//   }

//   return (
//     <div className="relative bg-black/40 rounded-lg border border-white/10 overflow-hidden my-4">
//       {/* Header */}
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
//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-white/70 hover:text-white hover:bg-white/10 h-7 px-2 text-xs"
//           >
//             <Edit className="h-3 w-3 mr-1" />
//             Edit
//           </Button>
//         </div>
//       </div>

//       {/* Code Content */}
//       <div className="p-4 overflow-x-auto">
//         <pre className="text-sm text-white/90 font-mono leading-relaxed">
//           <code
//             dangerouslySetInnerHTML={{
//               __html: highlightCode(code, language),
//             }}
//           />
//         </pre>
//       </div>
//     </div>
//   )
// }
