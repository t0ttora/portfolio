import { cn } from "@/lib/utils";

function Badge({ className = "", variant = "default", ...props }) {
  const variants = {
    default: "bg-secondary text-secondary-foreground border border-border",
    pending: "bg-amber-500/10 text-amber-200 border border-amber-500/20",
    paid: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20",
    progress: "bg-sky-500/10 text-sky-200 border border-sky-500/20",
  };

  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variants[variant] ?? variants.default,
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
