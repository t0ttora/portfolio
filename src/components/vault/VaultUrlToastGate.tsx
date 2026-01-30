"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { banForMs } from "@/components/vault/ban";

export function VaultUrlToastGate() {
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const vault = searchParams.get("vault");
    if (!vault) return;

    if (vault === "unauthorized") {
      toast.error("Unauthorized Identity");
      banForMs(5 * 60 * 1000);
    } else {
      toast.error("Access Denied");
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("vault");
    router.replace(url.pathname + url.search, { scroll: false });
  }, [searchParams, router]);

  return null;
}
