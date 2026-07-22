"use client";

import { useState, useCallback } from "react";
import type { ChatMessage } from "@/types/dashboard";

interface UseChatOptions {
  initialMessages?: ChatMessage[];
}

export function useChat({ initialMessages = [] }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
    },
    []
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setIsMinimized(false);
  }, [isOpen]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  return {
    messages,
    isOpen,
    isMinimized,
    inputValue,
    setInputValue,
    sendMessage,
    toggleOpen,
    toggleMinimize,
  };
}
