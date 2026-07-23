"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { ExternalLink, AlertTriangle, Eye, X, Maximize2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface WebsitePreviewProps {
  url?: string;
  screenshotUrl?: string;
  lastScan?: string;
  className?: string;
}

export function WebsitePreview({
  url = "example.com",
  screenshotUrl,
  lastScan = "2 minutes ago",
  className,
}: WebsitePreviewProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const cleanDomain = url.replace(/^(https?:\/\/)?(www\.)?/, "");
  const targetUrl = url.startsWith("http") ? url : `https://${url}`;
  
  // Primary screenshot URL using thum.io, fallback to microlink api
  const computedScreenshot = screenshotUrl || `https://image.thum.io/get/width/1200/crop/800/${targetUrl}`;

  return (
    <>
      <GlassCard className={cn("flex flex-col", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold tracking-tight truncate">
            Preview: {cleanDomain}
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            Live DOM
          </span>
        </div>

        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative min-h-[250px] flex-1 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 group cursor-pointer shadow-inner"
        >
          {/* Main Website Screenshot */}
          {!imgError ? (
            <img
              src={computedScreenshot}
              alt={`Screenshot of ${cleanDomain}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={cn(
                "w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105",
                !imgLoaded && "opacity-0"
              )}
            />
          ) : (
            /* Fallback Graphic UI Mockup if image blocked */
            <div className="flex flex-col h-full w-full bg-slate-900 text-white p-4">
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-slate-400 ml-2 font-mono truncate">{targetUrl}</span>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center gap-2 p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                  <Maximize2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">{cleanDomain}</h4>
                <p className="text-xs text-slate-400 max-w-xs">Click to view full snapshot in lightbox viewer</p>
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
            <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5" />
              Open Lightbox
            </span>
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
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline cursor-pointer"
          >
            View Full Snapshot
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </GlassCard>

      {/* Lightbox Snapshot Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-md"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-xs">
                    {cleanDomain.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{cleanDomain}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{targetUrl}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    Visit Website
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content - High Res Snapshot */}
              <div className="flex-1 overflow-auto bg-slate-950 p-6 flex justify-center items-start">
                <img
                  src={computedScreenshot}
                  alt={`Full snapshot of ${cleanDomain}`}
                  className="w-full max-w-4xl rounded-2xl border border-slate-800 shadow-2xl object-contain"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900 px-6 py-3 text-xs text-slate-400">
                <span>Audited Timestamp: {lastScan}</span>
                <span className="text-emerald-400 font-semibold">100% High-Def Visual Snapshot</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
