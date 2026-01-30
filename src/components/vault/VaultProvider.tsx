"use client";

import * as React from "react";
import { toast } from "sonner";

import { VaultLogin } from "@/components/vault/VaultLogin";
import { useVaultHotkey } from "@/components/vault/useVaultHotkey";
import { useVaultResetHotkey } from "@/components/vault/useVaultResetHotkey";
import { isBannedNow } from "@/components/vault/ban";
import { VaultUrlToastGate } from "@/components/vault/VaultUrlToastGate";

type VaultContextValue = {
  open: () => void;
  close: () => void;
};

const VaultContext = React.createContext<VaultContextValue | null>(null);

export function useVault() {
  const value = React.useContext(VaultContext);
  if (!value) throw new Error("useVault must be used within <VaultProvider />");
  return value;
}

export function VaultProvider(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => {
    if (isBannedNow()) {
      toast.error("Access Denied");
      return;
    }
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => setIsOpen(false), []);

  useVaultHotkey(open);
  useVaultResetHotkey();

  return (
    <VaultContext.Provider value={{ open, close }}>
      {props.children}

      <React.Suspense fallback={null}>
        <VaultUrlToastGate />
      </React.Suspense>

      <VaultLogin open={isOpen} onOpenChange={setIsOpen} />
    </VaultContext.Provider>
  );
}
