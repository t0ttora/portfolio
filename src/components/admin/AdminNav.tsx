"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  LayersIcon,
  UsersIcon,
  SettingsIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    Icon: LayoutDashboardIcon,
    tone: "text-amber-400",
  },
  {
    href: "/admin/portfolio",
    label: "Portfolio",
    Icon: LayersIcon,
    tone: "text-violet-400",
  },
  {
    href: "/admin/clients",
    label: "Clients",
    Icon: UsersIcon,
    tone: "text-emerald-400",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    Icon: SettingsIcon,
    tone: "text-rose-400",
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1">
      {items.map(({ href, label, Icon, tone }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors",
              "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              active && "bg-muted text-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-4",
                tone,
                active ? "opacity-100" : "opacity-70 group-hover:opacity-90",
              )}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
