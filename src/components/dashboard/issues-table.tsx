import { GlassCard } from "@/components/ui/glass-card";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Download } from "lucide-react";
import type { AuditIssue } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAppSelector } from "@/store";

interface IssuesTableProps {
  issues: AuditIssue[];
  className?: string;
}

const impactColorMap: Record<string, string> = {
  Performance: "text-red-600",
  SEO: "text-orange-600",
  Accessibility: "text-muted-foreground",
  Security: "text-indigo-600",
  General: "text-slate-600",
};

const TABLE_COLUMNS = [
  { key: "priority", label: "Priority" },
  { key: "category", label: "Category" },
  { key: "issue", label: "Issue" },
  { key: "page", label: "Page" },
  { key: "impact", label: "Impact" },
];

export function IssuesTable({ issues, className }: IssuesTableProps) {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const userPlan = isAdmin
    ? "enterprise"
    : user?.plan || (typeof window !== "undefined" ? (localStorage.getItem("user_plan") as any) : null) || "starter";

  const handleExportCsv = () => {
    if (!isAdmin && userPlan === "starter") {
      toast.error("Professional Feature Locked", {
        description: "Exporting audit data to CSV requires a Pro or Enterprise subscription. Upgrade now to export!",
      });
      if (typeof window !== "undefined") {
        window.location.href = "/upgrade";
      }
      return;
    }

    if (!issues.length) return;
    const header = "Priority,Category,Issue,Page,Impact";
    const rows = issues.map(
      (i) => `${i.priority},${i.category},"${i.issue}",${i.page},${i.impact}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `site_pilot_issues_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV Exported", { description: `${issues.length} issues exported.` });
  };

  return (
    <GlassCard className={cn("overflow-hidden p-0", className)}>
      <div className="flex items-center justify-between border-b border-border/50 p-6">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Identified Issues</h3>
          <p className="text-sm text-muted-foreground">
            {issues.length} issues found across all audit categories.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 shadow-sm cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-border/50 bg-slate-50/50">
            <tr>
              {TABLE_COLUMNS.map((col) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
