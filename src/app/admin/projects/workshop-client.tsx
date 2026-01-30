"use client";

import * as React from "react";
import Draggable, { type DraggableData, type DraggableEvent } from "react-draggable";
import { motion } from "framer-motion";
import {
  ArrowUpRightIcon,
  GithubIcon,
  LayersIcon,
  PlusIcon,
  RotateCwIcon,
  SparklesIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { fetchGitHubRepoMetadata } from "@/utils/github/client";

type ProjectRow = {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  description: string;
  github_url: string | null;
  demo_url: string | null;
  repo_stats: any;
  position_x: number;
  position_y: number;
  rotation: number;
  z_index: number;
  is_visible: boolean;
};

type ProjectDraft = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  github_url: string;
  demo_url: string;
  is_visible: boolean;
  repo_stats: any;
};

function slugify(input: string): string {
  return (input ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getMaxZ(projects: ProjectRow[]) {
  return projects.reduce((max, p) => Math.max(max, Number(p.z_index) || 0), 0);
}

async function patchProject(id: string, patch: Partial<ProjectRow>) {
  const res = await fetch(`/api/admin/projects/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => ""));
  return (await res.json()) as { project: ProjectRow };
}

async function createProject(payload: Partial<ProjectRow>) {
  const res = await fetch("/api/admin/projects", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => ""));
  return (await res.json()) as { project: ProjectRow };
}

export function WorkshopClient(props: {
  initialProjects: ProjectRow[];
  initialError?: string;
}) {
  const [projects, setProjects] = React.useState<ProjectRow[]>(
    props.initialProjects,
  );

  const nodeRefs = React.useRef(
    new Map<string, React.RefObject<HTMLDivElement | null>>(),
  );
  const getNodeRef = React.useCallback((id: string) => {
    const existing = nodeRefs.current.get(id);
    if (existing) return existing;
    const created = React.createRef<HTMLDivElement>();
    nodeRefs.current.set(id, created);
    return created;
  }, []);

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<ProjectDraft>(() => ({
    title: "",
    slug: "",
    description: "",
    github_url: "",
    demo_url: "",
    is_visible: true,
    repo_stats: {},
  }));

  const [isSaving, setIsSaving] = React.useState(false);
  const [isFetchingGitHub, setIsFetchingGitHub] = React.useState(false);

  const activeProject = React.useMemo(
    () => projects.find((p) => p.id === activeId) ?? null,
    [projects, activeId],
  );

  function openNew() {
    const z = getMaxZ(projects) + 1;
    setActiveId(null);
    setDraft({
      title: "",
      slug: "",
      description: "",
      github_url: "",
      demo_url: "",
      is_visible: true,
      repo_stats: {},
    });
    // pre-bump new cards above existing ones
    void z;
    setSheetOpen(true);
  }

  function openEdit(project: ProjectRow) {
    setActiveId(project.id);
    setDraft({
      id: project.id,
      title: project.title ?? "",
      slug: project.slug ?? "",
      description: project.description ?? "",
      github_url: project.github_url ?? "",
      demo_url: project.demo_url ?? "",
      is_visible: Boolean(project.is_visible),
      repo_stats: project.repo_stats ?? {},
    });
    setSheetOpen(true);
  }

  async function onFetchGitHub() {
    if (!draft.github_url.trim()) return;
    setIsFetchingGitHub(true);
    try {
      const meta = await fetchGitHubRepoMetadata(draft.github_url.trim());
      setDraft((d) => ({
        ...d,
        title: d.title || meta.repo,
        slug: d.slug || slugify(meta.repo),
        description:
          d.description ||
          (meta.description
            ? `${meta.description}\n\n---\n\n(Expanded markdown coming soon.)`
            : ""),
        repo_stats: {
          ...(d.repo_stats ?? {}),
          stars: meta.stars,
          forks: meta.forks,
          language: meta.language,
        },
      }));
    } finally {
      setIsFetchingGitHub(false);
    }
  }

  async function onSave() {
    setIsSaving(true);
    try {
      const payload = {
        title: draft.title.trim(),
        slug: draft.slug.trim() || slugify(draft.title),
        description: draft.description,
        github_url: draft.github_url.trim() || null,
        demo_url: draft.demo_url.trim() || null,
        is_visible: draft.is_visible,
        repo_stats: draft.repo_stats ?? {},
      };

      if (draft.id) {
        const { project } = await patchProject(draft.id, payload as any);
        setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
      } else {
        const z_index = getMaxZ(projects) + 1;
        const { project } = await createProject({
          ...payload,
          z_index,
          position_x: 24,
          position_y: 24,
          rotation: 0,
        } as any);
        setProjects((prev) => [...prev, project]);
      }

      setSheetOpen(false);
    } finally {
      setIsSaving(false);
    }
  }

  function updateLocal(id: string, patch: Partial<ProjectRow>) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  async function persistPosition(id: string, x: number, y: number) {
    updateLocal(id, { position_x: x, position_y: y });
    try {
      const { project } = await patchProject(id, { position_x: x, position_y: y } as any);
      updateLocal(id, project);
    } catch {
      // keep optimistic state
    }
  }

  async function bringToFront(id: string) {
    const next = getMaxZ(projects) + 1;
    updateLocal(id, { z_index: next });
    try {
      const { project } = await patchProject(id, { z_index: next } as any);
      updateLocal(id, project);
    } catch {
      // noop
    }
  }

  async function rotateRandomly(id: string) {
    const rot = Math.round((Math.random() * 14 - 7) * 1);
    updateLocal(id, { rotation: rot });
    try {
      const { project } = await patchProject(id, { rotation: rot } as any);
      updateLocal(id, project);
    } catch {
      // noop
    }
  }

  const errorBanner = props.initialError ? (
    <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
      Failed to load projects: <span className="font-mono">{props.initialError}</span>
    </div>
  ) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">My Projects</h1>
          <p className="text-sm text-muted-foreground">
            Visual workshop — drag cards on the desk.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="border border-border bg-secondary/50 hover:bg-secondary/70"
          onClick={openNew}
        >
          <PlusIcon className="size-4" />
          New
        </Button>
      </div>

      {errorBanner}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayersIcon className="size-4" />
            Desk
          </CardTitle>
          <CardDescription>
            Right-click a card for actions. Drag to reposition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={
              "relative h-[70dvh] w-full overflow-hidden rounded-lg border bg-background" +
              " bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)]" +
              " [background-size:16px_16px]"
            }
          >
            {projects.map((p) => {
              const stats = p.repo_stats ?? {};
              const stars = stats.stars ?? null;
              const language = stats.language ?? null;
              const nodeRef = getNodeRef(p.id);

              return (
                <ContextMenu key={p.id}>
                  <ContextMenuTrigger asChild>
                    <Draggable
                      nodeRef={nodeRef}
                      position={{ x: p.position_x ?? 0, y: p.position_y ?? 0 }}
                      onStop={(
                        _e: DraggableEvent,
                        data: DraggableData,
                      ) => {
                        void persistPosition(p.id, data.x, data.y);
                      }}
                      onDrag={(
                        _e: DraggableEvent,
                        data: DraggableData,
                      ) => {
                        // Keep local state in sync so the element doesn't snap back.
                        updateLocal(p.id, { position_x: data.x, position_y: data.y });
                      }}
                      handle=".drag-handle"
                      bounds="parent"
                    >
                      <div
                        ref={nodeRef}
                        className="absolute"
                        style={{ zIndex: p.z_index ?? 0 }}
                      >
                        <motion.div
                          className="w-64"
                          style={{ rotate: `${p.rotation ?? 0}deg` }}
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 350, damping: 26 }}
                        >
                          <div
                            className={
                              "rounded-lg border bg-card text-card-foreground shadow-sm" +
                              (p.is_visible ? "" : " opacity-55")
                            }
                          >
                            <div className="drag-handle flex cursor-grab items-center justify-between gap-2 px-3 py-2">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">
                                  {p.title}
                                </div>
                                <div className="truncate text-xs text-muted-foreground">
                                  /{p.slug}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {p.github_url ? (
                                  <a
                                    href={p.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-md p-1 text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                                    title="Open GitHub"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <GithubIcon className="size-4" />
                                  </a>
                                ) : null}
                                {p.demo_url ? (
                                  <a
                                    href={p.demo_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-md p-1 text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                                    title="Open Demo"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ArrowUpRightIcon className="size-4" />
                                  </a>
                                ) : null}
                              </div>
                            </div>

                            <Separator />

                            <div className="px-3 py-2">
                              <div className="max-h-12 overflow-hidden text-xs text-muted-foreground">
                                {p.description || "No description yet."}
                              </div>
                              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                                <span>{language ?? "—"}</span>
                                <span>{stars != null ? `★ ${stars}` : ""}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </Draggable>
                  </ContextMenuTrigger>

                  <ContextMenuContent>
                    <ContextMenuItem onSelect={() => void bringToFront(p.id)}>
                      <SparklesIcon className="size-4" />
                      Bring to Front
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => void rotateRandomly(p.id)}>
                      <RotateCwIcon className="size-4" />
                      Rotate Randomly
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onSelect={() => openEdit(p)}>
                      Edit Details
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}

            {projects.length === 0 ? (
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-sm font-medium">No projects yet</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Create one and start arranging your desk.
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[420px] sm:w-[420px]">
          <SheetHeader>
            <SheetTitle>{draft.id ? "Edit Project" : "New Project"}</SheetTitle>
            <SheetDescription>
              Minimal fields; GitHub can auto-fill some metadata.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 px-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(e: any) => {
                  const title = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    title,
                    slug: d.slug || slugify(title),
                  }));
                }}
                placeholder="Project title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={draft.slug}
                onChange={(e: any) =>
                  setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))
                }
                placeholder="my-project"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Button
                  type="button"
                  size="xs"
                  variant="secondary"
                  className="border border-border bg-secondary/50 hover:bg-secondary/70"
                  onClick={() => void onFetchGitHub()}
                  disabled={isFetchingGitHub || !draft.github_url.trim()}
                >
                  {isFetchingGitHub ? "Fetching…" : "Fetch"}
                </Button>
              </div>
              <Input
                id="github_url"
                value={draft.github_url}
                onChange={(e: any) =>
                  setDraft((d) => ({ ...d, github_url: e.target.value }))
                }
                placeholder="https://github.com/owner/repo"
              />
              <div className="text-[11px] text-muted-foreground">
                Auto-fills description, stars, language.
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="demo_url">Demo URL</Label>
              <Input
                id="demo_url"
                value={draft.demo_url}
                onChange={(e: any) =>
                  setDraft((d) => ({ ...d, demo_url: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Markdown)</Label>
              <Textarea
                id="description"
                value={draft.description}
                onChange={(e: any) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
                placeholder="Write the detailed story…"
              />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="grid gap-0.5">
                <div className="text-sm font-medium">Visible</div>
                <div className="text-xs text-muted-foreground">
                  Controls whether it shows publicly.
                </div>
              </div>
              <Switch
                checked={draft.is_visible}
                onCheckedChange={(v: boolean) =>
                  setDraft((d) => ({ ...d, is_visible: Boolean(v) }))
                }
              />
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-medium">Media</div>
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Drop images here (Supabase Storage bucket: <span className="font-mono">projects</span>)
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <div className="text-sm font-medium">Repo Stats</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md border p-2">
                  <div className="text-[11px] text-muted-foreground">Stars</div>
                  <div className="text-sm font-medium">
                    {draft.repo_stats?.stars ?? "—"}
                  </div>
                </div>
                <div className="rounded-md border p-2">
                  <div className="text-[11px] text-muted-foreground">Forks</div>
                  <div className="text-sm font-medium">
                    {draft.repo_stats?.forks ?? "—"}
                  </div>
                </div>
                <div className="rounded-md border p-2">
                  <div className="text-[11px] text-muted-foreground">Language</div>
                  <div className="text-sm font-medium">
                    {draft.repo_stats?.language ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button
              type="button"
              onClick={() => void onSave()}
              disabled={isSaving || !draft.title.trim()}
            >
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
