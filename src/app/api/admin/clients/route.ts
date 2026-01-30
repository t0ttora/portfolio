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

export async function GET() {
  const auth = await assertAdmin();
  if (!auth.ok) return json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await auth.supabase
    .from("clients")
    .select(
      "id, created_at, name, email, project_ref, access_code, magic_link_token, status, payment_status",
    )
    .order("created_at", { ascending: false });

  if (error) return json({ error: error.message }, { status: 500 });
  return json({ clients: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await assertAdmin();
  if (!auth.ok) return json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);

  const name = String(body?.name ?? "").trim();
  const email = body?.email ? String(body.email).trim() : null;
  const project_ref = body?.project_ref ? String(body.project_ref) : null;
  const access_code = String(body?.access_code ?? "").trim();
  const magic_link_token = body?.magic_link_token
    ? String(body.magic_link_token)
    : crypto.randomUUID();
  const status = String(body?.status ?? "Active").trim();
  const payment_status = String(body?.payment_status ?? "Pending").trim();

  if (!name) return json({ error: "name_required" }, { status: 400 });
  if (!access_code) return json({ error: "access_code_required" }, { status: 400 });
  if (!["Active", "Completed", "Archived"].includes(status)) {
    return json({ error: "invalid_status" }, { status: 400 });
  }
  if (!["Paid", "Pending", "Overdue"].includes(payment_status)) {
    return json({ error: "invalid_payment_status" }, { status: 400 });
  }

  const payload = {
    name,
    email,
    project_ref,
    access_code,
    magic_link_token,
    status,
    payment_status,
  };

  const { data, error } = await auth.supabase
    .from("clients")
    .insert(payload)
    .select(
      "id, created_at, name, email, project_ref, access_code, magic_link_token, status, payment_status",
    )
    .single();

  if (error) return json({ error: error.message }, { status: 500 });
  return json({ client: data });
}
