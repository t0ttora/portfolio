import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { isAllowedVaultIdentity } from "@/utils/supabase/middleware";
import { Button } from "@/components/ui/button";


export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (!isAllowedVaultIdentity(user.email)) redirect("/");

  const metrics = [
    { label: "Active Projects", value: "7", hint: "last 30 days" },
    { label: "Client Requests", value: "12", hint: "open" },
    { label: "Avg. Cycle", value: "18d", hint: "steady" },
    { label: "Deploys", value: "4", hint: "this week" },
    { label: "Assets", value: "128", hint: "synced" },
    { label: "Notes", value: "36", hint: "drafts" },
  ];

  const activity = [
    { subject: "Portfolio / Basil", from: "Auto-save", time: "2m" },
    { subject: "Client review: Northwind", from: "Client Portal", time: "1h" },
    { subject: "New asset uploaded", from: user.email ?? "you", time: "4h" },
    { subject: "Invoice approved", from: "Billing", time: "1d" },
    { subject: "Copy update requested", from: "Ops", time: "2d" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome, engineer.</h1>
          <p className="mt-2 text-sm text-white/50">
            Systems synced. Your studio is ready for the next move.
          </p>
        </div>
        <Button asChild className="rounded-2xl" variant="secondary">
          <Link href="/">Visit website</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-white/10 bg-neutral-950 p-4"
          >
            <div className="text-xs uppercase tracking-widest text-white/40">
              {metric.label}
            </div>
            <div className="mt-3 text-3xl font-semibold text-white">
              {metric.value}
            </div>
            <div className="mt-1 text-xs text-white/50">{metric.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-xl border border-white/10 bg-neutral-950">
          <div className="border-b border-white/10 px-4 py-3">
            <div className="text-sm font-semibold">Activity Feed</div>
            <div className="text-xs text-white/50">Recent movement</div>
          </div>
          <div className="divide-y divide-white/10">
            {activity.map((item) => (
              <div key={item.subject} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">
                    {item.subject}
                  </div>
                  <div className="truncate text-xs text-white/50">
                    {item.from}
                  </div>
                </div>
                <div className="text-xs text-white/50">{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <div className="text-sm font-semibold">Focus</div>
          <div className="mt-1 text-xs text-white/50">Current priorities</div>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-start justify-between">
              <span>Finalize portfolio refresh</span>
              <span className="text-xs text-white/40">Today</span>
            </li>
            <li className="flex items-start justify-between">
              <span>Reply to client feedback</span>
              <span className="text-xs text-white/40">Tomorrow</span>
            </li>
            <li className="flex items-start justify-between">
              <span>Schedule deploy window</span>
              <span className="text-xs text-white/40">Fri</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
