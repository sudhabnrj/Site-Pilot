"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ExternalLink,
  Trash2,
  Globe,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { FigmaIcon as Figma } from "@/components/ui/figma-icon";
import { DesignAuditReportItem } from "@/types/design-audit";

interface AuditHistoryTableProps {
  reports: DesignAuditReportItem[];
  onDeleteReport: (id: string) => void;
  isLoading?: boolean;
}

export function AuditHistoryTable({
  reports,
  onDeleteReport,
  isLoading = false,
}: AuditHistoryTableProps) {
  const [search, setSearch] = useState("");
  const [filterScore, setFilterScore] = useState<"all" | "high" | "medium" | "low">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.websiteUrl.toLowerCase().includes(search.toLowerCase()) ||
      (report.figmaUrl || "").toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterScore === "high") return report.overallScore >= 80;
    if (filterScore === "medium") return report.overallScore >= 65 && report.overallScore < 80;
    if (filterScore === "low") return report.overallScore < 65;

    return true;
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-all">
      {/* Table Toolbar */}
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Recent Design Audit Reports
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            History of pixel comparison scans and token alignment reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search domain or Figma link..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value as any)}
              className="appearance-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-2 pl-9 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
            >
              <option value="all">All Scores</option>
              <option value="high">High Match (80%+)</option>
              <option value="medium">Medium Match (65-79%)</option>
              <option value="low">Needs Work (&lt;65%)</option>
            </select>
            <Filter className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="py-4 px-6">Target Website</th>
              <th className="py-4 px-6">Design Source</th>
              <th className="py-4 px-6 text-center">Pixel Match %</th>
              <th className="py-4 px-6 text-center">Overall Score</th>
              <th className="py-4 px-6 text-center">Issues</th>
              <th className="py-4 px-6">Created Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  Loading design audit history...
                </td>
              </tr>
            ) : filteredReports.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No design audit reports found. Click &quot;Start Audit&quot; to execute your first visual comparison.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => {
                const reportId = (report._id || report.id || "").toString();
                const scoreColor =
                  report.overallScore >= 80
                    ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                    : report.overallScore >= 65
                    ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900"
                    : "bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900";

                const createdDateStr = new Date(report.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <tr
                    key={reportId}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Website URL */}
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="truncate">{report.websiteUrl}</span>
                      </div>
                    </td>

                    {/* Design Source */}
                    <td className="py-4 px-6 text-muted-foreground max-w-xs truncate">
                      {report.figmaUrl ? (
                        <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-medium">
                          <Figma className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{report.figmaUrl.replace("https://www.figma.com/", "")}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-medium">Uploaded Screenshot</span>
                      )}
                    </td>

                    {/* Pixel Match % */}
                    <td className="py-4 px-6 text-center font-bold text-slate-900 dark:text-white font-mono">
                      {report.pixelSimilarity}%
                    </td>

                    {/* Overall Score Badge */}
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border ${scoreColor}`}>
                        {report.overallScore} / 100
                      </span>
                    </td>

                    {/* Issues Count */}
                    <td className="py-4 px-6 text-center font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center justify-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        <span>{report.issues?.length || 0}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-muted-foreground">
                      {createdDateStr}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/design-audit/${reportId}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                        >
                          <span>View Report</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>

                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this design audit report?")) {
                              onDeleteReport(reportId);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
