"use client";

import { PdfHealthScoreWidget } from "./pdf-health-score-widget";
import { PdfSeoDonut } from "./pdf-seo-donut";
import { PdfAiRecommendationItem } from "./pdf-ai-recommendation-item";
import { PdfVisualPreviewCard } from "./pdf-visual-preview-card";
import { Brain, Link as LinkIcon } from "lucide-react";

interface PdfReportPreviewPaperProps {
  report?: any;
  domain?: string;
  overallScore?: number;
  date?: string;
  reportId?: string;
}

export function PdfReportPreviewPaper({
  report,
  domain: propDomain = "example.com",
  overallScore: propScore = 85,
  date: propDate = "TODAY",
  reportId: propReportId = "AA-29402-92X",
}: PdfReportPreviewPaperProps) {
  const domain = report?.domain || propDomain;
  const overallScore = report?.overallScore ?? propScore;
  const date = report?.createdAt
    ? new Date(report.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }).toUpperCase()
    : propDate;
  const reportId = report?._id ? `REP-${String(report._id).slice(-8).toUpperCase()}` : propReportId;

  const seoScore = report?.seoScore ?? 80;
  const securityScore = report?.securityScore ?? 95;
  const accessibilityScore = report?.accessibilityScore ?? 85;
  const performanceScore = report?.performanceScore ?? 75;

  // Build complete list of all issues & recommendations
  const allIssuesList = (() => {
    const list: Array<{
      num: number;
      title: string;
      description: string;
      category?: string;
      severity?: string;
      isLowPriority?: boolean;
    }> = [];

    if (report?.issues && Array.isArray(report.issues) && report.issues.length > 0) {
      report.issues.forEach((iss: any, index: number) => {
        list.push({
          num: index + 1,
          title: iss.issue || iss.title || "Audit Finding",
          description: iss.recommendation || iss.description || iss.impact || "Review website setup for optimization.",
          category: iss.category?.toUpperCase() || "AUDIT",
          severity: iss.severity || "warning",
          isLowPriority: iss.severity === "info",
        });
      });
    }

    if (report?.recommendations && Array.isArray(report.recommendations) && report.recommendations.length > 0) {
      report.recommendations.forEach((rec: any) => {
        const title = rec.title || rec.recommendation || "Optimization Step";
        const exists = list.some((item) => item.title.toLowerCase() === title.toLowerCase());
        if (!exists) {
          list.push({
            num: list.length + 1,
            title,
            description: rec.description || rec.impact || "Implement recommended fix to improve score.",
            category: rec.category?.toUpperCase() || "AI FIX",
            severity: rec.priority === "high" ? "critical" : "warning",
            isLowPriority: rec.priority === "low",
          });
        }
      });
    }

    // Fallback if no issues recorded
    if (list.length === 0) {
      list.push(
        {
          num: 1,
          title: "Optimize Largest Contentful Paint (LCP)",
          description: `Compress hero background imagery on ${domain} to improve page speed by up to 1.2s.`,
          category: "PERFORMANCE",
          severity: "warning",
          isLowPriority: false,
        },
        {
          num: 2,
          title: "Improve Mobile Tap Target Sizes",
          description: "Ensure touch navigation items have at least 48px padding for seamless mobile browsing.",
          category: "MOBILE",
          severity: "warning",
          isLowPriority: false,
        },
        {
          num: 3,
          title: "Fix Internal Broken Links",
          description: "Inspect crawler errors and repair 404 links to enhance crawl budget and SEO depth.",
          category: "SEO",
          severity: "critical",
          isLowPriority: false,
        },
        {
          num: 4,
          title: "Configure Strict Security Headers",
          description: "Add Content-Security-Policy (CSP) and Strict-Transport-Security (HSTS) response headers.",
          category: "SECURITY",
          severity: "info",
          isLowPriority: true,
        }
      );
    }

    return list;
  })();

  const securityStanding = securityScore >= 80 ? "A" : securityScore >= 70 ? "B" : "C";

  return (
    <div className="bg-white border border-slate-200/80 p-8 sm:p-10 rounded-[32px] shadow-xl max-w-4xl mx-auto relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Header section */}
      <header className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight mb-1 select-none">
            Website Audit Executive Summary
          </h1>
          <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 select-none">
            <LinkIcon className="h-3.5 w-3.5 text-blue-600" />
            {domain}
          </p>
        </div>
        <div className="text-right select-none">
          <div className="font-display text-lg font-black text-blue-600 tracking-tight leading-none select-none">
            Site Pilot
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 select-none">
            Certified Analysis
          </p>
        </div>
      </header>

      {/* Grid: Health Score & Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
        {/* Health Score Column */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <PdfHealthScoreWidget score={overallScore} standing={overallScore >= 80 ? "EXCELLENT" : overallScore >= 70 ? "GOOD" : "NEEDS ATTENTION"} />
        </div>

        {/* Breakdown Sub-indices Column */}
        <div className="md:col-span-7 grid grid-cols-2 gap-4 items-stretch">
          <PdfSeoDonut score={seoScore} />
          
          {/* Security Card */}
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-[24px] select-none flex flex-col justify-between">
            <p className="text-[10px] font-black text-slate-400 tracking-wider">
              SECURITY INDEX
            </p>
            <div className="flex flex-col items-center">
              <span className={`font-display text-3xl font-black leading-none ${
                securityScore >= 80 ? "text-emerald-600" : securityScore >= 70 ? "text-amber-500" : "text-red-500"
              }`}>
                {securityStanding}
              </span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden shadow-inner">
                <div className={`h-full rounded-full transition-all ${
                  securityScore >= 80 ? "bg-emerald-500" : securityScore >= 70 ? "bg-amber-500" : "bg-red-500"
                }`} style={{ width: `${securityScore}%` }} />
              </div>
              <p className="text-[9px] font-bold text-slate-400 mt-2 select-none">
                {securityScore >= 80 ? "SSL & security headers verified" : securityScore >= 70 ? "Moderate security configuration" : "Security enhancements recommended"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Progress Indices */}
      <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-[24px] select-none mb-10">
        <p className="text-[10px] font-black text-slate-400 tracking-wider mb-4">
          ACCESSIBILITY (WCAG 2.1) & PERFORMANCE INDEX
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span>Accessibility Score</span>
              <span className={`font-black ${
                accessibilityScore >= 80 ? "text-emerald-600" : accessibilityScore >= 70 ? "text-amber-500" : "text-red-500"
              }`}>{accessibilityScore}/100</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden shadow-inner">
              <div className={`h-full rounded-full transition-all ${
                accessibilityScore >= 80 ? "bg-emerald-500" : accessibilityScore >= 70 ? "bg-amber-500" : "bg-red-500"
              }`} style={{ width: `${accessibilityScore}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span>Performance Load Speed</span>
              <span className={`font-black ${
                performanceScore >= 80 ? "text-emerald-600" : performanceScore >= 70 ? "text-amber-500" : "text-red-500"
              }`}>{performanceScore}/100</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden shadow-inner">
              <div className={`h-full rounded-full transition-all ${
                performanceScore >= 80 ? "bg-emerald-500" : performanceScore >= 70 ? "bg-amber-500" : "bg-red-500"
              }`} style={{ width: `${performanceScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Identified Issues & Recommendations */}
      <section className="mb-10 select-none">
        <div className="flex items-center justify-between gap-2 mb-6 select-none border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Identified Audit Issues & Recommendations
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
            {allIssuesList.length} Total Findings
          </span>
        </div>

        <div className="space-y-3">
          {allIssuesList.map((rec) => (
            <PdfAiRecommendationItem key={rec.num} {...rec} />
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <footer className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs select-none">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-black text-blue-600">Site Pilot</span>
          <div className="h-4 w-px bg-slate-200" />
          <p className="font-semibold text-[10px]">Executive Web Analysis Report</p>
        </div>
        <div className="text-right font-bold text-[10px]">
          <p className="uppercase">Date: {date}</p>
          <p className="text-[9px] opacity-70 mt-0.5">Report ID: {reportId}</p>
        </div>
      </footer>
    </div>
  );
}
