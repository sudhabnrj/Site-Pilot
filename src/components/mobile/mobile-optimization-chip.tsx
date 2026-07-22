"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileOptimizationChipProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

export function MobileOptimizationChip({
  icon: Icon,
  title,
  description,
  onClick,
}: MobileOptimizationChipProps) {
  return (
    <GlassCard
      onClick={onClick}
      className="p-5 rounded-2xl border border-slate-200/80 bg-white/70 hover:bg-indigo-50/20 hover:border-indigo-200/60 transition-all duration-200 flex items-center gap-4 cursor-pointer hover:shadow-sm shadow-inner group shrink-0"
    >
      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 select-none">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="font-bold text-slate-800 text-sm tracking-tight">{title}</p>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5 leading-tight">
          {description}
        </p>
      </div>
    </GlassCard>
  );
}
