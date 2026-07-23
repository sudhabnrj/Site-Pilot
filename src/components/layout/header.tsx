"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Globe, Bell, Moon, Sun, Menu, ChevronDown, Plus, LogOut, User, Settings, CreditCard, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/auth-slice";
import { executeAudit, setCurrentReport } from "@/store/slices/audit-slice";
import { toast } from "sonner";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  className?: string;
}

export function Header({ onMobileMenuToggle, className }: HeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { isAuditing, reportsHistory, currentReport } = useAppSelector((state) => state.audit);

  // Dynamic website list from DB audit reports
  const websiteList = useMemo(() => {
    const list = reportsHistory.map((r) => r.url || `https://${r.domain}`);
    return Array.from(new Set(list.length > 0 ? list : ["https://example.com"]));
  }, [reportsHistory]);

  const [selectedWebsite, setSelectedWebsite] = useState<string>(
    currentReport?.url || websiteList[0] || "https://example.com"
  );
  const [auditUrl, setAuditUrl] = useState<string>(
    currentReport?.url || websiteList[0] || "https://example.com"
  );
  const [isWebsitesOpen, setIsWebsitesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  const websiteRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sync selected website and input URL when currentReport changes
  useEffect(() => {
    if (currentReport?.url) {
      setSelectedWebsite(currentReport.url);
      setAuditUrl(currentReport.url);
    }
  }, [currentReport]);

  const handleSelectWebsite = (siteUrl: string) => {
    setSelectedWebsite(siteUrl);
    setAuditUrl(siteUrl);
    setIsWebsitesOpen(false);

    // Find and set current report in store
    const foundReport = reportsHistory.find(
      (r) => r.url === siteUrl || `https://${r.domain}` === siteUrl || r.domain === siteUrl
    );
    if (foundReport) {
      dispatch(setCurrentReport(foundReport));
    }
  };

  const handleAuditSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = auditUrl.trim();
    if (!cleanUrl) {
      toast.error("Please enter a website URL", {
        description: "Example: https://example.com",
      });
      return;
    }

    try {
      const newReport = await dispatch(executeAudit(cleanUrl)).unwrap();
      toast.success("Audit Completed!", {
        description: `Successfully analyzed ${cleanUrl}`,
      });
      setSelectedWebsite(newReport.url || cleanUrl);
      setAuditUrl(newReport.url || cleanUrl);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error("Audit Failed", {
        description: typeof err === "string" ? err : "Unable to audit website. Please check the URL.",
      });
    }
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    try {
      await signOut({ redirect: false });
    } catch {
      // Ignore NextAuth signOut error
    }
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore API errors
    } finally {
      dispatch(logout());
      window.location.href = "/login";
    }
  };

  const displayName = user
    ? user.firstName || user.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : (user as any).name || "User"
    : "Guest User";

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GU";

  const fullName = displayName;
  const userEmail = user?.email || "";

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (websiteRef.current && !websiteRef.current.contains(event.target as Node)) {
        setIsWebsitesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 shadow-sm backdrop-blur-sm lg:px-10",
        className
      )}
    >
      <div className="flex flex-1 items-center gap-4 lg:gap-6 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onMobileMenuToggle}
          className="text-muted-foreground md:hidden hover:text-slate-900 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Website Selector Dropdown */}
        <div ref={websiteRef} className="relative shrink-0">
          <button
            onClick={() => setIsWebsitesOpen(!isWebsitesOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
            aria-haspopup="listbox"
            aria-expanded={isWebsitesOpen}
          >
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            <span className="hidden sm:inline truncate max-w-[120px]">{selectedWebsite.replace("https://", "")}</span>
            <ChevronDown className="h-3 w-3 text-slate-400 transition-transform duration-200" style={{ transform: isWebsitesOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          <AnimatePresence>
            {isWebsitesOpen && (
              <motion.ul
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 z-50 focus:outline-none"
                role="listbox"
              >
                {websiteList.map((site: string) => (
                  <li key={site} role="option" aria-selected={site === selectedWebsite}>
                    <button
                      onClick={() => handleSelectWebsite(site)}
                      className={cn(
                        "w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition-colors truncate cursor-pointer",
                        site === selectedWebsite
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {site.replace(/^https?:\/\//, "")}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Search Bar / URL Auditor Input & Action Form */}
        <form onSubmit={handleAuditSubmit} className="flex max-w-xl flex-1 items-center gap-3">
          <div className="flex flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
            <input
              type="text"
              value={auditUrl}
              onChange={(e) => setAuditUrl(e.target.value)}
              disabled={isAuditing}
              placeholder="Enter website URL (e.g. https://example.com)..."
              className="w-full border-none bg-transparent text-sm focus:outline-none focus:ring-0 text-slate-700 placeholder-slate-400 disabled:opacity-50"
              aria-label="Search or audit page"
            />
          </div>

          {/* Audit Website Button */}
          <button
            type="submit"
            disabled={isAuditing}
            className="hidden sm:inline-flex shrink-0 items-center gap-2 justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 active:scale-95 transition-all cursor-pointer"
          >
            {isAuditing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Auditing...</span>
              </>
            ) : (
              <span>Audit Website</span>
            )}
          </button>
        </form>
      </div>

      {/* Right actions */}
      <div className="ml-4 flex items-center gap-3 lg:ml-6 lg:gap-4 shrink-0">
        {/* Theme toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-muted-foreground transition-colors hover:text-blue-600 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="h-5 w-5 text-orange-500" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setHasNotifications(false)}
          className="text-muted-foreground transition-colors hover:text-blue-600 p-1.5 hover:bg-slate-50 rounded-lg relative cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        {/* User Menu Dropdown */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="h-8 w-8 overflow-hidden rounded-full border border-slate-300 shadow-sm hover:border-slate-400 transition-colors focus:outline-none cursor-pointer"
            aria-haspopup="true"
            aria-expanded={isUserMenuOpen}
            aria-label="User menu"
          >
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
              {initials}
            </div>
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 z-50 focus:outline-none"
              >
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-slate-950">{fullName}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
                </div>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    alert("Billing portal coming soon!");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                  Billing
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-500" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
