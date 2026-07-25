"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PdfHealthScoreWidgetProps {
  score: number;
  standing?: string;
  details?: string;
}

export function PdfHealthScoreWidget({
  score,
  standing = "OPTIMIZED",
  details = "Your site performs better than 92% of competitors in your industry.",
}: PdfHealthScoreWidgetProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Radius is 88. Circumference = 2 * pi * R = 2 * 3.14159 * 88 = 552.92
  const circumference = 552.92;
  const dashOffset = circumference - circumference * (animatedScore / 100);

  return (
    <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-[24px] flex flex-col items-center justify-center text-center shadow-inner select-none">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
        Overall Health Score
      </p>
      
      <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            fill="transparent"
            r="88"
            stroke="#e2e8f0"
            strokeWidth="10"
          />
          <circle
            cx="96"
            cy="96"
            fill="transparent"
            r="88"
            stroke={animatedScore >= 80 ? "#10b981" : animatedScore >= 70 ? "#f59e0b" : "#ef4444"}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeWidth="10"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <span className="font-display text-[60px] font-black text-slate-800 tracking-tight leading-none">
            {animatedScore}
          </span>
          <span className={`text-[10px] font-black mt-1 uppercase tracking-widest ${
            animatedScore >= 80 ? "text-emerald-600" : animatedScore >= 70 ? "text-amber-500" : "text-red-500"
          }`}>
            {standing}
          </span>
        </div>
      </div>
      
      <p className="mt-5 text-xs font-semibold text-slate-500 italic max-w-[200px] leading-relaxed">
        "{details}"
      </p>
    </div>
  );
}
