"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { usePathname } from "next/navigation";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/verify-email";

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center items-center font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="grid min-h-screen bg-slate-50/50 md:grid-cols-[auto_1fr] transition-all duration-300 ease-in-out">
      {/* Desktop Sidebar (Collapsible, Sticky) */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="hidden md:flex"
      />

      {/* Mobile/Tablet Overlay Navigation Drawer */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen min-w-0">
        {/* Header bar */}
        <Header onMobileMenuToggle={() => setMobileNavOpen(true)} />

        {/* Content canvas container */}
        <main className="flex-grow p-6 lg:p-10 max-w-[1440px] w-full mx-auto transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
