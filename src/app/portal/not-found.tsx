export default function PortalNotFound() {
  return (
    <div className="min-h-dvh bg-black text-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="text-xs uppercase tracking-[0.35em] text-white/40">Portal</div>
        <h1 className="mt-4 text-3xl font-semibold">Access code not found</h1>
        <p className="mt-3 text-sm text-white/60">
          This portal link is invalid or has expired. Please contact the studio for a new
          access code.
        </p>
      </div>
    </div>
  );
}
