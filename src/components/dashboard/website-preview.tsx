import { GlassCard } from "@/components/ui/glass-card";
import { ExternalLink, AlertTriangle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface WebsitePreviewProps {
  url?: string;
  lastScan?: string;
  className?: string;
}

export function WebsitePreview({
  url = "example.com",
  lastScan = "2 minutes ago",
  className,
}: WebsitePreviewProps) {
  return (
    <GlassCard className={cn("flex flex-col", className)}>
      <h3 className="mb-4 text-xl font-semibold tracking-tight">
        Preview: {url}
      </h3>

      <div className="relative min-h-[250px] flex-1 overflow-hidden rounded-xl border border-border/50 bg-slate-100">
        {/* Placeholder for website screenshot */}
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <span className="text-sm">Website screenshot preview</span>
        </div>

        {/* Issue overlay markers */}
        <div className="absolute left-1/3 top-1/4 flex h-8 w-8 animate-pulse items-center justify-center rounded-full border-4 border-white bg-red-500 text-white shadow-lg">
          <AlertTriangle className="h-3.5 w-3.5" aria-label="Critical issue detected" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white shadow-lg">
          <Eye className="h-3 w-3" aria-label="Warning detected" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs italic text-muted-foreground">
          Last scan: {lastScan}
        </span>
        <button className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline">
          View Full Snapshot
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </GlassCard>
  );
}
