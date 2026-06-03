"use client";

import { PrinterIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/jce/chip";

// Print preview pane (Foundations.html:793-824). A glass frame wrapping a
// paper-faithful A4 surface; the chrome is marked `.jce-print-hide` so only the
// paper prints. Live preview for A8/A9, U4 PO, A6 payslip, P8. Tag: Print.

export function PrintPreview({
  title = "Live print preview",
  paperSize = "A4",
  note = "Signature blocks are print-only artifacts — no in-app e-signing anywhere. The system tracks status and stores the scanned signed copy.",
  children,
  className,
}: {
  title?: string;
  paperSize?: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="print-preview"
      className={cn("glass rounded-[var(--r-glass)] p-4", className)}
    >
      <div className="jce-print-hide mb-3 flex items-center gap-2.5">
        <span className="kicker">{title}</span>
        <Chip tone="neutral">{paperSize} · paper-faithful</Chip>
        <Button
          size="sm"
          variant="outline"
          className="ml-auto"
          onClick={() => window.print()}
        >
          <PrinterIcon data-icon="inline-start" />
          Print
        </Button>
      </div>
      <div className="mx-auto max-w-[640px] rounded-md border border-jce-line bg-[var(--solid-surface)] p-5 text-[11px] leading-relaxed text-jce-ink shadow-[var(--solid-shadow)]">
        {children}
      </div>
      {note ? (
        <p className="jce-print-hide mx-auto mt-3 max-w-[60ch] text-center text-ui-12 text-jce-ink-2">
          {note}
        </p>
      ) : null}
    </div>
  );
}
