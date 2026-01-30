import type { GitHubRepoRef } from "./parse";
import { parseGitHubRepoUrl } from "./parse";

export type GitHubRepoMetadata = {
  owner: string;
  repo: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
};

export async function fetchGitHubRepoMetadata(
  githubUrl: string,
): Promise<GitHubRepoMetadata> {
  const repo = parseGitHubRepoUrl(githubUrl);
  if (!repo) throw new Error("Invalid GitHub URL");
  return fetchGitHubRepoMetadataByRef(repo);
}

export async function fetchGitHubRepoMetadataByRef(
  repo: GitHubRepoRef,
): Promise<GitHubRepoMetadata> {
  const qs = new URLSearchParams({ owner: repo.owner, repo: repo.repo });
  const res = await fetch(`/api/admin/github?${qs.toString()}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to fetch GitHub metadata");
  }
  return (await res.json()) as GitHubRepoMetadata;
}
