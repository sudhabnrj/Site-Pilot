import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Globe,
  Bell,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  Plus,
  LogOut,
  User,
  Settings,
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
  Trash2,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/auth-slice";
import { executeAudit, setCurrentReport } from "@/store/slices/audit-slice";
import { toast } from "sonner";

export interface HeaderNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "success" | "warning" | "info" | "critical";
}

const INITIAL_NOTIFICATIONS: HeaderNotification[] = [
  {
    id: "notif-1",
    title: "Audit Completed",
    description: "Successfully analyzed target website health metrics.",
    time: "10m ago",
    read: false,
    type: "success",
  },
  {
    id: "notif-2",
    title: "Security Header Alert",
    description: "Missing Strict-Transport-Security header detected.",
    time: "1h ago",
    read: false,
    type: "warning",
  },
  {
    id: "notif-3",
    title: "Weekly Performance Digest",
    description: "Your weekly Core Web Vitals summary report is compiled.",
    time: "1d ago",
    read: true,
    type: "info",
  },
];

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

  // Functional Notifications State
  const [notifications, setNotifications] = useState<HeaderNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const websiteRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Sync dark mode on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const nextState = !isDarkMode;
    setIsDarkMode(nextState);
    if (typeof window !== "undefined") {
      if (nextState) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        toast.success("Dark Mode Enabled");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        toast.success("Light Mode Enabled");
      }
    }
  };

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

  const isAdmin = user?.role === "admin";
  const userPlan = isAdmin
    ? "enterprise"
    : user?.plan || (typeof window !== "undefined" ? (localStorage.getItem("user_plan") as any) : null) || "free";

  const maxSites = isAdmin ? 999 : userPlan === "enterprise" ? 999 : userPlan === "pro" ? 15 : userPlan === "starter" ? 3 : 1;

  const handleAuditSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = auditUrl.trim();
    if (!cleanUrl) {
      toast.error("Please enter a website URL", {
        description: "Example: https://example.com",
      });
      return;
    }

    const cleanDomain = cleanUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].toLowerCase();
    const existingDomains = Array.from(new Set(reportsHistory.map((r) => (r.domain || r.url).replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].toLowerCase())));
    const isExistingSite = existingDomains.includes(cleanDomain);

    if (!isAdmin && !isExistingSite && existingDomains.length >= maxSites) {
      toast.error(`Website Limit Reached (${existingDomains.length}/${maxSites})`, {
        description: `Your ${userPlan.toUpperCase()} plan allows auditing up to ${maxSites} site(s). Upgrade your plan to audit more properties!`,
      });
      router.push("/upgrade");
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.info("Notifications cleared");
  };

  const toggleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90 px-6 shadow-sm backdrop-blur-sm lg:px-10 transition-colors",
        className
      )}
    >
      <div className="flex flex-1 items-center gap-4 lg:gap-6 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onMobileMenuToggle}
          className="text-muted-foreground md:hidden hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Website Selector Dropdown */}
        <div ref={websiteRef} className="relative shrink-0">
          <button
            onClick={() => setIsWebsitesOpen(!isWebsitesOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-haspopup="listbox"
            aria-expanded={isWebsitesOpen}
          >
            <Globe className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
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
                className="absolute left-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-1.5 shadow-lg ring-1 ring-black/5 z-50 focus:outline-none"
                role="listbox"
              >
                {websiteList.map((site: string) => (
                  <li key={site} role="option" aria-selected={site === selectedWebsite}>
                    <button
                      onClick={() => handleSelectWebsite(site)}
                      className={cn(
                        "w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition-colors truncate cursor-pointer",
                        site === selectedWebsite
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
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
          <div className="flex flex-1 items-center rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-4 py-2 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
            <input
              type="text"
              value={auditUrl}
              onChange={(e) => setAuditUrl(e.target.value)}
              disabled={isAuditing}
              placeholder="Enter website URL (e.g. https://example.com)..."
              className="w-full border-none bg-transparent text-sm focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 placeholder-slate-400 disabled:opacity-50"
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
          onClick={toggleDarkMode}
          className="text-slate-500 dark:text-slate-400 transition-colors hover:text-blue-600 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
          aria-label="Toggle dark mode"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="h-5 w-5 text-orange-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="text-slate-500 dark:text-slate-400 transition-colors hover:text-blue-600 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 shadow-xl ring-1 ring-black/5 z-50 focus:outline-none"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Clear all notifications"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto my-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                      No notifications to display.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => toggleNotificationRead(notif.id)}
                        className={cn(
                          "py-3 px-2 flex items-start gap-3 rounded-xl transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60",
                          !notif.read && "bg-blue-50/40 dark:bg-blue-950/20"
                        )}
                      >
                        <div className="mt-0.5 shrink-0">
                          {notif.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                          {notif.type === "warning" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                          {notif.type === "info" && <Info className="h-4 w-4 text-blue-500" />}
                          {notif.type === "critical" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={cn("text-xs font-bold truncate", notif.read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white")}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5 line-clamp-2">
                            {notif.description}
                          </p>
                        </div>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-1.5 shadow-lg ring-1 ring-black/5 z-50 focus:outline-none"
              >
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-slate-950 dark:text-white">{fullName}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
                </div>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    router.push("/billing");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                  Billing
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors font-medium cursor-pointer"
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

