"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { SeverityBadge } from "@/components/ui/severity-badge";
import type { AiRecommendation } from "@/types/dashboard";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { fixAuditIssue } from "@/store/slices/audit-slice";
import { toast } from "sonner";

interface AiRecommendationsProps {
  recommendations: AiRecommendation[];
  className?: string;
}

export function AiRecommendations({ recommendations, className }: AiRecommendationsProps) {
  const dispatch = useAppDispatch();
  const currentReport = useAppSelector((state) => state.audit.currentReport);

  const handleFixClick = async (rec: AiRecommendation) => {
    if (!currentReport || !currentReport._id) {
      toast.error("No active report loaded to apply fix.");
      return;
    }

    try {
      toast.loading("Applying AI optimization...", { id: "apply-fix" });
      await dispatch(
        fixAuditIssue({
          reportId: currentReport._id,
          recommendationId: rec.id,
          issueKeyword: rec.title,
        })
      ).unwrap();
      toast.dismiss("apply-fix");
      toast.success("Fix successfully synced!", {
        description: `"${rec.title}" has been permanently resolved from this report.`,
      });
    } catch (err: any) {
      toast.dismiss("apply-fix");
      toast.error("Failed to apply fix", {
        description: err || "Unable to save fix to MongoDB.",
      });
    }
  };

  return (
    <GlassCard className={cn("p-6", className)}>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blue-600 shadow-sm">
          <LucideIcons.Bot className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-semibold tracking-tight">AI Insights & Fixes</h3>
          <p className="text-sm text-muted-foreground">
            Recommended actions to optimize your page health scores.
          </p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs font-semibold">
          🎉 All recommended AI optimizations have been temporarily applied! Run a new scan to verify.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className="font-semibold text-slate-800 text-sm">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SeverityBadge level={rec.severity} />
                  <button
                    onClick={() => handleFixClick(rec)}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer active:scale-95 transition-all"
                  >
                    Fix Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
