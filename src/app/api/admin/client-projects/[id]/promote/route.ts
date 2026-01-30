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

export async function POST(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await assertAdmin();
  if (!auth.ok) return json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  if (!id) return json({ error: "id_required" }, { status: 400 });

  const { data: clientProject, error } = await auth.supabase
    .from("client_projects")
    .select(
      "id, client_id, title, summary, status, budget, deadline, notes, portfolio_project_id",
    )
    .eq("id", id)
    .single();

  if (error || !clientProject) return json({ error: "not_found" }, { status: 404 });

  if (clientProject.portfolio_project_id) {
    return json({
      clientProject,
      projectId: clientProject.portfolio_project_id,
      reused: true,
    });
  }

  const title = String(clientProject.title ?? "").trim();
  const slug = slugify(title);

  if (!title || !slug) return json({ error: "invalid_title" }, { status: 400 });

  const { data: project, error: projectError } = await auth.supabase
    .from("projects")
    .insert({
      title,
      slug,
      description: clientProject.summary ?? "",
      details: clientProject.notes ?? "",
      status: clientProject.status ?? "",
      short_desc: clientProject.summary ?? "",
      card_date: clientProject.deadline ?? "",
      tech: [],
      is_visible: true,
    })
    .select("id")
    .single();

  if (projectError || !project) {
    return json({ error: projectError?.message ?? "project_create_failed" }, { status: 500 });
  }

  const { data: updatedClientProject, error: updateError } = await auth.supabase
    .from("client_projects")
    .update({ portfolio_project_id: project.id })
    .eq("id", id)
    .select(
      "id, created_at, client_id, title, summary, status, budget, deadline, notes, portfolio_project_id",
    )
    .single();

  if (updateError || !updatedClientProject) {
    return json({ error: updateError?.message ?? "update_failed" }, { status: 500 });
  }

  await auth.supabase
    .from("clients")
    .update({ project_ref: project.id })
    .eq("id", clientProject.client_id);

  return json({ clientProject: updatedClientProject, projectId: project.id });
}
