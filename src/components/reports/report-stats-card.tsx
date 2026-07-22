"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { type LucideIcon } from "lucide-react";

interface ReportStatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  iconColorClass?: string;
  iconBgClass?: string;
}

export function ReportStatsCard({
  icon: Icon,
  title,
  value,
  iconColorClass = "text-blue-600",
  iconBgClass = "bg-blue-50/80 border-blue-100/50",
}: ReportStatsCardProps) {
  return (
    <GlassCard className="p-4 flex flex-col justify-between rounded-2xl border-slate-200">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border mb-3 shadow-sm ${iconBgClass} ${iconColorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <p className="text-xl font-bold text-slate-800 mt-1 tracking-tight">
          {value}
        </p>
      </div>
    </GlassCard>
  );
}
