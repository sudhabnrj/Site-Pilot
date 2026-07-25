"use client";

import { CheckCircle, Loader2, Sparkles } from "lucide-react";

interface AuditProgressRunnerProps {
  currentStep: number;
  message: string;
}

const STEPS = [
  "Validating Inputs & URLs",
  "Extracting Figma Design Tokens",
  "Capturing Live Website Viewports",
  "Parsing DOM & Computed Styles",
  "Generating Visual Diff & Heatmap",
  "AI Vision Defect Analysis",
  "Computing Pixel Accuracy Score",
];

export function AuditProgressRunner({ currentStep, message }: AuditProgressRunnerProps) {
  const percentage = Math.min(100, Math.round((currentStep / STEPS.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-8 text-center">
        {/* Animated Icon */}
        <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/30">
          <Sparkles className="h-8 w-8 animate-pulse" />
          <div className="absolute -inset-1 rounded-3xl bg-blue-500/20 blur-md -z-10" />
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          AI Design Audit in Progress
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
          {message || "Comparing design tokens and computed styles..."}
        </p>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Overall Progress</span>
            <span className="text-blue-600 dark:text-blue-400 font-mono">{percentage}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Step List */}
        <div className="mt-8 space-y-3 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
          {STEPS.map((stepName, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div
                key={stepName}
                className={`flex items-center gap-3 text-xs transition-colors ${
                  isDone
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : isCurrent
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-400 dark:text-slate-600 opacity-60"
                }`}
              >
                {isDone ? (
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 flex items-center justify-center text-[9px]">
                    {stepNum}
                  </div>
                )}
                <span className="truncate">{stepName}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-[10px] text-slate-400 dark:text-slate-500">
          Estimated completion time ~10-15 seconds. Please do not close this window.
        </p>
      </div>
    </div>
  );
}
