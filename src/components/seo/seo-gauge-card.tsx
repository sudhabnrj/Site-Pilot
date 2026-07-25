"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";

interface SeoGaugeCardProps {
  score: number;
  label?: string;
  description?: string;
}

export function SeoGaugeCard({
  score,
  label = "Good Standing",
  description = "Your site performs better than 72% of competitors in your industry.",
}: SeoGaugeCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Radius is 40. Arc length of a semi-circle = pi * R = 3.14159 * 40 = 125.66
  const arcLength = 125.66;
  const dashOffset = arcLength - arcLength * (animatedScore / 100);

  return (
    <GlassCard className="p-6 rounded-[24px] border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center bg-white/70">
      <div className="relative w-48 h-24 mb-4 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 50">
          {/* Background Arc */}
          <path
            className="fill-none stroke-slate-100 stroke-[10]"
            d="M 10 50 A 40 40 0 0 1 90 50"
          />
          {/* Progress Arc */}
          <path
            className="fill-none stroke-[10] stroke-linecap-round transition-all duration-1000 ease-out"
            stroke={animatedScore >= 80 ? "#10b981" : animatedScore >= 70 ? "#f59e0b" : "#ef4444"}
            d="M 10 50 A 40 40 0 0 1 90 50"
            strokeDasharray={`${arcLength} ${arcLength}`}
            strokeDashoffset={dashOffset}
          />
        </svg>
        {/* Core Center Text */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-1">
          <span className="text-4xl font-black text-slate-800 tracking-tight leading-none">
            {animatedScore}
          </span>
          <span className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
            / 100
          </span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">{label}</h3>
      <p className="text-xs font-semibold text-slate-400 max-w-[240px] leading-relaxed">
        {description}
      </p>
    </GlassCard>
  );
}
