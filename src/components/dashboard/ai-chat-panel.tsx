"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bot, Minimize2, X, Send } from "lucide-react";
import type { ChatMessage } from "@/types/dashboard";
import { motion, AnimatePresence } from "framer-motion";

interface AiChatPanelProps {
  messages: ChatMessage[];
  className?: string;
}

export function AiChatPanel({ messages: initialMessages, className }: AiChatPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-transform hover:scale-110"
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
            <span className="text-sm font-bold">AI Audit Assistant</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="rounded p-1 transition-colors hover:bg-white/20"
              aria-label="Minimize chat"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 transition-colors hover:bg-white/20"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-64 space-y-4 overflow-y-auto bg-white/50 p-4">
              {initialMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
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
                      "max-w-[80%] rounded-2xl p-3 text-sm shadow-sm",
                      msg.role === "assistant"
                        ? "rounded-tl-none bg-slate-100"
                        : "rounded-tr-none bg-blue-600 text-white"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 border-t border-border/50 bg-white p-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-lg border-none bg-slate-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Chat message input"
              />
              <button
                className="rounded-lg bg-blue-600 p-2 text-white transition-opacity hover:opacity-90"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
