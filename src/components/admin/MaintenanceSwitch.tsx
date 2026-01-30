"use client";

import * as React from "react";

import { Switch } from "@/components/ui/switch";

export function MaintenanceSwitch(props: {
  initialEnabled: boolean;
  hideLabel?: boolean;
}) {
  const [enabled, setEnabled] = React.useState(props.initialEnabled);
  const [isSaving, setIsSaving] = React.useState(false);

  async function setMaintenance(next: boolean) {
    setEnabled(next);
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings/maintenance", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      if (!res.ok) {
        // revert
        setEnabled((prev) => !prev);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {!props.hideLabel && (
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-medium">Maintenance</span>
          <span className="text-[11px] text-muted-foreground">
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      )}
      <Switch
        checked={enabled}
        disabled={isSaving}
        onCheckedChange={(next: boolean) => setMaintenance(next)}
        aria-label="Toggle maintenance mode"
      />
    </div>
  );
}
