// ============================================================================
// JCE SYSTEM — Warehouse module fixtures + derivations (Part 8, FINAL module).
// Ported from wh-data.jsx + the Phase-2 inline fixtures. UI/UX mock only.
//
// STOCK-ON-HAND IS NEVER TYPED — it is the running sum of immutable
// StockMovements that post ONLY when a document Locks. available = onHand −
// reserved. Both render .computed / non-editable. (§10.3.3, §10.9, §10.12)
//
// • qn/peso REUSED from lib/mock/format.ts. SO# from canonical SALES_ORDERS.
// • W8 verification is driven LIVE from lib/mock/pmg.ts (getMr/getMrLines +
//   reservedQty/forPurchaseQty) — no parallel reservation math.
// • MRR REGISTRY is the canonical owner of the Goods-Receipt event. The three
//   LOCKED MRRs are sourced FROM lib/mock/purchasing.ts GOODS_RECEIPTS (via
//   findPo) so they mirror it byte-for-byte (no MRR number maps to two POs).
//   The two in-flight receipts keep their narrative with fresh, non-colliding
//   numbers. Import GOODS_RECEIPTS read-only; nothing is re-exported.
// ============================================================================

import { type Tone } from "@/lib/mock/bdd";
import {
  SITEENG_SO,
  getMr,
  getMrLines,
  reservedQty,
  forPurchaseQty,
  type MrLine,
} from "@/lib/mock/pmg";
import { GOODS_RECEIPTS, findPo } from "@/lib/mock/purchasing";

export { SITEENG_SO };

// ---- W1 project / cost-centre cards ----------------------------------------
export type WhProject = {
  name: string;
  type: "Customer" | "Cost Center";
  so: string | null;
  items: number;
  onhand: number;
  open: number;
};

export const WH_PROJECTS: readonly WhProject[] = [
  {
    name: "NORECO II — 13.2KV",
    type: "Customer",
    so: "26-05-378",
    items: 42,
    onhand: 1860,
    open: 3,
  },
  {
    name: "Cavite 69KV",
    type: "Customer",
    so: "26-04-355",
    items: 28,
    onhand: 940,
    open: 1,
  },
  {
    name: "WORKSHOP",
    type: "Cost Center",
    so: null,
    items: 64,
    onhand: 5120,
    open: 2,
  },
  {
    name: "JCE STOCK",
    type: "Cost Center",
    so: null,
    items: 120,
    onhand: 8800,
    open: 0,
  },
  {
    name: "MOTORPOOL",
    type: "Cost Center",
    so: null,
    items: 36,
    onhand: 410,
    open: 0,
  },
] as const;

export const COST_CENTRES: readonly string[] = [
  "WORKSHOP",
  "JCE STOCK",
  "MOTORPOOL",
];
export function isCostCentre(project: string): boolean {
  return COST_CENTRES.includes(project);
}

// ---- W2 stock monitoring ledger (NORECO II, BOQ-driven) --------------------
// Planned seeds from the PMG BOQ (§10.2 #1 — typed fixture; cross-references the
// NORECO II anchor). Delivered = Σ Locked MRR receipts · Utilized = Σ Locked
// Release issues (seeded here as the materialized rollup). Undelivered / Balance
// / Variance DERIVE — see ledgerDerive().
export type LedgerRow = {
  wbs: string | null;
  item: string;
  unit: string;
  cost: number;
  planned: number | null;
  delivered: number;
  utilized: number;
  offBoq?: boolean;
};

export const WH_LEDGER: readonly LedgerRow[] = [
  {
    wbs: "A.1",
    item: "Concrete poles 35ft",
    unit: "pcs",
    cost: 9000,
    planned: 120,
    delivered: 80,
    utilized: 54,
  },
  {
    wbs: "B.1",
    item: "Distribution transformer 100KVA",
    unit: "set",
    cost: 300000,
    planned: 30,
    delivered: 6,
    utilized: 2,
  },
  {
    wbs: "B.2",
    item: "ACSR conductor 1/0",
    unit: "m",
    cost: 120,
    planned: 18000,
    delivered: 8000,
    utilized: 6540,
  },
  {
    wbs: "B.3",
    item: "Pole-line hardware set",
    unit: "set",
    cost: 4500,
    planned: 120,
    delivered: 120,
    utilized: 88,
  },
  {
    wbs: null,
    item: "Danger/warning signage",
    unit: "pcs",
    cost: 180,
    planned: null,
    delivered: 200,
    utilized: 120,
    offBoq: true,
  },
] as const;

/** Cost-centre ledger (illustrative rollup — no plan / variance). */
export const WH_LEDGER_COSTCTR: readonly LedgerRow[] = [
  {
    wbs: null,
    item: "Welding rod E6013",
    unit: "box",
    cost: 320,
    planned: null,
    delivered: 180,
    utilized: 148,
  },
  {
    wbs: null,
    item: 'Cutting disc 4"',
    unit: "pcs",
    cost: 45,
    planned: null,
    delivered: 600,
    utilized: 540,
  },
  {
    wbs: null,
    item: "Steel angle bar 50×50×6",
    unit: "pcs",
    cost: 340,
    planned: null,
    delivered: 320,
    utilized: 210,
  },
] as const;

/** Derived ledger columns — never editable. (§10.4) */
export function ledgerDerive(r: LedgerRow): {
  undelivered: number | null;
  balance: number;
  variance: number | null;
} {
  return {
    undelivered: r.planned != null ? r.planned - r.delivered : null,
    balance: r.delivered - r.utilized,
    variance: r.planned != null ? r.delivered - r.planned : null,
  };
}

// ---- W3 item master --------------------------------------------------------
export type WhItem = {
  code: string;
  desc: string;
  unit: string;
  main: number;
  sites: number;
  reserved: number;
  cat: string;
};

export const WH_ITEMS: readonly WhItem[] = [
  {
    code: "ITM-00142",
    desc: "ACSR conductor 1/0",
    unit: "m",
    main: 1200,
    sites: 6800,
    reserved: 1800,
    cat: "Conductors",
  },
  {
    code: "ITM-00088",
    desc: "Distribution transformer 100KVA",
    unit: "set",
    main: 2,
    sites: 2,
    reserved: 4,
    cat: "Transformers",
  },
  {
    code: "ITM-00210",
    desc: "Concrete poles 35ft",
    unit: "pcs",
    main: 0,
    sites: 26,
    reserved: 0,
    cat: "Civil",
  },
  {
    code: "ITM-00305",
    desc: "Insulator pin-type 15KV",
    unit: "pcs",
    main: 240,
    sites: 0,
    reserved: 240,
    cat: "Hardware",
  },
] as const;

/** On-hand = main + sites — the materialized sum of movements, never an input. */
export function itemOnHand(it: WhItem): number {
  return it.main + it.sites;
}
/** Available = on_hand − reserved (live, .computed; red when negative). */
export function itemAvailable(it: WhItem): number {
  return itemOnHand(it) - it.reserved;
}

// ---- W4/W5/W6 document gate ------------------------------------------------
export type GateStatus = "Draft" | "For Checking" | "Locked";
export const GATE_TONE: Record<string, Tone> = {
  Draft: "neutral",
  "For Checking": "pending",
  Locked: "locked",
  "In Transit": "info",
};

/** Map the 3-state warehouse gate to the LockGateBanner state vocabulary. */
export function gateLockState(s: GateStatus): "draft" | "check" | "locked" {
  return s === "Locked" ? "locked" : s === "For Checking" ? "check" : "draft";
}
/** A For-Checking MRR cannot Lock until the DR Photo is attached. (§10.6) */
export function mrrBlockReason(
  status: GateStatus,
  drPhoto: boolean,
): string | null {
  return status === "For Checking" && !drPhoto
    ? "DR Photo required to Lock"
    : null;
}

// ---- MRR REGISTRY (canonical Goods-Receipt owner) --------------------------
export type RecvStatus = "Partial" | "Fully Received" | "—";
export type Mrr = {
  no: string;
  date: string;
  supplier: string;
  inv: string;
  project: string;
  po: string;
  mr: string;
  by: string;
  status: GateStatus;
  drPhoto: boolean;
  receivedQty: number;
  orderedQty: number;
  recvStatus: RecvStatus;
};

// The three LOCKED MRRs are built FROM purchasing.ts GOODS_RECEIPTS (no/po/
// received/ordered/status sourced from GR; supplier/project/mr from the PO) so
// they mirror the Purchasing side byte-for-byte. Same event, two surfaces.
function lockedMrrFromGr(grIndex: number, date: string, inv: string): Mrr {
  const gr = GOODS_RECEIPTS[grIndex];
  if (!gr) throw new Error("GOODS_RECEIPTS index out of range");
  const po = findPo(gr.po);
  return {
    no: gr.mrr,
    date,
    supplier: po?.supplier ?? "—",
    inv,
    project: po?.project ?? "—",
    po: gr.po,
    mr: po?.mr ?? "—",
    by: "P. Garcia",
    status: "Locked",
    drPhoto: true,
    receivedQty: gr.receivedQty,
    orderedQty: gr.orderedQty,
    recvStatus: gr.status,
  };
}

// GOODS_RECEIPTS order: [0]=MRR-2026-0144/2605-0188IC (1/2 Partial),
// [1]=MRR-2026-0120/2604-0177IC (Fully), [2]=MRR-2026-0118/2604-0166 (Fully).
const LOCKED_MRRS: readonly Mrr[] = [
  lockedMrrFromGr(2, "2026-04-25", "ABB-5567"), // 0118 ABB / 2604-0166 / NORECO II
  lockedMrrFromGr(1, "2026-05-18", "JK-7781"), // 0120 JinkoSolar / 2604-0177IC
  lockedMrrFromGr(0, "2026-05-28", "SH-99821"), // 0144 Shenda / 2605-0188IC (Partial)
];

// In-flight receipts — renumbered to fresh, non-colliding MRR numbers (the
// prototype mapped 0144 to a 2nd PO; that collision is resolved here).
const INFLIGHT_MRRS: readonly Mrr[] = [
  {
    no: "MRR-2026-0145",
    date: "2026-05-18",
    supplier: "Meralco Industrial",
    inv: "ML-1102",
    project: "Cavite 69KV",
    po: "2605-0201",
    mr: "JCE-MR-2026-0140",
    by: "Site crew",
    status: "Draft",
    drPhoto: false,
    receivedQty: 0,
    orderedQty: 0,
    recvStatus: "—",
  },
  {
    no: "MRR-2026-0146",
    date: "2026-05-22",
    supplier: "Cebu Steel Corp.",
    inv: "CS-2231",
    project: "NORECO II — 13.2KV",
    po: "2605-0204",
    mr: "JCE-MR-2026-0142",
    by: "P. Garcia",
    status: "For Checking",
    drPhoto: false,
    receivedQty: 0,
    orderedQty: 0,
    recvStatus: "—",
  },
];

export const MRRS: readonly Mrr[] = [...LOCKED_MRRS, ...INFLIGHT_MRRS];
/** The renumbered For-Checking MRR (W1 "awaiting checking" deep-link). */
export const AWAITING_CHECK_MRR = "MRR-2026-0146";

export function getMrrs(): readonly Mrr[] {
  return MRRS;
}
export function findMrr(no: string): Mrr | undefined {
  return MRRS.find((m) => m.no === no);
}

export type MrrLine = { item: string; desc: string; qty: number; unit: string };
export const MRR_LINES: readonly MrrLine[] = [
  {
    item: "Structural steel angle bar",
    desc: "50×50×6mm",
    qty: 120,
    unit: "pcs",
  },
  { item: "Welding rod E6013", desc: "3.2mm", qty: 40, unit: "box" },
] as const;

// ---- W5 releases -----------------------------------------------------------
export type Release = {
  no: string;
  date: string;
  project: string;
  loc: string;
  recvBy: string;
  status: GateStatus;
};
export const RELEASES: readonly Release[] = [
  {
    no: "REL-2026-0071",
    date: "2026-05-25",
    project: "NORECO II — 13.2KV",
    loc: "Bulacan site",
    recvBy: "J. Foreman",
    status: "For Checking",
  },
  {
    no: "REL-2026-0066",
    date: "2026-05-15",
    project: "NORECO II — 13.2KV",
    loc: "Bulacan site",
    recvBy: "R. Crew",
    status: "Locked",
  },
] as const;
export function findRelease(no: string): Release | undefined {
  return RELEASES.find((r) => r.no === no);
}
export type ReleaseLine = {
  item: string;
  desc: string;
  qty: number;
  unit: string;
  onHand: number;
};
export const RELEASE_LINES: readonly ReleaseLine[] = [
  {
    item: "ACSR conductor 1/0",
    desc: "Stringing",
    qty: 540,
    unit: "m",
    onHand: 1448,
  },
] as const;

/** Negative-stock guard — hard-block a release that drives on-hand below 0. (§10.7) */
export function releaseGuard(
  onHand: number,
  qty: number,
): { negative: boolean; resulting: number } {
  return { negative: onHand - qty < 0, resulting: onHand - qty };
}

// ---- W6 transfers ----------------------------------------------------------
export type TransferStatus = "Draft" | "In Transit" | "Locked";
export type Transfer = {
  no: string;
  date: string;
  from: string;
  to: string;
  status: TransferStatus;
  dispatched: number;
  received: number | null;
};
export const TRANSFERS: readonly Transfer[] = [
  {
    no: "TRF-2026-0033",
    date: "2026-05-21",
    from: "Main Office",
    to: "Bulacan site",
    status: "In Transit",
    dispatched: 800,
    received: null,
  },
  {
    no: "TRF-2026-0030",
    date: "2026-05-10",
    from: "Workshop",
    to: "Cavite site",
    status: "Locked",
    dispatched: 200,
    received: 200,
  },
] as const;
export function findTransfer(no: string): Transfer | undefined {
  return TRANSFERS.find((t) => t.no === no);
}

// ---- W7 movements (immutable) ----------------------------------------------
export type MoveType =
  | "Receipt"
  | "Issue"
  | "Transfer-Out"
  | "Transfer-In"
  | "Adjustment";
export type Movement = {
  item: string;
  type: MoveType;
  qty: number;
  date: string;
  actor: string;
  loc: string;
  src: string;
  reason?: string;
  bal: number;
};
export const MOVEMENTS: readonly Movement[] = [
  {
    item: "ITM-00142",
    type: "Receipt",
    qty: 800,
    date: "2026-05-20",
    actor: "Warehouse",
    loc: "Main Office",
    src: "MRR-2026-0118",
    bal: 2000,
  },
  {
    item: "ITM-00142",
    type: "Issue",
    qty: -540,
    date: "2026-05-15",
    actor: "Warehouse",
    loc: "Bulacan site",
    src: "REL-2026-0066",
    bal: 1460,
  },
  {
    item: "ITM-00142",
    type: "Transfer-Out",
    qty: -200,
    date: "2026-05-10",
    actor: "Warehouse",
    loc: "Main Office",
    src: "TRF-2026-0030",
    bal: 1260,
  },
  {
    item: "ITM-00142",
    type: "Transfer-In",
    qty: 200,
    date: "2026-05-11",
    actor: "Warehouse",
    loc: "Cavite site",
    src: "TRF-2026-0030",
    bal: 200,
  },
  {
    item: "ITM-00142",
    type: "Adjustment",
    qty: -12,
    date: "2026-05-22",
    actor: "G. Lim",
    loc: "Main Office",
    src: "manual",
    reason: "Damaged in handling",
    bal: 1448,
  },
] as const;
export const MOVE_TONE: Record<MoveType, Tone> = {
  Receipt: "success",
  Issue: "danger",
  "Transfer-Out": "pending",
  "Transfer-In": "info",
  Adjustment: "neutral",
};
/** On-hand as the running sum of immutable movements. (§10.3.3) */
export function onHandFromMovements(itemCode: string, loc?: string): number {
  return MOVEMENTS.filter(
    (m) => m.item === itemCode && (!loc || m.loc === loc),
  ).reduce((a, m) => a + m.qty, 0);
}
/** Adjustment requires a mandatory reason — rejected without one. (§10.9) */
export function adjustmentValid(signedDelta: number, reason: string): boolean {
  return (
    Number.isFinite(signedDelta) && signedDelta !== 0 && reason.trim() !== ""
  );
}

// ---- W8 MR stock-verification (driven LIVE from pmg.ts) --------------------
export type VerifyLine = {
  line: MrLine;
  requested: number;
  available: number;
  forPurchase: number;
  reserve: number;
};
/** Per-line live verification — equals pmg.ts reservedQty/forPurchaseQty. (§10.11) */
export function verifyMrLines(mrNo: string): VerifyLine[] {
  return getMrLines(mrNo).map((l) => ({
    line: l,
    requested: l.reqQty,
    available: l.availQty,
    forPurchase: forPurchaseQty(l),
    reserve: reservedQty(l),
  }));
}
export function verifyMrHeader(mrNo: string) {
  return getMr(mrNo);
}
/** The W8 queue — MRs awaiting Warehouse stock-verification (anchor MR). */
export const WH_VERIFY_QUEUE: readonly string[] = ["JCE-MR-2026-0142"];

// ---- W9 audit --------------------------------------------------------------
export type WhAudit = {
  ts: string;
  actor: string;
  entity: string;
  action: string;
  delta: string;
};
export const WH_AUDIT: readonly WhAudit[] = [
  {
    ts: "2026-05-22 16:05",
    actor: "G. Lim (Warehouse Admin)",
    entity: "MRR-2026-0118",
    action: "Lock",
    delta: "For Checking → Locked · posted +800 receipt",
  },
  {
    ts: "2026-05-22 14:30",
    actor: "G. Lim (Warehouse Admin)",
    entity: "ITM-00142",
    action: "Adjustment",
    delta: "−12 · reason: damaged in handling",
  },
  {
    ts: "2026-05-21 09:15",
    actor: "P. Garcia (Site Engineer)",
    entity: "TRF-2026-0033",
    action: "Dispatch (submit)",
    delta: "Draft → For Checking · In Transit 800",
  },
  {
    ts: "2026-05-20 15:40",
    actor: "G. Lim (Warehouse Admin)",
    entity: "W2 ledger",
    action: "Promote to plan",
    delta: "Off-BOQ row → planned (likely VO)",
  },
] as const;

// ---- Numbering helpers (continuous, year-prefixed, NO monthly reset) -------
export function nextDocNumber(
  prefix: "MRR" | "REL" | "TRF",
  year: number,
  existing: readonly { no: string }[],
): string {
  const pre = `${prefix}-${year}-`;
  const seqs = existing
    .filter((x) => x.no.startsWith(pre))
    .map((x) => Number(x.no.slice(pre.length)) || 0);
  const next = (seqs.length ? Math.max(...seqs) : 0) + 1;
  return `${pre}${String(next).padStart(4, "0")}`;
}
/** System-generated item code ITM-##### (duplicate-active prevention). */
export function nextItemCode(existing: readonly { code: string }[]): string {
  const seqs = existing.map((x) => Number(x.code.replace("ITM-", "")) || 0);
  const next = (seqs.length ? Math.max(...seqs) : 0) + 1;
  return `ITM-${String(next).padStart(5, "0")}`;
}
export function isDuplicateItemCode(
  code: string,
  existing: readonly { code: string }[],
): boolean {
  return existing.some((x) => x.code === code);
}

// ============================================================================
// Phase 2 fixtures
// ============================================================================

// ---- W10 reorder -----------------------------------------------------------
export type ReorderRule = {
  item: string;
  loc: string;
  min: number;
  reorder: number;
  onhand: number;
};
export const REORDER_RULES: readonly ReorderRule[] = [
  {
    item: "ACSR conductor 1/0",
    loc: "Main Office",
    min: 2000,
    reorder: 3000,
    onhand: 1200,
  },
  {
    item: "Insulator pin-type 15KV",
    loc: "Main Office",
    min: 100,
    reorder: 200,
    onhand: 240,
  },
  {
    item: "Welding rod E6013",
    loc: "Workshop",
    min: 50,
    reorder: 80,
    onhand: 32,
  },
  {
    item: "Distribution transformer 100KVA",
    loc: "Main Office",
    min: 2,
    reorder: 4,
    onhand: 2,
  },
] as const;
export function belowReorder(r: ReorderRule): boolean {
  return r.onhand < r.reorder;
}

// ---- W11 stock-take --------------------------------------------------------
export type StockTakeItem = {
  k: string;
  item: string;
  loc: string;
  system: number;
  unit: string;
};
export const STOCKTAKE_ITEMS: readonly StockTakeItem[] = [
  {
    k: "a",
    item: "ACSR conductor 1/0",
    loc: "Main Office",
    system: 1448,
    unit: "m",
  },
  {
    k: "b",
    item: "Insulator pin-type 15KV",
    loc: "Main Office",
    system: 240,
    unit: "pcs",
  },
  {
    k: "c",
    item: "Welding rod E6013",
    loc: "Workshop",
    system: 32,
    unit: "box",
  },
  {
    k: "d",
    item: "Transformer 100KVA",
    loc: "Main Office",
    system: 2,
    unit: "set",
  },
] as const;

// ---- W12 custody -----------------------------------------------------------
export type CustodyRecord = {
  id: number;
  item: string;
  code: string;
  holder: string;
  out: string;
  back: string | null;
};
export const CUSTODY_RECORDS: readonly CustodyRecord[] = [
  {
    id: 1,
    item: "Hydraulic crimping tool",
    code: "TOOL-0042",
    holder: "P. Garcia (Bulacan)",
    out: "2026-05-18",
    back: null,
  },
  {
    id: 2,
    item: "Insulation tester 5KV",
    code: "TOOL-0011",
    holder: "R. dela Cruz (Cavite)",
    out: "2026-05-10",
    back: null,
  },
  {
    id: 3,
    item: "Torque wrench set",
    code: "TOOL-0028",
    holder: "—",
    out: "2026-04-22",
    back: "2026-05-02",
  },
] as const;

// ---- W13 bins --------------------------------------------------------------
export type Bin = {
  bin: string;
  loc: string;
  zone: string;
  items: number;
  qty: string;
};
export const BINS: readonly Bin[] = [
  {
    bin: "MO-A-01",
    loc: "Main Office",
    zone: "Aisle A",
    items: 8,
    qty: "1,448 m + 240 pcs",
  },
  {
    bin: "MO-A-02",
    loc: "Main Office",
    zone: "Aisle A",
    items: 3,
    qty: "2 set",
  },
  {
    bin: "MO-B-05",
    loc: "Main Office",
    zone: "Aisle B",
    items: 12,
    qty: "misc hardware",
  },
  {
    bin: "WS-01",
    loc: "Workshop",
    zone: "Rack 1",
    items: 6,
    qty: "32 box + steel",
  },
] as const;
