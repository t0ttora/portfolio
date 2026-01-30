"use client";

import * as React from "react";
import Link from "next/link";
import { PlusIcon, RefreshCcwIcon, SearchIcon, FilterIcon, WalletIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

type ClientStatus = "Active" | "Completed" | "Archived";
type PaymentStatus = "Paid" | "Pending" | "Overdue";

export type ClientRow = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  project_ref: string | null;
  access_code: string;
  magic_link_token: string | null;
  status: ClientStatus;
  payment_status: PaymentStatus;
};

export type ProjectOption = {
  id: string;
  title: string;
  description?: string | null;
  demo_url?: string | null;
};

async function createClient(payload: {
  name: string;
  email: string | null;
  project_ref: string | null;
  access_code: string;
  magic_link_token: string | null;
  status: ClientStatus;
  payment_status: PaymentStatus;
}) {
  const res = await fetch("/api/admin/clients", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => ""));
  return (await res.json()) as { client: ClientRow };
}

export function ClientsClient(props: {
  initialClients: ClientRow[];
  initialProjects: ProjectOption[];
  initialClientProjects: unknown[];
  initialError?: string;
}) {
  const [clients, setClients] = React.useState<ClientRow[]>(props.initialClients);
  const [projects] = React.useState<ProjectOption[]>(props.initialProjects);
  const [error, setError] = React.useState<string | null>(props.initialError ?? null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<ClientStatus | "All">("All");
  const [paymentFilter, setPaymentFilter] = React.useState<PaymentStatus | "All">("All");

  const [draft, setDraft] = React.useState({
    name: "",
    email: "",
    project_ref: props.initialProjects[0]?.id ?? "",
    access_code: "",
    magic_link_token: "",
    status: "Active" as ClientStatus,
    payment_status: "Pending" as PaymentStatus,
  });

  const projectMap = React.useMemo(() => {
    return new Map(projects.map((project) => [project.id, project]));
  }, [projects]);

  function generateAccessCode() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => alphabet[b % alphabet.length])
      .join("");
  }

  React.useEffect(() => {
    if (isDialogOpen && !draft.access_code) {
      setDraft((prev) => ({
        ...prev,
        access_code: generateAccessCode(),
        magic_link_token: prev.magic_link_token || crypto.randomUUID(),
      }));
    }
  }, [isDialogOpen, draft.access_code]);

  const filteredClients = clients.filter((client) => {
    const q = query.trim().toLowerCase();
    const projectTitle = client.project_ref ? projectMap.get(client.project_ref)?.title ?? "" : "";
    const matchesQuery =
      !q ||
      client.name.toLowerCase().includes(q) ||
      (client.email ?? "").toLowerCase().includes(q) ||
      projectTitle.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || client.status === statusFilter;
    const matchesPayment = paymentFilter === "All" || client.payment_status === paymentFilter;
    return matchesQuery && matchesStatus && matchesPayment;
  });

  async function onCreate() {
    if (!draft.name.trim()) {
      setError("Name is required.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const { client } = await createClient({
        name: draft.name.trim(),
        email: draft.email.trim() ? draft.email.trim() : null,
        project_ref: draft.project_ref ? String(draft.project_ref) : null,
        access_code: draft.access_code.trim(),
        magic_link_token: draft.magic_link_token || crypto.randomUUID(),
        status: draft.status,
        payment_status: draft.payment_status,
      });
      setClients((prev) => [client, ...prev]);
      setDraft({
        name: "",
        email: "",
        project_ref: props.initialProjects[0]?.id ?? "",
        access_code: "",
        magic_link_token: "",
        status: "Active",
        payment_status: "Pending",
      });
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create client.");
    } finally {
      setIsSaving(false);
    }
  }

  function statusBadgeClass(status: ClientStatus) {
    switch (status) {
      case "Completed":
        return "border-emerald-500/40 text-emerald-200";
      case "Archived":
        return "border-white/20 text-white/50";
      case "Active":
      default:
        return "border-white/30 text-white/70";
    }
  }

  function paymentBadgeClass(status: PaymentStatus) {
    switch (status) {
      case "Paid":
        return "border-emerald-500/40 text-emerald-200";
      case "Overdue":
        return "border-amber-400/50 text-amber-200";
      case "Pending":
      default:
        return "border-white/20 text-white/60";
    }
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[36px] border border-white/10 bg-neutral-950/70">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Client Control</CardTitle>
              <CardDescription className="text-white/50">
                Select a client to open the detail page.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" className="rounded-full" variant="secondary">
                    <PlusIcon className="mr-2 size-4" /> Add client
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl">
                  <DialogHeader>
                    <DialogTitle>Add new client</DialogTitle>
                    <DialogDescription>Create a new client record.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Name</Label>
                      <Input
                        value={draft.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setDraft((d) => ({ ...d, name: e.target.value }))
                        }
                        placeholder="Client name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input
                        value={draft.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setDraft((d) => ({ ...d, email: e.target.value }))
                        }
                        placeholder="name@company.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Project</Label>
                      <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={draft.project_ref}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setDraft((d) => ({ ...d, project_ref: e.target.value }))
                        }
                      >
                        <option value="">No project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Access code</Label>
                      <div className="flex items-center gap-2">
                        <Input value={draft.access_code} readOnly />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 rounded-2xl"
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              access_code: generateAccessCode(),
                            }))
                          }
                        >
                          <RefreshCcwIcon className="mr-2 size-4" /> Regenerate
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Status</Label>
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={draft.status}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setDraft((d) => ({
                              ...d,
                              status: (e.target.value || "Active") as ClientStatus,
                            }))
                          }
                        >
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Payment status</Label>
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={draft.payment_status}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setDraft((d) => ({
                              ...d,
                              payment_status: (e.target.value || "Pending") as PaymentStatus,
                            }))
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" className="rounded-2xl" onClick={onCreate} disabled={isSaving}>
                      <PlusIcon className="mr-2 size-4" /> Create client
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.5fr]">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-2">
              <SearchIcon className="size-4 text-white/40" />
              <input
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                placeholder="Search name, email, project"
                className="w-full bg-transparent text-sm text-white outline-none"
              />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 text-xs">
              <FilterIcon className="size-4 text-white/40" />
              <select
                className="w-full bg-transparent text-white outline-none"
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter((e.target.value || "All") as ClientStatus | "All")
                }
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 text-xs">
              <WalletIcon className="size-4 text-white/40" />
              <select
                className="w-full bg-transparent text-white outline-none"
                value={paymentFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setPaymentFilter((e.target.value || "All") as PaymentStatus | "All")
                }
              >
                <option value="All">All payments</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white/50">
              {filteredClients.length} / {clients.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          {clients.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              No clients yet.
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-black/50">
              <div className="border-b border-white/10 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.25em] text-white/40">Signal list</div>
              </div>
              <ScrollArea className="h-[720px]">
                <div className="divide-y divide-white/5">
                  {filteredClients.map((client) => {
                    const project = client.project_ref ? projectMap.get(client.project_ref) : null;
                    return (
                      <Link
                        key={client.id}
                        href={`/admin/clients/${client.id}`}
                        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-white">{client.name}</div>
                          <div className="truncate text-xs text-white/50">
                            {project?.title ?? "Unassigned project"}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] ${statusBadgeClass(
                              client.status,
                            )}`}
                          >
                            {client.status}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] ${paymentBadgeClass(
                              client.payment_status,
                            )}`}
                          >
                            {client.payment_status}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
