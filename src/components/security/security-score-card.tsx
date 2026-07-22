"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";

interface SecurityScoreCardProps {
  scoreGrade: string;
  scorePercent: number;
  standing: string;
  details: string;
}

export function SecurityScoreCard({
  scoreGrade = "A+",
  scorePercent = 95,
  standing = "Excellent",
  details = "Your site is in the top 1% of audited domains for header security.",
}: SecurityScoreCardProps) {
  const [animatedOffset, setAnimatedOffset] = useState(552.92);

  // Radius is 88. Circumference = 2 * pi * R = 2 * 3.14159 * 88 = 552.92
  const circumference = 552.92;

  useEffect(() => {
    const timer = setTimeout(() => {
      const targetOffset = circumference - circumference * (scorePercent / 100);
      setAnimatedOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [scorePercent]);

  return (
    <GlassCard className="p-6 rounded-[24px] border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group bg-white/70">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-500 pointer-events-none" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 select-none">
        Security Index
      </p>

      <div className="relative w-48 h-48 flex items-center justify-center shrink-0 select-none">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            fill="transparent"
            r="88"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          <circle
            cx="96"
            cy="96"
            fill="transparent"
            r="88"
            stroke="#004ac6"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={animatedOffset}
            strokeLinecap="round"
            strokeWidth="8"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <span className="font-display text-[60px] font-black text-slate-800 tracking-tight leading-none">
            {scoreGrade}
          </span>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mt-1.5">
            {standing}
          </span>
        </div>
      </div>

      <p className="text-xs font-semibold text-slate-400 mt-5 px-4 leading-relaxed">
        {details.split(standing)[0]}
        <span className="text-slate-800 font-bold">{standing}</span>
        {details.split(standing)[1] || "Your site is in the top 1% of audited domains."}
      </p>
    </GlassCard>
  );
}
