"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface AccessibilityOverallScoreProps {
  score: number;
  standing: string;
  standingType: "pass" | "warning" | "fail";
  details: string;
}

export function AccessibilityOverallScore({
  score,
  standing,
  standingType,
  details,
}: AccessibilityOverallScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Radius is 40. Circumference = 2 * pi * R = 2 * 3.14159 * 40 = 251.32
  const circumference = 251.32;
  const dashOffset = circumference - circumference * (animatedScore / 100);

  const getStandingColor = () => {
    switch (standingType) {
      case "pass":
        return "text-emerald-600";
      case "warning":
        return "text-amber-500";
      case "fail":
        return "text-red-500";
    }
  };

  const getProgressColor = () => {
    switch (standingType) {
      case "pass":
        return "stroke-emerald-500";
      case "warning":
        return "stroke-amber-500";
      case "fail":
        return "stroke-blue-600"; // Stitch HTML uses blue #004ac6 even for needs improvement! Let's stay matching.
    }
  };

  return (
    <GlassCard className="p-5 rounded-[24px] border-slate-200/80 shadow-sm flex items-center gap-6 min-w-[320px] bg-white/70">
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            fill="transparent"
            r="40"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          <circle
            cx="48"
            cy="48"
            fill="transparent"
            r="40"
            stroke="#004ac6"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeWidth="8"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <span className="text-2xl font-black text-blue-600 tracking-tight leading-none">
            {animatedScore}
          </span>
          <span className="text-[9px] uppercase font-black text-slate-400 mt-1 tracking-widest">
            Score
          </span>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800 tracking-tight">Overall Score</h4>
        <p className={cn("text-[10px] font-black uppercase tracking-wider mt-1", getStandingColor())}>
          {standing}
        </p>
        <p className="text-xs font-semibold text-slate-400 mt-0.5">{details}</p>
      </div>
    </GlassCard>
  );
}
