"use client";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

// Document-number chip — scannable, copyable references in every register and
// header (jce-tokens.css:190-197 · Foundations.html:900-903). Click to copy.
// Tag: Solid.

export function DocChip({
  code,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & { code: string }) {
  return (
    <button
      type="button"
      data-slot="doc-chip"
      title="Click to copy"
      className={cn("docchip focus-ring-jce", className)}
      onClick={(e) => {
        e.stopPropagation();
        void navigator.clipboard?.writeText(code);
        toast.success(`Copied ${code}`);
      }}
      {...props}
    >
      {code}
    </button>
  );
}
