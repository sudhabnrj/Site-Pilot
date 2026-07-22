"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Sparkles } from "lucide-react";

interface AiGrowthRecommendationProps {
  title?: string;
  description?: string;
  tags?: string[];
  onAction?: () => void;
}

export function AiGrowthRecommendation({
  title = "AI Growth Recommendation",
  description = "We've identified a common performance bottleneck across 4 of your properties. Updating your CDN configuration could improve LCP scores by an average of 18%.",
  tags = ["Performance", "Optimization"],
  onAction,
}: AiGrowthRecommendationProps) {
  return (
    <GlassCard className="rounded-[32px] p-6 md:p-8 border-l-4 border-l-blue-600 relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-inner">
          <Sparkles className="h-7 w-7 text-blue-600" />
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left min-w-0">
          <h4 className="text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h4>
          <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-2xl">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100/50 rounded-full text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onAction}
          className="shrink-0 px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold shadow hover:bg-slate-800 active:scale-95 transition-all"
        >
          View Detailed Insight
        </button>
      </div>

      {/* Ambient background glow decoration */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
    </GlassCard>
  );
}
