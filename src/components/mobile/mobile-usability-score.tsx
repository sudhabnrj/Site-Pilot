"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface MobileUsabilityScoreProps {
  score: number;
  standing: string;
  standingType: "good" | "warning" | "error";
  details: string;
}

export function MobileUsabilityScore({
  score,
  standing,
  standingType,
  details,
}: MobileUsabilityScoreProps) {
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
      case "good":
        return "text-emerald-600";
      case "warning":
        return "text-amber-500";
      case "error":
        return "text-red-500";
    }
  };

  return (
    <GlassCard className="p-5 rounded-[24px] border-slate-200/80 shadow-sm flex items-center gap-6 min-w-[280px] bg-white/70">
      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center select-none">
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
            stroke={standingType === "good" ? "#10b981" : standingType === "warning" ? "#f59e0b" : "#ef4444"}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeWidth="8"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-2xl font-black text-slate-800 tracking-tight">
          {animatedScore}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
          Usability Score
        </p>
        <p className={cn("text-base font-bold mt-1.5 leading-tight", getStandingColor())}>
          {standing}
        </p>
        <p className="text-xs font-semibold text-slate-400 mt-1">{details}</p>
      </div>
    </GlassCard>
  );
}
