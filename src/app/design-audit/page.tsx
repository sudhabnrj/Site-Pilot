"use client";

import { useEffect, useState } from "react";
import { Sparkles, Plus, Layers, Target, CheckCircle2, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchDesignAudits,
  runDesignAudit,
  deleteDesignAudit,
  resetProgress,
} from "@/store/slices/design-audit-slice";

import { AuditStatsCards } from "@/components/design-audit/audit-stats-cards";
import { AuditHistoryTable } from "@/components/design-audit/audit-history-table";
import { AuditInputModal } from "@/components/design-audit/audit-input-modal";
import { AuditProgressRunner } from "@/components/design-audit/audit-progress-runner";
import { toast } from "sonner";

export default function DesignAuditDashboardPage() {
  const dispatch = useAppDispatch();
  const {
    reports,
    isLoading,
    isExecutingAudit,
    auditProgressStep,
    auditProgressMessage,
    error,
  } = useAppSelector((state) => state.designAudit);

  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDesignAudits());
  }, [dispatch]);

  const handleStartAudit = async (data: {
    websiteUrl: string;
    figmaUrl?: string;
    uploadedScreenshot?: string;
  }) => {
    setIsInputModalOpen(false);

    try {
      const resultAction = await dispatch(runDesignAudit(data));
      if (runDesignAudit.fulfilled.match(resultAction)) {
        toast.success("AI Design Audit Completed!", {
          description: `Visual pixel match score: ${resultAction.payload.pixelSimilarity}%.`,
        });
      } else if (runDesignAudit.rejected.match(resultAction)) {
        toast.error("Audit Failed", {
          description: (resultAction.payload as string) || "Could not complete design audit.",
        });
      }
    } catch (err) {
      toast.error("Unexpected error during audit.");
    } finally {
      setTimeout(() => dispatch(resetProgress()), 2000);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const resultAction = await dispatch(deleteDesignAudit(reportId));
      if (deleteDesignAudit.fulfilled.match(resultAction)) {
        toast.success("Report Deleted", {
          description: "Design audit report has been removed.",
        });
      }
    } catch {
      toast.error("Failed to delete report.");
    }
  };

  // Compute aggregate stats from reports
  const totalAudits = reports.length;
  const avgPixelMatch =
    totalAudits > 0
      ? Math.round(reports.reduce((acc, r) => acc + (r.pixelSimilarity || 0), 0) / totalAudits)
      : 89;
  const tokenAccuracy =
    totalAudits > 0
      ? Math.round(reports.reduce((acc, r) => acc + (r.categoryScores?.typography || 85), 0) / totalAudits)
      : 92;
  const totalDefects = reports.reduce((acc, r) => acc + (r.issues?.length || 0), 0);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Real-time Progress Runner Modal */}
      {isExecutingAudit && (
        <AuditProgressRunner
          currentStep={auditProgressStep}
          message={auditProgressMessage}
        />
      )}

      {/* Input Modal */}
      <AuditInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSubmit={handleStartAudit}
        isSubmitting={isExecutingAudit}
      />

      {/* Page Title & Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              AI Design Audit
            </h2>
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
              <Sparkles className="h-3 w-3" /> Premium Engine
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare Figma designs and screenshots against live websites for pixel-perfect implementation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(fetchDesignAudits())}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            title="Refresh History"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsInputModalOpen(true)}
            className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Start Design Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <AuditStatsCards
        totalAudits={totalAudits}
        avgPixelMatch={avgPixelMatch}
        tokenAccuracy={tokenAccuracy}
        totalDefects={totalDefects}
      />

      {/* History Table */}
      <AuditHistoryTable
        reports={reports}
        onDeleteReport={handleDeleteReport}
        isLoading={isLoading}
      />
    </div>
  );
}
