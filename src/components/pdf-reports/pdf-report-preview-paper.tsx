"use client";

import { PdfHealthScoreWidget } from "./pdf-health-score-widget";
import { PdfSeoDonut } from "./pdf-seo-donut";
import { PdfAiRecommendationItem } from "./pdf-ai-recommendation-item";
import { PdfVisualPreviewCard } from "./pdf-visual-preview-card";
import { Brain, Link as LinkIcon } from "lucide-react";

interface PdfReportPreviewPaperProps {
  domain: string;
  overallScore: number;
  date: string;
  reportId: string;
}

const MOCK_RECOMMENDATIONS = [
  {
    num: 1,
    title: "Optimize Largest Contentful Paint (LCP)",
    description: "Image compression on the homepage banner could reduce load time by 1.2s.",
    isLowPriority: false,
  },
  {
    num: 2,
    title: "Improve Mobile Tap Targets",
    description: "Navigation links in the footer are too close for mobile users (below 48px threshold).",
    isLowPriority: false,
  },
  {
    num: 3,
    title: "Fix Broken Inbound Links",
    description: "The \"About\" page has 3 internal 404 errors impacting SEO crawl depth.",
    isLowPriority: false,
  },
  {
    num: 4,
    title: "Implement Schema Markup",
    description: "Missing BreadcrumbList schema on service pages is limiting rich snippet potential.",
    isLowPriority: true,
  },
  {
    num: 5,
    title: "H1 Semantic Structure",
    description: "Multiple H1 tags detected on the homepage. Condense to a single primary heading.",
    isLowPriority: true,
  },
];

export function PdfReportPreviewPaper({
  domain = "example.com",
  overallScore = 85,
  date = "OCTOBER 24, 2023",
  reportId = "AA-29402-92X",
}: PdfReportPreviewPaperProps) {
  return (
    <div className="max-w-[816px] mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden min-h-[1056px] flex flex-col p-12 hover:shadow-2xl hover:scale-[1.005] transition-all duration-300 select-none">
      {/* Document Header */}
      <header className="flex justify-between items-start mb-10 select-none">
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

      <hr className="border-slate-100 mb-10 select-none" />

      {/* Grid: Health Score & Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
        {/* Health Score Column */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <PdfHealthScoreWidget score={overallScore} standing="OPTIMIZED" />
        </div>

        {/* Breakdown Sub-indices Column */}
        <div className="md:col-span-7 grid grid-cols-2 gap-4 items-stretch">
          <PdfSeoDonut score={80} />
          
          {/* Security Card */}
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-[24px] select-none flex flex-col justify-between">
            <p className="text-[10px] font-black text-slate-400 tracking-wider">
              SECURITY INDEX
            </p>
            <div className="flex flex-col items-center">
              <span className="font-display text-3xl font-black text-emerald-600 leading-none">
                A+
              </span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden shadow-inner">
                <div className="w-[95%] bg-emerald-500 h-full rounded-full" />
              </div>
              <p className="text-[9px] font-bold text-slate-400 mt-2 select-none">
                Zero vulnerabilities detected
              </p>
            </div>
          </div>

          {/* Accessibility Progress Indices */}
          <div className="col-span-2 bg-slate-50 border border-slate-200/60 p-5 rounded-[24px] select-none">
            <p className="text-[10px] font-black text-slate-400 tracking-wider mb-4">
              ACCESSIBILITY (WCAG 2.1)
            </p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Contrast</span>
                  <span className="text-slate-600">High</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden shadow-inner">
                  <div className="w-[88%] bg-blue-600 h-full rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Screen Reader Compatibility</span>
                  <span className="text-slate-600">Medium</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden shadow-inner">
                  <div className="w-[62%] bg-indigo-600 h-full rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <section className="mb-10 select-none">
        <div className="flex items-center gap-2 mb-6 select-none">
          <Brain className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
            Top 5 AI Recommendations
          </h2>
        </div>
        <div className="space-y-3">
          {MOCK_RECOMMENDATIONS.map((rec) => (
            <PdfAiRecommendationItem key={rec.num} {...rec} />
          ))}
        </div>
      </section>

      {/* Visual latency & security graphs */}
      <div className="grid grid-cols-2 gap-4 mb-10 select-none">
        <PdfVisualPreviewCard
          title="System Latency Heatmap"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuCVmDXAKheArQQ3X6FJnUU4oi8Y6L_y-7-VM7qyFtKtoReLITIs5tJuRlzBFAcyIQArUkgxzIK9KgJdFFJLJpvVy9f9ylKlpv1IHwkPBfu2iMu6F_cq1RsH58BB67wiY4pvIIGtm_ExqSRsyVBsD5eH0QNL2iX9cyIf2i-p_f-5cFlxnw7XWXf-_sdEFy_o-SqSSkpcHRHrU_v136rkTZ0P8OBHUXVMEP6gz6yAx3zMd9hmpqrAuBSDmA"
        />
        <PdfVisualPreviewCard
          title="Security Node Mapping"
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuD0a2p3pa8ZC4Qa6_a6-xxwrZCzJLr-zHyzuDfx5SubfRBkLw-JiMtHgacmlQwK04NKj6xd9O696MZTpIkjSONv-O2Vjoia9tRkas_suoaGxDsaD_v7jQjl3pV9ZTa68w6pCphYr0grCyBIyx0JRDKAVmXf_BJNsNUIUK7n-S3fXCX5_epafRSw4myWM9tUpxm9z7E8zx2NnT7cA_rwgvWd-fks3kJFrLsR8d9i8akanWpxEuvPSgg1Qw"
        />
      </div>

      {/* Footer Info */}
      <footer className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-xs select-none">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-black text-blue-600">Site Pilot</span>
          <div className="h-4 w-px bg-slate-200" />
          <p className="font-semibold text-[10px]">Enterprise Web Analysis Report</p>
        </div>
        <div className="text-right font-bold text-[10px]">
          <p className="uppercase">Date: {date}</p>
          <p className="text-[9px] opacity-70 mt-0.5">Report ID: {reportId}</p>
        </div>
      </footer>
    </div>
  );
}
