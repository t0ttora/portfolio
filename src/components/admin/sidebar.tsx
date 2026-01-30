"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cog, Layers, LayoutGrid, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { label: "Portfolio", href: "/admin/portfolio", icon: Layers },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Cog },
];

export function AdminSidebar(props: { email?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[260px] flex-shrink-0 flex-col border-r border-white/10 bg-[#1c1c1e]">
      <div className="px-5 pt-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
          Core Control
        </div>
      </div>

      <nav className="mt-5 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/75 transition",
                "hover:bg-white/5 hover:text-white",
                active && "bg-white/20 text-white",
              )}
            >
              <Icon className="size-[18px] text-white/80" />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
          <div className="grid size-9 place-items-center rounded-full border border-white/10 bg-black">
            <span className="text-xs font-semibold text-white/70">
              {(props.email ?? "CC").slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-white/80">Signed in</div>
            <div className="truncate text-xs text-white/50">
              {props.email ?? "core@local"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
