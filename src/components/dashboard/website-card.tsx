"use client";

import { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { RefreshCw, MoreVertical, Square, ExternalLink, Trash2, BarChart3 } from "lucide-react";
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
  onDelete?: (id: string) => void;
  onViewReport?: (id: string) => void;
}

export function WebsiteCard({ website, onRefresh, onMore, onStop, onDelete, onViewReport }: WebsiteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

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
          src={website.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop"}
          alt={`Mockup for ${website.name}`}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop";
          }}
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
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors active:scale-95 cursor-pointer"
            aria-label="Stop scan"
          >
            <Square className="h-4 w-4 fill-slate-500 stroke-none" />
          </button>
        ) : (
          <button
            onClick={() => onRefresh?.(website.id)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors active:scale-95 cursor-pointer"
            aria-label="Refresh scan"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}

        {/* Three-dots menu with dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors active:scale-95 cursor-pointer"
            aria-label="More actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                onClick={() => {
                  window.open(`https://${website.domain}`, "_blank");
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                Visit Website
              </button>
              <button
                onClick={() => {
                  onViewReport?.(website.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <BarChart3 className="h-3.5 w-3.5 text-slate-400" />
                View Audit Report
              </button>
              <button
                onClick={() => {
                  onRefresh?.(website.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                Re-Scan Website
              </button>
              <div className="border-t border-slate-100" />
              <button
                onClick={() => {
                  onDelete?.(website.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Website
              </button>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
