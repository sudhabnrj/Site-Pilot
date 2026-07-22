"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeoBreakdownCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  score: number;
  iconBgClass?: string;
  iconColorClass?: string;
  progressBarColor?: string;
}

export function SeoBreakdownCard({
  icon: Icon,
  title,
  description,
  score,
  iconBgClass = "bg-blue-50 border-blue-100",
  iconColorClass = "text-blue-600",
  progressBarColor = "bg-blue-600",
}: SeoBreakdownCardProps) {
  return (
    <GlassCard className="p-5 rounded-[24px] border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-200 bg-white/70">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-xl border flex items-center justify-center shadow-sm", iconBgClass, iconColorClass)}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <span className={cn("text-xs font-black tracking-tight", iconColorClass)}>
          {score}%
        </span>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-800 tracking-tight mb-1">
          {title}
        </h4>
        <p className="text-xs font-semibold text-slate-400 mb-4 leading-relaxed">
          {description}
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
          <div
            className={cn("h-full rounded-full transition-all duration-500", progressBarColor)}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </GlassCard>
  );
}
