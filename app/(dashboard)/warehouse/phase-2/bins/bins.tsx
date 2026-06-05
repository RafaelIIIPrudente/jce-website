"use client";

import { useState } from "react";
import { ScanLineIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { BINS } from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { EmptyState } from "@/components/jce/empty-state";

// A deterministic 5×5 mock QR (filled cells from a fixed bitmask per bin) — no
// hex; filled cells use the ink token.
const QR_MASKS = [0x1f8d7, 0x1a2b5, 0x0f3e1, 0x15a4b];
function qrCells(mask: number): boolean[] {
  return Array.from({ length: 25 }, (_, i) => ((mask >> i) & 1) === 1);
}

// W13 · Bins & barcodes (wh-phase2.jsx:371). Bin cards + Scan mode (mock);
// camera-first capture for receipts, issues, counts.
export function Bins() {
  const { role } = useJce();
  const mayEdit = canEdit(role, "wh");
  const [scan, setScan] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W13 · Phase 2"
        title="Bins & barcodes"
        actions={
          <>
            <Button
              variant={scan ? "accent" : "ghost"}
              size="sm"
              onClick={() => {
                setScan((s) => !s);
                toast.info(
                  scan
                    ? "Scan mode off."
                    : "Scan mode — point the camera at a bin QR (mock).",
                );
              }}
            >
              <ScanLineIcon data-icon="inline-start" /> Scan mode
            </Button>
            {mayEdit ? (
              <Button
                size="sm"
                onClick={() =>
                  toast.info("Add bin — structured location within a Location.")
                }
              >
                + Add bin
              </Button>
            ) : null}
          </>
        }
      />

      {scan ? (
        <div className="glass flex items-start gap-3 rounded-(--r-glass) p-4">
          <ScanLineIcon
            className="mt-0.5 size-5 shrink-0 text-jce-green-700"
            aria-hidden
          />
          <div className="text-ui-12 text-jce-ink-2">
            <div className="text-ui-13 font-semibold text-jce-ink">
              Scan-first capture
            </div>
            Camera-first, mobile-friendly flows for receipts, issues and counts
            — scan a bin&apos;s QR or an item barcode to jump straight to its
            movement entry.
          </div>
        </div>
      ) : null}

      {BINS.length === 0 ? (
        <EmptyState
          title="No bins yet"
          description="Add a bin location to start scanning."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BINS.map((b, i) => (
            <div
              key={b.bin}
              className="solid flex gap-3 rounded-(--r-solid) p-4"
            >
              <div className="grid size-16 shrink-0 grid-cols-5 grid-rows-5 gap-px rounded-(--r-chip) border border-jce-line p-1">
                {qrCells(QR_MASKS[i % QR_MASKS.length] ?? 0).map((on, j) => (
                  <span
                    key={j}
                    className={cn(
                      "rounded-[1px]",
                      on ? "bg-jce-ink" : "bg-transparent",
                    )}
                    aria-hidden
                  />
                ))}
              </div>
              <div className="min-w-0">
                <div className="font-mono text-ui-14 font-bold text-jce-ink">
                  {b.bin}
                </div>
                <div className="text-ui-12 text-jce-ink-2">
                  {b.loc} · {b.zone}
                </div>
                <div className="mt-1 text-ui-12 text-jce-ink">
                  {b.items} items · {b.qty}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-ui-12 text-jce-ink-2">
        Structured bin locations within a Location; barcode / QR scanning for
        receipts, issues, and counts.
      </p>
    </div>
  );
}
