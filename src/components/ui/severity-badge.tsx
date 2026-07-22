import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { SeverityLevel } from "@/types/dashboard";

const severityVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
  {
    variants: {
      level: {
        critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        medium: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
        low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      },
    },
    defaultVariants: {
      level: "medium",
    },
  }
);

interface SeverityBadgeProps extends VariantProps<typeof severityVariants> {
  level: SeverityLevel;
  className?: string;
}

export function SeverityBadge({ level, className }: SeverityBadgeProps) {
  return (
    <span className={cn(severityVariants({ level }), className)} role="status">
      {level}
    </span>
  );
}
