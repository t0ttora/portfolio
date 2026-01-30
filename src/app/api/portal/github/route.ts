import { NextResponse } from "next/server";
import { parseGitHubRepoUrl } from "@/utils/github/parse";

export const dynamic = "force-dynamic";

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

async function fetchGitHub(url: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portal-client",
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return fetch(url, { headers, cache: "no-store" });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repoUrl = searchParams.get("repo");

  if (!repoUrl) {
    return json({ error: "repo_required" }, { status: 400 });
  }

  const repo = parseGitHubRepoUrl(repoUrl);
  if (!repo) {
    return json({ error: "invalid_repo_url" }, { status: 400 });
  }

  const baseUrl = `https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}`;

  try {
    // Fetch all data in parallel
    const [repoRes, commitsRes, issuesRes, pullsRes] = await Promise.all([
      fetchGitHub(baseUrl),
      fetchGitHub(`${baseUrl}/commits?per_page=15`),
      fetchGitHub(`${baseUrl}/issues?state=all&per_page=10`),
      fetchGitHub(`${baseUrl}/pulls?state=all&per_page=10`),
    ]);

    // Parse responses
    const repoData = repoRes.ok ? await repoRes.json() : null;
    const commitsData = commitsRes.ok ? await commitsRes.json() : [];
    const issuesData = issuesRes.ok ? await issuesRes.json() : [];
    const pullsData = pullsRes.ok ? await pullsRes.json() : [];

    // Format repo info
    const repoInfo = repoData ? {
      name: repoData.name,
      full_name: repoData.full_name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      open_issues: repoData.open_issues_count,
      default_branch: repoData.default_branch,
      updated_at: repoData.updated_at,
      language: repoData.language,
      url: repoData.html_url,
    } : null;

    // Format commits
    const commits = (commitsData as any[]).map((item) => ({
      sha: String(item?.sha ?? ""),
      message: String(item?.commit?.message ?? "").split("\n")[0],
      author: item?.commit?.author?.name ?? null,
      date: item?.commit?.author?.date ?? null,
      url: item?.html_url ?? null,
    }));

    // Format issues (filter out pull requests which are also returned as issues)
    const issues = (issuesData as any[])
      .filter((item) => !item.pull_request)
      .map((item) => ({
        id: item.id,
        number: item.number,
        title: item.title,
        state: item.state,
        created_at: item.created_at,
        updated_at: item.updated_at,
        url: item.html_url,
        labels: (item.labels || []).map((label: any) => ({
          name: label.name,
          color: label.color,
        })),
        user: item.user ? {
          login: item.user.login,
          avatar_url: item.user.avatar_url,
        } : null,
      }));

    // Format pull requests
    const pullRequests = (pullsData as any[]).map((item) => ({
      id: item.id,
      number: item.number,
      title: item.title,
      state: item.state,
      created_at: item.created_at,
      updated_at: item.updated_at,
      url: item.html_url,
      merged_at: item.merged_at,
      user: item.user ? {
        login: item.user.login,
        avatar_url: item.user.avatar_url,
      } : null,
    }));

    return json({
      repoInfo,
      commits,
      issues,
      pullRequests,
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return json({ error: "github_api_error" }, { status: 500 });
  }
}
