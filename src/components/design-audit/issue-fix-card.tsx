"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  AlertOctagon,
  AlertTriangle,
  Info,
  Code2,
  Target,
  MapPin,
  FileCode,
} from "lucide-react";
import { DesignAuditIssue } from "@/types/design-audit";
import { toast } from "sonner";

interface IssueFixCardProps {
  issue: DesignAuditIssue;
}

export function IssueFixCard({ issue }: IssueFixCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCss = () => {
    if (!issue.suggestedCssFix) return;
    navigator.clipboard.writeText(issue.suggestedCssFix);
    setCopied(true);
    toast.success("CSS Fix Copied!", {
      description: `Copied CSS code snippet for ${issue.title} to clipboard.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = () => {
    if (issue.severity === "critical") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
          <AlertOctagon className="h-3.5 w-3.5" /> Critical
        </span>
      );
    }
    if (issue.severity === "warning") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
          <AlertTriangle className="h-3.5 w-3.5" /> Warning
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
        <Info className="h-3.5 w-3.5" /> Info
      </span>
    );
  };

  const rawElem = issue.element || "DOM Element";
  const cssSelector = rawElem;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm hover:shadow-md transition-all space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          {getSeverityBadge()}
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Category: <strong className="text-slate-900 dark:text-white">{issue.category}</strong>
          </span>
          {issue.confidenceScore && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
              <Target className="h-3 w-3" /> DOM Mapping: {issue.confidenceScore}%
            </span>
          )}
        </div>

        <code className="text-[11px] font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {rawElem}
        </code>
      </div>

      {/* Real Element Selector & Location Guidance */}
      <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Target HTML Element: <strong className="text-blue-700 dark:text-blue-300">{rawElem}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-mono text-[11px]">
            <FileCode className="h-3.5 w-3.5 text-blue-500" />
            <span>Target CSS Selector: <strong className="bg-blue-100 dark:bg-blue-900/80 px-2 py-0.5 rounded">{cssSelector}</strong></span>
          </div>
        </div>

        <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 font-medium">
          Instruction: Apply the CSS rule fix to selector <code className="font-mono font-bold">{cssSelector}</code> in your website&apos;s active stylesheet or CSS module to align with Figma.
        </p>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
          {issue.title}
        </h4>
        <p className="text-xs text-muted-foreground mt-1">
          Rule Evaluation Tolerance: <span className="font-bold text-slate-800 dark:text-slate-200">{issue.tolerance || "±2px"}</span>.
        </p>
      </div>

      {/* Values Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Figma Expected Value
          </span>
          <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {issue.expectedValue}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Live Computed Style
          </span>
          <span className="text-sm font-mono font-bold text-red-500 dark:text-red-400">
            {issue.actualValue}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Variance Difference
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {issue.difference}
          </span>
        </div>
      </div>

      {/* Suggested CSS Fix Code Block */}
      {issue.suggestedCssFix && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code2 className="h-4 w-4 text-blue-600" /> Actionable CSS Code Snippet
            </span>
            <button
              onClick={handleCopyCss}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy CSS Snippet</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto border border-slate-800">
            <code>{issue.suggestedCssFix}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
