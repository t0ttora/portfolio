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
  const projectTitle = String(body?.project_title ?? "").trim();
  const scope = String(body?.scope ?? "").trim();
  const deadline = String(body?.deadline ?? "").trim();
  const budget = String(body?.budget ?? "").trim();
  const notes = String(body?.notes ?? "").trim();

  if (!code) return json({ error: "code_required" }, { status: 400 });
  if (!projectTitle) return json({ error: "project_title_required" }, { status: 400 });

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .eq("access_code", code)
    .single();

  if (clientError || !client) {
    return json({ error: "invalid_client" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("client_intake")
    .insert({
      client_id: client.id,
      project_title: projectTitle,
      scope: scope || null,
      deadline: deadline || null,
      budget: budget || null,
      notes: notes || null,
    })
    .select("id, created_at, project_title, scope, deadline, budget, notes")
    .single();

  if (error) return json({ error: error.message }, { status: 500 });

  return json({ ok: true, intake: data });
}
