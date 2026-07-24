"use client";

import { useState, useEffect } from "react";
import { PerformanceMetricCard } from "@/components/performance/performance-metric-card";
import { PerformanceBottlenecks, type BottleneckIssue } from "@/components/performance/performance-bottlenecks";
import { AiPerformanceInsights, type PerformanceInsightItem } from "@/components/performance/ai-performance-insights";
import { GlobalResponseHealth } from "@/components/performance/global-response-health";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { Timer, Layers, Zap, Server, Share2, Download, Play, Pause, Globe } from "lucide-react";
import type { PerformanceDataPoint, ChartConfig } from "@/types/charts";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUserAudits } from "@/store/slices/audit-slice";
import { toast } from "sonner";

import { PlanGate } from "@/components/auth/plan-gate";

const DEFAULT_METRICS = [
  {
    id: "lcp",
    icon: Timer,
    title: "LCP (Largest Contentful)",
    value: "1.2s",
    comparison: "+12% vs last scan",
    comparisonStatus: "improved" as const,
    statusText: "Good",
    statusType: "good" as const,
    progress: 85,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50 border-blue-100/50",
    progressBarColor: "bg-blue-600",
  },
  {
    id: "cls",
    icon: Layers,
    title: "CLS (Layout Shift)",
    value: "0.02",
    comparison: "Stable",
    comparisonStatus: "stable" as const,
    statusText: "Perfect",
    statusType: "good" as const,
    progress: 95,
    colorClass: "text-indigo-600",
    bgClass: "bg-indigo-50 border-indigo-100/50",
    progressBarColor: "bg-indigo-600",
  },
  {
    id: "fcp",
    icon: Zap,
    title: "FCP (First Paint)",
    value: "0.8s",
    comparison: "-5% vs last scan",
    comparisonStatus: "declined" as const,
    statusText: "Needs Work",
    statusType: "warning" as const,
    progress: 60,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50 border-amber-100/50",
    progressBarColor: "bg-amber-500",
  },
  {
    id: "ttfb",
    icon: Server,
    title: "TTFB (Server Response)",
    value: "240ms",
    comparison: "+4% vs last scan",
    comparisonStatus: "improved" as const,
    statusText: "Excellent",
    statusType: "good" as const,
    progress: 90,
    colorClass: "text-slate-700",
    bgClass: "bg-slate-100 border-slate-200/60",
    progressBarColor: "bg-slate-800",
  },
];

const DEFAULT_BOTTLENECKS: BottleneckIssue[] = [
  {
    id: "bot-1",
    title: "Unused JavaScript",
    description: "jquery.min.js v3.5",
    resource: "scripts/vendor.js",
    impact: "-0.82s",
    severity: "critical",
    type: "js",
  },
  {
    id: "bot-2",
    title: "Large Image Payloads",
    description: "hero-bg-2x.png",
    resource: "assets/images/",
    impact: "-0.45s",
    severity: "warning",
    type: "image",
  },
];

const DEFAULT_INSIGHTS: PerformanceInsightItem[] = [
  {
    id: "ins-1",
    type: "Optimization Tip",
    text: "Main-thread blocking detected. Moving non-critical scripts to a",
    highlightText: "Web Worker will reduce TBT by 30%.",
  },
  {
    id: "ins-2",
    type: "Content Strategy",
    text: "Converting hero images to",
    highlightText: "AVIF/WebP format saves payload bytes.",
  },
];

const DEFAULT_CHART_DATA: PerformanceDataPoint[] = [
  { date: "Mon", lcp: 1.4, cls: 0.04, fcp: 0.9 },
  { date: "Tue", lcp: 1.3, cls: 0.03, fcp: 0.9 },
  { date: "Wed", lcp: 1.3, cls: 0.03, fcp: 0.8 },
  { date: "Thu", lcp: 1.2, cls: 0.02, fcp: 0.8 },
  { date: "Fri", lcp: 1.2, cls: 0.02, fcp: 0.8 },
];

const CHART_CONFIG: ChartConfig = {
  xAxisKey: "date",
  series: [
    { key: "lcp", color: "#2563eb", label: "LCP (s)" },
    { key: "fcp", color: "#f59e0b", label: "FCP (s)" },
  ],
};

export default function PerformancePage() {
  const dispatch = useAppDispatch();
  const currentReport = useAppSelector((state) => state.audit.currentReport);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    dispatch(fetchUserAudits());
  }, [dispatch]);

  // Map dynamic metrics from current report
  const metrics = currentReport
    ? [
        {
          id: "lcp",
          icon: Timer,
          title: "LCP (Largest Contentful)",
          value: `${currentReport.metrics.lcp}s`,
          comparison: "Live DB metric",
          comparisonStatus: "improved" as const,
          statusText: currentReport.metrics.lcp < 2.5 ? "Good" : "Needs Work",
          statusType: (currentReport.metrics.lcp < 2.5 ? "good" : "warning") as any,
          progress: Math.max(10, Math.min(100, Math.round(100 - currentReport.metrics.lcp * 15))),
          colorClass: "text-blue-600",
          bgClass: "bg-blue-50 border-blue-100/50",
          progressBarColor: "bg-blue-600",
        },
        {
          id: "cls",
          icon: Layers,
          title: "CLS (Layout Shift)",
          value: `${currentReport.metrics.cls}`,
          comparison: "Live DB metric",
          comparisonStatus: "stable" as const,
          statusText: currentReport.metrics.cls < 0.1 ? "Perfect" : "Needs Work",
          statusType: (currentReport.metrics.cls < 0.1 ? "good" : "warning") as any,
          progress: Math.max(10, Math.min(100, Math.round(100 - currentReport.metrics.cls * 200))),
          colorClass: "text-indigo-600",
          bgClass: "bg-indigo-50 border-indigo-100/50",
          progressBarColor: "bg-indigo-600",
        },
        {
          id: "fcp",
          icon: Zap,
          title: "FCP (First Paint)",
          value: `${currentReport.metrics.fcp}s`,
          comparison: "Live DB metric",
          comparisonStatus: "improved" as const,
          statusText: currentReport.metrics.fcp < 1.8 ? "Good" : "Needs Work",
          statusType: (currentReport.metrics.fcp < 1.8 ? "good" : "warning") as any,
          progress: Math.max(10, Math.min(100, Math.round(100 - currentReport.metrics.fcp * 20))),
          colorClass: "text-amber-600",
          bgClass: "bg-amber-50 border-amber-100/50",
          progressBarColor: "bg-amber-500",
        },
        {
          id: "ttfb",
          icon: Server,
          title: "TTFB (Server Response)",
          value: `${currentReport.metrics.ttfb}ms`,
          comparison: "Live DB metric",
          comparisonStatus: "improved" as const,
          statusText: currentReport.metrics.ttfb < 300 ? "Excellent" : "Needs Work",
          statusType: (currentReport.metrics.ttfb < 300 ? "good" : "warning") as any,
          progress: Math.max(10, Math.min(100, Math.round(100 - currentReport.metrics.ttfb / 10))),
          colorClass: "text-slate-700",
          bgClass: "bg-slate-100 border-slate-200/60",
          progressBarColor: "bg-slate-800",
        },
      ]
    : DEFAULT_METRICS;

  const chartData = currentReport?.chartData?.length
    ? currentReport.chartData
    : DEFAULT_CHART_DATA;

  const bottlenecks: BottleneckIssue[] = currentReport?.issues?.length
    ? currentReport.issues
        .filter((i) => i.category === "Performance" || i.category === "General")
        .map((iss, idx) => ({
          id: iss.id || `bot-${idx}`,
          title: iss.issue,
          description: iss.page || "/",
          resource: iss.category,
          impact: iss.impact,
          severity: iss.priority === "critical" || iss.priority === "high" ? "critical" : "warning",
          type: "js",
        }))
    : DEFAULT_BOTTLENECKS;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link Copied!", {
        description: "Performance metrics report link copied to clipboard.",
      });
    }
  };

  const handleExportReport = () => {
    if (!currentReport) return;
    const header = "Metric,Value,Status\n";
    const lcpRow = `Largest Contentful Paint (LCP),${currentReport.metrics.lcp}s,${currentReport.metrics.lcp < 2.5 ? "Good" : "Needs Work"}\n`;
    const clsRow = `Cumulative Layout Shift (CLS),${currentReport.metrics.cls},${currentReport.metrics.cls < 0.1 ? "Perfect" : "Needs Work"}\n`;
    const fcpRow = `First Contentful Paint (FCP),${currentReport.metrics.fcp}s,${currentReport.metrics.fcp < 1.8 ? "Good" : "Needs Work"}\n`;
    const ttfbRow = `Time to First Byte (TTFB),${currentReport.metrics.ttfb}ms,${currentReport.metrics.ttfb < 300 ? "Excellent" : "Needs Work"}\n`;
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(header + lcpRow + clsRow + fcpRow + ttfbRow);
    
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `performance_report_${currentReport.domain}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export Successful", {
      description: `Downloaded performance report for ${currentReport.domain}.`,
    });
  };

  return (
    <PlanGate requiredPlan="pro" featureName="Performance Metrics">
      <div className="flex flex-col gap-8 pb-16">
        {/* Top Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
              <Globe className="h-3.5 w-3.5" />
              <span>{currentReport?.domain || "Active Property"}</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Performance Metrics
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time Core Web Vitals and load performance analysis from MongoDB Atlas.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer",
                isMonitoring
                  ? "border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/80"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {isMonitoring ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Monitoring Active</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-slate-500" />
                  <span>Resume Monitoring</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Share Report</span>
            </button>

            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <PerformanceMetricCard key={m.id} {...m} />
          ))}
        </div>

        {/* Chart & Bottlenecks Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PerformanceChart data={chartData} config={CHART_CONFIG} />
          </div>
          <div>
            <PerformanceBottlenecks issues={bottlenecks} />
          </div>
        </div>

        {/* Insights & Health Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AiPerformanceInsights insights={DEFAULT_INSIGHTS} />
          </div>
          <div>
            <GlobalResponseHealth
              score={`${currentReport?.overallScore || 98}%`}
              label="Reliability Score"
            />
          </div>
        </div>
      </div>
    </PlanGate>
  );
}
