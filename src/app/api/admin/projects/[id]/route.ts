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
  if ("slug" in body) allowed.slug = String((body as any).slug ?? "");
  if ("description" in body)
    allowed.description = String((body as any).description ?? "");
  if ("details" in body)
    allowed.details = String((body as any).details ?? "");
  if ("ref_code" in body) allowed.ref_code = String((body as any).ref_code ?? "");
  if ("category" in body) allowed.category = String((body as any).category ?? "");
  if ("short_desc" in body)
    allowed.short_desc = String((body as any).short_desc ?? "");
  if ("card_date" in body)
    allowed.card_date = String((body as any).card_date ?? "");
  if ("status" in body) allowed.status = String((body as any).status ?? "");
  if ("tech" in body) {
    const tech = Array.isArray((body as any).tech)
      ? (body as any).tech.map((t: any) => String(t))
      : [];
    allowed.tech = tech;
  }
  if ("github_url" in body)
    allowed.github_url = (body as any).github_url
      ? String((body as any).github_url)
      : null;
  if ("demo_url" in body)
    allowed.demo_url = (body as any).demo_url
      ? String((body as any).demo_url)
      : null;
  if ("image_url" in body)
    allowed.image_url = (body as any).image_url
      ? String((body as any).image_url)
      : null;
  if ("repo_stats" in body) allowed.repo_stats = (body as any).repo_stats ?? {};

  if ("position_x" in body) allowed.position_x = Number((body as any).position_x);
  if ("position_y" in body) allowed.position_y = Number((body as any).position_y);
  if ("rotation" in body) allowed.rotation = Number((body as any).rotation);
  if ("z_index" in body) allowed.z_index = Number((body as any).z_index);
  if ("is_visible" in body) allowed.is_visible = Boolean((body as any).is_visible);

  const { data, error } = await auth.supabase
    .from("projects")
    .update(allowed)
    .eq("id", id)
    .select(
      "id, created_at, title, slug, description, details, ref_code, category, short_desc, card_date, status, tech, github_url, demo_url, image_url, repo_stats, position_x, position_y, rotation, z_index, is_visible",
    )
    .single();

  if (error) return json({ error: error.message }, { status: 500 });
  return json({ project: data });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await assertAdmin();
  if (!auth.ok) return json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  if (!id) return json({ error: "id_required" }, { status: 400 });

  const { error } = await auth.supabase.from("projects").delete().eq("id", id);
  if (error) return json({ error: error.message }, { status: 500 });

  return json({ ok: true });
}
