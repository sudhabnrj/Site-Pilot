"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import type { WebsiteHealthData } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { getScoreTextColor } from "@/lib/score-colors";

interface WebsiteHealthCardProps {
  data: WebsiteHealthData;
  className?: string;
}

export function WebsiteHealthCard({ data, className }: WebsiteHealthCardProps) {
  const scoreTextColor = getScoreTextColor(data.score);
  const ringStrokeColor = data.score >= 80 ? "text-emerald-500" : data.score >= 70 ? "text-amber-500" : "text-red-500";
  const statusTextColor = data.score >= 80 ? "text-emerald-600 dark:text-emerald-400" : data.score >= 70 ? "text-amber-500 dark:text-amber-400" : "text-red-500 dark:text-red-400";
  const statusLabel = data.score >= 80 ? "Excellent" : data.score >= 70 ? "Good" : "Needs Attention";

  return (
    <GlassCard className={cn("flex flex-col items-center justify-center text-center", className)}>
      <h3 className="mb-6 text-xl font-semibold tracking-tight">Website Health</h3>

      <ProgressRing value={data.score} max={data.maxScore} size={192} strokeWidth={12} strokeClassName={ringStrokeColor}>
        <div className="flex flex-col items-center">
          <span className={cn("text-5xl font-black tracking-tight", scoreTextColor)}>
            {data.score}
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Score
          </span>
        </div>
      </ProgressRing>

      <div className="mt-8 grid w-full grid-cols-2 gap-8 border-t border-border/50 pt-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Status</p>
          <p className={cn("text-lg font-bold", statusTextColor)}>{statusLabel}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Scan Duration</p>
          <p className="text-lg font-bold text-foreground">{data.scanDuration}</p>
        </div>
      </div>
    </GlassCard>
  );
}
