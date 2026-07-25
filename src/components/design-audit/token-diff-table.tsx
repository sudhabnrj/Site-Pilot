"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Sliders,
  Type,
  Palette,
  Move,
  Box,
  MapPin,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";
import { DesignAuditReportItem } from "@/types/design-audit";
import { toast } from "sonner";

interface TokenDiffTableProps {
  report: DesignAuditReportItem;
}

export function TokenDiffTable({ report }: TokenDiffTableProps) {
  const issues = report.issues || [];
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Tokens", icon: Sliders },
    { id: "typography", label: "Typography", icon: Type },
    { id: "spacing", label: "Spacing & Padding", icon: Move },
    { id: "color", label: "Colors & Fills", icon: Palette },
    { id: "component", label: "Components & Radius", icon: Box },
  ];

  const filteredIssues = issues.filter((issue) => {
    if (selectedCategory === "all") return true;
    return issue.category === selectedCategory;
  });

  const handleCopyCss = (fixCss: string, id: string) => {
    if (!fixCss) return;
    navigator.clipboard.writeText(fixCss);
    setCopiedId(id);
    toast.success("CSS Snippet Copied!", {
      description: "Copied code fix snippet to clipboard.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm">
      {/* Header & Instructions */}
      <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="h-5 w-5 text-blue-600" />
              Design Token Comparison Matrix
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Side-by-side alignment of Figma design tokens vs computed live DOM CSS styles.
            </p>
          </div>
        </div>

        {/* Guidance Banner */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-blue-700 dark:text-blue-300 font-bold block mb-0.5">How to use this matrix:</strong>
            1. Select a token category filter below (Typography, Colors, Spacing).
            2. Check the <strong>Location &amp; Component</strong> column to find where the mismatch exists in your code.
            3. Compare <strong>Figma Expected Token</strong> vs <strong>Live Computed CSS</strong>.
            4. Click the <strong>Copy Fix Snippet</strong> action to copy the exact CSS code fix.
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            const count =
              cat.id === "all"
                ? issues.length
                : issues.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
                <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                  selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="py-3 px-4">Location &amp; Target Element</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Figma Expected Token</th>
              <th className="py-3 px-4">Live Computed CSS</th>
              <th className="py-3 px-4">Variance Delta</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-emerald-600 dark:text-emerald-400 font-medium">
                  🎉 No design token mismatches found in this category! Live website matches Figma tokens perfectly.
                </td>
              </tr>
            ) : (
              filteredIssues.map((issue) => {
                const isCritical = issue.severity === "critical";

                return (
                  <tr key={issue.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Location & Target Element */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-xs">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-0.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{issue.element || issue.title}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-normal truncate">{issue.title}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                      {issue.category}
                    </td>

                    {/* Expected */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {issue.expectedValue}
                    </td>

                    {/* Actual */}
                    <td className="py-3.5 px-4 font-mono font-bold text-red-500 dark:text-red-400">
                      {issue.actualValue}
                    </td>

                    {/* Variance */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {issue.difference}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300">
                          <XCircle className="h-3 w-3" /> Mismatch
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
                          <CheckCircle2 className="h-3 w-3" /> Variance
                        </span>
                      )}
                    </td>

                    {/* Quick Action */}
                    <td className="py-3.5 px-4 text-right">
                      {issue.suggestedCssFix ? (
                        <button
                          onClick={() => handleCopyCss(issue.suggestedCssFix, issue.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 text-blue-600 hover:text-white dark:text-blue-300 font-bold text-[11px] transition-all cursor-pointer border border-blue-200 dark:border-blue-900"
                        >
                          {copiedId === issue.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Fix Snippet</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px]">No Snippet</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
