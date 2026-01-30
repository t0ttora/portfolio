import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient({ allowSetCookies: true });
  const body = await request.json().catch(() => null);

  const code = String(body?.code ?? "").trim();
  const message = String(body?.message ?? "").trim();
  const type = String(body?.type ?? "Bug").trim();

  if (!code) return json({ error: "code_required" }, { status: 400 });
  if (!message) return json({ error: "message_required" }, { status: 400 });
  if (!{"Bug": true, "Feature": true}[type]) {
    return json({ error: "invalid_type" }, { status: 400 });
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .eq("access_code", code)
    .single();

  if (clientError || !client) {
    return json({ error: "invalid_client" }, { status: 404 });
  }

  const { error } = await supabase.from("feedback").insert({
    client_id: client.id,
    message,
    type,
  });

  if (error) return json({ error: error.message }, { status: 500 });

  return json({ ok: true });
}
