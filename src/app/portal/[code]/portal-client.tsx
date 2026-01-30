"use client";

import * as React from "react";
import {
  Monitor,
  Smartphone,
  RefreshCw,
  ExternalLink,
  FileText,
  MessageSquare,
  GitCommit,
  CheckCircle2,
  Clock,
  Activity,
  CreditCard,
  Send,
  Sparkles,
  Bug,
  Download,
  FileIcon,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Types
type ClientStatus = "Active" | "Completed" | "Archived";
type PaymentStatus = "Paid" | "Pending" | "Overdue";

type PortalClientProps = {
  code: string;
  client: {
    name: string;
    email: string | null;
    status: ClientStatus;
    payment_status: PaymentStatus;
  };
  project: {
    id: string;
    title: string;
    description: string | null;
    details: string | null;
    demo_url: string | null;
    github_url: string | null;
    short_desc: string | null;
    status: string | null;
    category: string | null;
    card_date: string | null;
    tech: string[] | null;
    image_url: string | null;
  } | null;
  commits: Array<{
    sha: string;
    message: string;
    author: string | null;
    date: string | null;
    url: string | null;
  }>;
  feedback: Array<{
    id: string;
    created_at: string;
    type: "Bug" | "Feature";
    message: string;
  }>;
  intake: Array<{
    id: string;
    created_at: string;
    project_title: string;
    scope: string | null;
    deadline: string | null;
    budget: string | null;
    notes: string | null;
  }>;
  documents: Array<{
    id: string;
    title: string;
    description: string | null;
    file_url: string;
    file_type: string;
    created_at: string;
    uploaded_by: string;
  }>;
  milestones: Array<{
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    completed_at: string | null;
    status: "pending" | "in_progress" | "completed" | "delayed";
  }>;
};

// Helpers
function formatTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return "Az önce";
  if (hours < 24) return `${hours}s önce`;
  if (days === 1) return "Dün";
  if (days < 7) return `${days} gün önce`;
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(date);
}

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(new Date(value));
}

function getFileIcon(fileType: string) {
  const color = fileType.includes("pdf")
    ? "text-red-400"
    : fileType.includes("image")
    ? "text-blue-400"
    : "text-white/50";
  return <FileIcon className={`size-4 ${color}`} />;
}

// ============================================
// LEFT PANEL - Client Info
// ============================================
function LeftPanel({ props, progress, completedMilestones, totalMilestones, upcomingMilestones, onFeedbackOpen }: {
  props: PortalClientProps;
  progress: number;
  completedMilestones: number;
  totalMilestones: number;
  upcomingMilestones: PortalClientProps["milestones"];
  onFeedbackOpen: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-1">
      {/* Project Info */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-lg font-semibold">
            {props.client.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium truncate">{props.project?.title || "Proje"}</h2>
            <p className="text-sm text-white/50 truncate">{props.client.name}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${
              props.client.status === "Active"
                ? "bg-emerald-500/15 text-emerald-400"
                : props.client.status === "Completed"
                ? "bg-blue-500/15 text-blue-400"
                : "bg-white/10 text-white/50"
            }`}
          >
            {props.client.status === "Active" && (
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
            {props.client.status === "Active" ? "Aktif" : props.client.status === "Completed" ? "Tamamlandı" : "Arşivlendi"}
          </span>
          <span
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              props.client.payment_status === "Paid"
                ? "bg-emerald-500/15 text-emerald-400"
                : props.client.payment_status === "Pending"
                ? "bg-amber-500/15 text-amber-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {props.client.payment_status === "Paid" ? "Ödendi" : props.client.payment_status === "Pending" ? "Bekliyor" : "Gecikmiş"}
          </span>
        </div>

        {totalMilestones > 0 && (
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/50">İlerleme</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-white/50 mt-2">
              {completedMilestones} / {totalMilestones} adım
            </p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="size-4 text-white/50" />
          <h3 className="text-sm font-medium">Yaklaşan Adımlar</h3>
        </div>
        <div className="space-y-3">
          {upcomingMilestones.length > 0 ? (
            upcomingMilestones.map((milestone, idx) => (
              <div key={milestone.id} className="flex items-start gap-3">
                <div className="relative">
                  <div
                    className={`size-7 rounded-md flex items-center justify-center ${
                      milestone.status === "in_progress"
                        ? "bg-blue-500/15"
                        : milestone.status === "delayed"
                        ? "bg-red-500/15"
                        : "bg-white/5"
                    }`}
                  >
                    {milestone.status === "in_progress" ? (
                      <Activity className="size-3.5 text-blue-400" />
                    ) : milestone.status === "delayed" ? (
                      <Clock className="size-3.5 text-red-400" />
                    ) : (
                      <Clock className="size-3.5 text-white/30" />
                    )}
                  </div>
                  {idx < upcomingMilestones.length - 1 && (
                    <div className="absolute top-7 left-1/2 -translate-x-1/2 w-px h-5 bg-white/10" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm truncate">{milestone.title}</p>
                  {milestone.due_date && (
                    <p className="text-xs text-white/50 mt-0.5">{formatDate(milestone.due_date)}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/50 text-center py-3">Yaklaşan adım yok</p>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-5 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="size-4 text-white/50" />
          <h3 className="text-sm font-medium">Dosyalar</h3>
        </div>
        <div className="space-y-1">
          {props.documents.length > 0 ? (
            props.documents.slice(0, 5).map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5 transition-colors"
              >
                {getFileIcon(doc.file_type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{doc.title}</p>
                  <p className="text-xs text-white/50">{formatTime(doc.created_at)}</p>
                </div>
                <Download className="size-4 text-white/30" />
              </a>
            ))
          ) : (
            <p className="text-sm text-white/50 text-center py-3">Henüz dosya yok</p>
          )}
        </div>
      </div>

      {/* Feedback Button */}
      <Button onClick={onFeedbackOpen} className="w-full h-11 rounded-xl">
        <MessageSquare className="size-4" />
        Geri Bildirim Ver
      </Button>
    </div>
  );
}

// ============================================
// CENTER PANEL - Preview
// ============================================
function CenterPanel({ props, isLocked }: { props: PortalClientProps; isLocked: boolean }) {
  const [device, setDevice] = React.useState<"desktop" | "mobile">("desktop");
  const [isLoading, setIsLoading] = React.useState(true);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const previewUrl = props.project?.demo_url || "https://olusemre.dev";

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 flex flex-col h-full overflow-hidden">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
        <span className="text-sm text-white/50 truncate max-w-[150px]">{props.project?.title}</span>

        <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
          <button
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
              device === "desktop" ? "bg-white text-black" : "text-white/50 hover:text-white"
            }`}
          >
            <Monitor className="size-4" />
            <span className="hidden lg:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
              device === "mobile" ? "bg-white text-black" : "text-white/50 hover:text-white"
            }`}
          >
            <Smartphone className="size-4" />
            <span className="hidden lg:inline">Mobile</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-colors"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 p-4 flex items-center justify-center bg-black/30 min-h-0">
        <div
          className={`relative h-full transition-all duration-300 ${
            device === "mobile" ? "w-[375px] max-w-full" : "w-full"
          }`}
        >
          <div
            className={`relative h-full bg-neutral-900 overflow-hidden ${
              device === "mobile"
                ? "rounded-[2.5rem] border-[8px] border-neutral-800"
                : "rounded-xl border border-white/10"
            }`}
          >
            {device === "mobile" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-28 h-6 bg-neutral-900 rounded-b-xl" />
            )}

            {isLocked ? (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                <div className="text-center">
                  <CreditCard className="size-12 text-red-400/50 mx-auto mb-3" />
                  <h3 className="font-medium mb-1">Önizleme Kilitli</h3>
                  <p className="text-sm text-white/50">Ödeme bekleniyor</p>
                </div>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center z-10">
                    <Loader2 className="size-6 animate-spin text-white/50" />
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  src={previewUrl}
                  title="Preview"
                  className="w-full h-full"
                  onLoad={() => setIsLoading(false)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// RIGHT PANEL - GitHub Activity
// ============================================
function RightPanel({ props, completedMilestones }: { props: PortalClientProps; completedMilestones: number }) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-1">
      {/* Stats */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Proje Durumu</h3>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-400">Aktif</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-2xl font-semibold">{props.commits.length}</p>
            <p className="text-xs text-white/50 mt-1">Commit</p>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-2xl font-semibold">{completedMilestones}</p>
            <p className="text-xs text-white/50 mt-1">Tamamlanan</p>
          </div>
        </div>
      </div>

      {/* Commits */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-5 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <GitCommit className="size-4 text-white/50" />
          <h3 className="text-sm font-medium">Son Güncellemeler</h3>
        </div>
        <div className="space-y-2">
          {props.commits.length > 0 ? (
            props.commits.slice(0, 10).map((commit) => (
              <a
                key={commit.sha}
                href={commit.url || "#"}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg p-2 hover:bg-white/5 transition-colors"
              >
                <p className="text-sm line-clamp-2">{commit.message}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                  <span className="font-mono">{commit.sha.slice(0, 7)}</span>
                  <span>·</span>
                  <span>{formatTime(commit.date)}</span>
                </div>
              </a>
            ))
          ) : (
            <p className="text-sm text-white/50 text-center py-3">Henüz commit yok</p>
          )}
        </div>
      </div>

      {/* Tech Stack */}
      {props.project?.tech && props.project.tech.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-5">
          <h3 className="text-sm font-medium mb-3">Teknolojiler</h3>
          <div className="flex flex-wrap gap-1.5">
            {props.project.tech.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-white/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function PortalClient(props: PortalClientProps) {
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [mobileTab, setMobileTab] = React.useState<"client" | "preview" | "activity">("preview");
  const [feedbackType, setFeedbackType] = React.useState<"Bug" | "Feature">("Bug");
  const [feedbackMessage, setFeedbackMessage] = React.useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = React.useState(false);

  const isLocked = props.client.payment_status === "Overdue";

  const completedMilestones = props.milestones.filter((m) => m.status === "completed").length;
  const totalMilestones = props.milestones.length;
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const upcomingMilestones = props.milestones
    .filter((m) => m.status !== "completed")
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 4);

  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage.trim()) return;
    setFeedbackSubmitting(true);
    try {
      await fetch("/api/portal/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: props.code, type: feedbackType, message: feedbackMessage }),
      });
      setFeedbackMessage("");
      setFeedbackOpen(false);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#171717]">
      {/* ==================== DESKTOP LAYOUT ==================== */}
      <div className="hidden md:flex h-screen p-4 gap-4">
        {/* Left Column - 280px */}
        <div className="w-[280px] shrink-0">
          <LeftPanel
            props={props}
            progress={progress}
            completedMilestones={completedMilestones}
            totalMilestones={totalMilestones}
            upcomingMilestones={upcomingMilestones}
            onFeedbackOpen={() => setFeedbackOpen(true)}
          />
        </div>

        {/* Center Column - Flexible */}
        <div className="flex-1 min-w-0">
          <CenterPanel props={props} isLocked={isLocked} />
        </div>

        {/* Right Column - 280px */}
        <div className="w-[280px] shrink-0">
          <RightPanel props={props} completedMilestones={completedMilestones} />
        </div>
      </div>

      {/* ==================== MOBILE LAYOUT ==================== */}
      <div className="md:hidden min-h-screen pb-20">
        <div className="p-4">
          {mobileTab === "client" && (
            <LeftPanel
              props={props}
              progress={progress}
              completedMilestones={completedMilestones}
              totalMilestones={totalMilestones}
              upcomingMilestones={upcomingMilestones}
              onFeedbackOpen={() => setFeedbackOpen(true)}
            />
          )}
          {mobileTab === "preview" && (
            <div className="h-[calc(100vh-120px)]">
              <CenterPanel props={props} isLocked={isLocked} />
            </div>
          )}
          {mobileTab === "activity" && (
            <RightPanel props={props} completedMilestones={completedMilestones} />
          )}
        </div>

        {/* Mobile Tab Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#171717] to-transparent pt-8">
          <div className="flex items-center justify-around rounded-xl border border-white/20 bg-neutral-950 p-1">
            <button
              onClick={() => setMobileTab("client")}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
                mobileTab === "client" ? "bg-white/10 text-white" : "text-white/50"
              }`}
            >
              <FileText className="size-5" />
              <span className="text-xs">Bilgi</span>
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
                mobileTab === "preview" ? "bg-white/10 text-white" : "text-white/50"
              }`}
            >
              <Monitor className="size-5" />
              <span className="text-xs">Önizleme</span>
            </button>
            <button
              onClick={() => setMobileTab("activity")}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
                mobileTab === "activity" ? "bg-white/10 text-white" : "text-white/50"
              }`}
            >
              <Activity className="size-5" />
              <span className="text-xs">Aktivite</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== FEEDBACK MODAL ==================== */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-950 border-white/10">
          <DialogHeader>
            <DialogTitle>Geri Bildirim</DialogTitle>
            <DialogDescription>Projeyle ilgili görüşlerinizi paylaşın</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="flex gap-2">
              <button
                onClick={() => setFeedbackType("Bug")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition-colors ${
                  feedbackType === "Bug"
                    ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/30"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                <Bug className="size-4" />
                Bug
              </button>
              <button
                onClick={() => setFeedbackType("Feature")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition-colors ${
                  feedbackType === "Feature"
                    ? "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                <Sparkles className="size-4" />
                Öneri
              </button>
            </div>

            <textarea
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="w-full h-28 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-white/20 placeholder:text-white/30"
            />

            <Button
              onClick={handleFeedbackSubmit}
              disabled={feedbackSubmitting || !feedbackMessage.trim()}
              className="w-full"
            >
              {feedbackSubmitting ? <Loader2 className="size-4 animate-spin" /> : <><Send className="size-4" /> Gönder</>}
            </Button>

            {props.feedback.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 mb-3">Önceki Mesajlar</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {props.feedback.slice(0, 3).map((f) => (
                    <div key={f.id} className="rounded-lg bg-white/5 p-3">
                      <div className="flex items-center gap-2 text-xs">
                        {f.type === "Bug" ? <Bug className="size-3 text-red-400" /> : <Sparkles className="size-3 text-blue-400" />}
                        <span className="text-white/50">{formatTime(f.created_at)}</span>
                      </div>
                      <p className="text-sm text-white/70 mt-1.5">{f.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
