"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bot, Minimize2, X, Send, Loader2 } from "lucide-react";
import type { ChatMessage } from "@/types/dashboard";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/store";

interface AiChatPanelProps {
  messages: ChatMessage[];
  className?: string;
}

export function AiChatPanel({ messages: initialMessages, className }: AiChatPanelProps) {
  const currentReport = useAppSelector((state) => state.audit.currentReport);

  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const promptText = inputValue.trim();
    if (!promptText || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText,
          domain: currentReport?.domain || "example.com",
          report: currentReport,
        }),
      });

      const data = await res.json();
      const replyText = data.success ? data.reply : "I am experiencing an issue analyzing the website right now. Please try again.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I am unable to connect to the Lumina AI engine right now.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-transform hover:scale-110 cursor-pointer"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI chat assistant"
      >
        <Bot className="h-6 w-6" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-96 overflow-hidden rounded-2xl border border-border/50 bg-white shadow-2xl",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-sm font-bold block leading-none">AI Audit Assistant</span>
              <span className="text-[10px] text-blue-200 block mt-0.5">{currentReport?.domain || "example.com"}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="rounded p-1 transition-colors hover:bg-white/20 cursor-pointer"
              aria-label="Minimize chat"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 transition-colors hover:bg-white/20 cursor-pointer"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div ref={chatContainerRef} className="h-64 space-y-4 overflow-y-auto bg-slate-50/50 p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2.5",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600">
                      <Bot className="h-3 w-3 text-white" aria-hidden="true" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs whitespace-pre-line",
                      msg.role === "assistant"
                        ? "rounded-tl-none bg-white border border-slate-200 text-slate-800"
                        : "rounded-tr-none bg-blue-600 text-white font-medium"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold italic">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                  <span>AI Assistant is analyzing...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-border/50 bg-white p-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask how to fix SEO, performance..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label="Chat message input"
              />
              <button
                type="submit"
                disabled={isTyping}
                className="rounded-xl bg-blue-600 px-3 py-2 text-white transition-opacity hover:opacity-90 active:scale-95 cursor-pointer disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
