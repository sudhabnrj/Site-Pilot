"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReportStatsCard } from "@/components/reports/report-stats-card";
import { ReportsFilters } from "@/components/reports/reports-filters";
import { ReportsTable, type ScanReport } from "@/components/reports/reports-table";
import { History, TrendingUp, Download, Plus, FileSpreadsheet } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUserAudits, setCurrentReport, deleteAuditReport, executeAudit } from "@/store/slices/audit-slice";
import { toast } from "sonner";

const INITIAL_REPORTS: ScanReport[] = [
  {
    id: "rep-1",
    website: "acme-digital.com",
    tag: "Production",
    version: "v2.4.0",
    date: "Oct 24, 2023",
    time: "14:20 PM",
    score: 94,
    performance: 92,
    seo: 98,
    accessibility: 88,
  },
];

export default function ReportsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { reportsHistory } = useAppSelector((state) => state.audit);

  const [selectedWebsite, setSelectedWebsite] = useState("All Websites");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    dispatch(fetchUserAudits());
  }, [dispatch]);

  const reports: ScanReport[] = useMemo(() => {
    if (reportsHistory.length === 0) return INITIAL_REPORTS;
    return reportsHistory.map((rep) => ({
      id: rep._id || rep.url,
      website: rep.domain || rep.url,
      tag: "Production",
      version: "v1.0",
      date: rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : "Today",
      time: rep.createdAt ? new Date(rep.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now",
      score: rep.overallScore,
      performance: rep.performanceScore,
      seo: rep.seoScore,
      accessibility: rep.accessibilityScore,
    }));
  }, [reportsHistory]);

  // Extract unique domains for filter dropdown
  const uniqueWebsites = useMemo(() => {
    const list = reports.map((r) => r.website);
    return Array.from(new Set(list));
  }, [reports]);

  // Filter Logic
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      return (
        selectedWebsite === "All Websites" || report.website === selectedWebsite
      );
    });
  }, [reports, selectedWebsite]);

  // Paginated subset
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, currentPage, pageSize]);

  const handleApplyFilters = (filters: { website: string; dateRange: string }) => {
    setSelectedWebsite(filters.website);
    setCurrentPage(1);
  };

  const handleOpenReport = (id: string) => {
    const found = reportsHistory.find((r) => r._id === id || r.url === id);
    if (found) {
      dispatch(setCurrentReport(found));
      router.push("/");
    }
  };

  const handleDownloadPdf = (id: string) => {
    const report = reports.find((r) => r.id === id);
    toast.info("Generating PDF Audit Report", {
      description: `Preparing executive PDF summary for ${report?.website || "website"}...`,
    });
    router.push("/pdf-reports");
  };

  const handleExportCsv = () => {
    if (!reports || reports.length === 0) {
      toast.error("No audit reports available to export.");
      return;
    }

    const headers = [
      "ID",
      "Website Domain",
      "Version",
      "Tag",
      "Date",
      "Time",
      "Overall Score",
      "Performance Score",
      "SEO Score",
      "Accessibility Score",
    ];

    const rows = reports.map((r) => [
      `"${r.id}"`,
      `"${r.website}"`,
      `"${r.version}"`,
      `"${r.tag}"`,
      `"${r.date}"`,
      `"${r.time}"`,
      r.score,
      r.performance,
      r.seo,
      r.accessibility,
    ]);

    const csvData = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `site_pilot_audit_reports_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    toast.success("CSV Export Completed!", {
      description: `Exported ${reports.length} report entries into CSV file.`,
    });
  };

  const handleNewReport = async () => {
    const targetUrl = prompt("Enter website URL to audit:", "https://example.com");
    if (!targetUrl || !targetUrl.trim()) return;

    try {
      toast.loading("Starting audit scan...", { id: "reports-audit" });
      await dispatch(executeAudit(targetUrl.trim())).unwrap();
      toast.dismiss("reports-audit");
      toast.success("Audit completed successfully!");
      router.push("/");
    } catch (err: any) {
      toast.dismiss("reports-audit");
      toast.error("Audit Failed", { description: typeof err === "string" ? err : "Failed to audit website." });
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Scan Reports History
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and manage your historical website audit data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 border border-slate-200 bg-white px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-slate-400" />
            Export CSV
          </button>
          <button
            onClick={handleNewReport}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            New Report
          </button>
        </div>
      </div>

      {/* Filters and Bento Mini Stats */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        {/* Filters Panel */}
        <div className="col-span-12 lg:col-span-8">
          <ReportsFilters
            websites={uniqueWebsites}
            onApplyFilters={handleApplyFilters}
          />
        </div>

        {/* Bento Stats */}
        <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
          <ReportStatsCard
            icon={History}
            title="Total Scans"
            value={`${reports.length} Runs`}
            iconColorClass="text-blue-600"
            iconBgClass="bg-blue-50/70 border-blue-100/50"
          />
          <ReportStatsCard
            icon={TrendingUp}
            title="Avg Score"
            value="88/100"
            iconColorClass="text-indigo-600"
            iconBgClass="bg-indigo-50/70 border-indigo-100/50"
          />
        </div>
      </div>

      {/* Reports Data Table */}
      <ReportsTable
        reports={paginatedReports}
        totalResults={filteredReports.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onDownloadPdf={handleDownloadPdf}
      />
    </div>
  );
}
