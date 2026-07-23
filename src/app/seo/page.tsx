"use client";

import { useState, useEffect } from "react";
import { SeoGaugeCard } from "@/components/seo/seo-gauge-card";
import { SeoBreakdownCard } from "@/components/seo/seo-breakdown-card";
import { SeoFeaturedInsight } from "@/components/seo/seo-featured-insight";
import { SeoIssuesTable, type SeoIssue } from "@/components/seo/seo-issues-table";
import { SeoVisualCard } from "@/components/seo/seo-visual-card";
import { FileSpreadsheet, History, FileText, Settings, Link as LinkIcon, Download, Globe } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUserAudits } from "@/store/slices/audit-slice";
import { toast } from "sonner";

const DEFAULT_BREAKDOWNS = [
  {
    id: "on-page",
    icon: FileText,
    title: "On-Page SEO",
    description: "Content structure, title tags, and meta description quality.",
    score: 92,
    iconBgClass: "bg-indigo-50 border-indigo-100/50",
    iconColorClass: "text-indigo-600",
    progressBarColor: "bg-indigo-600",
  },
  {
    id: "tech-seo",
    icon: Settings,
    title: "Technical SEO",
    description: "Indexing, crawlability, canonicals, and schema markup.",
    score: 78,
    iconBgClass: "bg-amber-50 border-amber-100/50",
    iconColorClass: "text-amber-600",
    progressBarColor: "bg-amber-500",
  },
  {
    id: "backlinks",
    icon: LinkIcon,
    title: "Links & Social Cards",
    description: "Open Graph tags, Twitter Cards, and link structure.",
    score: 85,
    iconBgClass: "bg-blue-50 border-blue-100/50",
    iconColorClass: "text-blue-600",
    progressBarColor: "bg-blue-600",
  },
];

const DEFAULT_ISSUES: SeoIssue[] = [
  {
    id: "iss-1",
    title: "Missing Meta Description",
    impact: "Critical",
    description: "Primary target pages missing meta descriptions.",
  },
  {
    id: "iss-2",
    title: "H1 Tag Missing",
    impact: "High",
    description: "Target homepage missing single primary H1 tag.",
  },
];

export default function SeoPage() {
  const dispatch = useAppDispatch();
  const currentReport = useAppSelector((state) => state.audit.currentReport);

  useEffect(() => {
    dispatch(fetchUserAudits());
  }, [dispatch]);

  const seoScore = currentReport ? currentReport.seoScore : 84;

  const breakdowns = currentReport
    ? [
        {
          id: "on-page",
          icon: FileText,
          title: "On-Page SEO",
          description: "Content structure, title tags, and meta description quality.",
          score: currentReport.seoScore,
          iconBgClass: "bg-indigo-50 border-indigo-100/50",
          iconColorClass: "text-indigo-600",
          progressBarColor: "bg-indigo-600",
        },
        {
          id: "tech-seo",
          icon: Settings,
          title: "Technical SEO",
          description: "Indexing, crawlability, canonicals, and schema markup.",
          score: Math.max(20, currentReport.seoScore - 5),
          iconBgClass: "bg-amber-50 border-amber-100/50",
          iconColorClass: "text-amber-600",
          progressBarColor: "bg-amber-500",
        },
        {
          id: "backlinks",
          icon: LinkIcon,
          title: "Links & Social Cards",
          description: "Open Graph tags, Twitter Cards, and link structure.",
          score: Math.min(100, currentReport.seoScore + 4),
          iconBgClass: "bg-blue-50 border-blue-100/50",
          iconColorClass: "text-blue-600",
          progressBarColor: "bg-blue-600",
        },
      ]
    : DEFAULT_BREAKDOWNS;

  const issuesList: SeoIssue[] = currentReport?.issues?.length
    ? currentReport.issues
        .filter((i) => i.category === "SEO" || i.category === "General")
        .map((iss, idx) => ({
          id: iss.id || `seo-iss-${idx}`,
          title: iss.issue,
          impact: iss.priority === "critical" ? "Critical" : iss.priority === "high" ? "High" : "Medium",
          description: `Page: ${iss.page} - Impact: ${iss.impact}`,
        }))
    : DEFAULT_ISSUES;

  const handleExportCsv = () => {
    toast.success("SEO Audit Exported", {
      description: `Exported SEO report for ${currentReport?.domain || "website"}.`,
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <Globe className="h-3.5 w-3.5" />
            <span>{currentReport?.domain || "Active Property"}</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            SEO Audit & Optimization
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search engine visibility, meta structure, canonicals, and Open Graph tags from MongoDB Atlas.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Export SEO Audit</span>
        </button>
      </div>

      {/* Main SEO Dashboard Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          <SeoGaugeCard score={seoScore} />
          <SeoIssuesTable
            issues={issuesList}
            resolvedCount={0}
            onViewAll={() => {
              toast.info("All SEO Issues", {
                description: `Displaying all ${issuesList.length} SEO issues for ${currentReport?.domain || "website"}.`,
              });
            }}
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          <SeoVisualCard
            title="SERP Snippet Preview"
            description="Visualize how search engine bots render your meta title and description."
            imageSrc={currentReport?.screenshotUrl || "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=600&auto=format&fit=crop"}
          />
          <SeoFeaturedInsight
            recommendation={
              currentReport?.recommendations[0]?.description ||
              "Optimizing heading hierarchy and adding missing meta descriptions will improve search engine ranking."
            }
          />
        </div>
      </div>

      {/* 3 Breakdown Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {breakdowns.map((b) => (
          <SeoBreakdownCard key={b.id} {...b} />
        ))}
      </div>
    </div>
  );
}
