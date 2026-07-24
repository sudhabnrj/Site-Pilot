"use client";

import { cn } from "@/lib/utils";

interface PdfAiRecommendationItemProps {
  num: number;
  title: string;
  description: string;
  isLowPriority?: boolean;
}

export function PdfAiRecommendationItem({
  num,
  title,
  description,
  isLowPriority = false,
}: PdfAiRecommendationItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 dark:bg-slate-00 bg-indigo-50/20 border border-indigo-100/60 rounded-xl transition-all duration-300",
        isLowPriority && "opacity-60"
      )}
    >
      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-600 text-white font-extrabold text-xs shrink-0 shadow select-none">
        {num}
      </span>
      <div>
        <h4 className="text-sm font-bold text-slate-800 leading-none">{title}</h4>
        <p className="text-xs font-semibold text-slate-400 mt-1.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
