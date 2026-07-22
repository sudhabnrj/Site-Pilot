"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { type LucideIcon, ArrowDown, ArrowUp, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceMetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  comparison: string;
  comparisonStatus: "improved" | "declined" | "stable";
  statusText: string;
  statusType: "good" | "warning" | "error";
  progress: number;
  colorClass?: string;
  bgClass?: string;
  progressBarColor?: string;
}

export function PerformanceMetricCard({
  icon: Icon,
  title,
  value,
  comparison,
  comparisonStatus,
  statusText,
  statusType,
  progress,
  colorClass = "text-blue-600",
  bgClass = "bg-blue-50 border-blue-100",
  progressBarColor = "bg-blue-600",
}: PerformanceMetricCardProps) {
  const getStatusIcon = () => {
    switch (statusType) {
      case "good":
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-600 mr-1 shrink-0" />;
      case "warning":
        return <ArrowUp className="h-3.5 w-3.5 text-amber-500 mr-1 shrink-0" />;
      case "error":
        return <AlertTriangle className="h-3.5 w-3.5 text-red-500 mr-1 shrink-0" />;
    }
  };

  const getStatusTextClass = () => {
    switch (statusType) {
      case "good":
        return "text-emerald-600";
      case "warning":
        return "text-amber-500";
      case "error":
        return "text-red-500";
    }
  };

  const getComparisonBadgeClass = () => {
    switch (comparisonStatus) {
      case "improved":
        return "text-blue-600 bg-blue-50/50 border-blue-100";
      case "declined":
        return "text-red-600 bg-red-50/50 border-red-100";
      case "stable":
        return "text-slate-600 bg-slate-100/50 border-slate-200";
    }
  };

  return (
    <GlassCard className="p-5 rounded-[24px] border-slate-200/80 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-xl border flex items-center justify-center shadow-sm", bgClass, colorClass)}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <span className={cn("text-[10px] font-extrabold px-2.5 py-1 rounded-full border tracking-wide", getComparisonBadgeClass())}>
          {comparison}
        </span>
      </div>

      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
        {title}
      </h4>

      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
        <span className={cn("font-bold text-xs flex items-center mt-1", getStatusTextClass())}>
          {getStatusIcon()}
          {statusText}
        </span>
      </div>

      <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={cn("h-full rounded-full transition-all duration-500", progressBarColor)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </GlassCard>
  );
}
