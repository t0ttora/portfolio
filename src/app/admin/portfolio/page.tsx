import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isAllowedVaultIdentity } from "@/utils/supabase/middleware";

import { PortfolioCanvasClient } from "./portfolio-canvas-client";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (!isAllowedVaultIdentity(user.email)) redirect("/");

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, created_at, title, slug, description, details, ref_code, category, short_desc, card_date, status, tech, github_url, demo_url, image_url, repo_stats, position_x, position_y, rotation, z_index, is_visible",
    )
    .order("z_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <PortfolioCanvasClient initialProjects={[]} initialError={error.message} />
    );
  }

  return <PortfolioCanvasClient initialProjects={data ?? []} />;
}
