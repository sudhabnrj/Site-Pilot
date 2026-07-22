"use client";

import { useState, useMemo } from "react";
import { WebsiteCard, type WebsiteProperty } from "@/components/dashboard/website-card";
import { AiGrowthRecommendation } from "@/components/dashboard/ai-growth-recommendation";
import { AddWebsiteCard } from "@/components/dashboard/add-website-card";
import { LayoutGrid, List, Filter, Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_WEBSITES: WebsiteProperty[] = [
  {
    id: "web-1",
    name: "Nova Motors",
    domain: "novamotors.com",
    score: 94,
    status: "active",
    lastScan: "2 hours ago",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE6_d3i8Ttlvx6RW7P79cHLoSIsxXgywKt5fOy6bzclg2oTHk1tI2GumoCP3TaoDbxsRO0zbReM9ldLlLCqKuqng1cyGjPLH0qAK6fw0ChkFmaQyseH3Kd48LeEG2XB8ycqhssCYg3CSNbXIdePk72XlFFRSxl71SMPEgtgFaTT_VD6s8ec9RAek8tGkWm1DIXsrxcc0W2q_eNIA2bRHDZ5LmW89kZX1gsf_C0TBkC2aa1hl074LYPbQ",
  },
  {
    id: "web-2",
    name: "Aether Decor",
    domain: "aetherdecor.store",
    score: 82,
    status: "scanning",
    lastScan: "In progress...",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUFyyFvBo5-CgDNo9JM7IQcRTo1jxB4tCfVFVb1MHdpdf7Hlb0u7Rmf3THuB4SWxoPQRBO76ZVKVDlnHkfDF2me2euStsj02ZXg2Nrkq9UYHP6eAeoutN3Q05S1XNvbcqUKSHUJaGSmkC3g_pxC6d6OMVpC1BmPfbL_bqtOg8bqU_K070xJU6Z3-OGK7g4r8eJJ4td5XT2kpd72_JGbzVLDbKibWP6h1q5zxhy5oSdYV0wg_ZuZocxbw",
  },
  {
    id: "web-3",
    name: "Vivid Studio",
    domain: "vivid-studio.io",
    score: 56,
    status: "active",
    lastScan: "May 24, 2026",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_aLlYnGDxO8afLuaXoFHjv5qXrRijpk6op2opyDdJeHbALARBSeEcK0-QGSjUv5UIafTbZaYXJEyi6sWTsRORJ0k4y8Lj-KfWzidtDNOklzfRJBlbhu2jwWsVGNGaJS2Ea5eiK6hG7HhKt08-jmn6lDGIwuQlQmNVzviSb-n_TgVqoAS9GSmzi0lBXQz_Cga1Z0KyC7EDr2Q5qjqk5xZYg2E_zSoyQFV60w_N3pVMq68UiDeCiMkUGA",
  },
  {
    id: "web-4",
    name: "Cura Health",
    domain: "cura.health",
    score: 91,
    status: "active",
    lastScan: "1 day ago",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeafTU-sY8US7D-34bTc9OmS-MEhN-NyH4GHrG9MKDzdfo7fi4U4-XiRykmYW364weoR_0xZrH9dEqdMgqQTJtUIqruMtw6l2rHsBt1RtujpDaa9CTqFu0PHEQHYW4lpmkAbkmZDXLl_JxONDWYiUw7ocQ1l72J_PBIkTHXTINimvNl1wZI1oMxGB_wxmJWv2ZDAp3bGgGY7A1Lthw_LXnZAYinOPyNwtLWfaOvz410EPpz9Br7H1Eig",
  },
  {
    id: "web-5",
    name: "SkyNet Cloud",
    domain: "skynet-cloud.com",
    score: 78,
    status: "active",
    lastScan: "May 21, 2026",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkDpi1Jj4VqxTbyycLXO7pwC5bO_VbADBhHXouVIyzIJLgCh00mpHn7Dhn1QH0T0enhO9cINofguFu_Pt-SSDvwRkFOFkNl-hddwcGQn1cJRjfvva7J71ZiuP_RJI5uEcexPOyH1kNqDW8oUFAa7rgiZV-iOoJmwwX3ymzR2Mh42VYz26kMwlIDyHgJo8E0eO-li9KRFTOUUH7iTB2qmW39V9E_dMevaFLx4p_J82An262DxHsjsXt7A",
  },
];

const PRESETS = [
  { name: "Alpha Devs", domain: "alphadevs.io", score: 85, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE6_d3i8Ttlvx6RW7P79cHLoSIsxXgywKt5fOy6bzclg2oTHk1tI2GumoCP3TaoDbxsRO0zbReM9ldLlLCqKuqng1cyGjPLH0qAK6fw0ChkFmaQyseH3Kd48LeEG2XB8ycqhssCYg3CSNbXIdePk72XlFFRSxl71SMPEgtgFaTT_VD6s8ec9RAek8tGkWm1DIXsrxcc0W2q_eNIA2bRHDZ5LmW89kZX1gsf_C0TBkC2aa1hl074LYPbQ" },
  { name: "Stellar App", domain: "stellarapp.com", score: 96, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUFyyFvBo5-CgDNo9JM7IQcRTo1jxB4tCfVFVb1MHdpdf7Hlb0u7Rmf3THuB4SWxoPQRBO76ZVKVDlnHkfDF2me2euStsj02ZXg2Nrkq9UYHP6eAeoutN3Q05S1XNvbcqUKSHUJaGSmkC3g_pxC6d6OMVpC1BmPfbL_bqtOg8bqU_K070xJU6Z3-OGK7g4r8eJJ4td5XT2kpd72_JGbzVLDbKibWP6h1q5zxhy5oSdYV0wg_ZuZocxbw" },
  { name: "Design Labs", domain: "designlabs.agency", score: 68, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_aLlYnGDxO8afLuaXoFHjv5qXrRijpk6op2opyDdJeHbALARBSeEcK0-QGSjUv5UIafTbZaYXJEyi6sWTsRORJ0k4y8Lj-KfWzidtDNOklzfRJBlbhu2jwWsVGNGaJS2Ea5eiK6hG7HhKt08-jmn6lDGIwuQlQmNVzviSb-n_TgVqoAS9GSmzi0lBXQz_Cga1Z0KyC7EDr2Q5qjqk5xZYg2E_zSoyQFV60w_N3pVMq68UiDeCiMkUGA" },
];

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<WebsiteProperty[]>(INITIAL_WEBSITES);
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Overall Score");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Handle Scan Refresh Simulation
  const handleRefresh = (id: string) => {
    setWebsites((prev) =>
      prev.map((site) =>
        site.id === id
          ? { ...site, status: "scanning", lastScan: "Scanning..." }
          : site
      )
    );

    setTimeout(() => {
      setWebsites((prev) =>
        prev.map((site) =>
          site.id === id
            ? {
                ...site,
                status: "active",
                score: Math.min(100, Math.max(40, site.score + Math.floor(Math.random() * 9) - 4)),
                lastScan: "Just now",
              }
            : site
        )
      );
    }, 2500);
  };

  // Handle Stop Scan Simulation
  const handleStop = (id: string) => {
    setWebsites((prev) =>
      prev.map((site) =>
        site.id === id
          ? { ...site, status: "active", lastScan: "Scan interrupted" }
          : site
      )
    );
  };

  // Handle Add Website Simulation
  const handleAddWebsite = () => {
    const preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    const newSite: WebsiteProperty = {
      id: `web-${Date.now()}`,
      name: preset.name,
      domain: preset.domain,
      score: preset.score,
      status: "active",
      lastScan: "Never scanned",
      image: preset.img,
    };
    setWebsites((prev) => [...prev, newSite]);
  };

  // Filter & Sort Logic
  const filteredWebsites = useMemo(() => {
    let result = websites.filter((site) => {
      const matchesSearch =
        site.name.toLowerCase().includes(filterText.toLowerCase()) ||
        site.domain.toLowerCase().includes(filterText.toLowerCase());

      const matchesStatus =
        statusFilter === "All Statuses" ||
        site.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    if (sortBy === "Overall Score") {
      result.sort((a, b) => b.score - a.score);
    } else if (sortBy === "Alphabetic") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [websites, filterText, statusFilter, sortBy]);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Monitored Websites
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time health monitoring for {websites.length} active properties.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 border border-slate-200/60 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleAddWebsite}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Website
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white/80 border border-slate-200/60 backdrop-blur rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-slate-700 placeholder-slate-400"
            placeholder="Filter by domain or tag..."
            type="text"
            aria-label="Filter websites"
          />
        </div>
        <div className="h-6 w-px bg-slate-200 hidden md:block" />
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none focus:ring-0 py-0 cursor-pointer"
            aria-label="Filter by status"
          >
            <option>All Statuses</option>
            <option value="active">Active</option>
            <option value="scanning">Scanning</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <div className="h-6 w-px bg-slate-200 hidden md:block" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none focus:ring-0 py-0 cursor-pointer"
            aria-label="Sort websites"
          >
            <option>Overall Score</option>
            <option>Alphabetic</option>
          </select>
        </div>
      </div>

      {/* Grid or List of Website Cards */}
      <AnimatePresence mode="popLayout">
        {viewMode === "grid" ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredWebsites.map((site) => (
              <motion.div
                layout
                key={site.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <WebsiteCard
                  website={site}
                  onRefresh={handleRefresh}
                  onStop={handleStop}
                />
              </motion.div>
            ))}
            <motion.div layout>
              <AddWebsiteCard onClick={handleAddWebsite} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="flex flex-col gap-3 bg-white/80 border border-slate-200/50 backdrop-blur p-4 rounded-[24px] shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 pb-3">
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-4">Property</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domain</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Scan</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredWebsites.map((site) => (
                    <tr key={site.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-bold text-slate-800 pl-4 text-sm">{site.name}</td>
                      <td className="py-4 text-xs font-semibold text-slate-500">{site.domain}</td>
                      <td className={`py-4 font-black text-sm ${
                        site.score >= 90 ? "text-emerald-600" : site.score >= 70 ? "text-amber-500" : "text-red-500"
                      }`}>{site.score}</td>
                      <td className="py-4 text-xs uppercase font-bold text-slate-600">{site.status}</td>
                      <td className="py-4 text-xs font-semibold text-slate-500">{site.lastScan}</td>
                      <td className="py-4 text-right pr-4">
                        <button
                          onClick={() => handleRefresh(site.id)}
                          className="text-xs font-bold text-blue-600 hover:underline active:scale-95 transition-all"
                        >
                          Refresh Scan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insight Section (Premium Banner) */}
      <AiGrowthRecommendation
        title="AI Growth Recommendation"
        description="We've identified a common performance bottleneck across 4 of your properties. Updating your CDN configuration could improve LCP scores by an average of 18%."
        tags={["Performance", "Optimization"]}
        onAction={() => alert("Detailed insight scanner report compiled successfully.")}
      />

      {/* Pagination / Footer */}
      <footer className="flex justify-between items-center border-t border-slate-100 pt-8 mt-4">
        <p className="text-xs font-bold text-slate-400">
          Showing {filteredWebsites.length} of {websites.length} websites
        </p>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all active:scale-95">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs active:scale-95 shadow">1</button>
          <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs transition-all active:scale-95">2</button>
          <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all active:scale-95">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
