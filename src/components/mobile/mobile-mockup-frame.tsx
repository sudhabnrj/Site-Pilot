"use client";

import { Wifi, Signal, Battery } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMockupFrameProps {
  activeAnnotation?: number | null;
  onSelectAnnotation?: (num: number) => void;
}

export function MobileMockupFrame({
  activeAnnotation = null,
  onSelectAnnotation,
}: MobileMockupFrameProps) {
  const renderPulse = (num: number, title: string, customClass: string) => {
    const isActive = activeAnnotation === num;
    return (
      <button
        onClick={() => onSelectAnnotation?.(num)}
        className={cn(
          "absolute w-6 h-6 bg-red-600 border border-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-black z-20 transition-all duration-300 hover:scale-115 cursor-pointer shadow-md select-none",
          isActive ? "scale-115 ring-4 ring-red-400/50 shadow-lg shadow-red-500/30" : "",
          customClass
        )}
        title={title}
        aria-label={`Annotation ${num}: ${title}`}
      >
        <span>{num}</span>
        <span className="absolute inset-0 border border-red-500 rounded-full animate-ping opacity-75 pointer-events-none" />
      </button>
    );
  };

  return (
    <div className="border-[12px] border-slate-800 rounded-[40px] shadow-2xl w-[280px] h-[520px] bg-white overflow-hidden relative select-none shrink-0">
      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 w-full h-7 bg-white/90 border-b border-slate-100 flex justify-between px-6 items-center z-30 select-none">
        <span className="text-[10px] font-black text-slate-700">9:41</span>
        <div className="flex gap-1.5 items-center text-slate-700">
          <Signal className="h-2.5 w-2.5" />
          <Wifi className="h-2.5 w-2.5" />
          <Battery className="h-3 w-3" />
        </div>
      </div>

      {/* Simulated Device Content */}
      <div className="h-full w-full bg-white overflow-y-auto pt-7 select-none">
        {/* Header */}
        <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/50">
          <div className="w-16 h-3 bg-slate-200 rounded" />
          <div className="w-6 h-6 bg-slate-200 rounded-lg" />
        </div>

        {/* Hero Banner Section */}
        <div className="p-4 space-y-3 relative">
          <div className="w-full h-32 bg-slate-100 border border-slate-200/80 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 to-slate-200/20" />
            {/* Annotation 2: Overflow / Content wider than screen */}
            <div className="absolute top-1/2 -right-5 w-12 h-12 border border-red-400 border-dashed bg-red-50/30 rounded-lg" />
            {renderPulse(2, "Content wider than screen", "top-1/2 -translate-y-1/2 -right-2")}
          </div>
          <div className="w-3/4 h-5 bg-slate-800 rounded" />
          <div className="w-full h-2.5 bg-slate-200 rounded" />
          <div className="w-full h-2.5 bg-slate-200 rounded" />
        </div>

        {/* Buttons (Too Close) */}
        <div className="p-4 flex gap-1.5 relative mt-2">
          <div className="flex-1 h-9 bg-blue-600 rounded-lg shadow-sm" />
          <div className="flex-1 h-9 bg-slate-100 border border-slate-200 rounded-lg" />
          {/* Annotation 1: Tap Targets Too Close */}
          {renderPulse(1, "Tap targets too close", "-top-2 left-1/2 -translate-x-1/2")}
        </div>

        {/* Footer (Text Too Small) */}
        <div className="mt-8 p-4 border-t border-slate-100 bg-slate-50/80 h-32 relative">
          <div className="space-y-2">
            <div className="w-1/2 h-2 bg-slate-400/30 rounded" />
            <div className="w-1/3 h-2 bg-slate-400/30 rounded" />
            {/* Annotation 3: Text Too Small */}
            {renderPulse(3, "Text too small", "bottom-8 right-6")}
          </div>
        </div>
      </div>
    </div>
  );
}
