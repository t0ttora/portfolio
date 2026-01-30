import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isAllowedVaultIdentity } from "@/utils/supabase/middleware";

import { ClientsClient } from "./clients-list";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (!isAllowedVaultIdentity(user.email)) redirect("/");

  const { data, error } = await supabase
    .from("clients")
    .select(
      "id, created_at, name, email, project_ref, access_code, magic_link_token, status, payment_status",
    )
    .order("created_at", { ascending: false });

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, title, description, demo_url")
    .order("created_at", { ascending: false });

  const { data: clientProjects, error: clientProjectsError } = await supabase
    .from("client_projects")
    .select(
      "id, created_at, client_id, title, summary, status, budget, deadline, notes, portfolio_project_id",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <ClientsClient
        initialClients={[]}
        initialProjects={projects ?? []}
        initialClientProjects={clientProjects ?? []}
        initialError={error.message}
      />
    );
  }

  if (projectsError) {
    return (
      <ClientsClient
        initialClients={data ?? []}
        initialProjects={[]}
        initialClientProjects={clientProjects ?? []}
        initialError={projectsError.message}
      />
    );
  }

  if (clientProjectsError) {
    return (
      <ClientsClient
        initialClients={data ?? []}
        initialProjects={projects ?? []}
        initialClientProjects={[]}
        initialError={clientProjectsError.message}
      />
    );
  }

  return (
    <ClientsClient
      initialClients={data ?? []}
      initialProjects={projects ?? []}
      initialClientProjects={clientProjects ?? []}
    />
  );
}
