"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "primary" | "secondary";
  onAction?: () => void;
}

export function SecurityActionCard({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonVariant = "primary",
  onAction,
}: SecurityActionCardProps) {
  return (
    <GlassCard className="p-6 rounded-[24px] border-slate-200/80 shadow-sm bg-white/70 flex gap-5 items-start">
      <div className="w-12 h-12 bg-blue-50 border border-blue-100/50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800 tracking-tight mb-1">{title}</h4>
        <p className="text-xs font-semibold text-slate-400 mb-4 leading-relaxed">
          {description}
        </p>
        <button
          onClick={onAction}
          className={cn(
            "px-4 py-2 rounded-xl text-[10px] font-black tracking-wide uppercase transition-all duration-200 active:scale-95 shadow-sm select-none border",
            buttonVariant === "primary"
              ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
          )}
        >
          {buttonText}
        </button>
      </div>
    </GlassCard>
  );
}
