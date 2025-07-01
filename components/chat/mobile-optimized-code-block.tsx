// "use client"

// import { useState, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Copy, Check } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface MobileOptimizedCodeBlockProps {
//   code: string
//   language: string
//   onCopy?: () => void
//   isTyping?: boolean
//   title?: string
// }

// export function MobileOptimizedCodeBlock({
//   code,
//   language,
//   onCopy,
//   isTyping = false,
//   title,
// }: MobileOptimizedCodeBlockProps) {
//   const [copied, setCopied] = useState(false)
//   const codeContainerRef = useRef<HTMLDivElement>(null)

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

//   const highlightCode = (code: string, lang: string) => {
//     if (!code) return ""

//     switch (lang.toLowerCase()) {
//       case "tsx":
//       case "jsx":
//       case "javascript":
//       case "js":
//         return code
//           .replace(
//             /\b(import|export|from|function|const|let|var|return|if|else|for|while|class|interface|type|extends|implements|async|await|try|catch|finally|throw|new|this|super|static|public|private|protected|readonly|abstract|default)\b/g,
//             '<span class="text-blue-400 font-medium">$1</span>',
//           )
//           .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="text-yellow-300 font-medium">$1</span>')
//           .replace(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, '.<span class="text-blue-300">$1</span>')
//           .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
//           .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>')
//           .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-purple-400">$1</span>')
//           .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
//           .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
//           .replace(/(<\/?[a-zA-Z][a-zA-Z0-9-]*)/g, '<span class="text-red-400">$1</span>')
//           .replace(/(\/?>)/g, '<span class="text-red-400">$1</span>')
//           .replace(/\s([a-zA-Z-]+)=/g, ' <span class="text-blue-300">$1</span>=')
//       default:
//         return code
//     }
//   }

//   return (
//     <div className="relative bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden my-4 shadow-2xl">
//       {/* Title Section */}
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

//       {/* Header with Language and Copy Button */}
//       <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/10">
//         <span className="text-xs text-white/70 font-mono font-medium">{language}</span>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="text-white/70 hover:text-white hover:bg-white/10 h-7 px-2 text-xs font-medium transition-colors"
//           onClick={handleCopy}
//         >
//           {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
//           {copied ? "Copied" : "Copy"}
//         </Button>
//       </div>

//       {/* Code Content with Mobile-Optimized Scrolling */}
//       <div
//         ref={codeContainerRef}
//         className={cn(
//           "relative p-4 bg-[#0d1117]",
//           // Mobile-optimized scrolling
//           "overflow-x-auto overflow-y-hidden",
//           // Touch scrolling for iOS
//           "touch-pan-x",
//           // Custom scrollbar for mobile
//           "mobile-scroll-container",
//         )}
//         style={{
//           // Ensure content doesn't wrap and enables horizontal scroll
//           whiteSpace: "nowrap",
//           // Smooth scrolling behavior
//           scrollBehavior: "smooth",
//           // WebKit scrolling for iOS
//           WebkitOverflowScrolling: "touch",
//         }}
//       >
//         <pre className="text-sm text-white/90 font-mono leading-relaxed">
//           <code
//             dangerouslySetInnerHTML={{
//               __html:
//                 highlightCode(code, language) + (isTyping ? '<span class="animate-pulse text-white">|</span>' : ""),
//             }}
//             style={{
//               // Prevent line breaks
//               whiteSpace: "pre",
//               // Ensure minimum width for scrolling
//               minWidth: "max-content",
//             }}
//           />
//         </pre>
//       </div>
//     </div>
//   )
// }
