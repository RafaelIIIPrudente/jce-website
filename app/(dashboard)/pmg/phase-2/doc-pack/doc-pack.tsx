"use client";

import { useState } from "react";
import { CheckIcon, PrinterIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// P18 · Document pack export (pmg-phase2.jsx:450). Per-period bundle checklist →
// ordered PDF set (P8 report, NET AMOUNT sheet, P14 photos, …).
type Key = "report" | "net" | "soa" | "photos" | "mrr" | "signoff";
const ITEMS: [Key, string, string][] = [
  ["report", "Accomplishment report (byte-faithful print)", "P8"],
  ["net", "NET AMOUNT computation sheet", "P8"],
  ["soa", "Statement of Account", "A9"],
  ["photos", "Field photo evidence (reviewed)", "P14"],
  ["mrr", "Supporting MRR receipts", "W4"],
  ["signoff", "Signatory page (print-only)", "—"],
];

export function DocPack() {
  const [sel, setSel] = useState<Record<Key, boolean>>({
    report: true,
    net: true,
    soa: true,
    photos: true,
    mrr: false,
    signoff: true,
  });
  const chosen = ITEMS.filter(([k]) => sel[k]);
  const count = chosen.length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        kicker="PMG · P18 · Phase 2"
        title="Document pack export"
        actions={
          <select className="field h-9 w-auto" aria-label="Period">
            <option>PB5 · Cavite 69KV</option>
            <option>PB1 · NORECO II</option>
          </select>
        }
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="solid rounded-(--r-solid) p-5">
          <h2 className="text-ui-14 font-semibold text-jce-ink">
            Pack contents
          </h2>
          <div className="mt-2 flex flex-col">
            {ITEMS.map(([k, label, src]) => (
              <label
                key={k}
                className="flex items-center gap-2 border-b border-jce-line py-2.5 text-ui-13"
              >
                <input
                  type="checkbox"
                  checked={sel[k]}
                  onChange={(e) =>
                    setSel((s) => ({ ...s, [k]: e.target.checked }))
                  }
                  className="accent-jce-green-700"
                />
                <span className="flex-1 text-jce-ink">{label}</span>
                <DocChip code={src} />
              </label>
            ))}
          </div>
          <Button
            className="mt-4 w-full"
            disabled={count === 0}
            onClick={() =>
              toast.success(`Pack exported — ${count} documents → PDF set.`)
            }
          >
            <PrinterIcon data-icon="inline-start" /> Export pack ({count} docs)
            → PDF set
          </Button>
        </div>
        <div className="glass rounded-(--r-glass) p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="kicker">Pack preview</span>
            <Chip tone="neutral">{count}-document bundle</Chip>
          </div>
          <div className="solid rounded-(--r-solid) p-4">
            {count === 0 ? (
              <div className="px-3 py-8 text-center text-ui-12 text-jce-ink-2">
                Nothing selected — pick at least one document to bundle.
              </div>
            ) : (
              <ol className="flex flex-col gap-1.5">
                {chosen.map(([k, label], i) => (
                  <li key={k} className="flex items-center gap-2.5 text-ui-13">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-jce-green-100 text-[10px] font-bold text-jce-green-700">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-jce-ink">{label}</span>
                    <CheckIcon
                      className="size-3.5 text-(--st-success)"
                      aria-hidden
                    />
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        One-click bundle per progress billing — report + NET AMOUNT +
        attachments collated into a single ordered PDF set for the client
        submission.
      </p>
    </div>
  );
}
