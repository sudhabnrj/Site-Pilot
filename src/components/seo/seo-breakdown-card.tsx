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
  iconBgClass,
  iconColorClass,
  progressBarColor,
}: SeoBreakdownCardProps) {
  const computedBg =
    iconBgClass ||
    (score >= 80
      ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900"
      : score >= 70
      ? "bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900"
      : "bg-red-50 dark:bg-red-950/60 border-red-100 dark:border-red-900");

  const computedColor =
    iconColorClass ||
    (score >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 70
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400");

  const computedProgress =
    progressBarColor ||
    (score >= 80 ? "bg-emerald-500" : score >= 70 ? "bg-amber-500" : "bg-red-500");

  return (
    <GlassCard className="p-5 rounded-[24px] border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-200 bg-white/70">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-xl border flex items-center justify-center shadow-sm", computedBg, computedColor)}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <span className={cn("text-xs font-black tracking-tight", computedColor)}>
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
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden shadow-inner">
          <div
            className={cn("h-full rounded-full transition-all duration-500", computedProgress)}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </GlassCard>
  );
}
