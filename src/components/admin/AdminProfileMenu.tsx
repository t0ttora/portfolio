"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { MaintenanceSwitch } from "@/components/admin/MaintenanceSwitch";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function initials(email: string | null | undefined) {
  const v = (email ?? "").trim();
  if (!v) return "?";
  return v[0]?.toUpperCase() ?? "?";
}

export function AdminProfileMenu(props: {
  email: string | null | undefined;
  maintenanceEnabled: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group w-full rounded-2xl border border-border bg-background/40 px-3 py-3 text-left",
            "hover:bg-background/60 transition-colors",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative size-9 overflow-hidden rounded-xl bg-muted">
              <Image
                src="/avatar.jpeg"
                alt="Profile avatar"
                fill
                className="object-cover"
                sizes="36px"
                priority
              />
              <span className="sr-only">{initials(props.email)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-muted-foreground">Profile</div>
              <div className="truncate text-sm font-medium">
                {props.email ?? "—"}
              </div>
            </div>
            <ChevronDownIcon
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[320px] p-3">
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-background/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">Maintenance mode</div>
                <div className="text-xs text-muted-foreground">
                  Public site gate
                </div>
              </div>
              <MaintenanceSwitch initialEnabled={props.maintenanceEnabled} hideLabel />
            </div>
          </div>

          <SignOutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
}
