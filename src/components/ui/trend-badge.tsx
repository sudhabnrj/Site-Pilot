import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { TrendDirection } from "@/types/dashboard";

interface TrendBadgeProps {
  direction: TrendDirection;
  percentage: number;
  label?: string;
  className?: string;
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    iconColor: "text-green-500",
    textColor: "text-green-600",
    prefix: "+",
  },
  down: {
    icon: TrendingDown,
    iconColor: "text-red-500",
    textColor: "text-red-600",
    prefix: "-",
  },
  neutral: {
    icon: Minus,
    iconColor: "text-muted-foreground",
    textColor: "text-muted-foreground",
    prefix: "",
  },
} as const;

export function TrendBadge({ direction, percentage, label, className }: TrendBadgeProps) {
  const config = trendConfig[direction];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Icon className={cn("h-3.5 w-3.5", config.iconColor)} aria-hidden="true" />
      <span className={cn("text-xs font-medium", config.textColor)}>
        {config.prefix}{percentage}%{label ? ` ${label}` : ""}
      </span>
    </div>
  );
}
