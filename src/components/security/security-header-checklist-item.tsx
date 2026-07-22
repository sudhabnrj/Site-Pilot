"use client";

import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityHeaderChecklistItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  statusText: string;
}

export function SecurityHeaderChecklistItem({
  icon: Icon,
  title,
  description,
  statusText,
}: SecurityHeaderChecklistItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/40 hover:border-blue-200 rounded-xl transition-all duration-200 select-none group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform duration-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 leading-none">{title}</h4>
          <p className="text-xs font-semibold text-slate-400 mt-1.5 leading-none">
            {description}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase select-none shadow-sm shrink-0">
        <Check className="h-3 w-3 text-emerald-600" />
        <span>{statusText}</span>
      </div>
    </div>
  );
}
