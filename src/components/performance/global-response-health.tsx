"use client";

import { GlassCard } from "@/components/ui/glass-card";

interface GlobalResponseHealthProps {
  score?: string;
  label?: string;
  barHeights?: number[];
}

export function GlobalResponseHealth({
  score = "98.4%",
  label = "Reliability Score",
  barHeights = [60, 75, 90, 80, 70, 95, 85, 90, 100],
}: GlobalResponseHealthProps) {
  return (
    <GlassCard className="p-5 rounded-[24px] shadow-sm bg-slate-900 border-slate-800 text-white relative overflow-hidden">
      {/* Visual noise/texture effect */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 relative z-10">
        Global Response Health
      </h3>

      <div className="flex justify-between items-center relative z-10">
        <div>
          <p className="text-2xl font-black leading-none">{score}</p>
          <p className="text-[10px] font-semibold text-slate-400 mt-1">{label}</p>
        </div>

        <div className="flex gap-1.5 items-end h-10 shrink-0">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="w-1 bg-emerald-400 rounded-full transition-all duration-300 hover:bg-emerald-300 cursor-pointer"
              style={{ height: `${h}%` }}
              title={`Uptime indicator ${i + 1}: ${h}%`}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
