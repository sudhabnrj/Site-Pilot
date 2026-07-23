"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Globe, Calendar, Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReportsFiltersProps {
  websites: string[];
  onApplyFilters?: (filters: { website: string; dateRange: string }) => void;
}

export function ReportsFilters({ websites, onApplyFilters }: ReportsFiltersProps) {
  const [selectedWebsite, setSelectedWebsite] = useState("All Websites");
  const [dateRange, setDateRange] = useState("");

  const handleApply = () => {
    onApplyFilters?.({ website: selectedWebsite, dateRange });
  };

  return (
    <GlassCard className="p-6 flex flex-wrap items-center gap-4 rounded-3xl border-slate-200 shadow-sm">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">
          Website Filter
        </label>
        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
          <select
            value={selectedWebsite}
            onChange={(e) => setSelectedWebsite(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            aria-label="Select website"
          >
            <option>All Websites</option>
            {websites.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">
          Date Range
        </label>
        <div className="relative">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
          <input
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="Last 30 days"
            type="text"
            aria-label="Filter by date range"
          />
        </div>
      </div>

      <div className="flex gap-2 self-end mt-2 md:mt-0 shrink-0">
        <button
          onClick={() => {
            setSelectedWebsite("All Websites");
            setDateRange("");
            onApplyFilters?.({ website: "All Websites", dateRange: "" });
            toast.success("Filters Cleared", { description: "Reset all website filters to default." });
          }}
          className="p-2.5 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 active:scale-95 transition-all text-slate-500 hover:text-slate-800 shadow-sm cursor-pointer"
          title="Reset filters"
          aria-label="Reset filters"
        >
          <Filter className="h-4 w-4" />
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          Apply Filters
        </button>
      </div>
    </GlassCard>
  );
}
