"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccessibilityFailure {
  id: string;
  code: string;
  title: string;
  severity: "Critical" | "Warning";
  description: string;
  aiSuggestion: string;
  imageSrc?: string;
}

interface AccessibilityFailureCardProps {
  failure: AccessibilityFailure;
}

export function AccessibilityFailureCard({
  failure,
}: AccessibilityFailureCardProps) {
  const isCritical = failure.severity === "Critical";

  // Use the provided imageSrc or a default placeholder
  const imageSource = failure.imageSrc || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop";

  return (
    <GlassCard
      className={cn(
        "rounded-[24px] overflow-hidden border-slate-200/80 shadow-sm group bg-white/70 transition-all duration-300"
      )}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left Graphics Panel showing screenshot */}
        <div className="lg:w-1/3 h-48 lg:h-auto relative overflow-hidden shrink-0 select-none border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50">
          <img
            className="w-full h-full object-cover transition-all duration-500 ease-out"
            src={imageSource}
            alt={failure.title}
          />
          <div
            className={cn(
              "absolute top-4 left-4 text-white text-[9px] font-black px-2.5 py-1 rounded tracking-wide shadow-sm uppercase",
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
              <h4 className="text-base font-bold text-slate-800 tracking-tight">
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
                "p-4 rounded-xl border text-xs leading-relaxed text-slate-600 shadow-sm",
                isCritical
                  ? "bg-slate-50/50 border-slate-200"
                  : "bg-indigo-50/20 border-indigo-100/30"
              )}
            >
              <div className="flex items-start gap-2.5">
                <Brain className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-800 mb-0.5">AI Suggestion</p>
                  <p className="font-medium text-slate-500 italic">&quot;{failure.aiSuggestion}&quot;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
