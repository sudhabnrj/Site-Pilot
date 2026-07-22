"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { RefreshCw, MoreVertical, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WebsiteProperty {
  id: string;
  name: string;
  domain: string;
  score: number;
  status: "active" | "scanning" | "offline";
  lastScan: string;
  image: string;
}

interface WebsiteCardProps {
  website: WebsiteProperty;
  onRefresh?: (id: string) => void;
  onMore?: (id: string) => void;
  onStop?: (id: string) => void;
}

export function WebsiteCard({ website, onRefresh, onMore, onStop }: WebsiteCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };

  const getStatusBadge = (status: "active" | "scanning" | "offline") => {
    switch (status) {
      case "active":
        return (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-slate-700">Active</span>
          </div>
        );
      case "scanning":
        return (
          <div className="absolute top-3 left-3 bg-blue-50/95 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
            <RefreshCw className="h-3 w-3 text-blue-600 animate-spin" />
            <span className="text-[10px] uppercase font-bold text-blue-700">Scanning</span>
          </div>
        );
      case "offline":
        return (
          <div className="absolute top-3 left-3 bg-slate-100/90 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Offline</span>
          </div>
        );
    }
  };

  return (
    <GlassCard className="flex flex-col group p-4 transition-all duration-300 rounded-[24px]">
      <div className="relative h-40 rounded-xl overflow-hidden mb-4 border border-slate-200 bg-slate-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={website.image}
          alt={`Mockup for ${website.name}`}
        />
        {getStatusBadge(website.status)}
      </div>

      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {website.name}
          </h3>
          <p className="text-xs font-medium text-muted-foreground truncate">
            {website.domain}
          </p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className={cn("text-2xl font-black leading-none", getScoreColor(website.score))}>
            {website.score}
          </span>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
            Score
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Last Scan
          </p>
          <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">
            {website.lastScan}
          </p>
        </div>

        {website.status === "scanning" ? (
          <button
            onClick={() => onStop?.(website.id)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors active:scale-95"
            aria-label="Stop scan"
          >
            <Square className="h-4 w-4 fill-slate-500 stroke-none" />
          </button>
        ) : (
          <button
            onClick={() => onRefresh?.(website.id)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors active:scale-95"
            aria-label="Refresh scan"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={() => onMore?.(website.id)}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors active:scale-95"
          aria-label="More actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </GlassCard>
  );
}
