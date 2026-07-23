"use client";

import { useState, useEffect, useMemo } from "react";
import { MobileUsabilityScore } from "@/components/mobile/mobile-usability-score";
import { MobileUsabilityIssueCard } from "@/components/mobile/mobile-usability-issue-card";
import { MobileMockupFrame } from "@/components/mobile/mobile-mockup-frame";
import { MobileOptimizationChip } from "@/components/mobile/mobile-optimization-chip";
import { Sparkles, Image, Code, CheckCircle, XCircle, Globe } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUserAudits } from "@/store/slices/audit-slice";
import { toast } from "sonner";

const DEFAULT_ISSUES = [
  {
    id: "iss-1",
    num: 1,
    category: "CRITICAL" as const,
    title: "Tap targets too close",
    description: "Interactive elements (buttons, links) are less than 48px apart on mobile viewports.",
    fix: "Add padding to touch target elements",
  },
  {
    id: "iss-2",
    num: 2,
    category: "LAYOUT" as const,
    title: "Content wider than screen",
    description: "Horizontal scrolling detected at 375px mobile viewport width.",
    fix: "Use max-width: 100% on layout containers",
  },
];

const OPTIMIZATIONS = [
  {
    id: "opt-1",
    icon: Sparkles,
    title: "Auto-fix Viewport",
    description: "Inject responsive viewport meta tag to eliminate unwanted zoom.",
  },
  {
    id: "opt-2",
    icon: Image,
    title: "Responsive Images",
    description: "Generate srcset responsive hero imagery automatically.",
  },
  {
    id: "opt-3",
    icon: Code,
    title: "Mobile CSS Refactor",
    description: "Replace fixed px containers with responsive flexbox and grid.",
  },
];

export default function MobilePage() {
  const dispatch = useAppDispatch();
  const currentReport = useAppSelector((state) => state.audit.currentReport);

  const [selectedIssueNum, setSelectedIssueNum] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<"comparison" | "heatmap">("comparison");

  useEffect(() => {
    dispatch(fetchUserAudits());
  }, [dispatch]);

  const score = currentReport ? currentReport.mobileScore || currentReport.performanceScore : 82;
  const domain = currentReport?.domain || "example.com";
  const screenshotSrc = currentReport?.screenshotUrl || `https://image.thum.io/get/width/1200/crop/800/https://${domain}`;

  const issuesList = useMemo(() => {
    if (!currentReport?.issues?.length) return DEFAULT_ISSUES;

    const filtered = currentReport.issues.filter(
      (i) => i.category === "Mobile" || i.category === "Accessibility" || i.category === "General"
    );

    if (filtered.length === 0) return DEFAULT_ISSUES;

    return filtered.map((iss, idx) => ({
      id: iss.id || `mob-iss-${idx}`,
      num: idx + 1,
      category: (iss.priority === "critical" ? "CRITICAL" : "LAYOUT") as any,
      title: iss.issue,
      description: `Page: ${iss.page} - Impact: ${iss.impact}`,
      fix: `Remediate ${iss.issue.toLowerCase()} for mobile viewports.`,
    }));
  }, [currentReport]);

  const handleSelectIssue = (num: number) => {
    setSelectedIssueNum(num);
  };

  const handleApplyOptimization = (title: string) => {
    toast.success("Mobile Optimization Applied", {
      description: `Applied optimization rule: ${title}`,
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header section */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 select-none">
            <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wider uppercase">
              Mobile Audit
            </span>
            <span className="text-slate-400 text-xs font-semibold">
              <Globe className="h-3.5 w-3.5 inline mr-1 text-blue-600" />
              {domain}
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Mobile Responsiveness
          </h2>
          <p className="text-slate-500 text-sm font-semibold max-w-2xl leading-relaxed">
            Analyze how your website performs across multiple device viewports from MongoDB Atlas.
          </p>
        </div>
        <MobileUsabilityScore
          score={score}
          standing={score >= 85 ? "Excellent" : "Needs Attention"}
          standingType={score >= 85 ? "good" : "error"}
          details={`${issuesList.length} mobile usability flags`}
        />
      </section>

      {/* Main Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Issues list */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Detected Usability Issues
          </h3>
          <div className="flex flex-col gap-4">
            {issuesList.map((issue) => (
              <MobileUsabilityIssueCard
                key={issue.id}
                id={issue.id}
                category={issue.category}
                title={issue.title}
                description={issue.description}
                fix={issue.fix}
                isSelected={selectedIssueNum === issue.num}
                onClick={() => handleSelectIssue(issue.num)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Devices visual comparisons */}
        <div className="lg:col-span-8">
          <GlassCard className="rounded-[24px] p-6 border-slate-200/80 shadow-sm bg-white/70 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8 select-none">
              <h3 className="text-base font-bold text-slate-800 tracking-tight">Visual Annotations</h3>
              <div className="flex bg-slate-100 border border-slate-200/60 rounded-full p-1">
                <button
                  onClick={() => setActiveTab("comparison")}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer",
                    activeTab === "comparison"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  Comparison
                </button>
                <button
                  onClick={() => setActiveTab("heatmap")}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer",
                    activeTab === "heatmap"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  Heatmap
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center">
              {/* Desktop View Card */}
              <div className="space-y-4 w-full max-w-[320px]">
                <p className="text-[10px] font-black text-slate-400 text-center tracking-widest uppercase select-none">
                  Desktop View (1440px)
                </p>
                <div className="aspect-video bg-slate-100 border border-slate-200 rounded-xl overflow-hidden relative group shadow-sm select-none">
                  <img
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    src={screenshotSrc}
                    alt={`Desktop view of ${domain}`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-slate-900/80 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-sm shadow-md border border-slate-800">
                      Source of Truth
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 px-2 select-none">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5" /> Perfect Layout
                  </span>
                  <span>100% Score</span>
                </div>
              </div>

              {/* Mobile Mockup Simulator View */}
              <div className="space-y-4 w-full flex flex-col items-center">
                <p className="text-[10px] font-black text-slate-400 text-center tracking-widest uppercase select-none">
                  Mobile Viewport (375px)
                </p>
                <MobileMockupFrame
                  activeAnnotation={selectedIssueNum}
                  onSelectAnnotation={handleSelectIssue}
                />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Optimizations Chips bar */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          Recommended Optimizations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OPTIMIZATIONS.map((opt) => (
            <MobileOptimizationChip
              key={opt.id}
              icon={opt.icon}
              title={opt.title}
              description={opt.description}
              onClick={() => handleApplyOptimization(opt.title)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
