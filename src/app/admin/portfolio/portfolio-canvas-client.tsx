"use client";

import * as React from "react";
import {
  GithubIcon,
  PlusIcon,
  XIcon,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Code2,
  Quote,
  Minus,
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Mathematics,
  migrateMathStrings,
} from "@tiptap/extension-mathematics";
import Typography from "@tiptap/extension-typography";
import "katex/dist/katex.min.css";

import { useAdminPortfolioStore } from "@/stores/admin-portfolio-store";
import { fetchGitHubRepoMetadata } from "@/utils/github/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type ProjectRow = {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  description: string;
  details?: string | null;
  ref_code?: string | null;
  category?: string | null;
  short_desc?: string | null;
  card_date?: string | null;
  status?: string | null;
  tech?: string[] | null;
  github_url: string | null;
  demo_url: string | null;
  image_url?: string | null;
  repo_stats: any;
  position_x: number;
  position_y: number;
  rotation: number;
  z_index: number;
  is_visible: boolean;
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

type SaveState = "idle" | "saving" | "saved" | "error";

export function PortfolioCanvasClient(props: {
  initialProjects: ProjectRow[];
  initialError?: string;
}) {
  const [projects, setProjects] = React.useState<ProjectRow[]>(props.initialProjects);
  const [saveState, setSaveState] = React.useState<SaveState>("idle");
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [editorHtml, setEditorHtml] = React.useState("");
  const [isMathRendered, setIsMathRendered] = React.useState(true);

  const { mode, selectedProjectId, isRightSidebarOpen, selectProject, openNewProject, clearSelection } =
    useAdminPortfolioStore();

  const activeProject = React.useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const pendingSelectionRef = React.useRef<{
    id?: string;
    slug?: string;
    title?: string;
    ref_code?: string;
    category?: string;
    short_desc?: string;
    card_date?: string;
    status?: string;
    description?: string;
    tech?: string[];
    position_x?: number;
    position_y?: number;
    rotation?: number;
  } | null>(null);

  function resolveSelection(payload: {
    id?: string;
    slug?: string;
    title?: string;
    ref_code?: string;
    category?: string;
    short_desc?: string;
    card_date?: string;
    status?: string;
    description?: string;
    tech?: string[];
    position_x?: number;
    position_y?: number;
    rotation?: number;
  }) {
    const targetId = String(payload.id ?? "").toLowerCase();
    const targetSlug = String(payload.slug ?? "").toLowerCase();
    const targetTitle = String(payload.title ?? "").toLowerCase();
    const targetSlugFromTitle = targetTitle ? slugify(targetTitle) : "";

    const match = projects.find((project) => {
      const slug = String(project.slug ?? "").toLowerCase();
      const id = String(project.id ?? "").toLowerCase();
      const title = String(project.title ?? "").toLowerCase();
      return (
        (targetId && (slug === targetId || id === targetId)) ||
        (targetSlug && slug === targetSlug) ||
        (targetTitle && title === targetTitle) ||
        (targetSlugFromTitle && slug === targetSlugFromTitle)
      );
    });

    if (match) {
      const patch: Partial<ProjectRow> = {};
      if (!match.ref_code && payload.ref_code) patch.ref_code = payload.ref_code;
      if (!match.category && payload.category) patch.category = payload.category;
      if (!match.short_desc && payload.short_desc) patch.short_desc = payload.short_desc;
      if (!match.card_date && payload.card_date) patch.card_date = payload.card_date;
      if (!match.status && payload.status) patch.status = payload.status;
      if (!match.description && payload.description) patch.description = payload.description;
      if ((!match.tech || match.tech.length === 0) && payload.tech) patch.tech = payload.tech;
      if (Number.isFinite(payload.position_x)) patch.position_x = Number(payload.position_x);
      if (Number.isFinite(payload.position_y)) patch.position_y = Number(payload.position_y);
      if (Number.isFinite(payload.rotation)) patch.rotation = Number(payload.rotation);

      if (Object.keys(patch).length > 0) {
        updateLocal(match.id, patch);
        queueSave(match.id, patch);
      }

      skipNextDraftSyncRef.current = true;
      setDraft((prev) => ({
        ...prev,
        title: match.title ?? prev.title,
        slug: match.slug ?? prev.slug,
        description: match.description ?? payload.description ?? prev.description,
        details: (match.details as any) ?? prev.details,
        ref_code: (patch.ref_code ?? match.ref_code ?? payload.ref_code ?? prev.ref_code) as any,
        category: (patch.category ?? match.category ?? payload.category ?? prev.category) as any,
        short_desc: (patch.short_desc ?? match.short_desc ?? payload.short_desc ?? prev.short_desc) as any,
        card_date: (patch.card_date ?? match.card_date ?? payload.card_date ?? prev.card_date) as any,
        status: (patch.status ?? match.status ?? payload.status ?? prev.status) as any,
        tech: (patch.tech ?? match.tech ?? payload.tech ?? prev.tech) as any,
        position_x:
          Number.isFinite(payload.position_x)
            ? Number(payload.position_x)
            : Number(match.position_x ?? prev.position_x),
        position_y:
          Number.isFinite(payload.position_y)
            ? Number(payload.position_y)
            : Number(match.position_y ?? prev.position_y),
        rotation:
          Number.isFinite(payload.rotation)
            ? Number(payload.rotation)
            : Number(match.rotation ?? prev.rotation),
        z_index: Number(match.z_index ?? prev.z_index),
        github_url: match.github_url ?? prev.github_url,
        demo_url: match.demo_url ?? prev.demo_url,
        image_url: (match.image_url as any) ?? prev.image_url,
        is_visible: Boolean(match.is_visible),
        repo_stats: match.repo_stats ?? prev.repo_stats,
      }));

      selectProject(match.id);

      return true;
    }

    return false;
  }

  const resolveSelectionRef = React.useRef(resolveSelection);
  resolveSelectionRef.current = resolveSelection;

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "1") {
      openNewProject();
      params.delete("new");
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`.replace(/\?$/, ""));
    }
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin && event.origin !== "null") return;
      if (!event.data || typeof event.data !== "object") return;
      const payload = event.data as {
        type?: string;
        id?: string;
        slug?: string;
        title?: string;
        ref_code?: string;
        category?: string;
        short_desc?: string;
        card_date?: string;
        status?: string;
        description?: string;
        tech?: string[];
        position_x?: number;
        position_y?: number;
        rotation?: number;
      };
      if (payload.type !== "admin-portfolio-select") return;
      const resolved = resolveSelectionRef.current(payload);
      if (!resolved) {
        pendingSelectionRef.current = payload;
        openNewProject();
        const nextTitle = String(payload.title ?? "").trim();
        const nextSlug = slugify(nextTitle);
        setDraft((prev) => ({
          ...prev,
          title: nextTitle || prev.title,
          slug: nextSlug || prev.slug,
          ref_code: payload.ref_code ?? prev.ref_code,
          category: payload.category ?? prev.category,
          short_desc: payload.short_desc ?? prev.short_desc,
          card_date: payload.card_date ?? prev.card_date,
          status: payload.status ?? prev.status,
          description: payload.description ?? prev.description,
          tech: payload.tech ?? prev.tech,
          position_x: Number.isFinite(payload.position_x)
            ? Number(payload.position_x)
            : prev.position_x,
          position_y: Number.isFinite(payload.position_y)
            ? Number(payload.position_y)
            : prev.position_y,
          rotation: Number.isFinite(payload.rotation)
            ? Number(payload.rotation)
            : prev.rotation,
        }));
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [projects, selectProject, openNewProject]);

  React.useEffect(() => {
    const pending = pendingSelectionRef.current;
    if (!pending) return;
    if (resolveSelectionRef.current(pending)) {
      pendingSelectionRef.current = null;
    }
  }, [projects]);

  const [draft, setDraft] = React.useState<{
    title: string;
    slug: string;
    description: string;
    details: string;
    ref_code: string;
    category: string;
    short_desc: string;
    card_date: string;
    status: string;
    tech: string[];
    position_x: number;
    position_y: number;
    rotation: number;
    z_index: number;
    github_url: string;
    demo_url: string;
    image_url: string;
    is_visible: boolean;
    repo_stats: any;
  }>(() => ({
    title: "",
    slug: "",
    description: "",
    details: "",
    ref_code: "",
    category: "",
    short_desc: "",
    card_date: "",
    status: "",
    tech: [],
    position_x: 0,
    position_y: 0,
    rotation: 0,
    z_index: 0,
    github_url: "",
    demo_url: "",
    image_url: "",
    is_visible: true,
    repo_stats: {},
  }));

  const pendingPatchRef = React.useRef<Partial<ProjectRow> | null>(null);
  const saveTimerRef = React.useRef<number | null>(null);
  const skipNextDraftSyncRef = React.useRef(false);
  const migrateTimerRef = React.useRef<number | null>(null);

  const migrateMathStringsExtended = React.useCallback((editorInstance: Editor | null) => {
    if (!editorInstance) return;
    const { inlineMath } = editorInstance.schema.nodes as any;
    if (!inlineMath) {
      migrateMathStrings(editorInstance);
      return;
    }
    const { doc } = editorInstance.state;
    let tr = editorInstance.state.tr;
    const regexes = [/\$\$([\s\S]+?)\$\$/g, /\$(?!\d+\$)(.+?)\$(?!\d)/g];
    doc.descendants((node, pos) => {
      if (!node.isText || !node.text) return;
      const text = node.text;
      regexes.forEach((regex) => {
        regex.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text))) {
          const start = match.index;
          const end = start + match[0].length;
          const from = tr.mapping.map(pos + start);
          const to = tr.mapping.map(pos + end);
          const $from = tr.doc.resolve(from);
          const parent = $from.parent;
          const index = $from.index();
          if (!parent.canReplaceWith(index, index + 1, inlineMath)) return;
          tr = tr.replaceWith(from, to, inlineMath.create({ latex: match[1] }));
        }
      });
    });
    if (tr.docChanged) {
      tr.setMeta("addToHistory", false);
      editorInstance.view.dispatch(tr);
    }
  }, []);

  const showRawMathStrings = React.useCallback((editorInstance: Editor | null) => {
    if (!editorInstance) return;
    const { inlineMath, blockMath, paragraph } = editorInstance.schema.nodes as any;
    if (!inlineMath || !blockMath || !paragraph) return;
    let tr = editorInstance.state.tr;
    editorInstance.state.doc.descendants((node, pos) => {
      if (node.type === inlineMath) {
        const latex = node.attrs?.latex ?? "";
        const from = tr.mapping.map(pos);
        const to = tr.mapping.map(pos + node.nodeSize);
        tr = tr.replaceWith(from, to, editorInstance.schema.text(`$${latex}$`));
      }
      if (node.type === blockMath) {
        const latex = node.attrs?.latex ?? "";
        const from = tr.mapping.map(pos);
        const to = tr.mapping.map(pos + node.nodeSize);
        tr = tr.replaceWith(
          from,
          to,
          paragraph.create(null, editorInstance.schema.text(`$$${latex}$$`))
        );
      }
    });
    if (tr.docChanged) {
      tr.setMeta("addToHistory", false);
      editorInstance.view.dispatch(tr);
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Typography,
      Link.configure({ openOnClick: false }),
      Image,
      Mathematics.configure({
        katexOptions: {
          throwOnError: false,
        },
      }),
    ],
    content: editorHtml,
    onCreate({ editor }) {
      migrateMathStringsExtended(editor);
    },
    onBlur({ editor }) {
      migrateMathStringsExtended(editor);
    },
    onUpdate({ editor }) {
      setEditorHtml(editor.getHTML());
      if (migrateTimerRef.current) {
        window.clearTimeout(migrateTimerRef.current);
      }
      migrateTimerRef.current = window.setTimeout(() => {
        migrateMathStringsExtended(editor);
      }, 120);
    },
    editorProps: {
      handlePaste(view, event) {
        const html = event.clipboardData?.getData("text/html") ?? "";
        if (html) return false;

        const text = event.clipboardData?.getData("text/plain") ?? "";
        if (!text || !text.includes("$")) return false;

        const fragments: Array<
          | { type: "text"; value: string }
          | { type: "inline"; value: string }
          | { type: "block"; value: string }
        > = [];

        function pushTextWithInline(segment: string) {
          let last = 0;
          const inlineRegex = /\$([^$]+)\$/g;
          let match: RegExpExecArray | null;
          while ((match = inlineRegex.exec(segment))) {
            if (match.index > last) {
              fragments.push({ type: "text", value: segment.slice(last, match.index) });
            }
            fragments.push({ type: "inline", value: match[1] });
            last = match.index + match[0].length;
          }
          if (last < segment.length) {
            fragments.push({ type: "text", value: segment.slice(last) });
          }
        }

        let cursor = 0;
        const blockRegex = /\$\$([\s\S]+?)\$\$/g;
        let blockMatch: RegExpExecArray | null;
        while ((blockMatch = blockRegex.exec(text))) {
          if (blockMatch.index > cursor) {
            pushTextWithInline(text.slice(cursor, blockMatch.index));
          }
          fragments.push({ type: "block", value: blockMatch[1] });
          cursor = blockMatch.index + blockMatch[0].length;
        }
        if (cursor < text.length) {
          pushTextWithInline(text.slice(cursor));
        }

        if (!fragments.length) return false;

        event.preventDefault();
        const editorInstance = editor;
        if (!editorInstance) return false;
        editorInstance.chain().focus();
        fragments.forEach((fragment) => {
          if (fragment.type === "text") {
            editorInstance.commands.insertContent(fragment.value);
          } else if (fragment.type === "inline") {
            editorInstance.commands.insertContent({
              type: "inlineMath",
              attrs: { latex: fragment.value },
            });
          } else if (fragment.type === "block") {
            editorInstance.commands.insertContent({
              type: "blockMath",
              attrs: { latex: fragment.value },
            });
            editorInstance.commands.enter();
          }
        });

        migrateMathStrings(editorInstance);

        return true;
      },
      handleTextInput() {
        return false;
      },
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    if (!isEditorOpen) return;
    editor.commands.setContent(editorHtml || draft.details || "");
    window.setTimeout(() => {
      migrateMathStringsExtended(editor);
    }, 0);
  }, [editor, isEditorOpen, editorHtml, draft.details, migrateMathStringsExtended]);

  const MONTHS = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const YEARS = Array.from({ length: 9 }, (_, idx) => String(2020 + idx));

  function parseCardDate(value: string) {
    const parts = String(value ?? "").trim().split(" ");
    const month = parts[0] ?? "";
    const year = parts[1] ?? "";
    return { month, year };
  }

  function updateLocal(id: string, patch: Partial<ProjectRow>) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function queueSave(id: string, patch: Partial<ProjectRow>) {
    pendingPatchRef.current = { ...(pendingPatchRef.current ?? {}), ...patch };

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    setSaveState("saving");
    setSaveError(null);
    setHasUnsavedChanges(true);

    saveTimerRef.current = window.setTimeout(async () => {
      const pending = pendingPatchRef.current;
      pendingPatchRef.current = null;
      try {
        const { project } = await patchProject(id, pending ?? {});
        updateLocal(id, project);
        setSaveState("saved");
        setHasUnsavedChanges(false);
      } catch (e: any) {
        setSaveState("error");
        setSaveError(e?.message || "Failed to save");
      }
    }, 450);
  }

  function openEditor() {
    setEditorHtml(draft.details || "");
    setIsEditorOpen(true);
    setIsMathRendered(true);
    window.setTimeout(() => editor?.commands.focus(), 0);
  }

  function saveEditor() {
    const html = editor?.getHTML() ?? editorHtml;
    setDraft((d) => ({ ...d, details: html }));
    if (mode === "edit" && activeProject) {
      updateLocal(activeProject.id, { details: html } as any);
      queueSave(activeProject.id, { details: html } as any);
    }
    setIsEditorOpen(false);
  }

  async function flushSave() {
    if (mode !== "edit" || !activeProject) return;
    const patch: Partial<ProjectRow> = {
      title: draft.title,
      slug: draft.slug,
      description: draft.description,
      details: draft.details,
      ref_code: draft.ref_code,
      category: draft.category,
      short_desc: draft.short_desc,
      card_date: draft.card_date,
      status: draft.status,
      tech: draft.tech,
      github_url: draft.github_url || null,
      demo_url: draft.demo_url || null,
      image_url: draft.image_url || null,
      is_visible: draft.is_visible,
      position_x: draft.position_x,
      position_y: draft.position_y,
      rotation: draft.rotation,
      z_index: draft.z_index,
    };

    setSaveState("saving");
    setSaveError(null);
    try {
      const { project } = await patchProject(activeProject.id, patch);
      updateLocal(activeProject.id, project);
      setSaveState("saved");
      setHasUnsavedChanges(false);
    } catch (e: any) {
      setSaveState("error");
      setSaveError(e?.message || "Failed to save");
    }
  }

  React.useEffect(() => {
    if (skipNextDraftSyncRef.current) {
      skipNextDraftSyncRef.current = false;
      return;
    }
    if (mode === "edit" && activeProject) {
      setDraft({
        title: activeProject.title ?? "",
        slug: activeProject.slug ?? "",
        description: activeProject.description ?? "",
        details: (activeProject.details as any) ?? "",
        ref_code: (activeProject.ref_code as any) ?? "",
        category: (activeProject.category as any) ?? "",
        short_desc: (activeProject.short_desc as any) ?? "",
        card_date: (activeProject.card_date as any) ?? "",
        status: (activeProject.status as any) ?? "",
        tech: (activeProject.tech as any) ?? [],
        position_x: Number(activeProject.position_x ?? 0),
        position_y: Number(activeProject.position_y ?? 0),
        rotation: Number(activeProject.rotation ?? 0),
        z_index: Number(activeProject.z_index ?? 0),
        github_url: activeProject.github_url ?? "",
        demo_url: activeProject.demo_url ?? "",
        image_url: (activeProject.image_url as any) ?? "",
        is_visible: Boolean(activeProject.is_visible),
        repo_stats: activeProject.repo_stats ?? {},
      });
      setSaveState("idle");
      setSaveError(null);
    }

    if (mode === "new") {
      setDraft({
        title: "",
        slug: "",
        description: "",
        details: "",
        ref_code: "",
        category: "",
        short_desc: "",
        card_date: "",
        status: "",
        tech: [],
        position_x: 0,
        position_y: 0,
        rotation: 0,
        z_index: 0,
        github_url: "",
        demo_url: "",
        image_url: "",
        is_visible: true,
        repo_stats: {},
      });
      setSaveState("idle");
      setSaveError(null);
    }

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      pendingPatchRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedProjectId]);

  async function onFetchGitHub() {
    const url = draft.github_url.trim();
    if (!url) return;

    try {
      const meta = await fetchGitHubRepoMetadata(url);
      const nextPatch: Partial<ProjectRow> = {
        title: draft.title || meta.repo,
        slug: draft.slug || slugify(meta.repo),
        description:
          draft.description ||
          (meta.description
            ? `${meta.description}\n\n---\n\n(Expanded markdown coming soon.)`
            : ""),
        repo_stats: {
          ...(draft.repo_stats ?? {}),
          stars: meta.stars,
          forks: meta.forks,
          language: meta.language,
        },
      };

      setDraft((d) => ({
        ...d,
        title: (nextPatch.title as any) ?? d.title,
        slug: (nextPatch.slug as any) ?? d.slug,
        description: (nextPatch.description as any) ?? d.description,
        repo_stats: (nextPatch.repo_stats as any) ?? d.repo_stats,
      }));

      if (mode === "edit" && activeProject) {
        updateLocal(activeProject.id, nextPatch);
        queueSave(activeProject.id, nextPatch);
      }
    } catch (e: any) {
      setSaveState("error");
      setSaveError(e?.message || "GitHub fetch failed");
    }
  }

  async function onCreateNew() {
    const payload = {
      title: draft.title.trim(),
      slug: (draft.slug.trim() || slugify(draft.title)).trim(),
      description: draft.description,
      details: draft.details,
      ref_code: draft.ref_code.trim(),
      category: draft.category.trim(),
      short_desc: draft.short_desc.trim(),
      card_date: draft.card_date.trim(),
      status: draft.status.trim(),
      tech: draft.tech,
      position_x: draft.position_x,
      position_y: draft.position_y,
      rotation: draft.rotation,
      z_index: draft.z_index,
      github_url: draft.github_url.trim() || null,
      demo_url: draft.demo_url.trim() || null,
      image_url: draft.image_url.trim() || null,
      is_visible: draft.is_visible,
      repo_stats: draft.repo_stats ?? {},
    };

    setSaveState("saving");
    setSaveError(null);

    try {
      const { project } = await createProject(payload as any);
      setProjects((prev) => [...prev, project]);
      selectProject(project.id);
      setSaveState("saved");
    } catch (e: any) {
      setSaveState("error");
      setSaveError(e?.message || "Failed to create");
    }
  }

  const isPanelOpen = isRightSidebarOpen;

  return (
    <div className="relative">
      <div className="fixed inset-0 z-0 overflow-hidden bg-black">
        <iframe
          src="/?admin=1"
          title="Homepage preview"
          className="h-full w-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups"
        />
      </div>

      {isPanelOpen ? (
        <aside className="fixed right-0 top-0 z-40 m-4 h-[calc(100dvh-2rem)] w-72 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-xl">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3 px-5 pt-5">
                <div>
                  <div className="text-sm font-semibold tracking-tight">Inspector</div>
                <div className="mt-1 text-xs text-white/40">
                    {mode === "new"
                      ? "Create a project"
                      : mode === "edit"
                        ? saveState === "saving"
                          ? "Saving…"
                          : saveState === "saved"
                            ? "Saved"
                            : saveState === "error"
                              ? "Error"
                              : "Ready"
                        : "Select a card"}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  className="h-9 rounded-2xl"
                  onClick={() => clearSelection()}
                >
                  <XIcon className="size-4" />
                </Button>
              </div>

              <Separator className="my-5 bg-white/10" />

              <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-24">
                {mode === null ? (
                  <div className="grid h-full place-items-center">
                    <div className="max-w-[18rem] text-center">
                      <div className="text-sm font-medium">Nothing selected</div>
                      <div className="mt-1 text-xs text-white/60">
                        Select a project from the sidebar to edit it here.
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {saveState === "error" && saveError ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                        {saveError}
                      </div>
                    ) : null}

                    <div className="grid gap-2">
                      <Label>Title</Label>
                      <Input
                        value={draft.title}
                        onChange={(e: any) => {
                          const nextTitle = e.target.value;
                          setDraft((d) => ({
                            ...d,
                            title: nextTitle,
                            slug: d.slug ? d.slug : slugify(nextTitle),
                          }));

                          if (mode === "edit" && activeProject) {
                            const patch = {
                              title: nextTitle,
                              slug: draft.slug || slugify(nextTitle),
                            } as any;
                            updateLocal(activeProject.id, patch);
                            queueSave(activeProject.id, patch);
                          }
                        }}
                        className="rounded-2xl bg-black/60"
                        placeholder="Project title"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Slug</Label>
                      <Input
                        value={draft.slug}
                        onChange={(e: any) => {
                          const next = e.target.value;
                          setDraft((d) => ({ ...d, slug: next }));
                          if (mode === "edit" && activeProject) {
                            updateLocal(activeProject.id, { slug: next } as any);
                            queueSave(activeProject.id, { slug: next } as any);
                          }
                        }}
                        className="rounded-2xl bg-black/60"
                        placeholder="project-slug"
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="grid gap-2">
                        <Label>Ref code</Label>
                        <Input
                          value={draft.ref_code}
                          onChange={(e: any) => {
                            const next = e.target.value;
                            setDraft((d) => ({ ...d, ref_code: next }));
                            if (mode === "edit" && activeProject) {
                              updateLocal(activeProject.id, { ref_code: next } as any);
                              queueSave(activeProject.id, { ref_code: next } as any);
                            }
                          }}
                          className="rounded-2xl bg-black/60"
                          placeholder="PRJ-001"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Status</Label>
                        <select
                          className="h-10 rounded-2xl border border-input bg-black/60 px-3 text-sm"
                          value={draft.status}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const next = e.target.value;
                            setDraft((d) => ({ ...d, status: next }));
                            if (mode === "edit" && activeProject) {
                              updateLocal(activeProject.id, { status: next } as any);
                              queueSave(activeProject.id, { status: next } as any);
                            }
                          }}
                        >
                          <option value="">Select status</option>
                          <option value="PROTOTYPE">PROTOTYPE</option>
                          <option value="BETA">BETA</option>
                          <option value="STABLE">STABLE</option>
                          <option value="LIVE">LIVE</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <select
                          className="h-10 rounded-2xl border border-input bg-black/60 px-3 text-sm"
                          value={draft.category}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const next = e.target.value;
                            setDraft((d) => ({ ...d, category: next }));
                            if (mode === "edit" && activeProject) {
                              updateLocal(activeProject.id, { category: next } as any);
                              queueSave(activeProject.id, { category: next } as any);
                            }
                          }}
                        >
                          <option value="">Select category</option>
                          <option value="SOFT">SOFT</option>
                          <option value="ELEC">ELEC</option>
                          <option value="MECH">MECH</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Date</Label>
                        <div className="grid gap-2">
                          <select
                            className="h-10 rounded-2xl border border-input bg-black/60 px-3 text-sm"
                            value={parseCardDate(draft.card_date).month}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              const year = parseCardDate(draft.card_date).year;
                              const next = `${e.target.value} ${year}`.trim();
                              setDraft((d) => ({ ...d, card_date: next }));
                              if (mode === "edit" && activeProject) {
                                updateLocal(activeProject.id, { card_date: next } as any);
                                queueSave(activeProject.id, { card_date: next } as any);
                              }
                            }}
                          >
                            <option value="">Month</option>
                            {MONTHS.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                          <select
                            className="h-10 rounded-2xl border border-input bg-black/60 px-3 text-sm"
                            value={parseCardDate(draft.card_date).year}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              const month = parseCardDate(draft.card_date).month;
                              const next = `${month} ${e.target.value}`.trim();
                              setDraft((d) => ({ ...d, card_date: next }));
                              if (mode === "edit" && activeProject) {
                                updateLocal(activeProject.id, { card_date: next } as any);
                                queueSave(activeProject.id, { card_date: next } as any);
                              }
                            }}
                          >
                            <option value="">Year</option>
                            {YEARS.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Short label</Label>
                      <Input
                        value={draft.short_desc}
                        onChange={(e: any) => {
                          const next = e.target.value;
                          setDraft((d) => ({ ...d, short_desc: next }));
                          if (mode === "edit" && activeProject) {
                            updateLocal(activeProject.id, { short_desc: next } as any);
                            queueSave(activeProject.id, { short_desc: next } as any);
                          }
                        }}
                        className="rounded-2xl bg-black/60"
                        placeholder="H/W INTERFACE"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Textarea
                        value={draft.description}
                        onChange={(e: any) => {
                          const next = e.target.value;
                          setDraft((d) => ({ ...d, description: next }));
                          if (mode === "edit" && activeProject) {
                            updateLocal(activeProject.id, { description: next } as any);
                            queueSave(activeProject.id, { description: next } as any);
                          }
                        }}
                        className="min-h-[120px] rounded-2xl bg-black/60"
                        placeholder="Short pitch, notes, etc."
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Tags</Label>
                      <Input
                        value={draft.tech.join(", ")}
                        onChange={(e: any) => {
                          const next = e.target.value
                            .split(",")
                            .map((item: string) => item.trim())
                            .filter(Boolean);
                          setDraft((d) => ({ ...d, tech: next }));
                          if (mode === "edit" && activeProject) {
                            updateLocal(activeProject.id, { tech: next } as any);
                            queueSave(activeProject.id, { tech: next } as any);
                          }
                        }}
                        className="rounded-2xl bg-black/60"
                        placeholder="PCB Design, KiCad, Embedded"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Card position</Label>
                      <div className="grid gap-2">
                        <Input
                          value={String(draft.position_x)}
                          onChange={(e: any) => {
                            const next = Number(e.target.value);
                            if (!Number.isFinite(next)) return;
                            setDraft((d) => ({ ...d, position_x: next }));
                            if (mode === "edit" && activeProject) {
                              updateLocal(activeProject.id, { position_x: next } as any);
                              queueSave(activeProject.id, { position_x: next } as any);
                            }
                          }}
                          className="rounded-2xl bg-black/60"
                          placeholder="X"
                        />
                        <Input
                          value={String(draft.position_y)}
                          onChange={(e: any) => {
                            const next = Number(e.target.value);
                            if (!Number.isFinite(next)) return;
                            setDraft((d) => ({ ...d, position_y: next }));
                            if (mode === "edit" && activeProject) {
                              updateLocal(activeProject.id, { position_y: next } as any);
                              queueSave(activeProject.id, { position_y: next } as any);
                            }
                          }}
                          className="rounded-2xl bg-black/60"
                          placeholder="Y"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Input
                          value={String(draft.rotation)}
                          onChange={(e: any) => {
                            const next = Number(e.target.value);
                            if (!Number.isFinite(next)) return;
                            setDraft((d) => ({ ...d, rotation: next }));
                            if (mode === "edit" && activeProject) {
                              updateLocal(activeProject.id, { rotation: next } as any);
                              queueSave(activeProject.id, { rotation: next } as any);
                            }
                          }}
                          className="rounded-2xl bg-black/60"
                          placeholder="Rotation"
                        />
                        <Input
                          value={String(draft.z_index)}
                          onChange={(e: any) => {
                            const next = Number(e.target.value);
                            if (!Number.isFinite(next)) return;
                            setDraft((d) => ({ ...d, z_index: next }));
                            if (mode === "edit" && activeProject) {
                              updateLocal(activeProject.id, { z_index: next } as any);
                              queueSave(activeProject.id, { z_index: next } as any);
                            }
                          }}
                          className="rounded-2xl bg-black/60"
                          placeholder="Z"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Detailed text</Label>
                      <Textarea
                        value={draft.details}
                        onChange={(e: any) => {
                          const next = e.target.value;
                          setDraft((d) => ({ ...d, details: next }));
                          if (mode === "edit" && activeProject) {
                            updateLocal(activeProject.id, { details: next } as any);
                            queueSave(activeProject.id, { details: next } as any);
                          }
                        }}
                        className="min-h-[180px] rounded-2xl bg-black/60"
                        placeholder="Long-form notes, case study, or narrative."
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-9 rounded-2xl"
                        onClick={openEditor}
                      >
                        Open editor
                      </Button>
                    </div>

                    <div className="grid gap-2">
                      <Label>GitHub URL</Label>
                      <Input
                        value={draft.github_url}
                        onChange={(e: any) => {
                          const next = e.target.value;
                          setDraft((d) => ({ ...d, github_url: next }));
                          if (mode === "edit" && activeProject) {
                            updateLocal(activeProject.id, { github_url: next || null } as any);
                            queueSave(activeProject.id, { github_url: next || null } as any);
                          }
                        }}
                        className="rounded-2xl bg-black/60"
                        placeholder="https://github.com/owner/repo"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="rounded-2xl"
                        onClick={onFetchGitHub}
                      >
                        <GithubIcon className="mr-2 size-4" /> Fetch metadata
                      </Button>
                    </div>

                    <div className="grid gap-2">
                      <Label>Demo URL</Label>
                      <Input
                        value={draft.demo_url}
                        onChange={(e: any) => {
                          const next = e.target.value;
                          setDraft((d) => ({ ...d, demo_url: next }));
                          if (mode === "edit" && activeProject) {
                            updateLocal(activeProject.id, {
                              demo_url: next || null,
                            } as any);
                            queueSave(activeProject.id, {
                              demo_url: next || null,
                            } as any);
                          }
                        }}
                        className="rounded-2xl bg-black/60"
                        placeholder="https://demo.example.com"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Image URL</Label>
                      <Input
                        value={draft.image_url}
                        onChange={(e: any) => {
                          const next = e.target.value;
                          setDraft((d) => ({ ...d, image_url: next }));
                          if (mode === "edit" && activeProject) {
                            updateLocal(activeProject.id, {
                              image_url: next || null,
                            } as any);
                            queueSave(activeProject.id, {
                              image_url: next || null,
                            } as any);
                          }
                        }}
                        className="rounded-2xl bg-black/60"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 p-3">
                      <div>
                        <div className="text-sm font-medium">Visible</div>
                        <div className="text-xs text-white/40">Show on public site</div>
                      </div>
                      <Switch
                        checked={draft.is_visible}
                        onCheckedChange={(next: boolean) => {
                          setDraft((d) => ({ ...d, is_visible: next }));
                          if (mode === "edit" && activeProject) {
                            updateLocal(activeProject.id, { is_visible: next } as any);
                            queueSave(activeProject.id, { is_visible: next } as any);
                          }
                        }}
                      />
                    </div>

                    {mode === "edit" && activeProject ? (
                      <div className="rounded-2xl border border-white/10 bg-black/60 p-3">
                        <div className="text-xs text-white/40">Project ID</div>
                        <div className="mt-1 truncate text-xs">{activeProject.id}</div>
                      </div>
                    ) : null}
                  </>
                )}
            </div>
              <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-white/40">
                    {saveState === "saving"
                      ? "Saving…"
                      : saveState === "saved"
                        ? "Saved"
                        : saveState === "error"
                          ? "Save failed"
                          : hasUnsavedChanges
                            ? "Unsaved changes"
                            : "All changes synced"}
                  </div>
                  <Button
                    type="button"
                    className="h-9 rounded-2xl"
                    variant="secondary"
                    onClick={flushSave}
                    disabled={saveState === "saving" || mode !== "edit"}
                  >
                    Save changes
                  </Button>
                </div>
              </div>
          </div>
        </aside>
      ) : null}

      {isEditorOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60">
          <div
            className="absolute inset-0"
            onClick={() => setIsEditorOpen(false)}
          />
          <div
            className="relative z-10 flex h-[720px] w-[960px] min-h-[720px] max-h-[720px] min-w-[960px] max-w-[960px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl"
            style={{
              marginLeft: "calc(var(--admin-sidebar-w) + 2rem)",
              marginRight: "calc(var(--admin-sidebar-w) + 2rem)",
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
              <div>
                <div className="text-sm font-semibold">Detailed editor</div>
                <div className="text-xs text-white/40">
                  WYSIWYG content for the READ page
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-9 rounded-2xl"
                  onClick={saveEditor}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  className="h-9 rounded-2xl"
                  onClick={() => setIsEditorOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Bold"
              >
                <Bold className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Italic"
              >
                <Italic className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Heading 1"
              >
                <Heading1 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Heading 2"
              >
                <Heading2 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Heading 3"
              >
                <Heading3 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Code block"
              >
                <Code2 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Divider"
              >
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Bulleted list"
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Numbered list"
              >
                <ListOrdered className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt("Link URL");
                  if (url) editor?.chain().focus().setLink({ href: url }).run();
                }}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Insert link"
              >
                <LinkIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().unsetLink().run()}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Remove link"
              >
                <Unlink className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt("Image URL");
                  if (url) editor?.chain().focus().setImage({ src: url }).run();
                }}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Insert image"
              >
                <ImageIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const latex = window.prompt("Inline LaTeX (no $)");
                  if (latex) editor?.chain().focus().insertContent({
                    type: "inlineMath",
                    attrs: { latex },
                  }).run();
                }}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Inline LaTeX"
              >
                $\LaTeX$
              </button>
              <button
                type="button"
                onClick={() => {
                  const latex = window.prompt("Block LaTeX (no $$)");
                  if (latex) editor?.chain().focus().insertContent({
                    type: "blockMath",
                    attrs: { latex },
                  }).run();
                }}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Block LaTeX"
              >
                $$\LaTeX$$
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label="Blockquote"
              >
                <Quote className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editor) return;
                  if (isMathRendered) {
                    showRawMathStrings(editor);
                    setIsMathRendered(false);
                    return;
                  }
                  migrateMathStringsExtended(editor);
                  setIsMathRendered(true);
                }}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                aria-label={isMathRendered ? "Show raw LaTeX" : "Render LaTeX"}
              >
                {isMathRendered ? "Raw" : "Render"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-white p-6 text-sm text-slate-800">
              <EditorContent
                editor={editor}
                className="h-full [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:prose [&_.ProseMirror]:max-w-none"
              />
            </div>
          </div>
        </div>
      ) : null}
     </div>
   );
}
