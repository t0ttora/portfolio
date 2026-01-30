"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Maximize2, Cpu, Radio } from "lucide-react";

const navItems = [
  { id: "/", label: "DESK", icon: <Maximize2 size={16} /> },
  { id: "/skills", label: "SPECS", icon: <Cpu size={16} /> },
  { id: "/songs", label: "RADIO", icon: <Radio size={16} /> },
];

export const Navbar = memo(() => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg shadow-2xl ring-1 ring-white/10">
        {navItems.map((item) => {
          const isActive = pathname === item.id;
          return (
            <Link
              key={item.id}
              href={item.id}
              className={`relative px-4 py-2 flex items-center gap-2 rounded-md text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-slate-800 text-white shadow-sm ring-1 ring-white/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {item.icon}
              <span className="font-mono tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

Navbar.displayName = "Navbar";
