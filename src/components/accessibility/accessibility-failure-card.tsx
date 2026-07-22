"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Brain, Eye, Sparkles, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccessibilityFailure {
  id: string;
  code: string;
  title: string;
  severity: "Critical" | "Warning";
  description: string;
  aiSuggestion: string;
  imageSrc: string;
}

interface AccessibilityFailureCardProps {
  failure: AccessibilityFailure;
  onViewInCode?: (id: string) => void;
  onApplyFix?: (id: string) => void;
}

export function AccessibilityFailureCard({
  failure,
  onViewInCode,
  onApplyFix,
}: AccessibilityFailureCardProps) {
  const [fixState, setFixState] = useState<"idle" | "fixing" | "fixed">("idle");

  const handleFixClick = async () => {
    setFixState("fixing");
    onApplyFix?.(failure.id);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFixState("fixed");
  };

  const isCritical = failure.severity === "Critical";

  return (
    <GlassCard
      className={cn(
        "rounded-[24px] overflow-hidden border-slate-200/80 shadow-sm group bg-white/70 transition-all duration-300",
        fixState === "fixed" && "opacity-60 pointer-events-none bg-slate-50/20"
      )}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left Graphics Panel */}
        <div className="lg:w-1/3 h-48 lg:h-auto relative overflow-hidden shrink-0 select-none border-b lg:border-b-0 lg:border-r border-slate-100">
          <img
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
            src={failure.imageSrc}
            alt={failure.title}
          />
          <div
            className={cn(
              "absolute top-4 left-4 text-white text-[9px] font-black px-2 py-1 rounded tracking-wide shadow-sm",
              isCritical ? "bg-red-500" : "bg-amber-500"
            )}
          >
            {failure.code}
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="p-6 lg:w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4 mb-2">
              <h4
                className={cn(
                  "text-base font-bold text-slate-800 tracking-tight",
                  fixState === "fixed" && "line-through text-slate-400"
                )}
              >
                {failure.title}
              </h4>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded border text-[9px] font-extrabold uppercase tracking-wider shrink-0",
                  isCritical
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "bg-amber-50 text-amber-600 border-amber-100"
                )}
              >
                {failure.severity}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mb-4 leading-relaxed">
              {failure.description}
            </p>

            {/* AI Suggestion Box */}
            <div
              className={cn(
                "p-4 rounded-xl border text-xs leading-relaxed text-slate-600 mb-4 shadow-sm",
                isCritical
                  ? "bg-slate-50/50 border-slate-200"
                  : "bg-indigo-50/20 border-indigo-100/30"
              )}
            >
              <div className="flex items-start gap-2.5">
                <Brain className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-800 mb-0.5">AI Suggestion</p>
                  <p className="font-medium text-slate-500 italic">"{failure.aiSuggestion}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Links Footer */}
          <div className="flex items-center gap-6 pt-4 border-t border-slate-100 mt-2">
            <button
              onClick={() => onViewInCode?.(failure.id)}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 active:scale-95 transition-all hover:underline"
            >
              <Eye className="h-4 w-4" />
              View in Code
            </button>

            {fixState === "fixed" ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <Check className="h-4 w-4" />
                Fixed
              </span>
            ) : fixState === "fixing" ? (
              <span className="flex items-center gap-1 text-xs font-bold text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Applying Fix...
              </span>
            ) : (
              <button
                onClick={handleFixClick}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 active:scale-95 transition-all hover:underline"
              >
                <Sparkles className="h-4 w-4" />
                Apply Fix
              </button>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
