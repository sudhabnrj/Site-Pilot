"use client";

import { useState, useMemo, useEffect } from "react";
import { AccessibilityOverallScore } from "@/components/accessibility/accessibility-overall-score";
import { AccessibilityMetricCard } from "@/components/accessibility/accessibility-metric-card";
import { AccessibilityFailureCard, type AccessibilityFailure } from "@/components/accessibility/accessibility-failure-card";
import { Contrast, Code, Keyboard, Image, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUserAudits } from "@/store/slices/audit-slice";
import { toast } from "sonner";

const DEFAULT_FAILURES: AccessibilityFailure[] = [
  {
    id: "fail-1",
    code: "FAILURE #001",
    title: "Insufficient Color Contrast",
    severity: "Critical",
    description: "Low text contrast ratio detected below standard WCAG 2.1 AA 4.5:1 requirement.",
    aiSuggestion: "Increase background and text contrast ratio to meeting AAA compliance (7.0:1).",
    imageSrc: "",
  },
  {
    id: "fail-2",
    code: "FAILURE #002",
    title: "Missing ARIA Label on Interactive Elements",
    severity: "Critical",
    description: "Icon buttons lack aria-label attributes, making them unreadable for screen readers.",
    aiSuggestion: "Add descriptive aria-label attributes to all interactive icon elements.",
    imageSrc: "",
  },
];

const DEFAULT_METRICS = [
  {
    id: "contrast",
    icon: Contrast,
    title: "Color Contrast",
    passingPercent: 88,
    statusText: "Good" as const,
    iconBgClass: "bg-blue-50 border-blue-100/50",
    iconColorClass: "text-blue-600",
  },
  {
    id: "aria",
    icon: Code,
    title: "ARIA Labels",
    passingPercent: 92,
    statusText: "Good" as const,
    iconBgClass: "bg-emerald-50 border-emerald-100/50",
    iconColorClass: "text-emerald-600",
  },
  {
    id: "keyboard",
    icon: Keyboard,
    title: "Keyboard Nav",
    passingPercent: 95,
    statusText: "Good" as const,
    iconBgClass: "bg-blue-50 border-blue-100/50",
    iconColorClass: "text-blue-600",
  },
  {
    id: "alt",
    icon: Image,
    title: "Alt Text",
    passingPercent: 70,
    statusText: "Fair" as const,
    iconBgClass: "bg-amber-50 border-amber-100/50",
    iconColorClass: "text-amber-500",
  },
];

export default function AccessibilityPage() {
  const dispatch = useAppDispatch();
  const currentReport = useAppSelector((state) => state.audit.currentReport);

  const [severityFilter, setSeverityFilter] = useState<"All" | "Critical" | "Warning">("All");

  useEffect(() => {
    dispatch(fetchUserAudits());
  }, [dispatch]);

  const score = currentReport ? currentReport.accessibilityScore : 88;
  const standing = score >= 80 ? "Excellent" : score >= 70 ? "Good" : "Needs Improvement";
  const standingType: "pass" | "warning" | "fail" = score >= 80 ? "pass" : score >= 70 ? "warning" : "fail";

  const failuresList: AccessibilityFailure[] = useMemo(() => {
    if (!currentReport?.issues?.length) return DEFAULT_FAILURES;

    const filtered = currentReport.issues.filter(
      (i) => i.category === "Accessibility" || i.category === "General"
    );

    if (filtered.length === 0) return DEFAULT_FAILURES;

    return filtered.map((iss, idx) => ({
      id: iss.id || `fail-${idx}`,
      code: `FAILURE #${String(idx + 1).padStart(3, "0")}`,
      title: iss.issue,
      severity: (iss.priority === "critical" || iss.priority === "high" ? "Critical" : "Warning") as "Critical" | "Warning",
      description: `Page ${iss.page} - Impact: ${iss.impact}`,
      aiSuggestion: `Remediate ${iss.issue.toLowerCase()} to satisfy WCAG 2.1 Level AA compliance.`,
      imageSrc: currentReport?.screenshotUrl || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop",
    }));
  }, [currentReport]);

  const filteredFailures = useMemo(() => {
    return failuresList.filter((fail) => {
      if (severityFilter === "All") return true;
      return fail.severity === severityFilter;
    });
  }, [failuresList, severityFilter]);

  const handleApplyFix = (id: string) => {
    toast.success("AI Remediation Triggered", {
      description: `Applied automated code fix for ${id}.`,
    });
  };

  const handleViewInCode = (id: string) => {
    toast.info("Source Code Reference", {
      description: `Highlighting accessibility target element for ${id}.`,
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header section */}
      <section className="flex flex-col lg:flex-row gap-6 items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <Globe className="h-3.5 w-3.5" />
            <span>{currentReport?.domain || "Active Property"}</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Accessibility Audit
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            A comprehensive analysis of WCAG 2.1 Level AA accessibility standards powered by MongoDB Atlas.
          </p>
        </div>
        <AccessibilityOverallScore
          score={score}
          standing={standing}
          standingType={standingType}
          details={`${failuresList.length} total accessibility findings`}
        />
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DEFAULT_METRICS.map((metric) => {
          let passingPercent = metric.passingPercent;
          if (currentReport) {
            if (metric.id === "contrast") passingPercent = Math.max(50, score - 5);
            else if (metric.id === "aria") passingPercent = Math.max(45, score - 12);
            else if (metric.id === "keyboard") passingPercent = Math.max(60, score - 2);
            else if (metric.id === "alt") passingPercent = Math.max(30, score - 18);
          }
          const statusText = passingPercent >= 90 ? ("Good" as const) : passingPercent >= 75 ? ("Fair" as const) : ("Low" as const);
          return (
            <AccessibilityMetricCard
              key={metric.id}
              {...metric}
              passingPercent={passingPercent}
              statusText={statusText}
            />
          );
        })}
      </section>

      {/* Audit Failures list */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Audit Failures ({filteredFailures.length})
          </h3>
          <div className="flex items-center gap-2 select-none">
            <button
              onClick={() => setSeverityFilter("All")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 border cursor-pointer",
                severityFilter === "All"
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              )}
            >
              All
            </button>
            <button
              onClick={() => setSeverityFilter("Critical")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 border cursor-pointer",
                severityFilter === "Critical"
                  ? "bg-red-500 text-white border-red-500 shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              )}
            >
              Critical
            </button>
            <button
              onClick={() => setSeverityFilter("Warning")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 border cursor-pointer",
                severityFilter === "Warning"
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              )}
            >
              Warning
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {filteredFailures.map((failure) => (
            <AccessibilityFailureCard
              key={failure.id}
              failure={failure}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
