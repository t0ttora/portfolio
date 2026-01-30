"use client";

import * as React from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { banForMs, isBannedNow } from "@/components/vault/ban";

const formSchema = z.object({
  phrase: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

type VaultPhase = "gate" | "oauth";

const BAN_MS = 5 * 60 * 1000;

export function VaultLogin(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { open, onOpenChange } = props;
  const router = useRouter();
  const [phase, setPhase] = React.useState<VaultPhase>("gate");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { phrase: "" },
  });

  React.useEffect(() => {
    if (!open) {
      setPhase("gate");
      setIsSubmitting(false);
      form.reset({ phrase: "" });
    }
  }, [open, form]);

  async function verifyGate(values: FormValues) {
    if (isBannedNow()) {
      toast.error("Access Denied");
      onOpenChange(false);
      return;
    }

    const rawPhrase = values.phrase.trim();
    const noSpace = rawPhrase.replace(/\s+/g, "");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vault/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phrase: rawPhrase }),
      });
      if (res.ok) {
        setPhase("oauth");
        return;
      }

      const portalCode = noSpace.toUpperCase();
      const looksLikePortalCode =
        !/\s/.test(rawPhrase) && portalCode.length >= 4 && portalCode.length <= 12;
      if (looksLikePortalCode) {
        onOpenChange(false);
        router.push(`/portal/${portalCode}`);
        return;
      }

      banForMs(BAN_MS);
      toast.error("Access Denied");
      onOpenChange(false);
    } catch {
      const portalCode = noSpace.toUpperCase();
      const looksLikePortalCode =
        !/\s/.test(rawPhrase) && portalCode.length >= 4 && portalCode.length <= 12;
      if (looksLikePortalCode) {
        onOpenChange(false);
        router.push(`/portal/${portalCode}`);
        return;
      }

      toast.error("Access Denied");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function signInWithGoogle() {
    if (isBannedNow()) {
      toast.error("Access Denied");
      onOpenChange(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();

    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(
      "/admin/dashboard",
    )}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      toast.error("Unauthorized Identity");
      banForMs(BAN_MS);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md bg-black text-white border border-white/10 shadow-2xl"
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xs font-mono tracking-[0.3em] text-white/70">
            THE VAULT
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-[120px] flex items-center">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "gate" ? (
              <motion.form
                key="gate"
                onSubmit={form.handleSubmit(verifyGate)}
                className="w-full"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <Input
                  type="password"
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="text"
                  placeholder=""
                  className="h-12 bg-transparent border border-white/10 text-white font-mono tracking-widest placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...form.register("phrase")}
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-white/40 font-mono">
                    enter phrase
                  </span>
                  <Button
                    type="submit"
                    variant="secondary"
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/10"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "…" : "unlock"}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="oauth"
                className="w-full flex flex-col gap-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <Button
                  type="button"
                  onClick={signInWithGoogle}
                  className="w-full bg-white text-black hover:bg-white/90"
                >
                  Sign in with Google
                </Button>
                <p className="text-[11px] text-white/40 font-mono text-center">
                  identity verification required
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
