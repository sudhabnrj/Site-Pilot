import { cn } from "@/lib/utils";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import type { IssueStatus } from "@/types/dashboard";

const statusConfig = {
  open: {
    icon: AlertCircle,
    label: "Open",
    className: "text-muted-foreground",
  },
  "in-progress": {
    icon: Clock,
    label: "In Progress",
    className: "text-muted-foreground",
  },
  resolved: {
    icon: CheckCircle2,
    label: "Resolved",
    className: "text-green-600",
  },
} as const;

interface StatusIndicatorProps {
  status: IssueStatus;
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5", config.className, className)} role="status">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="text-xs font-medium">{config.label}</span>
    </div>
  );
}
