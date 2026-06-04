// ============================================================================
// JCE SYSTEM — Purchasing module fixtures + derivations (Part 7). Ported from
// pur-data.jsx + the Phase-2 inline fixtures. UI/UX mock only — no backend.
//
// • Money helpers (peso/pmoney/pmoneyU/ccyAmt) are REUSED from lib/mock/format.ts.
// • SO# tokens ALIGN to the canonical SALES_ORDERS in lib/mock/bdd.ts — no
//   parallel SO registry.
// • The Material-Request hand-off is READ from the canonical PMG registry in
//   lib/mock/pmg.ts via forPurchaseFromMr(); nothing is re-exported from pmg.ts.
// • The GoodsReceipt (GR-YY-XXXX) shape is modeled HERE as the Purchasing
//   surface of the Warehouse MRR (same event, two surfaces) so Part 8 can adopt
//   it. Purchasing never owns the MRR — it reads it.
//
// Derivations carry the SRS rule (§7) — the heart of fidelity:
//   nextPoNumber §7.4 · local/importTotals §7.5 · derivePaymentStatus §7.6 ·
//   threeWayMatch §7.15.1 · ewt §7.7 · resolveApprovalChain §7.15.4 ·
//   importProgress/localProgress §7.8/§7.15.5.
// ============================================================================

import { type Tone } from "@/lib/mock/bdd";
import { type Currency } from "@/lib/mock/format";
import {
  getMr,
  getMrLines,
  forPurchaseQty,
  type Mr,
  type MrLine,
} from "@/lib/mock/pmg";

// ---- U2 · PO ledger --------------------------------------------------------
export type PoType = "Local" | "Import";
export type PoStatus =
  | "Draft"
  | "For Approval"
  | "Approved"
  | "Sent"
  | "Closed"
  | "Void";
export type PayStatus = "Unpaid" | "Downpayment Paid" | "Fully Paid";

export type PurchaseOrder = {
  no: string;
  type: PoType;
  date: string;
  project: string;
  supplier: string;
  desc: string;
  amount: number;
  ccy: Currency;
  status: PoStatus;
  /** Last-known payment state — UNTRUSTED. Always render derivePaymentStatus(). */
  pay: PayStatus;
  so: string;
  mr: string;
  stage?: number;
  localStage?: number;
};

export const POS: readonly PurchaseOrder[] = [
  {
    no: "2605-0188IC",
    type: "Import",
    date: "2026-05-22",
    project: "NORECO II — 13.2KV",
    supplier: "Shenda Electric Co.",
    desc: "Power transformers 10MVA + switchgear",
    amount: 84000,
    ccy: "USD",
    status: "Approved",
    pay: "Downpayment Paid",
    so: "26-05-378",
    mr: "JCE-MR-2026-0142",
    stage: 6,
  },
  {
    no: "2605-0204",
    type: "Local",
    date: "2026-05-29",
    project: "Workshop",
    supplier: "Cebu Steel Corp.",
    desc: "Structural steel & consumables",
    amount: 318450,
    ccy: "PHP",
    status: "Approved",
    pay: "Unpaid",
    so: "WORKSHOP",
    mr: "JCE-MR-2026-0138",
    localStage: 2,
  },
  {
    no: "2605-0201",
    type: "Local",
    date: "2026-05-27",
    project: "Cavite 69KV",
    supplier: "Meralco Industrial",
    desc: "Conductors & accessories",
    amount: 1240000,
    ccy: "PHP",
    status: "Sent",
    pay: "Unpaid",
    so: "26-04-355",
    mr: "JCE-MR-2026-0140",
    localStage: 1,
  },
  {
    no: "2604-0177IC",
    type: "Import",
    date: "2026-04-30",
    project: "Solar Farm Tarlac",
    supplier: "JinkoSolar Intl.",
    desc: "PV modules 550Wp ×9,100",
    amount: 512000,
    ccy: "USD",
    status: "Sent",
    pay: "Fully Paid",
    so: "25-11-290",
    mr: "JCE-MR-2026-0120",
    stage: 14,
  },
  {
    no: "2604-0166",
    type: "Local",
    date: "2026-04-18",
    project: "NORECO II — 13.2KV",
    supplier: "ABB Inc.",
    desc: "Protection relays",
    amount: 86200,
    ccy: "PHP",
    status: "Closed",
    pay: "Fully Paid",
    so: "26-05-378",
    mr: "JCE-MR-2026-0118",
    localStage: 5,
  },
  {
    no: "2606-0210",
    type: "Local",
    date: "2026-06-02",
    project: "Workshop",
    supplier: "Cebu Steel Corp.",
    desc: "Welding consumables",
    amount: 48200,
    ccy: "PHP",
    status: "For Approval",
    pay: "Unpaid",
    so: "WORKSHOP",
    mr: "—",
    localStage: 0,
  },
] as const;

export const PO_STATUS_TONE: Record<PoStatus, Tone> = {
  Draft: "neutral",
  "For Approval": "pending",
  Approved: "info",
  Sent: "info",
  Closed: "success",
  Void: "danger",
};
export const PAY_TONE: Record<PayStatus, Tone> = {
  Unpaid: "danger",
  "Downpayment Paid": "pending",
  "Fully Paid": "success",
};

export function findPo(no: string): PurchaseOrder | undefined {
  return POS.find((p) => p.no === no);
}

// ---- U7 · import 15-stage tracker (PO 2605-0188IC) -------------------------
export type StageStatus = "Done" | "In Progress" | "Blocked" | "Pending";
export type ImportStage = {
  n: number;
  name: string;
  owner: string;
  status: StageStatus;
  target: string;
  actual: string;
  docs: readonly string[];
  gate?: boolean;
};

export const IMPORT_STAGES: readonly ImportStage[] = [
  {
    n: 1,
    name: "BOM",
    owner: "BDD / PMG",
    status: "Done",
    target: "2026-05-10",
    actual: "2026-05-09",
    docs: ["BOM.xlsx"],
  },
  {
    n: 2,
    name: "MR",
    owner: "PMG",
    status: "Done",
    target: "2026-05-12",
    actual: "2026-05-11",
    docs: ["JCE-MR-2026-0142"],
  },
  {
    n: 3,
    name: "PO + Supplier Quotation",
    owner: "Purchasing",
    status: "Done",
    target: "2026-05-20",
    actual: "2026-05-22",
    docs: ["PO-2605-0188IC", "Quote.pdf"],
  },
  {
    n: 4,
    name: "Approval of Sir Jimwel",
    owner: "President",
    status: "Done",
    target: "2026-05-22",
    actual: "2026-05-23",
    gate: true,
    docs: [],
  },
  {
    n: 5,
    name: "Performa Invoice",
    owner: "Supplier",
    status: "Done",
    target: "2026-05-24",
    actual: "2026-05-25",
    docs: ["PI-99821.pdf"],
  },
  {
    n: 6,
    name: "Technical Spec & Drawing",
    owner: "Engineering",
    status: "In Progress",
    target: "2026-06-05",
    actual: "—",
    docs: [],
  },
  {
    n: 7,
    name: "JCE Approval + Downpayment",
    owner: "President / Finance",
    status: "Blocked",
    target: "2026-06-08",
    actual: "—",
    gate: true,
    docs: ["RFP-PUR-26060021 (DP)"],
  },
  {
    n: 8,
    name: "Production",
    owner: "Supplier",
    status: "Pending",
    target: "2026-07-10",
    actual: "—",
    docs: [],
  },
  {
    n: 9,
    name: "Delivery Lead Time",
    owner: "Supplier",
    status: "Pending",
    target: "2026-07-20",
    actual: "—",
    docs: [],
  },
  {
    n: 10,
    name: "Balance Payment",
    owner: "Finance",
    status: "Pending",
    target: "2026-08-01",
    actual: "—",
    docs: [],
  },
  {
    n: 11,
    name: "Shipping Documents",
    owner: "Purchasing",
    status: "Pending",
    target: "2026-08-05",
    actual: "—",
    docs: ["B/L", "Packing List", "Commercial Invoice", "Form E"],
  },
  {
    n: 12,
    name: "Departure",
    owner: "Freight",
    status: "Pending",
    target: "2026-08-08",
    actual: "—",
    docs: [],
  },
  {
    n: 13,
    name: "Arrival",
    owner: "Freight",
    status: "Pending",
    target: "2026-08-22",
    actual: "—",
    docs: [],
  },
  {
    n: 14,
    name: "Customs Clearance",
    owner: "Broker",
    status: "Pending",
    target: "2026-08-25",
    actual: "—",
    docs: [],
  },
  {
    n: 15,
    name: "Delivery Onsite",
    owner: "Warehouse",
    status: "Pending",
    target: "2026-08-28",
    actual: "—",
    docs: ["DR → MRR"],
  },
] as const;

export const STAGE_TONE: Record<StageStatus, Tone> = {
  Done: "success",
  "In Progress": "info",
  Blocked: "danger",
  Pending: "neutral",
};

/** Local 5-stage tracker labels + auto-trigger copy (§7.15.5). */
export const LOCAL_STAGES: readonly [string, string][] = [
  ["PO Sent", "auto on Sent"],
  ["Goods Received", "first MRR · Partial/Full"],
  ["Invoice Received", "invoice no. + attachment"],
  ["Paid", "auto when RFP Paid"],
  ["Closed", "Paid + Fully Received"],
] as const;

// ---- U5 · RFP register -----------------------------------------------------
export type RfpType = "Downpayment" | "Balance" | "Single";
export type RfpStatus =
  | "Draft"
  | "Submitted"
  | "Verified"
  | "Received (Accounting)"
  | "Paid";
export type Rfp = {
  no: string;
  date: string;
  po: string;
  supplier: string;
  project: string;
  type: RfpType;
  due: string;
  net: number;
  status: RfpStatus;
};

// RFP-PUR-YYMM#### — resolved numbering (§7.12 #10), not the stale 5-digit form.
export const RFPS: readonly Rfp[] = [
  {
    no: "RFP-PUR-26060021",
    date: "2026-06-02",
    po: "2605-0188IC",
    supplier: "Shenda Electric Co.",
    project: "NORECO II — 13.2KV",
    type: "Downpayment",
    due: "2026-06-08",
    net: 1764000,
    status: "Verified",
  },
  {
    no: "RFP-PUR-26050188",
    date: "2026-05-30",
    po: "2605-0204",
    supplier: "Cebu Steel Corp.",
    project: "Workshop",
    type: "Single",
    due: "2026-06-15",
    net: 312081,
    status: "Submitted",
  },
  {
    no: "RFP-PUR-26040177",
    date: "2026-04-30",
    po: "2604-0177IC",
    supplier: "JinkoSolar Intl.",
    project: "Solar Farm Tarlac",
    type: "Balance",
    due: "2026-05-20",
    net: 7680000,
    status: "Paid",
  },
] as const;

export const RFP_TONE: Record<RfpStatus, Tone> = {
  Draft: "neutral",
  Submitted: "pending",
  Verified: "info",
  "Received (Accounting)": "info",
  Paid: "success",
};

export function findRfp(no: string): Rfp | undefined {
  return RFPS.find((r) => r.no === no);
}
export function rfpsForPo(no: string): Rfp[] {
  return RFPS.filter((r) => r.po === no);
}

// ---- U9 · suppliers --------------------------------------------------------
export type Supplier = {
  code: string;
  name: string;
  top: string;
  tin: string;
  city: string;
  cat: string;
  offers: readonly string[];
  active: boolean;
  bankPending: boolean;
};

export const SUPPLIERS: readonly Supplier[] = [
  {
    code: "JCE 00012",
    name: "Shenda Electric Co.",
    top: "50/50",
    tin: "—",
    city: "Shenzhen, CN",
    cat: "Transformers & switchgear",
    offers: ["Transformers", "Switchgear"],
    active: true,
    bankPending: true,
  },
  {
    code: "JCE 00007",
    name: "Cebu Steel Corp.",
    top: "NET30",
    tin: "004-221-118-000",
    city: "Cebu City, PH",
    cat: "Civil works",
    offers: ["Steel", "Fabrication"],
    active: true,
    bankPending: false,
  },
  {
    code: "JCE 00021",
    name: "JinkoSolar Intl.",
    top: "LC",
    tin: "—",
    city: "Shanghai, CN",
    cat: "Electrical equipment",
    offers: ["PV modules"],
    active: true,
    bankPending: false,
  },
  {
    code: "JCE 00003",
    name: "ABB Inc.",
    top: "NET30",
    tin: "002-118-552-000",
    city: "Makati, PH",
    cat: "Electrical equipment",
    offers: ["Relays", "Breakers"],
    active: true,
    bankPending: false,
  },
  {
    code: "JCE 00009",
    name: "Meralco Industrial",
    top: "NET15",
    tin: "000-333-444-000",
    city: "Pasig, PH",
    cat: "Electrical equipment",
    offers: ["Conductors"],
    active: true,
    bankPending: false,
  },
] as const;

export function findSupplier(code: string): Supplier | undefined {
  return SUPPLIERS.find((s) => s.code === code);
}
export function posForSupplier(name: string): PurchaseOrder[] {
  return POS.filter((p) => p.supplier === name);
}

// ---- U11 · Purchase Requisitions ------------------------------------------
export type Urgency = "Routine" | "Urgent" | "Critical";
export type PrqStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Converted to PO"
  | "Cancelled";
export type Prq = {
  no: string;
  date: string;
  requestor: string;
  project: string;
  mr: string;
  est: number;
  ccy: Currency;
  urgency: Urgency;
  status: PrqStatus;
  step: string;
};

export const PRQS: readonly Prq[] = [
  {
    no: "PRQ-26-0210",
    date: "2026-06-02",
    requestor: "PMG Staff",
    project: "Workshop",
    mr: "—",
    est: 48200,
    ccy: "PHP",
    urgency: "Routine",
    status: "Pending Approval",
    step: "Supervisor",
  },
  {
    no: "PRQ-26-0205",
    date: "2026-05-28",
    requestor: "N. Aquino",
    project: "NORECO II — 13.2KV",
    mr: "JCE-MR-2026-0142",
    est: 4200000,
    ccy: "PHP",
    urgency: "Critical",
    status: "Approved",
    step: "—",
  },
  {
    no: "PRQ-26-0198",
    date: "2026-05-20",
    requestor: "PMG Staff",
    project: "Cavite 69KV",
    mr: "JCE-MR-2026-0140",
    est: 1240000,
    ccy: "PHP",
    urgency: "Urgent",
    status: "Converted to PO",
    step: "—",
  },
] as const;

export const URGENCY_TONE: Record<Urgency, Tone> = {
  Routine: "neutral",
  Urgent: "pending",
  Critical: "danger",
};
export const PRQ_TONE: Record<PrqStatus, Tone> = {
  Draft: "neutral",
  "Pending Approval": "pending",
  Approved: "success",
  Rejected: "danger",
  "Converted to PO": "info",
  Cancelled: "neutral",
};

export function findPrq(no: string): Prq | undefined {
  return PRQS.find((p) => p.no === no);
}

/** SLA windows (hours) by urgency — drives the U11 SLA-breach chip. */
export const SLA_HOURS: Record<Urgency, number> = {
  Critical: 4,
  Urgent: 24,
  Routine: 48,
};

// ---- U12 · approval queue (cross-entity) ----------------------------------
export type ApprovalItem = {
  entity: string;
  ref: string;
  payee: string;
  amount: number;
  ccy: Currency;
  requestor: string;
  age: string;
  urgency: Urgency;
  note: string;
};

export const APPROVALS: readonly ApprovalItem[] = [
  {
    entity: "Import stage 7",
    ref: "2605-0188IC",
    payee: "Shenda Electric Co.",
    amount: 1764000,
    ccy: "PHP",
    requestor: "Purchasing",
    age: "2d",
    urgency: "Critical",
    note: "Downpayment release gate",
  },
  {
    entity: "PO",
    ref: "2606-0210",
    payee: "Cebu Steel Corp.",
    amount: 48200,
    ccy: "PHP",
    requestor: "PMG Staff",
    age: "6h",
    urgency: "Routine",
    note: "For Approval — welding consumables",
  },
  {
    entity: "PR",
    ref: "PRQ-26-0210",
    payee: "—",
    amount: 48200,
    ccy: "PHP",
    requestor: "PMG Staff",
    age: "1d",
    urgency: "Routine",
    note: "Pre-PO budget authorization",
  },
  {
    entity: "RFP",
    ref: "RFP-PUR-26050188",
    payee: "Cebu Steel Corp.",
    amount: 312081,
    ccy: "PHP",
    requestor: "Purchasing",
    age: "4h",
    urgency: "Urgent",
    note: "Single payment — verified",
  },
] as const;

export const ENTITY_TONE: Record<string, Tone> = {
  PO: "info",
  PR: "neutral",
  RFP: "success",
  Blanket: "pending",
  "Import stage 7": "danger",
  "Import stage 4": "danger",
};

// ---- U13 · audit -----------------------------------------------------------
export type PurAudit = {
  ts: string;
  actor: string;
  entity: string;
  action: string;
  delta: string;
};

export const PUR_AUDIT: readonly PurAudit[] = [
  {
    ts: "2026-06-02 11:20",
    actor: "N. Aquino (Supervisor)",
    entity: "2606-0210",
    action: "PO submit",
    delta: "Draft → For Approval",
  },
  {
    ts: "2026-06-02 09:05",
    actor: "Purchasing Staff",
    entity: "RFP-PUR-26060021",
    action: "RFP create",
    delta: "— → Submitted (DP)",
  },
  {
    ts: "2026-05-23 16:40",
    actor: "J. Cruz (President)",
    entity: "2605-0188IC",
    action: "Import gate 4 approve",
    delta: "Pending → Done",
  },
  {
    ts: "2026-05-22 10:00",
    actor: "N. Aquino (Supervisor)",
    entity: "Shenda Electric Co.",
    action: "Supplier bank change",
    delta: "Pending verification (fraud-control)",
  },
] as const;

// ---- Stage 15 ↔ Warehouse MRR : the GoodsReceipt (GR-YY-XXXX) -------------
// Modeled HERE as the Purchasing surface of the Warehouse MRR. Same event, two
// surfaces — Warehouse owns it (Part 8); Purchasing reads it (read-only).
export type GoodsReceipt = {
  gr: string;
  mrr: string;
  po: string;
  date: string;
  receivedQty: number;
  orderedQty: number;
  status: "Partial" | "Fully Received";
};

export const GOODS_RECEIPTS: readonly GoodsReceipt[] = [
  {
    gr: "GR-26-0144",
    mrr: "MRR-2026-0144",
    po: "2605-0188IC",
    date: "2026-05-28",
    receivedQty: 1,
    orderedQty: 2,
    status: "Partial",
  },
  {
    gr: "GR-26-0120",
    mrr: "MRR-2026-0120",
    po: "2604-0177IC",
    date: "2026-05-18",
    receivedQty: 9100,
    orderedQty: 9100,
    status: "Fully Received",
  },
  {
    gr: "GR-26-0118",
    mrr: "MRR-2026-0118",
    po: "2604-0166",
    date: "2026-04-25",
    receivedQty: 12,
    orderedQty: 12,
    status: "Fully Received",
  },
] as const;

export function grForPo(no: string): GoodsReceipt | undefined {
  return GOODS_RECEIPTS.find((g) => g.po === no);
}

// ============================================================================
// Phase 2 fixtures
// ============================================================================

// ---- U15/U16 · RFQ ---------------------------------------------------------
export type RfqStatus =
  | "Draft"
  | "Sent"
  | "Responses In"
  | "Awarded"
  | "Converted"
  | "Closed";
export type Rfq = {
  no: string;
  date: string;
  item: string;
  mr: string;
  invited: number;
  responses: number;
  status: RfqStatus;
};

export const RFQS: readonly Rfq[] = [
  {
    no: "RFQ-26-0044",
    date: "2026-06-01",
    item: "Power transformer 10MVA",
    mr: "JCE-MR-2026-0142",
    invited: 3,
    responses: 2,
    status: "Responses In",
  },
  {
    no: "RFQ-26-0041",
    date: "2026-05-22",
    item: "ACSR conductor 1/0 lot",
    mr: "—",
    invited: 4,
    responses: 4,
    status: "Awarded",
  },
  {
    no: "RFQ-26-0038",
    date: "2026-05-15",
    item: "Pole-line hardware",
    mr: "JCE-MR-2026-0138",
    invited: 2,
    responses: 0,
    status: "Sent",
  },
] as const;

export const RFQ_TONE: Record<RfqStatus, Tone> = {
  Draft: "neutral",
  Sent: "info",
  "Responses In": "pending",
  Awarded: "success",
  Converted: "info",
  Closed: "neutral",
};

export function findRfq(no: string): Rfq | undefined {
  return RFQS.find((r) => r.no === no);
}

export type RfqMatrixRow = {
  item: string;
  prices: readonly number[];
  leads: readonly number[];
};
export const RFQ_MATRIX_SUPPLIERS: readonly string[] = [
  "ABB Inc.",
  "Shenda Electric",
  "Schneider",
] as const;
export const RFQ_MATRIX_ROWS: readonly RfqMatrixRow[] = [
  {
    item: "Transformer 10MVA",
    prices: [128500, 142000, 151200],
    leads: [30, 45, 60],
  },
  {
    item: "HV bushings set",
    prices: [18200, 17500, 21000],
    leads: [20, 35, 25],
  },
] as const;

/** Index of the lowest value (first occurrence). -1 for an empty list. */
export function lowestIdx(arr: readonly number[]): number {
  if (arr.length === 0) return -1;
  return arr.indexOf(Math.min(...arr));
}

// ---- U17 · catalog ---------------------------------------------------------
export type CatalogItem = {
  code: string;
  name: string;
  uom: string;
  cat: string;
  supplier: string;
  last: string;
  active: boolean;
};
export const CATALOG_TREE: readonly string[] = [
  "All",
  "MEP > Electrical > Cable & Wire",
  "MEP > Electrical > Transformers",
  "MEP > Electrical > Switchgear",
  "Civil > Structural > Steel",
] as const;
export const CATALOG_ITEMS: readonly CatalogItem[] = [
  {
    code: "ITM-00142",
    name: "ACSR conductor 1/0",
    uom: "m",
    cat: "MEP > Electrical > Cable & Wire",
    supplier: "Meralco Ind.",
    last: "₱120.00",
    active: true,
  },
  {
    code: "ITM-00088",
    name: "Distribution transformer 100KVA",
    uom: "set",
    cat: "MEP > Electrical > Transformers",
    supplier: "ABB Inc.",
    last: "₱300,000.00",
    active: true,
  },
  {
    code: "ITM-00301",
    name: "MV switchgear panel",
    uom: "unit",
    cat: "MEP > Electrical > Switchgear",
    supplier: "Schneider",
    last: "₱128,500.00",
    active: true,
  },
  {
    code: "ITM-00410",
    name: "Structural steel angle 50×50×6",
    uom: "pcs",
    cat: "Civil > Structural > Steel",
    supplier: "Cebu Steel",
    last: "₱340.00",
    active: true,
  },
] as const;

// ---- U18 · price history ---------------------------------------------------
export type PriceRow = {
  date: string;
  supplier: string;
  price: number;
  ref: string;
  up: boolean;
};
export const PRICE_HISTORY: readonly PriceRow[] = [
  {
    date: "2026-05-22",
    supplier: "ABB Inc.",
    price: 128500,
    ref: "PO 2605-0188IC",
    up: false,
  },
  {
    date: "2026-03-10",
    supplier: "ABB Inc.",
    price: 122000,
    ref: "PO 2603-0140",
    up: false,
  },
  {
    date: "2025-12-02",
    supplier: "Schneider",
    price: 131000,
    ref: "RFQ-25-0210",
    up: true,
  },
  {
    date: "2025-09-18",
    supplier: "ABB Inc.",
    price: 119000,
    ref: "PO 2509-0088",
    up: false,
  },
] as const;
/** Series in chronological order for the trend SVG. */
export const PRICE_SERIES: readonly number[] = [
  119000, 131000, 122000, 128500,
] as const;
export const PRICE_THRESHOLD_PCT = 5;

// ---- U19 · BIR Form 2307 ---------------------------------------------------
export type Bir2307Row = {
  supplier: string;
  tin: string;
  atc: string;
  base: number;
  rate: string;
  tax: number;
};
export const BIR_2307_ROWS: readonly Bir2307Row[] = [
  {
    supplier: "Cebu Steel Corp.",
    tin: "004-221-118-000",
    atc: "WI010",
    base: 312081,
    rate: "1%",
    tax: 3120.81,
  },
  {
    supplier: "Shenda Electric",
    tin: "—",
    atc: "WI020",
    base: 1764000,
    rate: "2%",
    tax: 35280.0,
  },
] as const;

// ---- U20 · lead-time -------------------------------------------------------
export type LeadTimeRow = {
  name: string;
  onTime: number;
  avgDelay: number;
  orders: number;
  score: "A" | "B" | "C";
};
export const LEAD_TIME_ROWS: readonly LeadTimeRow[] = [
  { name: "ABB Inc.", onTime: 92, avgDelay: 1.2, orders: 14, score: "A" },
  { name: "Shenda Electric", onTime: 74, avgDelay: 6.8, orders: 8, score: "B" },
  {
    name: "Cebu Steel Corp.",
    onTime: 88,
    avgDelay: 2.1,
    orders: 22,
    score: "A",
  },
  {
    name: "JinkoSolar Intl.",
    onTime: 67,
    avgDelay: 11.0,
    orders: 5,
    score: "C",
  },
] as const;
export const SCORE_TONE: Record<"A" | "B" | "C", Tone> = {
  A: "success",
  B: "pending",
  C: "danger",
};

// ---- U21 · budget vs actual (Purchasing side) ------------------------------
export type BudgetRow = {
  proj: string;
  budget: number;
  committed: number;
  actual: number;
};
export const BUDGET_ROWS: readonly BudgetRow[] = [
  {
    proj: "NORECO II — 13.2KV",
    budget: 24000000,
    committed: 18400000,
    actual: 9820000,
  },
  {
    proj: "Cavite 69KV",
    budget: 22000000,
    committed: 24200000,
    actual: 19600000,
  },
] as const;

// ---- U22 · mobile approvals ------------------------------------------------
export type MobileApproval = {
  ref: string;
  entity: string;
  payee: string;
  amt: string;
  urgency: Urgency;
  age: string;
};
export const MOBILE_APPROVALS: readonly MobileApproval[] = [
  {
    ref: "2605-0188IC",
    entity: "Import gate 7",
    payee: "Shenda Electric",
    amt: "₱1,764,000",
    urgency: "Critical",
    age: "2d",
  },
  {
    ref: "2606-0210",
    entity: "PO · For Approval",
    payee: "Cebu Steel",
    amt: "₱48,200",
    urgency: "Routine",
    age: "6h",
  },
] as const;

// ---- U23 · cycle-time ------------------------------------------------------
export type CycleStage = {
  name: string;
  mean: number;
  median: number;
  slow?: boolean;
};
export const CYCLE_STAGES: readonly CycleStage[] = [
  { name: "Creation → Approved", mean: 1.8, median: 1.0 },
  { name: "Approved → Sent", mean: 0.9, median: 0.5 },
  { name: "Import gate 4", mean: 3.2, median: 2.0, slow: false },
  { name: "Import gate 7 (DP)", mean: 8.4, median: 6.0, slow: true },
  { name: "Production", mean: 24.0, median: 21.0 },
  { name: "Delivery", mean: 12.5, median: 11.0 },
] as const;

// ---- U24 · blanket POs -----------------------------------------------------
export type BpoStatus =
  | "Draft"
  | "Active"
  | "Suspended"
  | "Exhausted"
  | "Expired"
  | "Closed";
export type Blanket = {
  no: string;
  supplier: string;
  project: string;
  ceiling: number;
  used: number;
  status: BpoStatus;
  releases: number;
};
export const BLANKETS: readonly Blanket[] = [
  {
    no: "BPO-26-0004",
    supplier: "Cebu Steel Corp.",
    project: "Workshop",
    ceiling: 2000000,
    used: 1480000,
    status: "Active",
    releases: 6,
  },
  {
    no: "BPO-26-0002",
    supplier: "Meralco Industrial",
    project: "—",
    ceiling: 1500000,
    used: 1500000,
    status: "Exhausted",
    releases: 9,
  },
  {
    no: "BPO-26-0001",
    supplier: "ABB Inc.",
    project: "NORECO II",
    ceiling: 5000000,
    used: 900000,
    status: "Active",
    releases: 2,
  },
] as const;
export const BPO_TONE: Record<BpoStatus, Tone> = {
  Draft: "neutral",
  Active: "success",
  Suspended: "pending",
  Exhausted: "danger",
  Expired: "neutral",
  Closed: "neutral",
};

// ============================================================================
// DERIVATIONS — pure functions with the §7 rule baked in
// ============================================================================

export type PoLine = { qty: number; unit: string; desc: string; price: number };

/** YYMM from the PO date field — "2026-05-30" → "2605". (§7.4) */
export function poYearMonth(poDate: string): string {
  const parts = poDate.split("-");
  const y = parts[0] ?? "0000";
  const m = parts[1] ?? "00";
  return y.slice(2) + m;
}

/**
 * Next PO number — YYMM#### (Local) / YYMM####IC (Import), derived from the PO
 * DATE FIELD (never the system clock). Separate monthly counters per type;
 * assigned on leaving Draft (Drafts consume no number); voided numbers are
 * retained so gaps are allowed (max+1, not count+1). (§7.4)
 */
export function nextPoNumber(
  poDate: string,
  type: PoType,
  existing: readonly PurchaseOrder[] = POS,
): string {
  const ym = poYearMonth(poDate);
  const suffix = type === "Import" ? "IC" : "";
  const seqs = existing
    .filter((p) => p.type === type && p.no.startsWith(ym + "-"))
    .map((p) => {
      const m = p.no.match(/^\d{4}-(\d{4})/);
      return m && m[1] ? Number(m[1]) : 0;
    });
  const next = (seqs.length ? Math.max(...seqs) : 0) + 1;
  return `${ym}-${String(next).padStart(4, "0")}${suffix}`;
}

/** Placeholder shown while a PO is still Draft (no number assigned yet). */
export function poNumberPlaceholder(poDate: string, type: PoType): string {
  const ym = poYearMonth(poDate);
  return `auto on leaving Draft · ${ym}-####${type === "Import" ? "IC" : ""}`;
}

/** Local PO totals are VAT-INCLUSIVE: TOTAL = Σ(qty×price). (§7.5) */
export function localTotals(
  lines: readonly PoLine[],
  vatable: boolean,
): { total: number; net: number; vat: number } {
  const total = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const net = vatable ? total / 1.12 : total;
  const vat = vatable ? net * 0.12 : 0;
  return { total, net, vat };
}

/** Import PO totals: Sub-Total − Discount = Grand Total, no VAT. (§7.5) */
export function importTotals(
  lines: readonly PoLine[],
  discount: number,
): { sub: number; discount: number; grand: number } {
  const sub = lines.reduce((a, l) => a + l.qty * l.price, 0);
  return { sub, discount, grand: sub - discount };
}

/**
 * Payment Status is DERIVED from linked-RFP state, never typed. (§7.6, FR-LED-06)
 * With no RFP in the live register, fall back to the last-known PO.pay (history
 * predates the register). Import: a settled Downpayment RFP → "Downpayment Paid";
 * a paid Balance/Single → "Fully Paid".
 */
export function derivePaymentStatus(
  po: PurchaseOrder,
  rfps: readonly Rfp[] = RFPS,
): PayStatus {
  const linked = rfps.filter((r) => r.po === po.no);
  if (linked.length === 0) return po.pay;
  const isPaid = (s: RfpStatus) => s === "Paid";
  const isSettled = (s: RfpStatus) =>
    s === "Verified" || s === "Received (Accounting)" || s === "Paid";
  const balancePaid = linked.some(
    (r) => (r.type === "Balance" || r.type === "Single") && isPaid(r.status),
  );
  const dpSettled = linked.some(
    (r) => r.type === "Downpayment" && isSettled(r.status),
  );
  if (po.type === "Import") {
    if (balancePaid) return "Fully Paid";
    if (dpSettled) return "Downpayment Paid";
    return "Unpaid";
  }
  return linked.some((r) => isPaid(r.status)) ? "Fully Paid" : "Unpaid";
}

/**
 * Three-way match (PO ⇄ supplier invoice ⇄ MRR received). Passes within
 * tolerance (default 1% qty / ₱100 amount). Over-tolerance needs a Supervisor
 * override; the gate blocks RFP Draft→Submitted. (§7.15.1)
 */
export type ThreeWayInput = {
  poQty: number;
  invoiceQty: number;
  mrrQty: number;
  poAmt: number;
  invoiceAmt: number;
  qtyTolPct?: number;
  amtTol?: number;
};
export function threeWayMatch(i: ThreeWayInput): {
  ok: boolean;
  overTolerance: boolean;
  needsOverride: boolean;
  qtyDelta: number;
  amtDelta: number;
} {
  const qtyTolPct = i.qtyTolPct ?? 1;
  const amtTol = i.amtTol ?? 100;
  const qtyTol = (qtyTolPct / 100) * i.poQty;
  const qtyDelta = Math.max(
    Math.abs(i.poQty - i.invoiceQty),
    Math.abs(i.poQty - i.mrrQty),
  );
  const amtDelta = Math.abs(i.poAmt - i.invoiceAmt);
  const ok = qtyDelta <= qtyTol && amtDelta <= amtTol;
  return { ok, overTolerance: !ok, needsOverride: !ok, qtyDelta, amtDelta };
}

/** Expanded withholding (EWT) by classification. RFP is canonical for ATC. (§7.7) */
export type EwtClass = "Goods" | "Services" | "Rentals" | "Professional";
export const EWT_RATES: Record<EwtClass, number> = {
  Goods: 1,
  Services: 2,
  Rentals: 5,
  Professional: 10,
};
export const EWT_ATC: Record<EwtClass, string> = {
  Goods: "WI010",
  Services: "WI020",
  Rentals: "WI100",
  Professional: "WI011",
};
export function ewt(
  total: number,
  classification: EwtClass,
): { rate: number; atc: string; withholding: number; netPayment: number } {
  const rate = EWT_RATES[classification];
  const withholding = (rate / 100) * total;
  return {
    rate,
    atc: EWT_ATC[classification],
    withholding,
    netPayment: total - withholding,
  };
}

/**
 * Approval chain resolved at submit from the illustrative threshold bands and
 * STORED on the record (later table edits don't change an in-flight chain).
 * USD is normalized to PHP at a mock FX purely for banding. (§7.15.4)
 */
const MOCK_FX_USD_PHP = 56;
export function resolveApprovalChain(
  _entityType: string,
  amount: number,
  ccy: Currency,
): { band: string; chain: readonly string[]; boardNote: boolean } {
  const php = ccy === "USD" ? amount * MOCK_FX_USD_PHP : amount;
  if (php <= 50000)
    return { band: "0 – 50K", chain: ["Supervisor"], boardNote: false };
  if (php <= 500000)
    return {
      band: "50,001 – 500K",
      chain: ["Supervisor", "Finance / Admin Mgr"],
      boardNote: false,
    };
  if (php <= 5000000)
    return {
      band: "500,001 – 5M",
      chain: ["Supervisor", "Finance / Admin Mgr", "President"],
      boardNote: false,
    };
  return {
    band: "5M +",
    chain: ["Supervisor", "Finance / Admin Mgr", "President"],
    boardNote: true,
  };
}

/** Import tracker progress + the two stall gates (4 & 7). (§7.8) */
export function importProgress(stages: readonly ImportStage[]): {
  done: number;
  total: number;
  firstBlocked: ImportStage | null;
  gate4: ImportStage | null;
  gate7: ImportStage | null;
} {
  return {
    done: stages.filter((s) => s.status === "Done").length,
    total: stages.length,
    firstBlocked: stages.find((s) => s.status === "Blocked") ?? null,
    gate4: stages.find((s) => s.n === 4) ?? null,
    gate7: stages.find((s) => s.n === 7) ?? null,
  };
}

/** Local 5-stage progress. (§7.15.5) */
export function localProgress(stage: number): {
  current: number;
  total: number;
} {
  return { current: Math.max(0, Math.min(5, stage)), total: 5 };
}

// ---- Cross-module hand-off (PMG MR "For Purchase" → Purchasing) ------------
/** The MR header (read-only) from the canonical PMG registry. */
export function mrHeader(mrNo: string): Mr | undefined {
  return getMr(mrNo);
}
/** Only the For-Purchase>0 lines of an MR — the inventory-first hand-off. */
export function forPurchaseFromMr(mrNo: string): MrLine[] {
  return getMrLines(mrNo).filter((l) => forPurchaseQty(l) > 0);
}
