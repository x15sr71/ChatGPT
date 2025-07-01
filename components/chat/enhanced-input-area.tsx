// "use client";

// import type React from "react";
// import { Button } from "@/components/ui/button";
// import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
// import { Send, Paperclip, Mic, Square, Plus } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface EnhancedInputAreaProps {
//   input: string;
//   onInputChange: (value: string) => void;
//   onSend: () => void;
//   onKeyDown: (e: React.KeyboardEvent) => void;
//   textareaRef: React.RefObject<HTMLTextAreaElement>;
//   fileInputRef: React.RefObject<HTMLInputElement>;
//   hasMessages: boolean;
//   isTyping: boolean;
//   onPause: () => void;
//   onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   attachments: { preview: string; type: "image" | "text"; extracted?: string }[];
//   onRemoveAttachment: (i: number) => void;
// }


// export function EnhancedInputArea({
//   input,
//   onInputChange,
//   onSend,
//   onKeyDown,
//   textareaRef,
//   fileInputRef,
//   hasMessages,
//   isTyping,
//   onPause,
// }: EnhancedInputAreaProps) {
//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const extension = file.name.split(".").pop()?.toLowerCase();
//     const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(extension || "");
//     const resourceType = isImage ? "image" : "raw";

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await response.json();

//       if (!response.ok || !data.secure_url) {
//         console.error("Cloudinary upload failed:", data);
//         return;
//       }

//       const url = data.secure_url;
//       console.log("Uploaded to Cloudinary:", url);

//       if (isImage) {
//         console.log("Not calling /api/upload for image")
//         onInputChange(url);
//         console.log("onSend triggered from input area ");
//         onSend();
//       } else {
//         console.log("Calling /api/upload with:", url);
//         const uploadRes = await fetch("/api/upload", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ url }),
//         });

//         const uploadData = await uploadRes.json();
//         if (!uploadRes.ok || !uploadData?.extracted) {
//           console.error("File content extraction failed:", uploadData);
//           alert("Text extraction failed. Try a different file?");
//           return;
//         }

//         console.log("Extracted text:", uploadData.extracted);
//         onInputChange(uploadData.extracted);
//       }
//     } catch (err) {
//       console.error("Upload failed:", err);
//     }
//   };

//   return (
//     <div className="p-4 bg-[#212121]">
//       <div className="max-w-4xl mx-auto">
//         <div className="relative">
//           <div className="bg-white/10 border border-white/20 rounded-3xl p-3 sm:p-4 flex items-end gap-2 sm:gap-3 min-h-[56px]">
          
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-white/50 hover:text-white hover:bg-white/10 h-8 w-8 flex-shrink-0 self-end mb-1"
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <Paperclip className="h-4 w-4" />
//             </Button>

//             <input
//               ref={fileInputRef}
//               type="file"
//               className="hidden"
//               onChange={handleFileUpload}
//               accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.docx,.txt"
//             />

//             <div className="flex-1 mb-2 relative min-h-[24px] max-h-[200px]">
//               <AutoResizeTextarea
//                 ref={textareaRef}
//                 value={input}
//                 onChange={(e) => onInputChange(e.target.value)}
//                 onKeyDown={onKeyDown}
//                 placeholder={hasMessages ? "Message ChatGPT" : "Ask anything"}
//                 className="bg-transparent border-0 text-white placeholder:text-white/50 focus-visible:ring-0 text-base leading-6"
//                 rows={1}
//               />
//             </div>

//             <div className="flex items-center gap-2 flex-shrink-0 self-end mb-1">
//               {!hasMessages && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-white/70 hover:text-white hover:bg-white/10 gap-2 h-8 hidden sm:flex"
//                 >
//                   <Plus className="h-4 w-4" />
//                   Tools
//                 </Button>
//               )}

//               <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10 h-8 w-8">
//                 <Mic className="h-4 w-4" />
//               </Button>

//               <Button
//                 onClick={isTyping ? onPause : onSend}
//                 disabled={!isTyping && !input.trim()}
//                 size="icon"
//                 className={cn(
//                   "h-8 w-8 rounded-full transition-all duration-200",
//                   isTyping
//                     ? "bg-red-500 text-white hover:bg-red-600"
//                     : input.trim()
//                     ? "bg-white text-black hover:bg-white/90 shadow-md"
//                     : "bg-white/10 text-white/30 cursor-not-allowed"
//                 )}
//               >
//                 {isTyping ? <Square className="h-4 w-4" /> : <Send className="h-4 w-4" />}
//               </Button>
//             </div>
//           </div>
//         </div>

//         <p className="text-xs text-white/50 mt-2 text-center">ChatGPT can make mistakes. Check important info.</p>
//       </div>
//     </div>
//   );
// }
