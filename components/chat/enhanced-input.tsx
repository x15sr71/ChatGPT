"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import {
  Send,
  Paperclip,
  Mic,
  Square,
  Plus,
  Settings,
  X,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

interface Attachment {
  preview: string;
  type: "image" | "text";
  name: string;
  extracted?: string;
}

interface EnhancedInputProps {
  variant: "center" | "bottom";
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isTyping: boolean;
  hasMessages?: boolean;
  onPause: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  attachments: Attachment[];
  onRemoveAttachment: (index: number) => void;
}

export function EnhancedInput({
  variant,
  input,
  onInputChange,
  onSend,
  textareaRef,
  fileInputRef,
  isTyping,
  hasMessages = true,
  onPause,
  onFileUpload,
  attachments,
  onRemoveAttachment,
}: EnhancedInputProps) {
  const isMobile = useMobile();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleClick = () => {
    if (isTyping) onPause();
    else onSend();
  };

  const showTools =
    (variant === "center" && !isMobile) ||
    (variant === "bottom" && !hasMessages);

  return (
    <div className={cn(variant === "bottom" && "p-4 bg-[#212121]")}>
      <div
        className={cn(
          variant === "bottom"
            ? "max-w-4xl mx-auto"
            : "relative max-w-3xl mx-auto w-full space-y-4"
        )}
      >
        {variant === "center" && attachments.length > 0 && (
          <div className="flex flex-wrap gap-3 p-2 border border-white/20 rounded-xl bg-white/5">
            {attachments.map((att, idx) => (
              <div
                key={att.preview}
                className="relative max-w-[180px] w-full rounded-md border border-white/20 bg-white/10 p-3 text-xs text-white/80"
              >
                <button
                  className="absolute top-0 right-0 bg-black/70 rounded-full p-1 text-white hover:bg-black"
                  onClick={() => onRemoveAttachment(idx)}
                >
                  <X className="h-4 w-4" />
                </button>

                {att.type === "image" ? (
                  <img
                    src={att.preview}
                    alt={`attachment-${idx}`}
                    className="rounded-md max-h-32 border border-white/20"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-white/60 flex-shrink-0" />
                    <span className="truncate leading-tight" title={att.name}>
                      {att.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white/10 border border-white/20 rounded-3xl p-3 sm:p-4 flex items-end gap-2 sm:gap-3 shadow-lg min-h-[56px]">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/50 hover:text-white hover:bg-white/10 h-8 w-8 flex-shrink-0 self-end mb-1"
            onClick={() => fileInputRef.current?.click()}
          >
            {variant === "bottom" ? (
              <Paperclip className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={onFileUpload}
            accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.docx,.txt"
          />

          <div className="flex-1 mb-2 relative min-h-[24px] max-h-[200px]">
            <AutoResizeTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasMessages ? "Message ChatGPT" : "Ask anything"}
              className="bg-transparent border-0 text-white placeholder:text-white/50 focus-visible:ring-0 text-base leading-6"
              rows={1}
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end mb-1">
            {showTools && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 gap-2 h-8 hidden sm:flex"
              >
                {variant === "center" ? (
                  <Settings className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Tools
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="text-white/50 hover:text-white hover:bg-white/10 h-8 w-8"
            >
              <Mic className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleClick}
              disabled={!isTyping && !input.trim()}
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-200",
                isTyping
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : input.trim()
                  ? "bg-white text-black hover:bg-white/90 shadow-md"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              )}
            >
              {isTyping ? <Square className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {!isMobile && (
          <p className="text-xs text-white/50 mt-2 text-center">
            ChatGPT can make mistakes. Check important info.
          </p>
        )}
      </div>
    </div>
  );
}
