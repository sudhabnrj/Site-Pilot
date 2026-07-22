"use client";

import { useState, useMemo } from "react";
import { AccessibilityOverallScore } from "@/components/accessibility/accessibility-overall-score";
import { AccessibilityMetricCard } from "@/components/accessibility/accessibility-metric-card";
import { AccessibilityFailureCard, type AccessibilityFailure } from "@/components/accessibility/accessibility-failure-card";
import { Contrast, Code, Keyboard, Image, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_FAILURES: AccessibilityFailure[] = [
  {
    id: "fail-1",
    code: "FAILURE #001",
    title: "Insufficient Color Contrast",
    severity: "Critical",
    description: "The text \"Start Journey\" has a contrast ratio of 2.1:1, which is below the minimum requirement of 4.5:1 for standard text.",
    aiSuggestion: "Change the text color from #E2E8F0 to #00174B or darken the background to #004AC6 to meet AAA compliance (7.0:1).",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqIY3ml8IeArKfVDq0XKITO8d_0wyK458q1xGY74sXl-9p3pwlXpjJF_ToVXGRzN63oxiV9p_PHxxlZgavIYPvde-cE6PVa_FS-UJMBQUw-mgCV0XuoEznMHEx2pnur-y86UhzYKoGtF-e2WCksBj_QAwR-ektjEP0zEGtHdeZ7Jt6NKby-PDtbmSswNsTGXeyPBUgbxz8EdQ6eFLTG3jfH4kPEZJx7WIjgNw-xek3NO2c3Q_1frdvVg",
  },
  {
    id: "fail-2",
    code: "FAILURE #002",
    title: "Missing ARIA Label on Icon Buttons",
    severity: "Critical",
    description: "Social media icons in the footer do not have `aria-label` or `alt` attributes, making them unreachable for screen readers.",
    aiSuggestion: "Add aria-label='Follow us on X' to the first icon element. Our vision model identifies this logo as the X/Twitter brandmark.",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqVANytwKXf1kmR73oguqJnCeaFBXSAa3O2lSEErxYwaGpo5OniydmJEDR04ZmNnTbPto7-9cgBlQsX5AIHp9-hyG8h_IWMKBMqAoRx8Vb_d3CgbkqTgJZR62ipUVrWFv1HWWybjHGAG-eh5hGTvzGe7w6YzZFIIUrezBiQ3w5p9g1-ZoB_u6UdxwlU1R73bzSvZ7Jfx1wYzjDrsc3jP-UnMmkbl7ryen98c2DigxJZoEPDDWnWEvTrg",
  },
  {
    id: "fail-3",
    code: "FAILURE #003",
    title: "Non-standard Focus Ring",
    severity: "Warning",
    description: "The focus state for the 'Contact' form input is suppressed (`outline: none`), which hinders keyboard-only navigation users.",
    aiSuggestion: "Enable the default browser focus ring or apply a custom `ring-2 ring-primary` style to maintain brand consistency while ensuring visibility.",
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1Y21dliVzpEBMzTtTu1lJiuo6OhKU9m_Y0ogscP_704GKqbTdYZDyAUrjocbmjory7adXuG8Yw9Cc0y2LxkV7QuxzJsgAvYgwXNlRRUCPZY3wlG_qkK5hehv_D6T2jnec6BwWnhlUvZaaacY1Qnq39syWvdBsRJpvDHZSlIyDhH9hKKcFZ7K6mQnKYwrqiqKD5i0mCgkHyjun-BWtdceGrQhSoMYyhylYc-g5p4L0eHE1ySJn9bmtbw",
  },
];

const METRICS_CONFIG = [
  {
    id: "contrast",
    icon: Contrast,
    title: "Color Contrast",
    passingPercent: 42,
    statusText: "Low" as const,
    iconBgClass: "bg-red-50 border-red-100/50",
    iconColorClass: "text-red-500",
  },
  {
    id: "aria",
    icon: Code,
    title: "ARIA Labels",
    passingPercent: 88,
    statusText: "Fair" as const,
    iconBgClass: "bg-amber-50 border-amber-100/50",
    iconColorClass: "text-amber-500",
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
    passingPercent: 30,
    statusText: "Low" as const,
    iconBgClass: "bg-red-50 border-red-100/50",
    iconColorClass: "text-red-500",
  },
];

export default function AccessibilityPage() {
  const [severityFilter, setSeverityFilter] = useState<"All" | "Critical" | "Warning">("All");

  const filteredFailures = useMemo(() => {
    return MOCK_FAILURES.filter((fail) => {
      if (severityFilter === "All") return true;
      return fail.severity === severityFilter;
    });
  }, [severityFilter]);

  const handleApplyFix = (id: string) => {
    console.log(`Fixing accessibility issue ${id} in background...`);
  };

  const handleViewInCode = (id: string) => {
    const failure = MOCK_FAILURES.find((f) => f.id === id);
    alert(`Highlighting source code file and line references for ${failure?.code}...`);
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header section */}
      <section className="flex flex-col lg:flex-row gap-6 items-start justify-between">
        <div className="flex-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Accessibility Audit
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            A comprehensive analysis of your site's adherence to WCAG 2.1 Level AA standards. Last audited 2 hours ago.
          </p>
        </div>
        <AccessibilityOverallScore
          score={75}
          standing="Needs Improvement"
          standingType="warning"
          details="12 Critical issues found"
        />
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS_CONFIG.map((metric) => (
          <AccessibilityMetricCard key={metric.id} {...metric} />
        ))}
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
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 border",
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
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 border",
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
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 border",
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
              onApplyFix={handleApplyFix}
              onViewInCode={handleViewInCode}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => alert("Loading expanded compliance history reports...")}
            className="flex items-center gap-1.5 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl active:scale-95 transition-all shadow-sm"
          >
            Load All Results
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </section>
    </div>
  );
}
