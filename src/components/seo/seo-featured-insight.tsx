"use client";

import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeoFeaturedInsightProps {
  recommendation: string;
  onApplyInsight?: () => void;
}

export function SeoFeaturedInsight({
  recommendation,
  onApplyInsight,
}: SeoFeaturedInsightProps) {
  return (
    <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-[20px] flex flex-col md:flex-row items-center gap-4 shadow-sm">
      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-full animate-pulse shadow-md shadow-indigo-500/20">
        <Brain className="h-5 w-5 text-white" />
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-0.5">
          AI Recommendation
        </span>
        <p className="text-sm font-semibold text-slate-700 leading-relaxed">
          {recommendation}
        </p>
      </div>

    </div>
  );
}
