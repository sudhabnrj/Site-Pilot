"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Lightbulb, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileUsabilityIssueCardProps {
  id: string;
  category: "CRITICAL" | "LAYOUT" | "READABILITY";
  title: string;
  description: string;
  fix: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function MobileUsabilityIssueCard({
  id,
  category,
  title,
  description,
  fix,
  isSelected = false,
  onClick,
}: MobileUsabilityIssueCardProps) {
  const isCritical = category === "CRITICAL";

  return (
    <GlassCard
      onClick={onClick}
      className={cn(
        "p-5 rounded-2xl border transition-all duration-200 cursor-pointer group bg-white/70",
        isSelected
          ? "border-blue-600 shadow-md scale-[1.01]"
          : isCritical
          ? "border-red-100 hover:border-red-300"
          : "border-slate-200/80 hover:border-blue-300"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span
          className={cn(
            "px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide",
            isCritical
              ? "bg-red-50 text-red-600 border border-red-100"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          )}
        >
          {category}
        </span>
        <ChevronRight
          className={cn(
            "h-4 w-4 text-slate-400 transition-opacity",
            isSelected ? "opacity-100 text-blue-600" : "opacity-0 group-hover:opacity-100"
          )}
        />
      </div>

      <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
      <p className="text-xs font-semibold text-slate-400 mb-3 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-1.5 text-blue-600 font-extrabold text-[11px] bg-blue-50/50 border border-blue-100/30 px-2.5 py-1.5 rounded-lg w-fit shadow-inner select-none">
        <Lightbulb className="h-3.5 w-3.5 shrink-0" />
        <span>Fix: {fix}</span>
      </div>
    </GlassCard>
  );
}
