import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function getVaultStage(): "production" | "staging" | "development" {
  const raw =
    process.env.VAULT_STAGE ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV;

  if (raw === "production") return "production";
  if (raw === "staging") return "staging";
  return "development";
}

export function getAllowedVaultEmail(): string {
  const stage = getVaultStage();

  // Strict by default: production only trusts the production env var.
  if (stage === "production") return (process.env.VAULT_ALLOWED_EMAIL ?? "").trim();

  // Non-production may use a dedicated staging override.
  return (
    process.env.VAULT_ALLOWED_EMAIL_STAGING ??
    process.env.VAULT_ALLOWED_EMAIL ??
    ""
  ).trim();
}

export async function getSupabaseResponseAndUser(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, supabase, user };
}

export function isAllowedVaultIdentity(email: string | null | undefined) {
  const allowed = getAllowedVaultEmail();
  if (!allowed) return false;
  return (email ?? "").toLowerCase() === allowed.toLowerCase();
}
