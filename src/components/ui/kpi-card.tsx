"use client";

import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";
import { TrendBadge } from "@/components/ui/trend-badge";
import type { KpiMetric } from "@/types/dashboard";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

const colorVariantStyles = {
  primary: {
    iconBg: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400",
    valueColor: "text-blue-700 dark:text-blue-400",
    progressColor: "bg-blue-600",
  },
  secondary: {
    iconBg: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400",
    valueColor: "text-indigo-700 dark:text-indigo-400",
    progressColor: "bg-indigo-600",
  },
  tertiary: {
    iconBg: "bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400",
    valueColor: "text-orange-700 dark:text-orange-400",
    progressColor: "bg-orange-600",
  },
  neutral: {
    iconBg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200",
    valueColor: "text-slate-900 dark:text-white",
    progressColor: "bg-slate-800 dark:bg-slate-200",
  },
} as const;

interface KpiCardProps {
  metric: KpiMetric;
  className?: string;
}

export function KpiCard({ metric, className }: KpiCardProps) {
  const styles = colorVariantStyles[metric.colorVariant];
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[metric.icon];
  const progressPercent = metric.maxValue
    ? (metric.value / metric.maxValue) * 100
    : metric.value;

  return (
    <GlassCard hoverable className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between">
        <div className={cn("rounded-xl p-2", styles.iconBg)}>
          {IconComponent && <IconComponent className="h-5 w-5" aria-hidden="true" />}
        </div>
        <div className="text-right">
          <span className="text-xs font-medium tracking-wide text-muted-foreground">
            {metric.label}
          </span>
          <div className={cn("text-3xl font-bold tracking-tight", styles.valueColor)}>
            {metric.value}
            {metric.maxValue && (
              <span className="text-xs font-normal text-muted-foreground">/{metric.maxValue}</span>
            )}
          </div>
        </div>
      </div>

      <TrendBadge
        direction={metric.trend.direction}
        percentage={metric.trend.percentage}
        label={metric.trend.label}
      />

      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={cn("h-full rounded-full transition-all duration-700", styles.progressColor)}
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={metric.value}
          aria-valuemax={metric.maxValue ?? 100}
        />
      </div>
    </GlassCard>
  );
}
