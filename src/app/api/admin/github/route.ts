import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isAllowedVaultIdentity } from "@/utils/supabase/middleware";
import { parseGitHubRepoUrl } from "@/utils/github/parse";

export const dynamic = "force-dynamic";

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient({ allowSetCookies: true });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedVaultIdentity(user.email)) {
    return json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner")?.trim() ?? "";
  const repo = searchParams.get("repo")?.trim() ?? "";
  const url = searchParams.get("url")?.trim() ?? "";

  const parsed = owner && repo ? { owner, repo } : parseGitHubRepoUrl(url);
  if (!parsed) return json({ error: "invalid_repo" }, { status: 400 });

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-admin",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const ghRes = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`,
    {
      headers,
      // Keep it fresh in admin
      cache: "no-store",
    },
  );

  if (!ghRes.ok) {
    const errText = await ghRes.text().catch(() => "");
    return json(
      { error: "github_error", status: ghRes.status, detail: errText },
      { status: 502 },
    );
  }

  const data = (await ghRes.json()) as any;

  return json({
    owner: parsed.owner,
    repo: parsed.repo,
    full_name: String(data.full_name ?? `${parsed.owner}/${parsed.repo}`),
    html_url: String(data.html_url ?? ""),
    description: (data.description ?? null) as string | null,
    stars: Number(data.stargazers_count ?? 0),
    forks: Number(data.forks_count ?? 0),
    language: (data.language ?? null) as string | null,
  });
}
