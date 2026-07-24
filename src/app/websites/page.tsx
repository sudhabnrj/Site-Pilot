"use client";

import { useState, useMemo, useEffect } from "react";
import { WebsiteCard, type WebsiteProperty } from "@/components/dashboard/website-card";
import { AiGrowthRecommendation } from "@/components/dashboard/ai-growth-recommendation";
import { AddWebsiteCard } from "@/components/dashboard/add-website-card";
import { LayoutGrid, List, Filter, Search, ChevronLeft, ChevronRight, Plus, Globe, Loader2, Lock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUserAudits, executeAudit, setCurrentReport } from "@/store/slices/audit-slice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function WebsitesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { reportsHistory, isAuditing } = useAppSelector((state) => state.audit);

  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Overall Score");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    dispatch(fetchUserAudits());
  }, [dispatch]);

  // Convert DB audit reports into unique WebsiteProperty cards
  const websites: WebsiteProperty[] = useMemo(() => {
    if (!reportsHistory || reportsHistory.length === 0) return [];

    const map = new Map<string, WebsiteProperty>();
    reportsHistory.forEach((rep) => {
      const cleanDom = rep.domain || rep.url.replace(/^(https?:\/\/)?(www\.)?/, "");
      if (!map.has(cleanDom)) {
        map.set(cleanDom, {
          id: rep._id || rep.url,
          name: cleanDom.split(".")[0].toUpperCase(),
          domain: cleanDom,
          score: rep.overallScore,
          status: "active",
          lastScan: rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : "Just now",
          image: rep.screenshotUrl || `https://image.thum.io/get/width/1200/crop/800/https://${cleanDom}`,
        });
      }
    });

    return Array.from(map.values());
  }, [reportsHistory]);

  // Handle Scan Refresh
  const handleRefresh = async (id: string) => {
    const site = websites.find((w) => w.id === id);
    if (!site) return;

    try {
      toast.loading(`Re-auditing ${site.domain}...`, { id: "refresh-audit" });
      await dispatch(executeAudit(`https://${site.domain}`)).unwrap();
      toast.dismiss("refresh-audit");
      toast.success(`Successfully updated ${site.domain} audit metrics!`);
    } catch (err: any) {
      toast.dismiss("refresh-audit");
      toast.error("Re-audit failed", { description: typeof err === "string" ? err : "Unable to complete scan." });
    }
  };

  // Handle View Report — navigate to dashboard and set current report
  const handleViewReport = (id: string) => {
    const report = reportsHistory.find((r) => r._id === id || r.url === id);
    if (report) {
      dispatch(setCurrentReport(report));
    }
    router.push("/");
  };

  // Handle Delete Website
  const handleDelete = async (id: string) => {
    const site = websites.find((w) => w.id === id);
    if (!site) return;
    if (!confirm(`Are you sure you want to delete ${site.domain}?`)) return;

    try {
      const res = await fetch(`/api/audit/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(`Deleted ${site.domain} from monitored websites.`);
        dispatch(fetchUserAudits());
      } else {
        toast.error("Failed to delete website.");
      }
    } catch {
      toast.error("Network error while deleting.");
    }
  };

  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const userPlan = isAdmin
    ? "enterprise"
    : user?.plan || (typeof window !== "undefined" ? (localStorage.getItem("user_plan") as any) : null) || "free";

  const maxSites = isAdmin ? 999 : userPlan === "enterprise" ? 999 : userPlan === "pro" ? 15 : userPlan === "starter" ? 3 : 1;

  // Handle Add Website
  const handleAddWebsite = async () => {
    if (!isAdmin && websites.length >= maxSites) {
      toast.error(`Website Limit Reached (${websites.length}/${maxSites})`, {
        description: `Your ${userPlan.toUpperCase()} plan is capped at ${maxSites} site(s). Upgrade your plan to add more properties!`,
      });
      router.push("/upgrade");
      return;
    }

    const targetUrl = prompt("Enter website URL to add & audit (e.g., https://example.com):");
    if (!targetUrl || !targetUrl.trim()) return;

    try {
      toast.loading(`Auditing and saving ${targetUrl}...`, { id: "add-audit" });
      await dispatch(executeAudit(targetUrl.trim())).unwrap();
      toast.dismiss("add-audit");
      toast.success("Website successfully added and audited!");
      router.push("/");
    } catch (err: any) {
      toast.dismiss("add-audit");
      toast.error("Failed to add website", { description: typeof err === "string" ? err : "Audit error." });
    }
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
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Monitored Websites
            </h2>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
              {websites.length}/{isAdmin ? "∞" : maxSites} Used ({userPlan} plan)
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time health monitoring and audit history for {websites.length} properties.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleAddWebsite}
            disabled={isAuditing}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isAuditing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Website
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 backdrop-blur rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-2xl">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-slate-700 dark:text-slate-100 placeholder-slate-400"
            placeholder="Filter by domain name..."
            type="text"
            aria-label="Filter websites"
          />
        </div>
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-0 py-0 cursor-pointer"
            aria-label="Filter by status"
          >
            <option className="dark:bg-slate-900 dark:text-white">All Statuses</option>
            <option className="dark:bg-slate-900 dark:text-white" value="active">Active</option>
            <option className="dark:bg-slate-900 dark:text-white" value="scanning">Scanning</option>
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

      {/* Empty State if no websites in DB */}
      {filteredWebsites.length === 0 && !isAuditing && (
        <div className="flex flex-col items-center justify-center p-12 bg-white/60 rounded-3xl border border-slate-200 text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Globe className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Monitored Websites Yet</h3>
          <p className="text-xs text-slate-500 max-w-md">
            Enter a URL in the header search bar above or click "Add Website" to run your first real audit scan and store it in MongoDB Atlas.
          </p>
          <button
            onClick={handleAddWebsite}
            className="mt-2 bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          >
            Audit First Website
          </button>
        </div>
      )}

      {/* Grid or List of Website Cards */}
      {filteredWebsites.length > 0 && (
        <AnimatePresence mode="popLayout">
          {viewMode === "grid" ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredWebsites.map((site, index) => {
                const isMasked = !isAdmin && index >= maxSites;

                if (isMasked) {
                  return (
                    <motion.div
                      layout
                      key={site.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="relative overflow-hidden rounded-[24px]"
                    >
                      <div className="filter blur-[5px] pointer-events-none select-none opacity-30">
                        <WebsiteCard website={site} />
                      </div>
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-950/75 backdrop-blur-md rounded-[24px] border border-amber-500/30 shadow-2xl">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 border border-amber-500/30 shadow-inner">
                          <Lock className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full mb-1.5">
                          Locked by {userPlan.toUpperCase()} Plan
                        </span>
                        <h4 className="text-sm font-extrabold text-white tracking-tight">
                          {site.domain}
                        </h4>
                        <p className="text-[11px] text-slate-300 max-w-xs mt-1 mb-3 leading-relaxed">
                          Your {userPlan.toUpperCase()} plan limit is {maxSites} site{maxSites > 1 ? "s" : ""}. Upgrade your plan to unlock full monitoring.
                        </p>
                        <button
                          onClick={() => router.push("/upgrade")}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Upgrade Plan</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                }

                return (
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
                      onDelete={handleDelete}
                      onViewReport={handleViewReport}
                    />
                  </motion.div>
                );
              })}
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
                    {filteredWebsites.map((site, index) => {
                      const isMasked = !isAdmin && index >= maxSites;
                      return (
                        <tr key={site.id} className={cn("transition-colors", isMasked ? "bg-slate-100/50 opacity-70" : "hover:bg-slate-50/50")}>
                          <td className="py-4 font-bold text-slate-800 pl-4 text-sm flex items-center gap-2">
                            {isMasked && <Lock className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                            <span>{site.name}</span>
                          </td>
                          <td className="py-4 text-xs font-semibold text-slate-500">
                            {isMasked ? `${site.domain.slice(0, 3)}***${site.domain.includes(".") ? site.domain.slice(site.domain.indexOf(".")) : ""}` : site.domain}
                          </td>
                          <td className={`py-4 font-black text-sm ${
                            isMasked ? "text-slate-400" : site.score >= 90 ? "text-emerald-600" : site.score >= 70 ? "text-amber-500" : "text-red-500"
                          }`}>{isMasked ? "--" : site.score}</td>
                          <td className="py-4 text-xs uppercase font-bold text-slate-600">
                            {isMasked ? (
                              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                Locked ({userPlan.toUpperCase()})
                              </span>
                            ) : site.status}
                          </td>
                          <td className="py-4 text-xs font-semibold text-slate-500">{site.lastScan}</td>
                          <td className="py-4 text-right pr-4">
                            {isMasked ? (
                              <button
                                onClick={() => router.push("/upgrade")}
                                className="text-xs font-bold text-amber-600 hover:underline active:scale-95 transition-all cursor-pointer"
                              >
                                Upgrade Plan
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRefresh(site.id)}
                                className="text-xs font-bold text-blue-600 hover:underline active:scale-95 transition-all cursor-pointer"
                              >
                                Refresh Scan
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* AI Insight Section (Premium Banner) */}
      <AiGrowthRecommendation
        title="AI Growth Recommendation"
        description="We've analyzed your audited website properties. Optimizing hero media assets and enabling HTTP/2 multi-threading will elevate performance scores."
        tags={["Performance", "Optimization"]}
        onAction={() => router.push("/performance")}
      />

      {/* Pagination / Footer */}
      <footer className="flex justify-between items-center border-t border-slate-100 pt-8 mt-4">
        <p className="text-xs font-bold text-slate-400">
          Showing {filteredWebsites.length} of {websites.length} websites
        </p>
      </footer>
    </div>
  );
}
