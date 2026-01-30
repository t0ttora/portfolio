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

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await assertAdmin();
  if (!auth.ok) return json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  if (!id) return json({ error: "id_required" }, { status: 400 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return json({ error: "invalid_body" }, { status: 400 });
  }

  const allowed: Record<string, unknown> = {};

  if ("title" in body) allowed.title = String((body as any).title ?? "");
  if ("summary" in body) {
    allowed.summary = (body as any).summary ? String((body as any).summary) : null;
  }
  if ("status" in body) allowed.status = String((body as any).status ?? "Discovery");
  if ("budget" in body) {
    allowed.budget = (body as any).budget ? String((body as any).budget) : null;
  }
  if ("deadline" in body) {
    allowed.deadline = (body as any).deadline ? String((body as any).deadline) : null;
  }
  if ("notes" in body) {
    allowed.notes = (body as any).notes ? String((body as any).notes) : null;
  }

  const { data, error } = await auth.supabase
    .from("client_projects")
    .update(allowed)
    .eq("id", id)
    .select(
      "id, created_at, client_id, title, summary, status, budget, deadline, notes, portfolio_project_id",
    )
    .single();

  if (error) return json({ error: error.message }, { status: 500 });
  return json({ clientProject: data });
}
