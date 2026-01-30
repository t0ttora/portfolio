import { cn } from "@/lib/utils";

function Table({ className = "", ...props }) {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <table
        data-slot="table"
        className="w-full caption-bottom text-sm"
        {...props}
      />
    </div>
  );
}

function TableHeader({ className = "", ...props }) {
  return <thead data-slot="table-header" className={cn("", className)} {...props} />;
}

function TableBody({ className = "", ...props }) {
  return <tbody data-slot="table-body" className={cn("", className)} {...props} />;
}

function TableRow({ className = "", ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors hover:bg-muted/50",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className = "", ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-3 text-left align-middle text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className = "", ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn("p-3 align-middle", className)}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
