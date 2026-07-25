"use client";

import { Layers, Target, CheckCircle2, AlertTriangle } from "lucide-react";

interface AuditStatsCardsProps {
  totalAudits: number;
  avgPixelMatch: number;
  tokenAccuracy: number;
  totalDefects: number;
}

export function AuditStatsCards({
  totalAudits,
  avgPixelMatch,
  tokenAccuracy,
  totalDefects,
}: AuditStatsCardsProps) {
  const stats = [
    {
      id: "total-audits",
      label: "Total Design Audits",
      value: totalAudits,
      sub: "Scanned reports",
      icon: Layers,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgLight: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      id: "pixel-match",
      label: "Visual Pixel Match",
      value: `${avgPixelMatch}%`,
      sub: "Overall similarity",
      icon: Target,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      id: "token-accuracy",
      label: "Design Token Accuracy",
      value: `${tokenAccuracy}%`,
      sub: "Typography & Color match",
      icon: CheckCircle2,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-600 dark:text-purple-400",
      bgLight: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      id: "active-defects",
      label: "Discovered Defects",
      value: totalDefects,
      sub: "Layout & style shifts",
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600 dark:text-amber-400",
      bgLight: "bg-amber-50 dark:bg-amber-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.id}
            className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${stat.bgLight} ${stat.textColor} shadow-xs group-hover:scale-110 transition-transform`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground font-medium">
              {stat.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
