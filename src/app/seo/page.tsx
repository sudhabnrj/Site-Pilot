"use client";

import { useState } from "react";
import { SeoGaugeCard } from "@/components/seo/seo-gauge-card";
import { SeoBreakdownCard } from "@/components/seo/seo-breakdown-card";
import { SeoFeaturedInsight } from "@/components/seo/seo-featured-insight";
import { SeoIssuesTable, type SeoIssue } from "@/components/seo/seo-issues-table";
import { SeoVisualCard } from "@/components/seo/seo-visual-card";
import { FileSpreadsheet, History, FileText, Settings, Link as LinkIcon, Download } from "lucide-react";

const BREAKDOWNS = [
  {
    id: "on-page",
    icon: FileText,
    title: "On-Page SEO",
    description: "Content structure and keyword optimization.",
    score: 92,
    iconBgClass: "bg-indigo-50 border-indigo-100/50",
    iconColorClass: "text-indigo-600",
    progressBarColor: "bg-indigo-600",
  },
  {
    id: "tech-seo",
    icon: Settings,
    title: "Technical SEO",
    description: "Indexing, crawlability, and schema markup.",
    score: 78,
    iconBgClass: "bg-amber-50 border-amber-100/50",
    iconColorClass: "text-amber-600",
    progressBarColor: "bg-amber-500",
  },
  {
    id: "backlinks",
    icon: LinkIcon,
    title: "Backlinks",
    description: "Domain authority and link profile quality.",
    score: 65,
    iconBgClass: "bg-blue-50 border-blue-100/50",
    iconColorClass: "text-blue-600",
    progressBarColor: "bg-blue-600",
  },
];

const MOCK_ISSUES: SeoIssue[] = [
  {
    id: "iss-1",
    title: "Missing Meta Description",
    impact: "Critical",
    description: "14 pages are missing meta descriptions, affecting CTR in search results.",
  },
  {
    id: "iss-2",
    title: "H1 Tag Missing",
    impact: "High",
    description: "The homepage and 3 landing pages are missing primary H1 tags.",
  },
  {
    id: "iss-3",
    title: "Broken Internal Links",
    impact: "Medium",
    description: "8 internal links lead to 404 error pages, reducing crawl efficiency.",
  },
];

export default function SeoPage() {
  const handleExport = () => {
    alert("Exporting full SEO audit diagnostics reports log...");
  };

  const handleHistory = () => {
    alert("Redirecting to chronological SEO score timeline history...");
  };

  const handleApplyInsight = () => {
    alert("Successfully applied LSI Keywords header optimization patch!");
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            SEO Health Audit
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Detailed analysis for <span className="text-blue-600 font-bold">acme-digital.io</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 border border-slate-200 bg-white px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-400" />
            Export Report
          </button>
          <button
            onClick={handleHistory}
            className="flex items-center gap-1.5 border border-slate-200 bg-slate-100 px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 shadow-sm"
          >
            <History className="h-4 w-4 text-slate-400" />
            History
          </button>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        <div className="col-span-12 lg:col-span-4">
          <SeoGaugeCard score={84} />
        </div>
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {BREAKDOWNS.map((bd) => (
            <SeoBreakdownCard key={bd.id} {...bd} />
          ))}
        </div>
      </div>

      {/* Featured Insight Strip */}
      <SeoFeaturedInsight
        recommendation='Integrating LSI Keywords in your "Pricing" page header could boost organic traffic by approximately 14% based on current competitor trends.'
        onApplyInsight={handleApplyInsight}
      />

      {/* SEO Issues list table */}
      <SeoIssuesTable
        issues={MOCK_ISSUES}
        resolvedCount={12}
        onViewAll={() => alert("Loading expanded diagnostic issues matrix...")}
        onFixIssue={(id) => console.log(`Triggered fix for issue ${id}`)}
      />

      {/* Background Graphic Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SeoVisualCard
          title="Site Architecture"
          description="Visual map of your crawl depth."
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAcECd8_0-Xo6nEGkDbfbm7B501waxGLGyNACXq0RecpXhu5GWRYMn_ebaoPN63zuVyvDJhT-t8A59J0ODdEb_bLooOWUqFTSjCeQc25FZG9Mg_SgbZi81X5LnCKODnLzr7-J2ok-Xh-IJzfC8nIPxwqN41SGZm7AN_Eecaax9zkroWDfziiqI-OtkMa35pB5Sssv5qtx8bhHKKVgm0CVP_69sQBC-IL4l8NXknAtjFAGvNxHpQDuTNqg"
          onClick={() => alert("Opening interactive website architecture graph details...")}
        />
        <SeoVisualCard
          title="Traffic Forecast"
          description="Predicted growth after fixing issues."
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDvAM5GRCeiuT31JSra6tQOTaPxtKB52Wa7sFHLZnmCzpnuasxkq6o_o12bX8PBibWnTGAuYUPjYzIKk52V00poG6SaYlU3HT7LD8ynjqIRqYEra3HVdrStkWR7hnmWoP4NAV_CirpAwuoZUyT1ug3wVjSvH8UlDVykMH5rp2kURHkPHNQxcfV5OVW5BI0ZHArtrvLB9irixIPFNsRCMzfoEe2mvk22Su52j2LE1kLCgTLLiAVvmiysSQ"
          onClick={() => alert("Opening traffic projection model charts...")}
        />
      </div>
    </div>
  );
}
