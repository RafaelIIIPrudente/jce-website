"use client";

import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { pmoney } from "@/lib/mock/format";
import { useJce } from "@/lib/mock/role-context";
import { canVerb } from "@/lib/rbac";
import { BLANKETS, BPO_TONE, type Blanket } from "@/lib/mock/purchasing";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

function barColor(pct: number): string {
  if (pct >= 100) return "bg-(--st-danger)";
  if (pct >= 80) return "bg-jce-orange-500";
  return "bg-jce-green-600";
}

// U24 · Blanket POs (pur-phase2b.jsx:568). Ceiling utilization warns at 80%,
// blocks at 100% (Supervisor override). Each release auto-spawns a child PO.
export function BlanketPos() {
  const [sel, setSel] = useState<Blanket | null>(null);
  return sel ? (
    <BlanketDetail blanket={sel} onBack={() => setSel(null)} />
  ) : (
    <BlanketList onOpen={setSel} />
  );
}

function BlanketList({ onOpen }: { onOpen: (b: Blanket) => void }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader kicker="Purchasing · U24 · Phase 2" title="Blanket POs" />
      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Blanket No.</th>
              <th>Supplier</th>
              <th>Project</th>
              <th className="num">Ceiling</th>
              <th>Utilization</th>
              <th className="num">Releases</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {BLANKETS.map((b) => {
              const pct = Math.round((b.used / b.ceiling) * 100);
              return (
                <tr
                  key={b.no}
                  onClick={() => onOpen(b)}
                  className="cursor-pointer"
                >
                  <td>
                    <DocChip code={b.no} />
                  </td>
                  <td className="font-semibold">{b.supplier}</td>
                  <td>{b.project}</td>
                  <td className="num">{pmoney(b.ceiling)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-(--r-pill) bg-(--table-zebra)">
                        <div
                          className={cn("h-full", barColor(pct))}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-ui-12">{pct}%</span>
                    </div>
                  </td>
                  <td className="num">{b.releases}</td>
                  <td>
                    <Chip tone={BPO_TONE[b.status] ?? "neutral"}>
                      {b.status}
                    </Chip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        Ceiling + draw-down for routine supplies. Number format BPO-YY-XXXX.
        Reporting: utilization %, avg release size, projected exhaustion.
      </p>
    </div>
  );
}

function BlanketDetail({
  blanket,
  onBack,
}: {
  blanket: Blanket;
  onBack: () => void;
}) {
  const { role } = useJce();
  const mayVerb = canVerb(role, "pur");
  const pct = Math.round((blanket.used / blanket.ceiling) * 100);
  const exhausted = pct >= 100;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="focus-ring-jce inline-flex w-fit items-center gap-1.5 rounded-(--r-chip) text-ui-12 font-semibold text-jce-ink-2 hover:text-jce-green-900"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden /> Blanket POs
      </button>
      <PageHeader
        kicker="Purchasing · U24"
        title={
          <span className="flex items-center gap-2">
            <DocChip code={blanket.no} /> {blanket.supplier}
          </span>
        }
        actions={
          <>
            <Chip tone={BPO_TONE[blanket.status] ?? "neutral"}>
              {blanket.status}
            </Chip>
            {mayVerb ? (
              <Button
                size="sm"
                disabled={exhausted}
                onClick={() =>
                  toast.success(
                    `Release spawned a child PO (carries ${blanket.no} ref · no fresh approval).`,
                  )
                }
              >
                + New release (child PO)
              </Button>
            ) : null}
          </>
        }
      />

      <div className="solid flex flex-col gap-3 rounded-(--r-solid) p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-ui-13 font-semibold text-jce-ink">
            Ceiling utilization
          </div>
          <Chip tone={exhausted ? "danger" : pct >= 80 ? "pending" : "success"}>
            {pct}% used
          </Chip>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-(--r-pill) bg-(--table-zebra)">
          <div
            className={cn("h-full", barColor(pct))}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-jce-line pt-2 text-ui-12">
          <Cell k="Ceiling" v={pmoney(blanket.ceiling)} />
          <Cell k="Drawn" v={pmoney(blanket.used)} />
          <Cell k="Remaining" v={pmoney(blanket.ceiling - blanket.used)} />
        </div>
      </div>

      {exhausted ? (
        <p className="rounded-(--r-solid) border border-(--st-danger) bg-(--st-danger-bg) px-3 py-2 text-ui-12 text-(--st-danger-ink)">
          Ceiling exhausted (100%) — new releases are blocked. A Supervisor
          override or a fresh blanket is required.
        </p>
      ) : (
        <p className="text-ui-12 text-jce-ink-2">
          Utilization warns at 80%, blocks at 100% (Supervisor override). Each
          release auto-generates a child PO (no fresh approval; carries the
          blanket ref).
        </p>
      )}

      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Release</th>
              <th>Child PO</th>
              <th>Date</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.min(blanket.releases, 4) }).map(
              (_, i) => (
                <tr key={i}>
                  <td className="mono">R-{String(i + 1).padStart(2, "0")}</td>
                  <td>
                    <DocChip
                      code={`${blanket.no.replace("BPO", "2606")}-${i + 1}`}
                    />
                  </td>
                  <td className="mono text-ui-12">
                    2026-0{5 + (i % 2)}-1{i}
                  </td>
                  <td className="num">
                    {pmoney(Math.round(blanket.used / blanket.releases))}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-jce-ink-2">{k}</div>
      <div className="font-mono tabular-nums text-jce-ink">{v}</div>
    </div>
  );
}
