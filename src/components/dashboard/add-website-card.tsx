"use client";

import { Plus } from "lucide-react";

interface AddWebsiteCardProps {
  onClick?: () => void;
}

export function AddWebsiteCard({ onClick }: AddWebsiteCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-4 rounded-[24px] border-2 border-dashed border-slate-200 bg-white/40 p-6 min-h-[300px] transition-all hover:bg-slate-50/80 hover:border-blue-400 group active:scale-98"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 shadow-sm">
        <Plus className="h-6 w-6" />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-600">
          Add New Website
        </p>
        <p className="text-xs font-medium text-slate-400 mt-1">
          Connect your next project
        </p>
      </div>
    </button>
  );
}
