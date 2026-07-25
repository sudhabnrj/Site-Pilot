"use client";

import { useState } from "react";
import {
  Layers,
  Flame,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { DesignAuditReportItem } from "@/types/design-audit";

interface VisualDiffViewerProps {
  report: DesignAuditReportItem;
}

export function VisualDiffViewer({ report }: VisualDiffViewerProps) {
  const [activeTab, setActiveTab] = useState<"slider" | "diff" | "heatmap">("slider");
  const [activeViewport, setActiveViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sliderPosition, setSliderPosition] = useState(50); // 0% to 100%

  // Get current viewport screenshot or fallback to report data URIs
  const websiteScreenshot =
    report.websiteScreenshots?.[activeViewport] ||
    report.websiteScreenshots?.desktop ||
    report.diffScreenshot ||
    "";

  const designSourceImage = report.uploadedScreenshot || report.diffScreenshot || websiteScreenshot;

  // Viewport dimensions & aspect ratio classes
  const getContainerStyle = () => {
    if (activeViewport === "mobile") {
      return "max-w-[380px] mx-auto aspect-[9/18] rounded-[36px] border-[8px] border-slate-800 shadow-2xl";
    }
    if (activeViewport === "tablet") {
      return "max-w-[680px] mx-auto aspect-[3/4] rounded-[28px] border-[6px] border-slate-800 shadow-xl";
    }
    return "w-full aspect-[16/10] rounded-2xl border border-slate-800 shadow-lg";
  };

  const getViewportLabel = () => {
    if (activeViewport === "mobile") return "Mobile Viewport (375 × 812px)";
    if (activeViewport === "tablet") return "Tablet Viewport (768 × 1024px)";
    return "Desktop Viewport (1440 × 900px)";
  };

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm">
      {/* Control Bar Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Visual Pixel Comparison Studio
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Active Viewport: <strong className="text-blue-600 dark:text-blue-400">{getViewportLabel()}</strong>
          </p>
        </div>

        {/* Viewport Switcher & Diff Mode Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Viewports */}
          <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 select-none">
            <button
              onClick={() => setActiveViewport("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeViewport === "desktop"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Desktop</span>
            </button>

            <button
              onClick={() => setActiveViewport("tablet")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeViewport === "tablet"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
              <span>Tablet</span>
            </button>

            <button
              onClick={() => setActiveViewport("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeViewport === "mobile"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 select-none">
            <button
              onClick={() => setActiveTab("slider")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "slider"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Split Slider</span>
            </button>
            <button
              onClick={() => setActiveTab("diff")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "diff"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Diff Mask</span>
            </button>
            <button
              onClick={() => setActiveTab("heatmap")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "heatmap"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Heatmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Comparison Display */}
      <div className={`relative overflow-hidden bg-slate-950 flex items-center justify-center transition-all duration-300 ${getContainerStyle()}`}>
        {/* Mode 1: Interactive Split Slider */}
        {activeTab === "slider" && (
          <div className="relative w-full h-full select-none overflow-hidden group">
            {/* Live Website Layer (Right / Background) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={websiteScreenshot}
              alt="Live Website Capture"
              className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
            />

            {/* Design Source Layer (Left / Foreground Clipped) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden border-r border-blue-500/50"
              style={{ width: `${sliderPosition}%` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={designSourceImage}
                alt="Figma Design Source"
                className="absolute inset-0 max-w-none h-full object-cover object-top"
                style={{ width: "100%", minWidth: "100%" }}
              />
            </div>

            {/* Slider Handle Divider */}
            <div
              className="absolute inset-y-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] cursor-ew-resize flex items-center justify-center z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center text-xs font-black shadow-lg">
                ↔
              </div>
            </div>

            {/* Slider Input overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
            />

            {/* Labels overlay */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 shadow-md">
              Figma Design ({sliderPosition}%)
            </div>
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 shadow-md">
              Live Website ({100 - sliderPosition}%)
            </div>
          </div>
        )}

        {/* Mode 2: Diff Highlight Overlay */}
        {activeTab === "diff" && (
          <div className="relative w-full h-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={report.diffScreenshot || websiteScreenshot}
              alt="Pixel Diff Highlight Mask"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold border border-white/10 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span>Highlights changed bounding boxes &amp; style deltas</span>
            </div>
          </div>
        )}

        {/* Mode 3: Intensity Heatmap */}
        {activeTab === "heatmap" && (
          <div className="relative w-full h-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={report.heatmapScreenshot || websiteScreenshot}
              alt="Visual Variance Heatmap"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold border border-white/10 flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500 animate-bounce" />
              <span>Red/Orange regions indicate maximum visual mismatch density</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
