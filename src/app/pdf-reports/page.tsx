"use client";

import { useEffect } from "react";
import { PdfReportPreviewPaper } from "@/components/pdf-reports/pdf-report-preview-paper";
import { Download, Share2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUserAudits } from "@/store/slices/audit-slice";
import { toast } from "sonner";

import { PlanGate } from "@/components/auth/plan-gate";

export default function PdfReportsPage() {
  const dispatch = useAppDispatch();
  const currentReport = useAppSelector((state) => state.audit.currentReport);

  useEffect(() => {
    dispatch(fetchUserAudits());
  }, [dispatch]);

  const domain = currentReport?.domain || "example.com";
  const score = currentReport?.overallScore || 85;
  const dateStr = currentReport?.createdAt
    ? new Date(currentReport.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }).toUpperCase()
    : "TODAY";
  const reportId = currentReport?._id ? `REP-${String(currentReport._id).slice(-8).toUpperCase()}` : "AA-29402-92X";

  const handleDownload = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link Copied!", {
        description: `Copied PDF report URL for ${domain} to clipboard.`,
      });
    }
  };

  return (
    <PlanGate requiredPlan="pro" featureName="Executive PDF Reports">
      <div className="flex flex-col gap-8 pb-16">
        {/* Contextual Print Actions */}
        <div className="flex justify-center gap-4 sticky top-20 z-30 select-none">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all font-bold text-xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-full shadow-lg active:scale-95 transition-all font-bold text-xs cursor-pointer"
          >
            <Share2 className="h-4 w-4 text-slate-400" />
            Share Report
          </button>
        </div>

        {/* PDF Document Paper Sheet Preview */}
        <div className="w-full overflow-x-auto p-4 flex justify-center">
          <PdfReportPreviewPaper
            report={currentReport}
            domain={domain}
            overallScore={score}
            date={dateStr}
            reportId={reportId}
          />
        </div>
      </div>
    </PlanGate>
  );
}
