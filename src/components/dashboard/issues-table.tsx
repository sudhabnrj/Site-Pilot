import { GlassCard } from "@/components/ui/glass-card";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Download } from "lucide-react";
import type { AuditIssue } from "@/types/dashboard";
import { ISSUES_TABLE_COLUMNS } from "@/constants/dashboard";
import { cn } from "@/lib/utils";

interface IssuesTableProps {
  issues: AuditIssue[];
  className?: string;
}

const impactColorMap: Record<string, string> = {
  Performance: "text-red-600",
  SEO: "text-orange-600",
  Accessibility: "text-muted-foreground",
};

export function IssuesTable({ issues, className }: IssuesTableProps) {
  return (
    <GlassCard className={cn("overflow-hidden p-0", className)}>
      <div className="flex items-center justify-between border-b border-border/50 p-6">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Identified Issues</h3>
          <p className="text-sm text-muted-foreground">
            Breakdown of performance and technical debt.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 shadow-sm">
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-border/50 bg-slate-50/50">
            <tr>
              {ISSUES_TABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {issues.map((issue) => (
              <tr
                key={issue.id}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4">
                  <SeverityBadge level={issue.priority} />
                </td>
                <td className="px-6 py-4 text-sm">{issue.category}</td>
                <td className="px-6 py-4 text-sm font-semibold">{issue.issue}</td>
                <td className="px-6 py-4 text-sm font-medium text-blue-600">
                  {issue.page}
                </td>
                <td
                  className={cn(
                    "px-6 py-4 text-sm font-medium",
                    impactColorMap[issue.category] ?? "text-muted-foreground"
                  )}
                >
                  {issue.impact}
                </td>
                <td className="px-6 py-4">
                  <StatusIndicator status={issue.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
