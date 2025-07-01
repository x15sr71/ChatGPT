"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { nanoid } from "nanoid";

export type ChatPart =
  | { type: "text"; text: string }
  | { type: "image"; image: { url: string } };

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: ChatPart[];
  timestamp: Date;
  isTyping?: boolean;
  hasCodeBlock?: boolean;
}

export interface ChatSummary {
  chatId: string;
  title: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
}

export function useChat() {
  const { userId } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [inputPosition, setInputPosition] = useState<"center" | "bottom">("center");
  const [typingInterval, setTypingInterval] = useState<NodeJS.Timeout | null>(null);

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatList, setChatList] = useState<Chat[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (activeChatId) fetchChat(activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    if (userId) fetchChatList();
  }, [userId]);

  const fetchChatList = async () => {
    try {
      const res = await fetch(`/api/chats`);
      if (!res.ok) throw new Error("Failed to fetch chat list");
      const data = await res.json();
      setChatList(
        data.map((c: { chatId: string; title: string }) => ({
          id: c.chatId,
          title: c.title,
        }))
      );
    } catch (err) {
      console.error("[fetchChatList]", err);
    }
  };

  const fetchChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      if (!res.ok) throw new Error("Failed to fetch chat");
      const chat = await res.json();

      const normalizedMessages: Message[] = chat.messages.map((m: any) => ({
        id: m._id?.$oid ?? m._id?.toString?.() ?? nanoid(),
        role: m.role,
        content: Array.isArray(m.content)
          ? m.content.map((part) =>
              typeof part === "string" ? { type: "text", text: part } : part
            )
          : [],
        timestamp: new Date(m.timestamp),
      }));

      setMessages(normalizedMessages);
      setInputPosition("bottom");
    } catch (err) {
      console.error("[fetchChat]", err);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setActiveChatId(null);
    setInputPosition("center");
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const pauseGeneration = () => {
    setIsPaused(true);
    if (typingInterval) clearInterval(typingInterval);
    setTypingInterval(null);
    setIsTyping(false);
  };

  const handleEdit = (messageId: string, content: ChatPart[] | string) => {
    setEditingMessageId(messageId);
    const text =
      typeof content === "string"
        ? content
        : content
            .filter((c) => c.type === "text")
            .map((c) => (c as { type: "text"; text: string }).text)
            .join("\n\n");
    setEditContent(text);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  const deleteChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete chat");

      setChatList((prev) => prev.filter((chat) => chat.id !== chatId));
      if (activeChatId === chatId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("[deleteChat]", err);
    }
  };

  const handleSaveEdit = (messageId: string) => {
    if (!editContent.trim()) return;

    const index = messages.findIndex((m) => m.id === messageId);
    if (index === -1) return;

    const updatedMessages: Message[] = [];
    for (let i = 0; i < index; i++) updatedMessages.push(messages[i]);

    const edited = messages[index];
    if (edited.role !== "user") return;

    updatedMessages.push({
      ...edited,
      content: [{ type: "text", text: editContent.trim() }],
    });

    setMessages(updatedMessages);
    sendMessage(undefined, updatedMessages);

    setEditingMessageId(null);
    setEditContent("");
  };

  const handleRegenerate = async (messageId: string) => {
    const cutIndex = messages.findIndex((m) => m.id === messageId);
    if (cutIndex === -1) return;

    const prunedMessages = messages.slice(0, cutIndex + 1);
    setMessages(prunedMessages);
    await sendMessage(undefined, prunedMessages);
  };

  const sendMessage = async (
    parts?: ChatPart[],
    overrideMessages?: Message[]
  ) => {
    const baseMessages = overrideMessages ?? messages;
    if (!parts && baseMessages.length === 0) return;
    if (baseMessages.length === 0) setInputPosition("bottom");

    const userMessage: Message | null =
      parts && parts.length > 0
        ? {
            id: nanoid(),
            role: "user",
            content: parts,
            timestamp: new Date(),
          }
        : null;

    const next = userMessage ? [...baseMessages, userMessage] : [...baseMessages];
    setMessages(next);
    setInput("");
    setIsTyping(true);
    setIsPaused(false);

    try {
      const tempChatId = activeChatId ?? nanoid();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: tempChatId,
          messages: next.map((m) => ({
            role: m.role,
            content:
              m.content.length === 1 && m.content[0].type === "text"
                ? m.content[0].text
                : m.content,
          })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to fetch response from AI");

      const chatIdFromHeader = res.headers.get("x-chat-id");

      if (chatIdFromHeader && !activeChatId) {
        setActiveChatId(chatIdFromHeader);

        // 🚀 Optimistically update sidebar
        const firstTextPart = parts?.find((p) => p.type === "text") as
          | { type: "text"; text: string }
          | undefined;

        const title = firstTextPart
          ? firstTextPart.text.trim().slice(0, 50)
          : "Untitled";

        setChatList((prev) => [
          { id: chatIdFromHeader, title },
          ...prev,
        ]);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      const assistantId = nanoid();
      setMessages((cur) => [
        ...cur,
        {
          id: assistantId,
          role: "assistant",
          content: [],
          timestamp: new Date(),
          isTyping: true,
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        full += chunk;

        setMessages((cur) =>
          cur.map((m) =>
            m.id === assistantId
              ? { ...m, content: [{ type: "text", text: full }] }
              : m
          )
        );
      }

      setIsTyping(false);
      setMessages((cur) =>
        cur.map((m) => (m.id === assistantId ? { ...m, isTyping: false } : m))
      );
    } catch (err) {
      console.error("AI API error:", err);
      setIsTyping(false);
    }
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    isTyping,
    editingMessageId,
    editContent,
    setEditContent,
    inputPosition,
    messagesEndRef,
    textareaRef,
    pauseGeneration,
    sendMessage,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleRegenerate,
    handleNewChat,
    handleSelectChat,
    chatList,
    setChatList,
    activeChatId,
    deleteChat,
  };
}
