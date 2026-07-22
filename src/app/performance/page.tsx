"use client";

import { useState } from "react";
import { PerformanceMetricCard } from "@/components/performance/performance-metric-card";
import { PerformanceBottlenecks, type BottleneckIssue } from "@/components/performance/performance-bottlenecks";
import { AiPerformanceInsights, type PerformanceInsightItem } from "@/components/performance/ai-performance-insights";
import { GlobalResponseHealth } from "@/components/performance/global-response-health";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { Timer, Layers, Zap, Server, Share2, Download, Play, Pause } from "lucide-react";
import type { PerformanceDataPoint, ChartConfig } from "@/types/charts";
import { cn } from "@/lib/utils";

const MOCK_METRICS = [
  {
    id: "lcp",
    icon: Timer,
    title: "LCP (Largest Contentful)",
    value: "1.2s",
    comparison: "+12% vs last week",
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
    comparison: "-5% vs last week",
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
    comparison: "+4% vs last week",
    comparisonStatus: "improved" as const,
    statusText: "Excellent",
    statusType: "good" as const,
    progress: 90,
    colorClass: "text-slate-700",
    bgClass: "bg-slate-100 border-slate-200/60",
    progressBarColor: "bg-slate-800",
  },
];

const MOCK_BOTTLENECKS: BottleneckIssue[] = [
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
  {
    id: "bot-3",
    title: "Excessive DOM Size",
    description: "4,200 elements detected",
    resource: "index.html",
    impact: "-0.3s",
    severity: "critical",
    type: "dom",
  },
];

const MOCK_INSIGHTS: PerformanceInsightItem[] = [
  {
    id: "ins-1",
    type: "Optimization Tip",
    text: "We noticed your main-thread is blocked for 450ms. Moving your Analytics scripts to a",
    highlightText: "Web Worker could improve TBT by 30%.",
  },
  {
    id: "ins-2",
    type: "Content Strategy",
    text: "Converting your hero imagery from PNG to",
    highlightText: "WebP will save approximately 2.4MB per session.",
  },
];

const CHART_DATA: PerformanceDataPoint[] = [
  { date: "Aug 01", lcp: 1.4, cls: 0.04, fcp: 0.9 },
  { date: "Aug 04", lcp: 1.3, cls: 0.03, fcp: 0.9 },
  { date: "Aug 07", lcp: 1.3, cls: 0.03, fcp: 0.8 },
  { date: "Aug 10", lcp: 1.2, cls: 0.02, fcp: 0.8 },
  { date: "Aug 13", lcp: 1.2, cls: 0.02, fcp: 0.8 },
  { date: "Aug 16", lcp: 1.2, cls: 0.02, fcp: 0.8 },
  { date: "Aug 19", lcp: 1.3, cls: 0.03, fcp: 0.8 },
  { date: "Aug 22", lcp: 1.2, cls: 0.02, fcp: 0.8 },
];

const CHART_CONFIG: ChartConfig = {
  xAxisKey: "date",
  series: [
    { key: "lcp", color: "#2563eb", label: "LCP (s)" },
    { key: "fcp", color: "#f59e0b", label: "FCP (s)" },
  ],
};

export default function PerformancePage() {
  const [isMonitoring, setIsMonitoring] = useState(true);

  const handleShare = () => {
    alert("Copied performance audit dashboard share link to clipboard!");
  };

  const handleDownload = () => {
    alert("Generating and downloading full Core Web Vitals audit reports PDF...");
  };

  const handleSelectIssue = (id: string) => {
    const issue = MOCK_BOTTLENECKS.find((i) => i.id === id);
    alert(`Showing diagnostic details for performance bottleneck: ${issue?.title}`);
  };

  const handleGenerateCode = () => {
    alert("AI engine is generating optimization patches and Service Worker config code...");
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Performance Audit
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Detailed analysis for <span className="text-blue-600 font-bold">https://app.example-saas.io</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 shadow-sm"
          >
            <span className={cn("w-2 h-2 rounded-full", isMonitoring ? "bg-blue-600 animate-pulse" : "bg-slate-400")} />
            {isMonitoring ? "Monitoring Live" : "Monitoring Paused"}
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 border border-slate-200 bg-white rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all active:scale-95 shadow-sm"
            aria-label="Share reports"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2.5 border border-slate-200 bg-white rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all active:scale-95 shadow-sm"
            aria-label="Download PDF report"
          >
            <Download className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_METRICS.map((metric) => (
          <PerformanceMetricCard key={metric.id} {...metric} />
        ))}
      </div>

      {/* Trends Chart */}
      <PerformanceChart
        data={CHART_DATA}
        config={CHART_CONFIG}
        className="border-slate-200/80 shadow-sm rounded-3xl"
      />

      {/* Bottlenecks and AI Right Panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <PerformanceBottlenecks
            issues={MOCK_BOTTLENECKS}
            onSelectIssue={handleSelectIssue}
            onViewAll={() => alert("Redirecting to expanded checklist metrics...")}
          />
        </div>
        <div className="flex flex-col gap-6">
          <AiPerformanceInsights
            insights={MOCK_INSIGHTS}
            onGenerateCode={handleGenerateCode}
          />
          <GlobalResponseHealth />
        </div>
      </div>
    </div>
  );
}
