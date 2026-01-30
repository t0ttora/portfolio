import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isAllowedVaultIdentity } from "@/utils/supabase/middleware";

export const dynamic = "force-dynamic";

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

async function assertAdmin() {
  const supabase = await createSupabaseServerClient({ allowSetCookies: true });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedVaultIdentity(user.email)) {
    return { ok: false as const, supabase, user: null };
  }

  return { ok: true as const, supabase, user };
}

export async function POST(request: Request) {
  const auth = await assertAdmin();
  if (!auth.ok) return json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);

  const client_id = String(body?.client_id ?? "").trim();
  const title = String(body?.title ?? "").trim();
  const summary = body?.summary ? String(body.summary).trim() : null;
  const status = String(body?.status ?? "Discovery").trim();
  const budget = body?.budget ? String(body.budget).trim() : null;
  const deadline = body?.deadline ? String(body.deadline).trim() : null;
  const notes = body?.notes ? String(body.notes).trim() : null;

  if (!client_id) return json({ error: "client_id_required" }, { status: 400 });
  if (!title) return json({ error: "title_required" }, { status: 400 });

  const payload = {
    client_id,
    title,
    summary,
    status,
    budget,
    deadline,
    notes,
  };

  const { data, error } = await auth.supabase
    .from("client_projects")
    .insert(payload)
    .select(
      "id, created_at, client_id, title, summary, status, budget, deadline, notes, portfolio_project_id",
    )
    .single();

  if (error) return json({ error: error.message }, { status: 500 });
  return json({ clientProject: data });
}
