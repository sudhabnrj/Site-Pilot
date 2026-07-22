"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { BrainCircuit } from "lucide-react";

export interface PerformanceInsightItem {
  id: string;
  type: "Optimization Tip" | "Content Strategy" | "Caching Profile";
  text: string;
  highlightText: string;
}

interface AiPerformanceInsightsProps {
  insights: PerformanceInsightItem[];
  onGenerateCode?: () => void;
}

export function AiPerformanceInsights({
  insights,
  onGenerateCode,
}: AiPerformanceInsightsProps) {
  return (
    <GlassCard className="p-5 rounded-[24px] border-slate-200/80 shadow-sm flex flex-col bg-white/70">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-bold text-slate-800 tracking-tight">AI Insights</h3>
      </div>

      <div className="space-y-4 flex-1">
        {insights.map((insight) => {
          const isTip = insight.type === "Optimization Tip";
          return (
            <div
              key={insight.id}
              className={cn(
                "p-3 rounded-xl border text-xs leading-relaxed text-slate-600",
                isTip
                  ? "bg-indigo-50/30 border-indigo-100/50"
                  : "bg-blue-50/30 border-blue-100/50"
              )}
            >
              <p>
                <span
                  className={cn(
                    "font-extrabold mr-1",
                    isTip ? "text-indigo-600" : "text-blue-600"
                  )}
                >
                  {insight.type}:
                </span>{" "}
                {insight.text}{" "}
                <span className="font-extrabold text-slate-800">{insight.highlightText}</span>
              </p>
            </div>
          );
        })}
      </div>

      <button
        onClick={onGenerateCode}
        className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-xs shadow-md hover:shadow-lg active:scale-95 transition-all"
      >
        Generate Optimization Code
      </button>
    </GlassCard>
  );
}

// Simple helper to avoid import loop
import { cn } from "@/lib/utils";
