"use client";

import { KpiCard } from "@/components/ui/kpi-card";
import { WebsiteHealthCard } from "@/components/dashboard/website-health-card";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { WebsitePreview } from "@/components/dashboard/website-preview";
import { AiRecommendations } from "@/components/dashboard/ai-recommendations";
import { IssuesTable } from "@/components/dashboard/issues-table";
import { AiChatPanel } from "@/components/dashboard/ai-chat-panel";

import {
  KPI_CARDS,
  WEBSITE_HEALTH,
  MOCK_ISSUES,
  MOCK_RECOMMENDATIONS,
  MOCK_CHAT_MESSAGES,
  MOCK_PERFORMANCE_DATA,
  PERFORMANCE_CHART_CONFIG,
} from "@/constants/dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and audit your website's performance, SEO, accessibility, and security.
          </p>
        </div>
        <button className="inline-flex shrink-0 items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all">
          Scan Now
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <KpiCard key={card.id} metric={card} />
        ))}
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Side: Chart and Issues Table */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          <PerformanceChart
            data={MOCK_PERFORMANCE_DATA}
            config={PERFORMANCE_CHART_CONFIG}
          />
          <IssuesTable issues={MOCK_ISSUES} />
        </div>

        {/* Right Side: Overall Health, Preview and Recommendations */}
        <div className="flex flex-col gap-8">
          <WebsiteHealthCard data={WEBSITE_HEALTH} />
          <WebsitePreview url="example.com" lastScan="2 minutes ago" />
          <AiRecommendations recommendations={MOCK_RECOMMENDATIONS} />
        </div>
      </div>

      {/* Floating AI Chat Assistant */}
      <AiChatPanel messages={MOCK_CHAT_MESSAGES} />
    </div>
  );
}
