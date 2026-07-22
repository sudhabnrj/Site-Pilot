"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import type { WebsiteHealthData } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface WebsiteHealthCardProps {
  data: WebsiteHealthData;
  className?: string;
}

export function WebsiteHealthCard({ data, className }: WebsiteHealthCardProps) {
  return (
    <GlassCard className={cn("flex flex-col items-center justify-center text-center", className)}>
      <h3 className="mb-6 text-xl font-semibold tracking-tight">Website Health</h3>

      <ProgressRing value={data.score} max={data.maxScore} size={192} strokeWidth={12}>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-black tracking-tight text-blue-700">
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
          <p className={cn("text-lg font-bold", data.statusColor)}>{data.status}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Scan Duration</p>
          <p className="text-lg font-bold text-foreground">{data.scanDuration}</p>
        </div>
      </div>
    </GlassCard>
  );
}
