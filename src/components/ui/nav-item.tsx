"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { NavItem as NavItemType } from "@/types/dashboard";

interface NavItemProps {
  item: NavItemType;
  className?: string;
  isCollapsed?: boolean;
}

export function NavItem({ item, className, isCollapsed }: NavItemProps) {
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon];
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-blue-600 text-white shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        isCollapsed && "justify-center px-2",
        className
      )}
      title={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      {IconComponent && <IconComponent className="h-4 w-4 shrink-0" aria-hidden="true" />}
      {!isCollapsed && <span className="transition-opacity duration-200">{item.label}</span>}
    </Link>
  );
}
