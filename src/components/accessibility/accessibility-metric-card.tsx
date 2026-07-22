"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccessibilityMetricCardProps {
  icon: LucideIcon;
  title: string;
  passingPercent: number;
  statusText: "Low" | "Fair" | "Good";
  iconColorClass?: string;
  iconBgClass?: string;
}

export function AccessibilityMetricCard({
  icon: Icon,
  title,
  passingPercent,
  statusText,
  iconColorClass = "text-blue-600",
  iconBgClass = "bg-blue-50 border-blue-100",
}: AccessibilityMetricCardProps) {
  const getStatusColor = () => {
    switch (statusText) {
      case "Low":
        return "text-red-500 bg-red-50/50 border-red-100";
      case "Fair":
        return "text-amber-500 bg-amber-50/50 border-amber-100";
      case "Good":
        return "text-blue-600 bg-blue-50/50 border-blue-100";
    }
  };

  const getBarColor = () => {
    switch (statusText) {
      case "Low":
        return "bg-red-500";
      case "Fair":
        return "bg-amber-500";
      case "Good":
        return "bg-blue-600";
    }
  };

  return (
    <GlassCard className="p-5 rounded-[24px] border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-200 bg-white/70">
      <div className="flex justify-between items-center mb-4">
        <div className={cn("p-2 rounded-xl border flex items-center justify-center shadow-sm", iconBgClass, iconColorClass)}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <span className={cn("text-[10px] font-extrabold px-2.5 py-0.5 border rounded-full uppercase tracking-wide", getStatusColor())}>
          {statusText}
        </span>
      </div>

      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-base font-bold text-slate-800 mb-4 tracking-tight">
          {passingPercent}% Passing
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
          <div
            className={cn("h-full rounded-full transition-all duration-500", getBarColor())}
            style={{ width: `${passingPercent}%` }}
          />
        </div>
      </div>
    </GlassCard>
  );
}
