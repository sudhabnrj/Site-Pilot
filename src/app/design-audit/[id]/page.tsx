"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Share2,
  Sparkles,
  Layers,
  AlertTriangle,
  Sliders,
  FileText,
  UserCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDesignAudits, setCurrentReport } from "@/store/slices/design-audit-slice";
import { VisualDiffViewer } from "@/components/design-audit/visual-diff-viewer";
import { TokenDiffTable } from "@/components/design-audit/token-diff-table";
import { IssueFixCard } from "@/components/design-audit/issue-fix-card";
import { PdfDesignAuditPreview } from "@/components/design-audit/pdf-design-audit-preview";
import { FigmaIcon } from "@/components/ui/figma-icon";
import { toast } from "sonner";

export default function DesignAuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dispatch = useAppDispatch();
  const { reports, currentReport, isLoading } = useAppSelector((state) => state.designAudit);

  const [activeTab, setActiveTab] = useState<"visual" | "tokens" | "issues" | "pdf">("visual");

  useEffect(() => {
    if (reports.length === 0) {
      dispatch(fetchDesignAudits());
    } else {
      const found = reports.find(
        (r) => (r._id || r.id || "").toString() === resolvedParams.id
      );
      if (found) {
        dispatch(setCurrentReport(found));
      }
    }
  }, [dispatch, reports, resolvedParams.id]);

  const report =
    currentReport && (currentReport._id || currentReport.id || "").toString() === resolvedParams.id
      ? currentReport
      : reports.find((r) => (r._id || r.id || "").toString() === resolvedParams.id);

  if (isLoading && !report) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 text-muted-foreground">
        <Sparkles className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold">Loading design audit report details...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <h3 className="text-lg font-black">Design Audit Report Not Found</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          The requested report may have been deleted or does not exist.
        </p>
        <Link
          href="/design-audit"
          className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link Copied!", {
        description: "Design audit report link copied to clipboard.",
      });
    }
  };

  const figmaUserHandle = report.figmaUser?.handle || "Sudha Chandan Banerjee";
  const figmaUserEmail = report.figmaUser?.email || "sudha.banerjee@codeclouds.in";

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Top Header Navigation & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/design-audit"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-blue-600 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Design Audits</span>
          </Link>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <span>{report.websiteUrl}</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              Score: {report.overallScore}%
            </span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visual similarity: <strong className="text-slate-900 dark:text-white font-mono">{report.pixelSimilarity}%</strong> • Discovered Issues: <strong className="text-slate-900 dark:text-white">{report.issues?.length || 0}</strong>
          </p>

          {/* Figma User Account Badge */}
          <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold w-fit">
            <FigmaIcon className="h-3.5 w-3.5 shrink-0" />
            <UserCheck className="h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
            <span>Figma Account: <strong className="text-purple-900 dark:text-purple-100">{figmaUserHandle}</strong> ({figmaUserEmail})</span>
          </div>
        </div>

        <div className="flex items-center gap-3 select-none">
          <button
            onClick={handleShare}
            className="px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Share</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Detail Tabs Bar */}
      <div className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 border border-slate-200/60 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("visual")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "visual"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Visual Studio &amp; Diff</span>
        </button>

        <button
          onClick={() => setActiveTab("tokens")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "tokens"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Design Token Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab("issues")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "issues"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span>Discovered Fixes ({report.issues?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("pdf")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "pdf"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Executive PDF View</span>
        </button>
      </div>

      {/* Tab 1: Visual Comparison */}
      {activeTab === "visual" && <VisualDiffViewer report={report} />}

      {/* Tab 2: Token Matrix */}
      {activeTab === "tokens" && <TokenDiffTable report={report} />}

      {/* Tab 3: Issues & Fixes */}
      {activeTab === "issues" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Actionable CSS Code Fixes
            </h3>
            <span className="text-xs text-muted-foreground font-medium">
              Copy ready-to-use CSS snippets to achieve 100% pixel perfection.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {(report.issues || []).map((issue) => (
              <IssueFixCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Executive PDF View */}
      {activeTab === "pdf" && (
        <div className="flex justify-center p-4 overflow-x-auto">
          <PdfDesignAuditPreview report={report} />
        </div>
      )}
    </div>
  );
}
