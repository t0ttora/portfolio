import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isAllowedVaultIdentity } from "@/utils/supabase/middleware";

export const dynamic = "force-dynamic";

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export async function GET() {
  const supabase = await createSupabaseServerClient({ allowSetCookies: true });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedVaultIdentity(user.email)) {
    return json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "maintenance")
    .maybeSingle();

  if (error) return json({ error: error.message }, { status: 500 });

  const enabled = Boolean((data?.value as any)?.enabled ?? false);
  return json({ enabled });
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient({ allowSetCookies: true });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedVaultIdentity(user.email)) {
    return json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const enabled = Boolean(body?.enabled);

  const { error } = await supabase.from("site_settings").upsert(
    {
      key: "maintenance",
      value: { enabled },
    },
    { onConflict: "key" },
  );

  if (error) return json({ error: error.message }, { status: 500 });
  return json({ enabled });
}
