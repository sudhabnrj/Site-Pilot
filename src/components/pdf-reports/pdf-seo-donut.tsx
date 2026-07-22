"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PdfSeoDonutProps {
  score: number;
  title?: string;
  legend?: { label: string; colorClass: string }[];
}

export function PdfSeoDonut({
  score = 80,
  title = "SEO PERFORMANCE",
  legend = [
    { label: "Keywords", colorClass: "bg-indigo-600" },
    { label: "Backlinks", colorClass: "bg-blue-300" },
    { label: "Meta Tags", colorClass: "bg-slate-400" },
  ],
}: PdfSeoDonutProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Radius is 34. Circumference = 2 * pi * R = 2 * 3.14159 * 34 = 213.63
  const circumference = 213.63;
  const dashOffset = circumference - circumference * (animatedScore / 100);

  return (
    <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-[24px] select-none">
      <p className="text-[10px] font-black text-slate-400 mb-4 tracking-wider">{title}</p>
      
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 relative shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              fill="transparent"
              r="34"
              stroke="#e2e8f0"
              strokeWidth="5"
            />
            <circle
              cx="40"
              cy="40"
              fill="transparent"
              r="34"
              stroke="#645efb"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeWidth="5"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-black text-slate-800 text-sm">
            {animatedScore}%
          </div>
        </div>

        <ul className="text-[9px] font-bold text-slate-400 space-y-1.5 shrink-0">
          {legend.map((item, idx) => (
            <li key={idx} className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", item.colorClass)} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
