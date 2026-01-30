import type { ReactNode } from "react";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminProfileMenu } from "@/components/admin/AdminProfileMenu";
import { AdminBackground } from "@/components/admin/AdminBackground";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function AdminLayout(props: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      className="dark min-h-dvh text-foreground bg-[#171717]"
      style={{ "--admin-sidebar-w": "18rem" } as any}
    >
      <AdminBackground />
      
      <aside className="fixed left-0 top-0 z-40 m-4 h-[calc(100dvh-2rem)] w-72 overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-xl">
          <div className="flex h-full flex-col">
            <div className="px-5 pt-5">
            <AdminProfileMenu email={user?.email} maintenanceEnabled={false} />
          </div>

          <Separator className="my-5" />

          <div className="flex-1 px-3">
            <AdminNav />
          </div>

          <div className="px-4 pb-5">
            <a
              href="/admin/portfolio?new=1"
              className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/90"
            >
              <span className="text-base leading-none">+</span>
              Create project
            </a>
          </div>
        </div>
      </aside>

      <main className="h-dvh overflow-y-auto pl-[calc(var(--admin-sidebar-w)+2rem)] pr-4">
        <div className="w-full p-4">{props.children}</div>
      </main>
    </div>
  );
}
