"use client";

import { useEffect } from "react";

type Options = {
  enabled?: boolean;
};

export function useVaultHotkey(onTrigger: () => void, options: Options = {}) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const isMetaShiftK =
        (e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "k";

      if (!isMetaShiftK) return;

      e.preventDefault();
      onTrigger();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, onTrigger]);
}
