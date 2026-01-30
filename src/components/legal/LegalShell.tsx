import type { ReactNode } from "react";

export function LegalShell(props: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <header className="mb-10">
          <p className="text-[10px] font-mono tracking-[0.35em] text-white/50">
            LEGAL
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {props.title}
          </h1>
          {props.subtitle ? (
            <p className="mt-2 text-sm text-white/60 font-mono">
              {props.subtitle}
            </p>
          ) : null}
        </header>

        <article className="space-y-8 text-sm leading-relaxed text-white/80">
          {props.children}
        </article>

        <footer className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-white/40 font-mono">
            This page is intentionally not linked in the UI.
          </p>
        </footer>
      </div>
    </main>
  );
}
