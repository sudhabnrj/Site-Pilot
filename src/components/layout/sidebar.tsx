"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavItem } from "@/components/ui/nav-item";
import { BRAND, SIDEBAR_NAV_ITEMS, SIDEBAR_BOTTOM_ITEMS } from "@/constants/navigation";
import { Brain, Zap, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/auth-slice";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ className, isCollapsed = false, onToggle }: SidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
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

  const userPlan = isAdmin
    ? "admin"
    : user?.plan || (typeof window !== "undefined" ? (localStorage.getItem("user_plan") as any) : null) || "starter";

  const getPlanBadge = () => {
    if (isAdmin) {
      return (
        <span className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs">
          Admin Plan
        </span>
      );
    }
    if (userPlan === "enterprise") {
      return (
        <span className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-900 text-white shadow-xs">
          Enterprise Plan
        </span>
      );
    }
    if (userPlan === "pro") {
      return (
        <span className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
          Pro Plan
        </span>
      );
    }
    return (
      <span className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-200 text-slate-700">
        Starter Plan
      </span>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-[60] flex h-screen flex-col border-r border-slate-200 bg-slate-50/80 p-4 transition-all duration-300 ease-in-out md:sticky md:top-0",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Brand & Toggle Header */}
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-md">
            <Brain className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col items-start">
              <h1 className="text-md font-black leading-tight tracking-tight text-blue-700">
                {BRAND.name}
              </h1>
              {getPlanBadge()}
            </div>
          )}
        </div>

        {/* Collapse Button (Desktop Only) */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-900 md:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* Navigation list */}
      <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Sidebar navigation">
        {SIDEBAR_NAV_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
        ))}

        <div className="pt-6 mt-6 border-t border-slate-200/60">
          {SIDEBAR_BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>
      </nav>

      {/* Upgrade card / premium promo (hidden for admin role) */}
      {!isAdmin && (
        <div className="mt-auto pt-4 pb-4">
          {isCollapsed ? (
            <button
              onClick={() => router.push("/upgrade")}
              className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all relative group cursor-pointer"
              aria-label="Upgrade to Pro"
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
              <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Upgrade to Pro
              </span>
            </button>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-md relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <Zap className="h-24 w-24" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">Site Pilot Pro</p>
              <p className="mt-1 text-xs font-medium text-blue-50 leading-relaxed">
                Get unlimited audits, deep AI recommendations, and PDF exports.
              </p>
              <button
                onClick={() => router.push("/upgrade")}
                className="mt-3 w-full rounded-full bg-white py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* User Profile Block */}
      <div className="border-t border-slate-200 pt-4">
        {isCollapsed ? (
          <div className="flex justify-center group relative">
            <div
              onClick={handleLogout}
              className="h-9 w-9 rounded-full overflow-hidden border border-slate-300 shadow-sm cursor-pointer"
            >
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                {initials}
              </div>
            </div>
            <div className="absolute left-full ml-3 p-2 bg-slate-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
              <p className="font-semibold">{fullName}</p>
              <p className="text-[10px] text-slate-400">Click to Logout</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden border border-slate-300 shadow-sm">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                  {initials}
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-900 truncate">{fullName}</span>
                <span className="text-[10px] text-muted-foreground truncate">{userEmail}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-red-600 transition-colors shrink-0 p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"
              aria-label="Logout"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
