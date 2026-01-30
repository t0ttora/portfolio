import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isAllowedVaultIdentity } from "@/utils/supabase/middleware";

function safeNextPath(nextParam: string | null) {
  if (!nextParam) return "/admin/dashboard";
  if (!nextParam.startsWith("/")) return "/admin/dashboard";
  if (nextParam.startsWith("//")) return "/admin/dashboard";
  return nextParam;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/?vault=error", url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/?vault=error", url.origin));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedVaultIdentity(user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/?vault=unauthorized", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
