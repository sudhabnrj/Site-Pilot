"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { AlertTriangle, Image, Layout, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottleneckIssue {
  id: string;
  title: string;
  description: string;
  resource: string;
  impact: string;
  severity: "critical" | "warning";
  type: "js" | "image" | "dom";
}

interface PerformanceBottlenecksProps {
  issues: BottleneckIssue[];
  onViewAll?: () => void;
  onSelectIssue?: (id: string) => void;
}

export function PerformanceBottlenecks({
  issues,
  onViewAll,
  onSelectIssue,
}: PerformanceBottlenecksProps) {
  const getIcon = (type: "js" | "image" | "dom", severity: "critical" | "warning") => {
    const color = severity === "critical" ? "text-red-500" : "text-amber-500";
    switch (type) {
      case "js":
        return <AlertTriangle className={cn("h-5 w-5", color)} />;
      case "image":
        return <Image className={cn("h-5 w-5", color)} />;
      case "dom":
        return <Layout className={cn("h-5 w-5", color)} />;
    }
  };

  const criticalCount = issues.filter((i) => i.severity === "critical").length;

  return (
    <GlassCard className="rounded-[24px] overflow-hidden border-slate-200/80 shadow-sm flex flex-col h-full bg-white/70">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          Performance Bottlenecks
        </h3>
        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full uppercase tracking-wider">
          {criticalCount} Critical Issues
        </span>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="py-3 px-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Issue
              </th>
              <th className="py-3 px-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Resource
              </th>
              <th className="py-3 px-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                Impact
              </th>
              <th className="py-3 px-5 border-b border-slate-100" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/20">
            {issues.map((issue) => (
              <tr
                key={issue.id}
                onClick={() => onSelectIssue?.(issue.id)}
                className="hover:bg-slate-50/40 transition-colors cursor-pointer group"
              >
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    {getIcon(issue.type, issue.severity)}
                    <div>
                      <p className="text-sm font-bold text-slate-800">{issue.title}</p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span className="text-xs font-mono font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                    {issue.resource}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      issue.severity === "critical" ? "text-red-500" : "text-amber-500"
                    )}
                  >
                    {issue.impact}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
        <button
          onClick={onViewAll}
          className="text-blue-600 hover:text-blue-700 font-extrabold text-xs tracking-wider uppercase hover:underline"
        >
          View all findings
        </button>
      </div>
    </GlassCard>
  );
}
