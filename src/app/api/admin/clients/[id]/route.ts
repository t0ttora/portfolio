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

  if ("name" in body) allowed.name = String((body as any).name ?? "");
  if ("email" in body)
    allowed.email = (body as any).email ? String((body as any).email) : null;
  if ("project_ref" in body)
    allowed.project_ref = (body as any).project_ref
      ? String((body as any).project_ref)
      : null;
  if ("access_code" in body) allowed.access_code = String((body as any).access_code ?? "");
  if ("magic_link_token" in body)
    allowed.magic_link_token = (body as any).magic_link_token
      ? String((body as any).magic_link_token)
      : null;

  if ("status" in body) {
    const next = String((body as any).status ?? "Active");
    if (!["Active", "Completed", "Archived"].includes(next)) {
      return json({ error: "invalid_status" }, { status: 400 });
    }
    allowed.status = next;
  }

  if ("payment_status" in body) {
    const next = String((body as any).payment_status ?? "Pending");
    if (!["Paid", "Pending", "Overdue"].includes(next)) {
      return json({ error: "invalid_payment_status" }, { status: 400 });
    }
    allowed.payment_status = next;
  }

  const { data, error } = await auth.supabase
    .from("clients")
    .update(allowed)
    .eq("id", id)
    .select(
      "id, created_at, name, email, project_ref, access_code, magic_link_token, status, payment_status",
    )
    .single();

  if (error) return json({ error: error.message }, { status: 500 });
  return json({ client: data });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await assertAdmin();
  if (!auth.ok) return json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  if (!id) return json({ error: "id_required" }, { status: 400 });

  const { error } = await auth.supabase.from("clients").delete().eq("id", id);
  if (error) return json({ error: error.message }, { status: 500 });

  return json({ ok: true });
}
