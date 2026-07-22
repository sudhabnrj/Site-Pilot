"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { SeverityBadge } from "@/components/ui/severity-badge";
import type { AiRecommendation } from "@/types/dashboard";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AiRecommendationsProps {
  recommendations: AiRecommendation[];
  className?: string;
}

export function AiRecommendations({ recommendations, className }: AiRecommendationsProps) {
  return (
    <GlassCard className={cn("p-6", className)}>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blue-600 shadow-sm">
          <LucideIcons.Bot className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-semibold tracking-tight">AI Insights & Fixes</h3>
          <p className="text-sm text-muted-foreground">
            Recommended actions to boost your score by 8 points.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[rec.icon];

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-background p-4 transition-colors hover:border-blue-300"
            >
              <div className="flex items-center gap-4">
                {IconComponent && (
                  <IconComponent className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                )}
                <div>
                  <p className="font-semibold">{rec.title}</p>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SeverityBadge level={rec.severity} />
                <button className="text-sm font-bold text-blue-600 hover:underline">
                  Fix Now
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
