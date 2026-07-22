import type { NavItem } from "@/types/dashboard";

export const BRAND = {
  name: "SitePilot",
  plan: "Pro Plan",
} as const;

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "LayoutDashboard", href: "/" },
  { label: "Websites", icon: "Globe", href: "/websites" },
  { label: "Reports", icon: "BarChart3", href: "/reports" },
  { label: "AI Insights", icon: "Brain", href: "/ai-insights" },
  { label: "Performance", icon: "Gauge", href: "/performance" },
  { label: "SEO", icon: "Search", href: "/seo" },
  { label: "Accessibility", icon: "Accessibility", href: "/accessibility" },
  { label: "Security", icon: "Shield", href: "/security" },
  { label: "Mobile", icon: "Smartphone", href: "/mobile" },
  { label: "PDF Reports", icon: "FileText", href: "/pdf-reports" },
];

export const SIDEBAR_BOTTOM_ITEMS: NavItem[] = [
  { label: "Settings", icon: "Settings", href: "/settings" },
];
