export type GitHubRepoRef = { owner: string; repo: string };

export function parseGitHubRepoUrl(input: string): GitHubRepoRef | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.hostname !== "github.com") return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");
    if (!owner || !repo) return null;

    return { owner, repo };
  } catch {
    // Support shorthand: owner/repo
    const parts = raw.replace(/^github\.com\//, "").split("/").filter(Boolean);
    if (parts.length === 2) return { owner: parts[0], repo: parts[1] };
    return null;
  }
}
