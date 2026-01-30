"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
  Trash2,
  Save,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type ClientStatus = "Active" | "Completed" | "Archived";
type PaymentStatus = "Paid" | "Pending" | "Overdue";
type ClientProjectStatus = "Discovery" | "Design" | "Build" | "QA" | "Done";

type ClientRow = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  project_ref: string | null;
  access_code: string;
  status: ClientStatus;
  payment_status: PaymentStatus;
};

type ProjectOption = {
  id: string;
  title: string;
  description?: string | null;
  demo_url?: string | null;
};

type ClientProjectRow = {
  id: string;
  created_at: string;
  client_id: string;
  title: string;
  summary: string | null;
  status: ClientProjectStatus;
  budget: string | null;
  deadline: string | null;
  notes: string | null;
  portfolio_project_id: string | null;
};

async function patchClient(id: string, patch: Partial<ClientRow>) {
  const res = await fetch(`/api/admin/clients/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => ""));
  return (await res.json()) as { client: ClientRow };
}

async function deleteClient(id: string) {
  const res = await fetch(`/api/admin/clients/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text().catch(() => ""));
  return (await res.json()) as { ok: true };
}

async function createClientProject(payload: {
  client_id: string;
  title: string;
  summary: string | null;
  status: ClientProjectStatus;
  budget: string | null;
  deadline: string | null;
  notes: string | null;
}) {
  const res = await fetch("/api/admin/client-projects", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => ""));
  return (await res.json()) as { clientProject: ClientProjectRow };
}

async function patchClientProject(id: string, patch: Partial<ClientProjectRow>) {
  const res = await fetch(`/api/admin/client-projects/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => ""));
  return (await res.json()) as { clientProject: ClientProjectRow };
}

async function promoteClientProject(id: string) {
  const res = await fetch(`/api/admin/client-projects/${encodeURIComponent(id)}/promote`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text().catch(() => ""));
  return (await res.json()) as {
    clientProject: ClientProjectRow;
    projectId: string;
  };
}

export function ClientDetailClient(props: {
  client: ClientRow;
  projects: ProjectOption[];
  clientProjects: ClientProjectRow[];
}) {
  const [client, setClient] = React.useState<ClientRow>(props.client);
  const [clientProjects, setClientProjects] = React.useState<ClientProjectRow[]>(props.clientProjects);
  const [draft, setDraft] = React.useState<Partial<ClientRow>>({});
  const [projectDrafts, setProjectDrafts] = React.useState<Record<string, Partial<ClientProjectRow>>>({});
  const [newProject, setNewProject] = React.useState({
    title: "",
    summary: "",
    status: "Discovery" as ClientProjectStatus,
    budget: "",
    deadline: "",
    notes: "",
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const projectMap = React.useMemo(
    () => new Map(props.projects.map((project) => [project.id, project])),
    [props.projects],
  );

  const portalLink = client.access_code ? `/portal/${client.access_code}` : "";

  function updateDraft(patch: Partial<ClientRow>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function updateProjectDraft(id: string, patch: Partial<ClientProjectRow>) {
    setProjectDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  }

  async function saveClient() {
    if (Object.keys(draft).length === 0) return;
    setIsSaving(true);
    setError(null);
    try {
      const { client: saved } = await patchClient(client.id, draft);
      setClient(saved);
      setDraft({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update client.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeClient() {
    if (!confirm("Delete this client?")) return;
    setIsSaving(true);
    setError(null);
    try {
      await deleteClient(client.id);
      window.location.href = "/admin/clients";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete client.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
        <Link href="/admin" className="hover:text-white">Admin</Link>
        <ChevronRight className="size-3" />
        <Link href="/admin/clients" className="hover:text-white">Clients</Link>
        <ChevronRight className="size-3" />
        <span className="text-white/80">{client.name}</span>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="rounded-[32px] border border-white/10 bg-neutral-950/70">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <CardDescription className="text-white/50">Client profile</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-9 rounded-full"
                  onClick={saveClient}
                  disabled={isSaving || Object.keys(draft).length === 0}
                >
                  <Save className="mr-2 size-4" /> Save
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="h-9 rounded-full"
                  onClick={removeClient}
                  disabled={isSaving}
                >
                  <Trash2 className="mr-2 size-4" /> Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={draft.name ?? client.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateDraft({ name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  value={(draft.email ?? client.email) ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateDraft({ email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Project</Label>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={(draft.project_ref ?? client.project_ref) ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateDraft({ project_ref: e.target.value || null })
                  }
                >
                  <option value="">No project</option>
                  {props.projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={draft.status ?? client.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateDraft({ status: (e.target.value || "Active") as ClientStatus })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Access code</Label>
                <Input
                  value={draft.access_code ?? client.access_code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateDraft({ access_code: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Payment status</Label>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={draft.payment_status ?? client.payment_status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateDraft({ payment_status: (e.target.value || "Pending") as PaymentStatus })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
              <div>
                <div className="text-sm font-medium">Payment lock</div>
                <div className="text-xs text-muted-foreground">
                  Toggle to lock the portal preview.
                </div>
              </div>
              <Switch
                checked={(draft.payment_status ?? client.payment_status) === "Overdue"}
                onCheckedChange={(checked: boolean) =>
                  updateDraft({ payment_status: checked ? "Overdue" : "Pending" })
                }
              />
            </div>

            {portalLink ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-white/40">Portal</div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono text-white">{portalLink}</span>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 rounded-full"
                    onClick={() => window.open(portalLink, "_blank")}
                  >
                    <ExternalLink className="mr-2 size-3" /> Open
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border border-white/10 bg-neutral-950/70">
          <CardHeader>
            <CardTitle className="text-base">Project briefing</CardTitle>
            <CardDescription className="text-white/50">Linked project snapshot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.project_ref ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-sm font-medium text-white">
                  {projectMap.get(client.project_ref)?.title ?? "Project"}
                </div>
                <div className="mt-2 text-xs text-white/50">
                  {projectMap.get(client.project_ref)?.description ?? "No description."}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
                No project assigned yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[32px] border border-white/10 bg-neutral-950/70">
        <CardHeader>
          <CardTitle className="text-base">Client projects</CardTitle>
          <CardDescription className="text-white/50">
            Create client-bound projects, then promote to portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">New client project</div>
            <div className="mt-3 grid gap-3">
              <Input
                value={newProject.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewProject((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Project title"
              />
              <Input
                value={newProject.summary}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewProject((prev) => ({ ...prev, summary: e.target.value }))
                }
                placeholder="Short summary"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  value={newProject.deadline}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewProject((prev) => ({ ...prev, deadline: e.target.value }))
                  }
                  placeholder="Deadline"
                />
                <Input
                  value={newProject.budget}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewProject((prev) => ({ ...prev, budget: e.target.value }))
                  }
                  placeholder="Budget"
                />
              </div>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={newProject.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setNewProject((prev) => ({
                    ...prev,
                    status: (e.target.value || "Discovery") as ClientProjectStatus,
                  }))
                }
              >
                <option value="Discovery">Discovery</option>
                <option value="Design">Design</option>
                <option value="Build">Build</option>
                <option value="QA">QA</option>
                <option value="Done">Done</option>
              </select>
              <Textarea
                value={newProject.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewProject((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Notes"
              />
              <Button
                type="button"
                className="rounded-2xl"
                onClick={async () => {
                  if (!newProject.title.trim()) return;
                  setIsSaving(true);
                  setError(null);
                  try {
                    const { clientProject } = await createClientProject({
                      client_id: client.id,
                      title: newProject.title.trim(),
                      summary: newProject.summary.trim() || null,
                      status: newProject.status,
                      budget: newProject.budget.trim() || null,
                      deadline: newProject.deadline.trim() || null,
                      notes: newProject.notes.trim() || null,
                    });
                    setClientProjects((prev) => [clientProject, ...prev]);
                    setNewProject({
                      title: "",
                      summary: "",
                      status: "Discovery",
                      budget: "",
                      deadline: "",
                      notes: "",
                    });
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to create client project.");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
              >
                <Plus className="mr-2 size-4" /> Create project
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {clientProjects.length ? (
              clientProjects.map((item) => {
                const draftItem = projectDrafts[item.id] ?? {};
                const title = (draftItem.title ?? item.title) as string;
                const summary = (draftItem.summary ?? item.summary) as string | null;
                const status = (draftItem.status ?? item.status) as ClientProjectStatus;
                const deadline = (draftItem.deadline ?? item.deadline) as string | null;
                const budget = (draftItem.budget ?? item.budget) as string | null;
                const notes = (draftItem.notes ?? item.notes) as string | null;
                const isPromoted = Boolean(item.portfolio_project_id);

                return (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium text-white">{title}</div>
                        <div className="mt-1 text-xs text-white/50">{summary || "No summary."}</div>
                      </div>
                      <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] text-white/70">
                        {status}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-xs">
                      <Input
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateProjectDraft(item.id, { title: e.target.value })
                        }
                        placeholder="Project title"
                      />
                      <Input
                        value={summary ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateProjectDraft(item.id, { summary: e.target.value })
                        }
                        placeholder="Summary"
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input
                          value={deadline ?? ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateProjectDraft(item.id, { deadline: e.target.value })
                          }
                          placeholder="Deadline"
                        />
                        <Input
                          value={budget ?? ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateProjectDraft(item.id, { budget: e.target.value })
                          }
                          placeholder="Budget"
                        />
                      </div>
                      <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={status}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          updateProjectDraft(item.id, {
                            status: (e.target.value || "Discovery") as ClientProjectStatus,
                          })
                        }
                      >
                        <option value="Discovery">Discovery</option>
                        <option value="Design">Design</option>
                        <option value="Build">Build</option>
                        <option value="QA">QA</option>
                        <option value="Done">Done</option>
                      </select>
                      <Textarea
                        value={notes ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          updateProjectDraft(item.id, { notes: e.target.value })
                        }
                        placeholder="Notes"
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-8 rounded-full"
                        onClick={async () => {
                          setIsSaving(true);
                          setError(null);
                          try {
                            const { clientProject } = await patchClientProject(item.id, {
                              title,
                              summary,
                              status,
                              deadline,
                              budget,
                              notes,
                            });
                            setClientProjects((prev) =>
                              prev.map((row) => (row.id === item.id ? clientProject : row)),
                            );
                            setProjectDrafts((prev) => {
                              const next = { ...prev };
                              delete next[item.id];
                              return next;
                            });
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to update project.");
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                        disabled={isSaving}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 rounded-full"
                        onClick={async () => {
                          if (isPromoted) return;
                          setIsSaving(true);
                          setError(null);
                          try {
                            const { clientProject } = await promoteClientProject(item.id);
                            setClientProjects((prev) =>
                              prev.map((row) => (row.id === item.id ? clientProject : row)),
                            );
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to promote project.");
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                        disabled={isSaving || isPromoted}
                      >
                        {isPromoted ? "Promoted" : "Promote to portfolio"}
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
                No client projects yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
