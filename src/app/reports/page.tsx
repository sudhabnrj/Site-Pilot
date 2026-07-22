"use client";

import { useState, useMemo } from "react";
import { ReportStatsCard } from "@/components/reports/report-stats-card";
import { ReportsFilters } from "@/components/reports/reports-filters";
import { ReportsTable, type ScanReport } from "@/components/reports/reports-table";
import { History, TrendingUp, Download, Plus, FileSpreadsheet } from "lucide-react";

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
  {
    id: "rep-2",
    website: "fintech-pro.io",
    tag: "Staging",
    version: "v1.1.2",
    date: "Oct 22, 2023",
    time: "09:15 AM",
    score: 72,
    performance: 65,
    seo: 81,
    accessibility: 54,
  },
  {
    id: "rep-3",
    website: "ecom-nexus.net",
    tag: "Beta",
    version: "v0.9.8",
    date: "Oct 19, 2023",
    time: "22:05 PM",
    score: 89,
    performance: 85,
    seo: 95,
    accessibility: 90,
  },
  {
    id: "rep-4",
    website: "acme-digital.com",
    tag: "Staging",
    version: "v2.3.9",
    date: "Oct 15, 2023",
    time: "11:00 AM",
    score: 91,
    performance: 89,
    seo: 96,
    accessibility: 88,
  },
  {
    id: "rep-5",
    website: "ecom-nexus.net",
    tag: "Production",
    version: "v0.9.7",
    date: "Oct 12, 2023",
    time: "16:45 PM",
    score: 88,
    performance: 84,
    seo: 94,
    accessibility: 89,
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<ScanReport[]>(INITIAL_REPORTS);
  const [selectedWebsite, setSelectedWebsite] = useState("All Websites");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

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

  const handleDownloadPdf = (id: string) => {
    const report = reports.find((r) => r.id === id);
    alert(`Downloading PDF audit report for ${report?.website} (${report?.version})...`);
  };

  const handleExportCsv = () => {
    alert("Exporting reports log as CSV document...");
  };

  const handleNewReport = () => {
    const newRep: ScanReport = {
      id: `rep-${Date.now()}`,
      website: "stellarapp.com",
      tag: "Production",
      version: "v1.0.0",
      date: "Today",
      time: "Just now",
      score: 96,
      performance: 95,
      seo: 98,
      accessibility: 94,
    };
    setReports((prev) => [newRep, ...prev]);
    setCurrentPage(1);
    alert("New report triggered and added successfully!");
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
