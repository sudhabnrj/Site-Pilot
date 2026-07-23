"use client";

import { useEffect } from "react";
import { KpiCard } from "@/components/ui/kpi-card";
import { WebsiteHealthCard } from "@/components/dashboard/website-health-card";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { WebsitePreview } from "@/components/dashboard/website-preview";
import { AiRecommendations } from "@/components/dashboard/ai-recommendations";
import { IssuesTable } from "@/components/dashboard/issues-table";
import { AiChatPanel } from "@/components/dashboard/ai-chat-panel";
import { AuditProgressBar } from "@/components/dashboard/audit-progress-bar";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUserAudits } from "@/store/slices/audit-slice";

import {
  KPI_CARDS,
  WEBSITE_HEALTH,
  MOCK_ISSUES,
  MOCK_RECOMMENDATIONS,
  MOCK_CHAT_MESSAGES,
  MOCK_PERFORMANCE_DATA,
  PERFORMANCE_CHART_CONFIG,
} from "@/constants/dashboard";
import type { KpiMetric, WebsiteHealthData } from "@/types/dashboard";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const currentReport = useAppSelector((state) => state.audit.currentReport);

  useEffect(() => {
    dispatch(fetchUserAudits());
  }, [dispatch]);

  // Map dynamic KPI metrics from current report
  const kpiCards: KpiMetric[] = currentReport
    ? [
        {
          id: "overall-score",
          label: "Overall Score",
          value: currentReport.overallScore,
          maxValue: 100,
          trend: { direction: "up", percentage: 2.4, label: "from last scan" },
          icon: "BarChart3",
          colorVariant: "primary",
        },
        {
          id: "performance",
          label: "Performance",
          value: currentReport.performanceScore,
          trend: { direction: "up", percentage: 1.5, label: "from last scan" },
          icon: "Gauge",
          colorVariant: "secondary",
        },
        {
          id: "seo",
          label: "SEO",
          value: currentReport.seoScore,
          trend: { direction: "neutral", percentage: 0, label: "from last scan" },
          icon: "Search",
          colorVariant: "tertiary",
        },
        {
          id: "accessibility",
          label: "Accessibility",
          value: currentReport.accessibilityScore,
          trend: { direction: "up", percentage: 3.1, label: "from last scan" },
          icon: "Accessibility",
          colorVariant: "neutral",
        },
      ]
    : KPI_CARDS;

  // Map dynamic health card
  const websiteHealth: WebsiteHealthData = currentReport
    ? {
        score: currentReport.overallScore,
        maxScore: 100,
        status: currentReport.status,
        statusColor:
          currentReport.overallScore >= 90
            ? "text-green-600"
            : currentReport.overallScore >= 75
            ? "text-blue-600"
            : currentReport.overallScore >= 60
            ? "text-amber-500"
            : "text-red-500",
        scanDuration: currentReport.scanDuration,
      }
    : WEBSITE_HEALTH;

  const chartData = currentReport?.chartData?.length
    ? currentReport.chartData
    : MOCK_PERFORMANCE_DATA;

  const issuesList = currentReport?.issues?.length
    ? currentReport.issues
    : MOCK_ISSUES;

  const recommendationsList = currentReport?.recommendations?.length
    ? currentReport.recommendations
    : MOCK_RECOMMENDATIONS;

  const previewUrl = currentReport?.domain || "example.com";
  const lastScanTime = currentReport?.createdAt
    ? new Date(currentReport.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Just now";

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Real-time Audit Progress Banner */}
      <AuditProgressBar />

      {/* Title & Description Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentReport
              ? `Real audit metrics and automated insights for ${currentReport.domain}.`
              : "Monitor and audit your website's performance, SEO, accessibility, and security."}
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.id} metric={card} />
        ))}
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Side: Chart and Issues Table */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          <PerformanceChart
            data={chartData}
            config={PERFORMANCE_CHART_CONFIG}
          />
          <IssuesTable issues={issuesList} />
        </div>

        {/* Right Side: Overall Health & Preview */}
        <div className="flex flex-col gap-8">
          <WebsiteHealthCard data={websiteHealth} />
          <WebsitePreview url={previewUrl} lastScan={lastScanTime} />
        </div>
      </div>

      {/* Full Width AI Insights & Fixes Panel */}
      <div className="w-full">
        <AiRecommendations recommendations={recommendationsList} />
      </div>

      {/* Floating AI Chat Assistant */}
      <AiChatPanel messages={MOCK_CHAT_MESSAGES} />
    </div>
  );
}
