"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScanReport {
  id: string;
  website: string;
  tag: string;
  version: string;
  date: string;
  time: string;
  score: number;
  performance: number;
  seo: number;
  accessibility: number;
}

interface ReportsTableProps {
  reports: ScanReport[];
  totalResults: number;
  currentPage: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
  onDownloadPdf?: (id: string) => void;
}

export function ReportsTable({
  reports,
  totalResults,
  currentPage,
  pageSize,
  onPageChange,
  onDownloadPdf,
}: ReportsTableProps) {
  const totalPages = Math.ceil(totalResults / pageSize);

  const getScoreInfo = (score: number) => {
    if (score >= 90) {
      return {
        badgeText: "Optimal",
        badgeClass: "bg-blue-50 text-blue-600 border-blue-100",
        ringClass: "border-blue-600 text-blue-600",
      };
    }
    if (score >= 75) {
      return {
        badgeText: "Good",
        badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
        ringClass: "border-emerald-600 text-emerald-600",
      };
    }
    return {
      badgeText: "Needs Work",
      badgeClass: "bg-amber-50 text-amber-600 border-amber-100",
      ringClass: "border-amber-500 text-amber-500",
    };
  };

  const getMetricBarColor = (val: number) => {
    if (val >= 90) return "bg-blue-600";
    if (val >= 75) return "bg-emerald-500";
    return "bg-amber-500";
  };

  const getAvatarInitials = (domain: string) => {
    const clean = domain.replace(/^(https?:\/\/)?(www\.)?/, "");
    return clean.slice(0, 2).toUpperCase();
  };

  return (
    <GlassCard className="overflow-hidden rounded-3xl border-slate-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Website URL
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                Overall Score
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                Performance
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                SEO
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                Accessibility
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report) => {
              const scoreInfo = getScoreInfo(report.score);
              return (
                <tr
                  key={report.id}
                  className="hover:bg-slate-50/40 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {getAvatarInitials(report.website)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {report.website}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                          {report.version} • {report.tag}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <p className="text-xs font-semibold text-slate-600">{report.date}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{report.time}</p>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full border-2 flex items-center justify-center bg-white shadow-sm shrink-0",
                          scoreInfo.ringClass
                        )}
                      >
                        <span className="text-xs font-black">{report.score}</span>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border tracking-wider",
                          scoreInfo.badgeClass
                        )}
                      >
                        {scoreInfo.badgeText}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-center">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[80px] mx-auto shadow-inner">
                      <div
                        className={cn("h-full rounded-full", getMetricBarColor(report.performance))}
                        style={{ width: `${report.performance}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1 inline-block">
                      {report.performance}%
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-center">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[80px] mx-auto shadow-inner">
                      <div
                        className={cn("h-full rounded-full", getMetricBarColor(report.seo))}
                        style={{ width: `${report.seo}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1 inline-block">
                      {report.seo}%
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-center">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[80px] mx-auto shadow-inner">
                      <div
                        className={cn("h-full rounded-full", getMetricBarColor(report.accessibility))}
                        style={{ width: `${report.accessibility}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1 inline-block">
                      {report.accessibility}%
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadPdf?.(report.id);
                      }}
                      className="text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 p-2 rounded-lg transition-all active:scale-95 inline-flex items-center gap-1.5 text-xs font-bold shadow-sm hover:shadow"
                      title="Download PDF Report"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden group-hover:inline transition-all duration-300">
                        PDF
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-400">
          Showing {Math.min(totalResults, (currentPage - 1) * pageSize + 1)} to{" "}
          {Math.min(totalResults, currentPage * pageSize)} of {totalResults} results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-400 disabled:opacity-50 disabled:hover:bg-white active:scale-95 transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange?.(pageNum)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs active:scale-95 transition-all",
                  currentPage === pageNum
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "hover:bg-slate-100 text-slate-600"
                )}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-400 disabled:opacity-50 disabled:hover:bg-white active:scale-95 transition-all"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
