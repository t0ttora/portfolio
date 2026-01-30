"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { clearBan } from "@/components/vault/ban";

type Options = {
  enabled?: boolean;
};

export function useVaultResetHotkey(options: Options = {}) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const isMetaShiftM =
        (e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "m";

      if (!isMetaShiftM) return;

      e.preventDefault();
      clearBan();
      toast.success("Access Reset");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}
