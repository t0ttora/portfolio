import { notFound } from "next/navigation";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { PortalClient } from "./portal-client";
import { parseGitHubRepoUrl } from "@/utils/github/parse";

export const dynamic = "force-dynamic";

export default async function PortalPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { code: rawParam } = await params;
  const rawCode = String(rawParam ?? "");
  const code = rawCode.trim().toUpperCase().replace(/\s+/g, "");

  if (!code) notFound();

  const { data: clientRows, error } = await supabase.rpc("get_client_by_access_code", {
    p_code: code,
  });

  const client = Array.isArray(clientRows) ? clientRows[0] : clientRows;

  if (error || !client) notFound();

  const { data: project } = client.project_ref
    ? await supabase
        .from("projects")
        .select(
          "id, title, description, details, demo_url, github_url, short_desc, status, category, card_date, tech, image_url"
        )
        .eq("id", client.project_ref)
        .single()
    : { data: null };

  const commits = [] as Array<{
    sha: string;
    message: string;
    author: string | null;
    date: string | null;
    url: string | null;
  }>;

  if (project?.github_url) {
    const repo = parseGitHubRepoUrl(project.github_url);
    if (repo) {
      const ghRes = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(
          repo.repo
        )}/commits?per_page=15`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "portal-client",
            ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
          },
          cache: "no-store",
        }
      );

      if (ghRes.ok) {
        const data = (await ghRes.json()) as any[];
        data.slice(0, 15).forEach((item) => {
          commits.push({
            sha: String(item?.sha ?? ""),
            message: String(item?.commit?.message ?? "").split("\n")[0],
            author: item?.commit?.author?.name ?? null,
            date: item?.commit?.author?.date ?? null,
            url: item?.html_url ?? null,
          });
        });
      }
    }
  }

  const { data: feedback } = await supabase
    .from("feedback")
    .select("id, created_at, type, message")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false });

  const { data: intake } = await supabase
    .from("client_intake")
    .select("id, created_at, project_title, scope, deadline, budget, notes")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false });

  // Fetch documents for the client
  const { data: documents } = await supabase
    .from("client_documents")
    .select("id, title, description, file_url, file_type, created_at, uploaded_by")
    .eq("client_id", client.id)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  // Fetch milestones for the project
  const { data: milestones } = project
    ? await supabase
        .from("project_milestones")
        .select("id, title, description, due_date, completed_at, status")
        .eq("project_id", project.id)
        .order("due_date", { ascending: true })
    : { data: null };

  return (
    <PortalClient
      code={code}
      client={{
        name: client.name,
        email: client.email,
        status: client.status,
        payment_status: client.payment_status,
      }}
      project={
        project
          ? {
              id: project.id,
              title: project.title,
              description: project.description,
              details: project.details,
              demo_url: project.demo_url,
              github_url: project.github_url,
              short_desc: project.short_desc,
              status: project.status,
              category: project.category,
              card_date: project.card_date,
              tech: project.tech,
              image_url: project.image_url,
            }
          : null
      }
      commits={commits}
      feedback={feedback ?? []}
      intake={intake ?? []}
      documents={(documents ?? []).map((doc) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        file_url: doc.file_url,
        file_type: doc.file_type,
        created_at: doc.created_at,
        uploaded_by: doc.uploaded_by,
      }))}
      milestones={(milestones ?? []).map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        due_date: m.due_date,
        completed_at: m.completed_at,
        status: m.status as "pending" | "in_progress" | "completed" | "delayed",
      }))}
    />
  );
}
