"use client";

// Backwards-compatible wrapper (deprecated).
// Prefer `useVaultHotkey` + `useRapidTapTrigger`.

import { useRapidTapTrigger } from "@/components/vault/useRapidTapTrigger";
import { useVaultHotkey } from "@/components/vault/useVaultHotkey";

export function useVaultTriggers(onTrigger: () => void) {
  useVaultHotkey(onTrigger);
  return useRapidTapTrigger(onTrigger, { taps: 5, windowMs: 2000 });
}
