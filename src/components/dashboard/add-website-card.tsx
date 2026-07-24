"use client";

import { Plus } from "lucide-react";

interface AddWebsiteCardProps {
  onClick?: () => void;
}

export function AddWebsiteCard({ onClick }: AddWebsiteCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-4 rounded-[24px] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 min-h-[300px] transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/60 hover:border-blue-400 dark:hover:border-blue-500 group active:scale-98 cursor-pointer w-full"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-300 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 shadow-sm">
        <Plus className="h-6 w-6" />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-slate-800 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
          Add New Website
        </p>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-400 mt-1">
          Connect your next project
        </p>
      </div>
    </button>
  );
}
