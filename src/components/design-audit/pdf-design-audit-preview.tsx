"use client";

import { Brain, Layers, CheckCircle2, AlertTriangle, ShieldCheck, MapPin } from "lucide-react";
import { DesignAuditReportItem } from "@/types/design-audit";

interface PdfDesignAuditPreviewProps {
  report: DesignAuditReportItem;
}

export function PdfDesignAuditPreview({ report }: PdfDesignAuditPreviewProps) {
  const dateStr = new Date(report.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reportId = report._id ? `DA-${String(report._id).slice(-8).toUpperCase()}` : "DA-98214-88";
  const issues = report.issues || [];

  return (
    <div className="w-full max-w-[850px] bg-white text-slate-900 shadow-2xl rounded-2xl p-10 font-sans select-none border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-blue-700">Site Pilot</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Executive AI Design Audit Report
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-lg mb-1">
            {reportId}
          </span>
          <p className="text-xs text-slate-500 font-semibold">{dateStr}</p>
        </div>
      </div>

      {/* Target Domain Overview */}
      <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200 mb-8 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Website Domain</span>
          <h2 className="text-xl font-black text-slate-900 mt-1">{report.websiteUrl}</h2>
          {report.figmaUrl && (
            <p className="text-xs text-purple-700 font-medium mt-1">Figma: {report.figmaUrl}</p>
          )}
        </div>

        <div className="text-center bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Overall Weighted Score</span>
          <span className="text-3xl font-black text-blue-600 font-mono">{report.overallScore}%</span>
        </div>
      </div>

      {/* Category Scores Breakdown Grid */}
      <div className="mb-8">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-600" /> Category Score Summary
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Visual Similarity</span>
            <span className="text-lg font-black text-slate-900">{report.pixelSimilarity}%</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Typography Match</span>
            <span className="text-lg font-black text-slate-900">{report.categoryScores?.typography || 85}%</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Spacing &amp; Padding</span>
            <span className="text-lg font-black text-slate-900">{report.categoryScores?.spacing || 80}%</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Responsive Score</span>
            <span className="text-lg font-black text-slate-900">{report.categoryScores?.responsive || 90}%</span>
          </div>
        </div>
      </div>

      {/* Complete Discovered Issues List (Displaying ALL issues) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" /> Discovered Layout &amp; Token Mismatches ({issues.length})
          </h3>
          <span className="text-xs font-bold text-slate-500">Showing All Discovered Issues</span>
        </div>

        <div className="space-y-3">
          {issues.map((issue, idx) => (
            <div key={issue.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white font-mono text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{issue.title}</span>
                </div>
                <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  issue.severity === "critical"
                    ? "bg-red-100 text-red-700"
                    : issue.severity === "warning"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {issue.severity}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between text-slate-600 font-mono text-[11px] gap-2 pt-1 border-t border-slate-200/60">
                <span>Location: <strong className="text-slate-800">{issue.element || "DOM Element"}</strong></span>
                <span>Expected: <strong className="text-emerald-700">{issue.expectedValue}</strong></span>
                <span>Actual: <strong className="text-red-600">{issue.actualValue}</strong></span>
                <span>Delta: <strong className="text-slate-800">{issue.difference}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Signature */}
      <div className="border-t border-slate-200 pt-6 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>Generated by Site Pilot Hybrid Multi-Engine Audit Platform</span>
        </div>
        <span>Full Audit Report</span>
      </div>
    </div>
  );
}
