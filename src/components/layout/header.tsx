"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Globe, Bell, Moon, Sun, Menu, ChevronDown, Plus, LogOut, User, Settings, CreditCard } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/auth-slice";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  className?: string;
}

const MOCK_WEBSITES = ["https://example.com", "https://my-saas.app", "https://blog.dev"];

export function Header({ onMobileMenuToggle, className }: HeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [selectedWebsite, setSelectedWebsite] = useState(MOCK_WEBSITES[0]);
  const [isWebsitesOpen, setIsWebsitesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  const websiteRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
                {MOCK_WEBSITES.map((site) => (
                  <li key={site} role="option" aria-selected={site === selectedWebsite}>
                    <button
                      onClick={() => {
                        setSelectedWebsite(site);
                        setIsWebsitesOpen(false);
                      }}
                      className={cn(
                        "w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition-colors truncate cursor-pointer",
                        site === selectedWebsite
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {site.replace("https://", "")}
                    </button>
                  </li>
                ))}
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => setIsWebsitesOpen(false)}
                  className="flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add website
                </button>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Search Bar / URL Auditor Input */}
        <div className="flex max-w-lg flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
          <input
            type="search"
            placeholder="Audit a page on this website..."
            className="w-full border-none bg-transparent text-sm focus:outline-none focus:ring-0 text-slate-700 placeholder-slate-400"
            aria-label="Search or audit page"
          />
        </div>

        {/* Audit Website Button */}
        <button className="hidden sm:inline-flex shrink-0 items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer">
          Audit Website
        </button>
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
