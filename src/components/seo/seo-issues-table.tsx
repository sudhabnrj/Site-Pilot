"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { AlertCircle, AlertTriangle, Link, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SeoIssue {
  id: string;
  title: string;
  impact: "Critical" | "High" | "Medium" | "Low";
  description: string;
}

interface SeoIssuesTableProps {
  issues: SeoIssue[];
  resolvedCount?: number;
  onViewAll?: () => void;
  onFixIssue?: (id: string) => void;
}

export function SeoIssuesTable({
  issues: initialIssues,
  resolvedCount = 12,
  onViewAll,
  onFixIssue,
}: SeoIssuesTableProps) {
  const [issues, setIssues] = useState<SeoIssue[]>(initialIssues);
  const [fixingState, setFixingState] = useState<Record<string, "idle" | "fixing" | "fixed">>({});

  const handleFix = async (id: string) => {
    setFixingState((prev) => ({ ...prev, [id]: "fixing" }));
    onFixIssue?.(id);

    // Simulate fixing animation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFixingState((prev) => ({ ...prev, [id]: "fixed" }));
  };

  const getImpactBadgeClass = (impact: SeoIssue["impact"]) => {
    switch (impact) {
      case "Critical":
        return "bg-red-50 text-red-600 border-red-100";
      case "High":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Medium":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "Low":
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getIcon = (title: string, impact: SeoIssue["impact"]) => {
    if (impact === "Critical") {
      return <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />;
    }
    if (title.toLowerCase().includes("link")) {
      return <Link className="h-5 w-5 text-indigo-500 shrink-0" />;
    }
    return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
  };

  const activeCount = issues.filter((i) => fixingState[i.id] !== "fixed").length;
  const criticalCount = issues.filter(
    (i) => i.impact === "Critical" && fixingState[i.id] !== "fixed"
  ).length;

  return (
    <GlassCard className="rounded-[24px] overflow-hidden border-slate-200/80 shadow-sm flex flex-col bg-white/70">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          Identified SEO Issues
        </h3>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] font-extrabold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {criticalCount} Critical
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-extrabold uppercase tracking-wide">
            {resolvedCount + (issues.length - activeCount)} Resolved
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Issue Type
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Impact
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Description
              </th>
              <th className="px-6 py-4 border-b border-slate-100" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/20">
            {issues.map((issue) => {
              const state = fixingState[issue.id] ?? "idle";
              const isFixed = state === "fixed";
              const isFixing = state === "fixing";

              return (
                <tr
                  key={issue.id}
                  className={cn(
                    "hover:bg-slate-50/40 transition-all duration-300 group",
                    isFixed && "opacity-50 pointer-events-none bg-slate-50/20"
                  )}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {isFixed ? (
                        <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                      ) : (
                        getIcon(issue.title, issue.impact)
                      )}
                      <span
                        className={cn(
                          "text-sm font-bold text-slate-800",
                          isFixed && "line-through text-slate-400"
                        )}
                      >
                        {issue.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-md border text-[9px] font-extrabold uppercase tracking-wider",
                        getImpactBadgeClass(issue.impact)
                      )}
                    >
                      {issue.impact}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-xs font-semibold max-w-sm">
                    {issue.description}
                  </td>
                  <td className="px-6 py-5 text-right w-[140px]">
                    {isFixed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5 text-xs font-bold">
                        <Check className="h-3.5 w-3.5" />
                        Fixed
                      </span>
                    ) : isFixing ? (
                      <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5 text-xs font-bold">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Fixing
                      </span>
                    ) : (
                      <button
                        onClick={() => handleFix(issue.id)}
                        className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-sm hover:shadow"
                      >
                        Fix Issue
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
        <button
          onClick={onViewAll}
          className="text-blue-600 hover:text-blue-700 font-extrabold text-xs tracking-wider uppercase hover:underline"
        >
          View All {issues.length + 21} Issues
        </button>
      </div>
    </GlassCard>
  );
}
