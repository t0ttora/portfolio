import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isAllowedVaultIdentity } from "@/utils/supabase/middleware";
import { ClientDetailClient } from "./client-detail-client";

export const dynamic = "force-dynamic";

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (!isAllowedVaultIdentity(user.email)) redirect("/");

  const { data: client, error } = await supabase
    .from("clients")
    .select("id, created_at, name, email, project_ref, access_code, status, payment_status")
    .eq("id", id)
    .single();

  if (error || !client) redirect("/admin/clients");

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, description, demo_url")
    .order("created_at", { ascending: false });

  const { data: clientProjects } = await supabase
    .from("client_projects")
    .select("id, created_at, client_id, title, summary, status, budget, deadline, notes, portfolio_project_id")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  return (
    <ClientDetailClient
      client={client}
      projects={projects ?? []}
      clientProjects={clientProjects ?? []}
    />
  );
}
