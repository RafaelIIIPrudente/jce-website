// ============================================================================
// JCE SYSTEM — Project Management (PMG) fixtures (Part 6). Ported from
// pmg-data.jsx. The PM Head keys ONE judgment per line per period
// (This Period %); everything else DERIVES.
//
// • peso/pmoney REUSED from lib/mock/format.ts (not redefined).
// • SO# tokens ALIGN to the canonical SALES_ORDERS in lib/mock/bdd.ts
//   (26-05-378 / 26-04-355 / 25-11-290) — no parallel SO registry.
// • The MRS store here is the CANONICAL Material-Request registry that Part 7
//   (Purchasing) reads; the "For Purchase" remainder is the upstream trigger.
// • The NET AMOUNT block (Progress Bill − DP Recoupment − Retention) matches the
//   A9 SOA / BDD progress-billing formula and reproduces the shared anchors:
//   NORECO II PB1 = 11.34% → PBn ₱6,039,221.60 / Recoup ₱905,883.24 /
//   Retention ₱603,922.16 / NET ₱4,529,416.20.
// UI/UX mock only — no backend.
// ============================================================================

import { type Tone } from "@/lib/mock/bdd";

export const CONTRACT = 53277688;
export const DP_PCT = 15;
export const RET_PCT = 10;
export const DP_AMOUNT = (CONTRACT * DP_PCT) / 100; // 7,991,653.20

// ---- Portfolio -------------------------------------------------------------
export type PmgProject = {
  code: string;
  name: string;
  client: string;
  type: "Customer" | "Internal Cost Center";
  so: string | null;
  contract: number;
  pct: number;
  gain: number;
  period: string;
  billing: string;
  status: "Active" | "On Hold" | "Completed";
  updated: string;
  by: string;
  next: string;
  dp: number;
  ret: number;
  start: string;
  target: string;
  origContract: number;
  variations: number;
};

export const PROJECTS_PMG: readonly PmgProject[] = [
  {
    code: "P-26-0007",
    name: "NORECO II — 13.2KV Distribution Line",
    client: "NORECO II",
    type: "Customer",
    so: "26-05-378",
    contract: CONTRACT,
    pct: 11.34,
    gain: 11.34,
    period: "PB1",
    billing: "Issued",
    status: "Active",
    updated: "2026-06-01 14:10",
    by: "C. Mendoza",
    next: "PB2 period entry due",
    dp: DP_PCT,
    ret: RET_PCT,
    start: "2026-03-15",
    target: "2026-12-20",
    origContract: CONTRACT,
    variations: 0,
  },
  {
    code: "P-26-0004",
    name: "Cavite 69KV Transmission Line",
    client: "Meralco",
    type: "Customer",
    so: "26-04-355",
    contract: 38400000,
    pct: 62.0,
    gain: 8.5,
    period: "PB5",
    billing: "Partially Paid",
    status: "Active",
    updated: "2026-05-28 09:30",
    by: "C. Mendoza",
    next: "Retention release pending",
    dp: 15,
    ret: 10,
    start: "2026-01-10",
    target: "2026-09-30",
    origContract: 36000000,
    variations: 2400000,
  },
  {
    code: "P-25-0290",
    name: "Solar Farm Tarlac — 5MWp",
    client: "SMC Global",
    type: "Customer",
    so: "25-11-290",
    contract: 62000000,
    pct: 88.0,
    gain: 0,
    period: "PB9",
    billing: "Paid",
    status: "On Hold",
    updated: "2026-05-12 16:00",
    by: "C. Mendoza",
    next: "On hold — client variation review",
    dp: 20,
    ret: 10,
    start: "2025-11-01",
    target: "2026-08-15",
    origContract: 62000000,
    variations: 0,
  },
  {
    code: "CC-WORKSHOP",
    name: "Workshop",
    client: "Internal",
    type: "Internal Cost Center",
    so: null,
    contract: 0,
    pct: 0,
    gain: 0,
    period: "—",
    billing: "—",
    status: "Active",
    updated: "2026-06-02 08:00",
    by: "G. Lim",
    next: "Cost center — no BOQ",
    dp: 0,
    ret: 0,
    start: "—",
    target: "—",
    origContract: 0,
    variations: 0,
  },
];

/** Site Engineers are scoped to their assigned SO# (26-05-378 in the mock). */
export const SITEENG_SO = "26-05-378";

export function findProject(code: string): PmgProject | undefined {
  return PROJECTS_PMG.find((p) => p.code === code);
}

export const PROJECT_STATUS_TONE: Record<string, Tone> = {
  Active: "success",
  "On Hold": "pending",
  Completed: "neutral",
};
export const BILLING_TONE: Record<string, Tone> = {
  Issued: "info",
  "Partially Paid": "pending",
  Paid: "success",
};

// ---- BOQ -------------------------------------------------------------------
export type BoqStage = { stage: string; value: number };
export type BoqLine = {
  no: string;
  desc: string;
  qty: number;
  unit: string;
  staged: boolean;
  stages?: readonly BoqStage[];
  value?: number;
};
export type BoqCategory = { cat: string; lines: readonly BoqLine[] };

export const BOQ: readonly BoqCategory[] = [
  {
    cat: "A · Civil Works",
    lines: [
      {
        no: "A.1",
        desc: "Concrete poles — supply, deliver & install",
        qty: 120,
        unit: "pcs",
        staged: true,
        stages: [
          { stage: "Procure", value: 9000000 },
          { stage: "Deliver", value: 4500000 },
          { stage: "Install", value: 4500000 },
        ],
      },
      {
        no: "A.2",
        desc: "Pole excavation & backfill",
        qty: 120,
        unit: "pits",
        staged: false,
        value: 4277688,
      },
    ],
  },
  {
    cat: "B · Electrical Works",
    lines: [
      {
        no: "B.1",
        desc: "Distribution transformers 100KVA",
        qty: 30,
        unit: "set",
        staged: true,
        stages: [
          { stage: "Procure", value: 9000000 },
          { stage: "Deliver", value: 3000000 },
          { stage: "Install", value: 3000000 },
        ],
      },
      {
        no: "B.2",
        desc: "ACSR conductors & accessories",
        qty: 1,
        unit: "lot",
        staged: true,
        stages: [
          { stage: "Procure", value: 6000000 },
          { stage: "Deliver", value: 2000000 },
          { stage: "Install", value: 2000000 },
        ],
      },
      {
        no: "B.3",
        desc: "Pole-line hardware & fittings",
        qty: 1,
        unit: "lot",
        staged: false,
        value: 6000000,
      },
    ],
  },
];

export type BoqRow = {
  key: string;
  no: string;
  desc: string;
  stage: string | null;
  value: number;
};

/** Flatten BOQ to accomplishment rows (one per single line or per stage). */
export function boqRows(): BoqRow[] {
  const rows: BoqRow[] = [];
  BOQ.forEach((c) =>
    c.lines.forEach((l) => {
      if (l.staged && l.stages) {
        l.stages.forEach((s) =>
          rows.push({
            key: `${l.no}-${s.stage}`,
            no: l.no,
            desc: l.desc,
            stage: s.stage,
            value: s.value,
          }),
        );
      } else {
        rows.push({
          key: l.no,
          no: l.no,
          desc: l.desc,
          stage: null,
          value: l.value ?? 0,
        });
      }
    }),
  );
  return rows;
}

export function lineTotal(l: BoqLine): number {
  return l.staged && l.stages
    ? l.stages.reduce((a, s) => a + s.value, 0)
    : (l.value ?? 0);
}

// ---- PB1 default percentages (RE-TUNED so the LIVE grid reproduces the anchor)
// The prototype's defaults summed to ~₱7.24M and showed the anchor only as a
// static reference label. Here A.2 is the precise plug so Σ peso === the canonical
// PBn ₱6,039,221.60 to the centavo, accomplishment === 11.34%, and the NET block
// derives to ₱4,529,416.20. PB1 is a tuned reference seed.
const ANCHOR_PBN = 6039221.6;
const ROUND_SEED_SUM = 5370000; // A.1P 30 + A.1D 10 + B.1P 14 + B.2P 8 + B.3 8
const A2_TP = ((ANCHOR_PBN - ROUND_SEED_SUM) / 4277688) * 100; // ≈ 15.6442%

export const PB1_DEFAULTS: Record<string, [number, number]> = {
  "A.1-Procure": [0, 30],
  "A.1-Deliver": [0, 10],
  "A.1-Install": [0, 0],
  "A.2": [0, A2_TP],
  "B.1-Procure": [0, 14],
  "B.1-Deliver": [0, 0],
  "B.1-Install": [0, 0],
  "B.2-Procure": [0, 8],
  "B.2-Deliver": [0, 0],
  "B.2-Install": [0, 0],
  "B.3": [0, 8],
};

// ---- Accomplishment derivation (the computational heart) --------------------
export type AccRow = BoqRow & {
  weight: number;
  prev: number;
  tp: number;
  toDate: number;
  tpW: number;
  tdW: number;
  peso: number;
};
export type Period = {
  comp: AccRow[];
  PBn: number;
  accomplishment: number;
  recoup: number;
  retention: number;
  net: number;
};

/**
 * Derive a full period from This Period % entries. Only `tp` is keyed; weight,
 * To Date, weighted columns, peso, PBn, accomplishment and the NET AMOUNT block
 * all derive. NET = PBn − DP Recoupment − Retention (matches A9 SOA / BDD).
 */
export function computeAccomplishment(
  rows: readonly BoqRow[],
  vals: Record<string, { prev: number; tp: number }>,
  contract: number,
): Period {
  const comp: AccRow[] = rows.map((r) => {
    const v = vals[r.key] ?? { prev: 0, tp: 0 };
    const weight = (r.value / contract) * 100;
    const toDate = Math.min(100, v.prev + v.tp);
    const tpW = (weight * v.tp) / 100;
    const tdW = (weight * toDate) / 100;
    const peso = (r.value * v.tp) / 100;
    return { ...r, weight, prev: v.prev, tp: v.tp, toDate, tpW, tdW, peso };
  });
  const PBn = comp.reduce((a, r) => a + r.peso, 0);
  const accomplishment = comp.reduce((a, r) => a + r.tpW, 0);
  const recoup = Math.min((DP_PCT / 100) * PBn, DP_AMOUNT);
  const retention = (RET_PCT / 100) * PBn;
  const net = PBn - recoup - retention;
  return { comp, PBn, accomplishment, recoup, retention, net };
}

// ---- P9 billing history ----------------------------------------------------
export type Billing = {
  pb: string;
  asof: string;
  gain: number;
  amount: number;
  recoup: number;
  retention: number;
  net: number;
  status: string;
};

export const BILLING_HISTORY: readonly Billing[] = [
  {
    pb: "PB1",
    asof: "2026-05-15",
    gain: 11.34,
    amount: 6039221.6,
    recoup: 905883.24,
    retention: 603922.16,
    net: 4529416.2,
    status: "Issued",
  },
];

// ---- P10/P11 Material Requests (CANONICAL registry — Part 7 reads this) -----
export type MrStatus = "Pending approval" | "Approved" | "Fulfilled";
export type Mr = {
  no: string;
  date: string;
  project: string;
  so: string;
  lines: number;
  reserved: number;
  forPurchase: number;
  status: MrStatus;
  verified: "Verified" | "Pending";
};

export const MR_STATUS_TONE: Record<string, Tone> = {
  "Pending approval": "pending",
  Approved: "success",
  Fulfilled: "success",
};
export const VERIFIED_TONE: Record<string, Tone> = {
  Verified: "success",
  Pending: "pending",
};

const mrStore: Mr[] = [
  {
    no: "JCE-MR-2026-0142",
    date: "2026-05-26",
    project: "NORECO II — 13.2KV",
    so: "26-05-378",
    lines: 3,
    reserved: 1,
    forPurchase: 2,
    status: "Approved",
    verified: "Verified",
  },
  {
    no: "JCE-MR-2026-0138",
    date: "2026-05-20",
    project: "Cavite 69KV",
    so: "26-04-355",
    lines: 2,
    reserved: 2,
    forPurchase: 0,
    status: "Fulfilled",
    verified: "Verified",
  },
  {
    no: "JCE-GARCIA 3-0258",
    date: "2026-05-12",
    project: "NORECO II — 13.2KV",
    so: "26-05-378",
    lines: 3,
    reserved: 1,
    forPurchase: 2,
    status: "Pending approval",
    verified: "Pending",
  },
];

export function getMrs(): readonly Mr[] {
  return [...mrStore];
}
export function getMr(no: string): Mr | undefined {
  return mrStore.find((m) => m.no === no);
}
/** Approve a pending MR (reserves in-stock; For-Purchase flows to Purchasing). */
export function approveMr(no: string): void {
  const i = mrStore.findIndex((m) => m.no === no);
  const cur = mrStore[i];
  if (cur) mrStore[i] = { ...cur, status: "Approved", verified: "Verified" };
}

export type MrLine = {
  no: number;
  desc: string;
  purpose: string;
  reqQty: number;
  availQty: number;
  unit: string;
};

// Per-MR lines. Reserved (= min(req,avail)) and For-Purchase (= max(0,req−avail))
// are DERIVED (inventory-first split), never stored.
const MR_LINES: Record<string, readonly MrLine[]> = {
  "JCE-MR-2026-0142": [
    {
      no: 1,
      desc: "ACSR Conductor 1/0",
      purpose: "Stringing",
      reqQty: 5000,
      availQty: 3200,
      unit: "m",
    },
    {
      no: 2,
      desc: "Insulator pin-type 15KV",
      purpose: "Pole hardware",
      reqQty: 240,
      availQty: 240,
      unit: "pcs",
    },
    {
      no: 3,
      desc: "Distribution transformer 100KVA",
      purpose: "Substation",
      reqQty: 6,
      availQty: 2,
      unit: "set",
    },
  ],
  "JCE-MR-2026-0138": [
    {
      no: 1,
      desc: "Grounding rod copper-clad",
      purpose: "Earthing",
      reqQty: 120,
      availQty: 120,
      unit: "pcs",
    },
    {
      no: 2,
      desc: "Protection relay (spare)",
      purpose: "Substation",
      reqQty: 6,
      availQty: 6,
      unit: "pcs",
    },
  ],
  "JCE-GARCIA 3-0258": [
    {
      no: 1,
      desc: "Steel cross-arm",
      purpose: "Pole hardware",
      reqQty: 80,
      availQty: 30,
      unit: "pcs",
    },
    {
      no: 2,
      desc: "Guy wire 7/16",
      purpose: "Anchoring",
      reqQty: 600,
      availQty: 600,
      unit: "m",
    },
    {
      no: 3,
      desc: "Surge arrester 15KV",
      purpose: "Protection",
      reqQty: 40,
      availQty: 12,
      unit: "set",
    },
  ],
};

export function getMrLines(no: string): readonly MrLine[] {
  return MR_LINES[no] ?? [];
}
export function reservedQty(l: MrLine): number {
  return Math.min(l.reqQty, l.availQty);
}
export function forPurchaseQty(l: MrLine): number {
  return Math.max(0, l.reqQty - l.availQty);
}

// ---- P12 timeline ----------------------------------------------------------
export type TimelineEntry = {
  type: "period" | "mr" | "po" | "stock";
  ts: string;
  actor: string;
  txt: string;
  link: string;
};
export const PMG_TIMELINE: readonly TimelineEntry[] = [
  {
    type: "period",
    ts: "2026-06-01 14:10",
    actor: "C. Mendoza",
    txt: "PB1 period submitted & locked — 11.34% accomplishment",
    link: "PB1",
  },
  {
    type: "mr",
    ts: "2026-05-26 10:30",
    actor: "PMG Staff",
    txt: "MR JCE-MR-2026-0142 approved — 2 lines to Purchasing",
    link: "JCE-MR-2026-0142",
  },
  {
    type: "po",
    ts: "2026-05-22 09:00",
    actor: "Purchasing",
    txt: "PO-IMP-26-0188 raised for transformer lot",
    link: "PO-IMP-26-0188",
  },
  {
    type: "stock",
    ts: "2026-05-20 15:40",
    actor: "Warehouse",
    txt: "Stock receipt MRR-2026-0144 — 800 m conductor",
    link: "MRR-2026-0144",
  },
];

// ---- P13 PMG audit ---------------------------------------------------------
export type PmgAuditEntry = {
  ts: string;
  actor: string;
  entity: string;
  action: string;
  delta: string;
};
export const PMG_AUDIT: readonly PmgAuditEntry[] = [
  {
    ts: "2026-06-01 14:10",
    actor: "C. Mendoza (PM Head)",
    entity: "Period PB1",
    action: "Submit (lock)",
    delta: "Draft → Submitted/Locked · 11.34%",
  },
  {
    ts: "2026-05-30 11:20",
    actor: "C. Mendoza (PM Head)",
    entity: "VO-26-04-355-02",
    action: "VO approval",
    delta: "Contract 36.0M → 38.4M (revised)",
  },
  {
    ts: "2026-05-26 10:30",
    actor: "PMG Staff",
    entity: "JCE-MR-2026-0142",
    action: "MR approval",
    delta: "Pending → Approved",
  },
  {
    ts: "2026-05-15 09:00",
    actor: "C. Mendoza (PM Head)",
    entity: "P-26-0007",
    action: "Project create (BOQ import)",
    delta: "— → ₱53,277,688",
  },
];
