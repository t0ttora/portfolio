import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isAllowedVaultIdentity } from "@/utils/supabase/middleware";

export const dynamic = "force-dynamic";

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

function slugify(input: string): string {
  return (input ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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
    .from("projects")
    .select(
      "id, created_at, title, slug, description, details, ref_code, category, short_desc, card_date, status, tech, github_url, demo_url, image_url, repo_stats, position_x, position_y, rotation, z_index, is_visible",
    )
    .order("z_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return json({ error: error.message }, { status: 500 });
  return json({ projects: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await assertAdmin();
  if (!auth.ok) return json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);

  const title = String(body?.title ?? "").trim();
  const rawSlug = String(body?.slug ?? "").trim();
  const slug = slugify(rawSlug || title);

  if (!title) return json({ error: "title_required" }, { status: 400 });
  if (!slug) return json({ error: "slug_required" }, { status: 400 });

  const payload = {
    title,
    slug,
    description: String(body?.description ?? ""),
    details: String(body?.details ?? ""),
    ref_code: String(body?.ref_code ?? ""),
    category: String(body?.category ?? ""),
    short_desc: String(body?.short_desc ?? ""),
    card_date: String(body?.card_date ?? ""),
    status: String(body?.status ?? ""),
    tech: Array.isArray(body?.tech) ? body.tech.map((t: any) => String(t)) : [],
    github_url: body?.github_url ? String(body.github_url) : null,
    demo_url: body?.demo_url ? String(body.demo_url) : null,
    image_url: body?.image_url ? String(body.image_url) : null,
    repo_stats: (body?.repo_stats ?? {}) as any,
    position_x: Number.isFinite(body?.position_x) ? Number(body.position_x) : 0,
    position_y: Number.isFinite(body?.position_y) ? Number(body.position_y) : 0,
    rotation: Number.isFinite(body?.rotation) ? Number(body.rotation) : 0,
    z_index: Number.isFinite(body?.z_index) ? Number(body.z_index) : 0,
    is_visible: typeof body?.is_visible === "boolean" ? body.is_visible : true,
  };

  const { data, error } = await auth.supabase
    .from("projects")
    .insert(payload)
    .select(
      "id, created_at, title, slug, description, details, ref_code, category, short_desc, card_date, status, tech, github_url, demo_url, image_url, repo_stats, position_x, position_y, rotation, z_index, is_visible",
    )
    .single();

  if (error) return json({ error: error.message }, { status: 500 });
  return json({ project: data });
}
