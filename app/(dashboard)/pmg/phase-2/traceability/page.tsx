import type { Metadata } from "next";

import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

export const metadata: Metadata = { title: "Traceability" };

// P17 · MR → PO → delivery traceability (pmg-phase2.jsx:338). Status lights per
// hop: MR line → PO → tracker stage → MRR. A hop with no PO/receipt yet shows an
// amber "pending" light, never a broken link. (References Purchasing/Warehouse
// mock fixtures — PROPOSED, downstream owners not built yet.)
type Hop = "done" | "active" | "pending";
type Row = {
  mr: string;
  item: string;
  po: string;
  stage: number | null;
  local: number | null;
  mrr: string | null;
  hops: [Hop, Hop, Hop, Hop];
};

const ROWS: Row[] = [
  {
    mr: "JCE-MR-2026-0142 · L3",
    item: "Transformer 100KVA ×4",
    po: "2605-0188IC",
    stage: 6,
    local: null,
    mrr: null,
    hops: ["done", "done", "active", "pending"],
  },
  {
    mr: "JCE-MR-2026-0142 · L1",
    item: "ACSR conductor 1,800m",
    po: "2605-0201",
    stage: null,
    local: 1,
    mrr: null,
    hops: ["done", "done", "active", "pending"],
  },
  {
    mr: "JCE-MR-2026-0138 · L2",
    item: "Relays ×6",
    po: "2604-0166",
    stage: null,
    local: 5,
    mrr: "MRR-2026-0140",
    hops: ["done", "done", "done", "done"],
  },
];

function lightColor(s: Hop): string {
  if (s === "done") return "var(--st-success)";
  if (s === "active") return "var(--st-info)";
  return "var(--st-pending)";
}

function Light({ s }: { s: Hop }) {
  return (
    <span
      className="inline-block size-2.5 rounded-full align-middle"
      style={{ background: lightColor(s) }}
      aria-hidden
    />
  );
}

export default function TraceabilityPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        kicker="PMG · P17 · Phase 2"
        title="MR → PO → delivery traceability"
      />
      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>MR line</th>
              <th>Item</th>
              <th>① MR approved</th>
              <th>② PO raised</th>
              <th>③ Shipment / stage</th>
              <th>④ Stock receipt</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.mr}>
                <td>
                  <DocChip code={r.mr} />
                </td>
                <td>{r.item}</td>
                <td>
                  <Light s={r.hops[0]} /> approved
                </td>
                <td>
                  <Light s={r.hops[1]} /> <DocChip code={r.po} />
                </td>
                <td>
                  <Light s={r.hops[2]} />{" "}
                  {r.stage ? (
                    <Chip tone="info">Import {r.stage}/15</Chip>
                  ) : (
                    <Chip tone="neutral">Local {r.local}/5</Chip>
                  )}
                </td>
                <td>
                  <Light s={r.hops[3]} />{" "}
                  {r.mrr ? (
                    <DocChip code={r.mrr} />
                  ) : (
                    <span className="text-ui-12 text-(--st-pending-ink)">
                      awaiting
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-ui-12 text-jce-ink-2">
        End-to-end status lights per hop: each For-Purchase MR line → its PO →
        import/local tracker stage → the Locked MRR that closes the loop. An
        amber light means that hop is pending — never a broken link.
      </p>
    </div>
  );
}
