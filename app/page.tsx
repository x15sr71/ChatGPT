"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChat } from "@/hooks/use-chat";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { EnhancedMessageBubble } from "@/components/chat/enhanced-message-bubble";
import { EnhancedHeader } from "@/components/enhanced-header";
import { SearchModal } from "@/components/search/search-modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollToBottomButton } from "@/components/chat/scroll-to-bottom-button";
import { EnhancedInput } from "@/components/chat/enhanced-input";
import type { ChatPart } from "@/hooks/use-chat";
import { ResponsiveSidebar } from "@/components/sidebar/responsive-sidebar";

export default function ChatGPTInterface() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [attachments, setAttachments] = useState<
    { preview: string; type: "image" | "text"; extracted?: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  const {
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    toggleSidebarCollapse,
    closeSidebar,
  } = useSidebar();

  const {
    messages,
    input,
    setInput,
    isTyping,
    editingMessageId,
    editContent,
    setEditContent,
    inputPosition,
    messagesEndRef,
    textareaRef,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleRegenerate,
    handleNewChat,
    handleKeyDown,
    pauseGeneration,
    handleCodeEdit,
    handleSelectChat,
    sendMessage,
    chatList,
    setChatList, // ✅ Used to update chat title
    deleteChat,
  } = useChat();

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChatList((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(
      extension || ""
    );
    const resourceType = isImage ? "image" : "raw";

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    try {
      const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.secure_url) {
        alert(
          `Upload to Cloudinary failed: ${
            data.error?.message || "Unknown error"
          }`
        );
        return;
      }

      const url = data.secure_url;
      if (isImage) {
        setAttachments((prev) => [...prev, { preview: url, type: "image" }]);
      } else {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData?.extracted) {
          alert("Failed to extract text from document.");
          return;
        }

        setAttachments((prev) => [
          ...prev,
          { preview: url, type: "text", extracted: uploadData.extracted },
        ]);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check console for details.");
    }
  };

  const handleSend = () => {
    const imageUrls = attachments
      .filter((a) => a.type === "image" && a.preview)
      .map((a) => a.preview);

    const textContent = input.trim();
    const docTexts = attachments
      .filter((a) => a.type === "text" && a.extracted?.trim())
      .map((a) => a.extracted!.trim());

    const parts: ChatPart[] = [];

    if (textContent) parts.push({ type: "text", text: textContent });

    for (const docText of docTexts) {
      parts.push({
        type: "text",
        text: `\n\n[Attached Document Content]\n${docText}`,
      });
    }

    for (const url of imageUrls) {
      parts.push({ type: "image", image: { url } });
    }

    if (parts.length === 0) {
      alert("Cannot send an empty message.");
      return;
    }

    sendMessage(parts);
    setInput("");
    setAttachments([]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen w-full bg-[#212121] overflow-hidden">
      <div
        id="aria-live-region"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <ResponsiveSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={closeSidebar}
        onToggle={toggleSidebar}
        onToggleCollapse={toggleSidebarCollapse}
        chats={chatList}
        onNewChat={handleNewChat}
        onOpenSearch={() => setIsSearchOpen(true)}
        isMobile={isMobile}
        onSelectChat={handleSelectChat}
        deleteChat={deleteChat}
        onRenameChat={handleRenameChat} // ✅ Added here
      />

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <EnhancedHeader
          onToggleSidebar={toggleSidebar}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
        />

        <main
          id="main-content"
          className="flex-1 overflow-hidden"
          role="main"
          aria-label="Chat conversation"
        >
          {inputPosition === "center" ? (
            <div className="flex flex-col items-center justify-center min-h-full px-4">
              <div className="max-w-2xl w-full text-center space-y-8">
                <h1 className="text-2xl sm:text-3xl font-medium text-white mb-12">
                  {isMobile
                    ? "Hey, Chandragupt. Ready to dive in?"
                    : "What can I help with?"}
                </h1>
                <EnhancedInput
                  variant="center"
                  input={input}
                  onInputChange={setInput}
                  onSend={handleSend}
                  onKeyDown={handleKeyDown}
                  textareaRef={textareaRef}
                  fileInputRef={fileInputRef}
                  isTyping={isTyping}
                  onPause={pauseGeneration}
                  onFileUpload={handleFileUpload}
                  attachments={attachments}
                  onRemoveAttachment={handleRemoveAttachment}
                  hasMessages={messages.length > 0}
                />
              </div>
            </div>
          ) : (
            <ScrollArea
              ref={scrollAreaRef}
              className="h-full"
              aria-label="Chat messages"
            >
              <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
                {messages.map((message) => (
                  <EnhancedMessageBubble
                    key={message.id}
                    message={message}
                    isEditing={editingMessageId === message.id}
                    editContent={editContent}
                    onEdit={handleEdit}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onRegenerate={handleRegenerate}
                    onEditContentChange={setEditContent}
                    onCodeEdit={handleCodeEdit}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          <ScrollToBottomButton containerRef={scrollAreaRef} />
        </main>

        {inputPosition === "bottom" && (
          <EnhancedInput
            variant="bottom"
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            onKeyDown={handleKeyDown}
            textareaRef={textareaRef}
            fileInputRef={fileInputRef}
            isTyping={isTyping}
            onPause={pauseGeneration}
            onFileUpload={handleFileUpload}
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
            hasMessages={messages.length > 0}
          />
        )}
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chats={[]}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent
          className="bg-[#212121] border-white/10 text-white"
          aria-describedby="settings-description"
        >
          <DialogHeader>
            <DialogTitle className="text-white">Settings</DialogTitle>
          </DialogHeader>
          <div id="settings-description" className="space-y-6 py-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">General</h3>
              <div className="space-y-2 text-sm text-white/70">
                <p>Theme: Dark</p>
                <p>Language: English</p>
                <p>Data controls: Manage your data</p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white">Speech</h3>
              <div className="space-y-2 text-sm text-white/70">
                <p>Voice: Default</p>
                <p>Speed: Normal</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
