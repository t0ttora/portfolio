"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  async function onClick() {
    setIsSigningOut(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } finally {
      router.replace("/");
      setIsSigningOut(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      variant="secondary"
      className="w-full justify-center rounded-2xl border border-border bg-secondary/50 hover:bg-secondary/70"
      disabled={isSigningOut}
    >
      {isSigningOut ? "Signing out…" : "Sign Out"}
    </Button>
  );
}
