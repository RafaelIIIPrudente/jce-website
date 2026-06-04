// ============================================================================
// JCE SYSTEM — BDD module fixtures (Part 3). Ported from bdd-data.jsx.
// Two record patterns: IMMUTABLE event streams (Offers B4, Quotations B6) +
// standard edit-with-audit (Sales Orders, website content, inquiries).
//
// SALES_ORDERS is the CANONICAL SO# registry every other module (Parts 4–8)
// references — the `so` values (e.g. "26-05-378" NORECO II) are the anchors.
// Inquiries do NOT live here — they share lib/mock/inquiries.ts with the website.
// ============================================================================

// Chip tone vocabulary (matches components/jce/chip ChipTone) — kept local so this
// data module has no component dependency.
export type Tone =
  | "success"
  | "pending"
  | "danger"
  | "info"
  | "neutral"
  | "locked";

// ---- B1/B2 · Sales Orders (the SO# registry) -------------------------------
export type SalesOrder = {
  so: string;
  date: string;
  client: string;
  name: string;
  amount: number;
  /** cumulative progress-billed to date (sum of issued billings — external) */
  cumBilled: number;
  remarks: string;
  status: string;
  turned: boolean;
  by: string;
};

export const SALES_ORDERS: readonly SalesOrder[] = [
  {
    so: "26-05-378",
    date: "2026-05-02",
    client: "NORECO II",
    name: "13.2KV Distribution Line",
    amount: 53277688,
    cumBilled: 6039221.6, // 11.34% PB1 anchor → retention/recoup/remaining derive from this
    remarks: "With Contract",
    status: "Ongoing Project",
    turned: false,
    by: "B. Navarro",
  },
  {
    so: "26-04-355",
    date: "2026-04-10",
    client: "Meralco",
    name: "Cavite 69KV Transmission Line",
    amount: 38400000,
    cumBilled: 1920000,
    remarks: "With NTP",
    status: "Ongoing Project",
    turned: false,
    by: "B. Navarro",
  },
  {
    so: "25-11-290",
    date: "2025-11-04",
    client: "SMC Global",
    name: "Solar Farm Tarlac 5MWp",
    amount: 62000000,
    cumBilled: 12400000,
    remarks: "With SOA",
    status: "On Hold",
    turned: false,
    by: "BDD Staff",
  },
  {
    so: "25-09-201",
    date: "2025-09-18",
    client: "NGCP",
    name: "230KV Substation — Bulacan",
    amount: 120400000,
    cumBilled: 120400000,
    remarks: "Done",
    status: "Project Completed",
    turned: true,
    by: "B. Navarro",
  },
  {
    so: "26-06-390",
    date: "2026-06-01",
    client: "Aboitiz Power",
    name: "Switchgear supply",
    amount: 0,
    cumBilled: 0,
    remarks: "No Offer Yet",
    status: "Ongoing Project",
    turned: false,
    by: "BDD Staff",
  },
] as const;

export const SO_REMARK_TONE: Record<string, Tone> = {
  "No Offer Yet": "neutral",
  "With Offer": "info",
  "With NOA": "info",
  "With NTP": "info",
  "With P.O.": "info",
  "With SOA": "pending",
  "With Contract": "success",
  Done: "success",
  Cancelled: "danger",
};
export const SO_STATUS_TONE: Record<string, Tone> = {
  "Ongoing Project": "info",
  "On Hold": "pending",
  "Project Completed": "success",
  Cancelled: "danger",
};

export const SO_STATUS_OPTIONS = [
  "Ongoing Project",
  "On Hold",
  "Project Completed",
  "Cancelled",
] as const;
export const SO_REMARK_OPTIONS = [
  "No Offer Yet",
  "With Offer",
  "With NOA",
  "With NTP",
  "With P.O.",
  "With SOA",
  "With Contract",
  "Done",
  "Cancelled",
] as const;

// Progress-billing structure (per-contract %; mocked as JCE defaults).
export const DP_PCT = 0.15;
export const RETENTION_PCT = 0.1;
export const DP_RECOUP_PCT = 0.15;

export type SoDerived = {
  dpAmt: number;
  cumBilled: number;
  retentionHeld: number;
  dpRecouped: number;
  remaining: number;
};

/** Derived, read-only progress-billing figures (B2). Anchors for 26-05-378:
 *  dpAmt 7,991,653.20 · cumBilled 6,039,221.60 · retention 603,922.16 ·
 *  recoup 905,883.24 · remaining 47,238,466.40. */
export function soDerived(
  so: Pick<SalesOrder, "amount" | "cumBilled">,
): SoDerived {
  return {
    dpAmt: so.amount * DP_PCT,
    cumBilled: so.cumBilled,
    retentionHeld: so.cumBilled * RETENTION_PCT,
    dpRecouped: so.cumBilled * DP_RECOUP_PCT,
    remaining: so.amount - so.cumBilled,
  };
}

// ---- B3/B4 · Offers (JCEPSI · JICA streams) --------------------------------
export type OfferEntity = "JCEPSI" | "JICA";

export type Offer = {
  ref: string;
  entity: OfferEntity;
  date: string;
  emailed: string;
  by: string;
  client: string;
  subject: string;
  amount: number;
  status: string;
  rev: number;
};

export const OFFERS: readonly Offer[] = [
  {
    ref: "NER2-26-021",
    entity: "JCEPSI",
    date: "2026-05-20",
    emailed: "2026-05-20",
    by: "B. Navarro",
    client: "NORECO II",
    subject: "13.2KV Distribution Line — formal offer",
    amount: 53277688,
    status: "Awarded",
    rev: 0,
  },
  {
    ref: "MER-26-018",
    entity: "JCEPSI",
    date: "2026-05-12",
    emailed: "2026-05-13",
    by: "BDD Staff",
    client: "Meralco",
    subject: "Cavite 69KV line",
    amount: 38400000,
    status: "Acknowledged",
    rev: 0,
  },
  {
    ref: "ABZ-26-009Rev.01",
    entity: "JCEPSI",
    date: "2026-05-28",
    emailed: "2026-05-28",
    by: "BDD Staff",
    client: "Aboitiz Power",
    subject: "Switchgear supply (revised)",
    amount: 6200000,
    status: "Waiting for Client Response",
    rev: 1,
  },
  {
    ref: "JICA-26-004",
    entity: "JICA",
    date: "2026-04-30",
    emailed: "2026-05-01",
    by: "B. Navarro",
    client: "DOE-JICA Program",
    subject: "Rural electrification package",
    amount: 88000000,
    status: "For Revision",
    rev: 0,
  },
] as const;

export const OFFER_STATUS_TONE: Record<string, Tone> = {
  "Waiting for Client Response": "pending",
  Acknowledged: "info",
  "For Revision": "pending",
  Revised: "neutral",
  Awarded: "success",
  "Not Awarded": "danger",
  "Offer Lapsed": "neutral",
  Cancelled: "danger",
};

export type OfferEventType =
  | "Status Change"
  | "P.O./NOA Received"
  | "COC Date"
  | "Receipt"
  | "Remark"
  | "Sales Order Linked";

export type OfferEvent = {
  type: OfferEventType | string;
  data: string;
  ts: string;
  user: string;
};

export const OFFER_EVENT_TYPES: readonly OfferEventType[] = [
  "Status Change",
  "P.O./NOA Received",
  "COC Date",
  "Receipt",
  "Remark",
  "Sales Order Linked",
];

// B4 append-only event stream for NER2-26-021 (newest first).
export const OFFER_EVENTS: Record<string, readonly OfferEvent[]> = {
  "NER2-26-021": [
    {
      type: "Sales Order Linked",
      data: "SO# 26-05-378",
      ts: "2026-06-01 14:22",
      user: "B. Navarro",
    },
    {
      type: "Status Change",
      data: "Acknowledged → Awarded",
      ts: "2026-06-01 14:20",
      user: "B. Navarro",
    },
    {
      type: "P.O./NOA Received",
      data: "NOA No. NER2-NOA-118 · 2026-05-30",
      ts: "2026-05-30 10:05",
      user: "BDD Staff",
    },
    {
      type: "Remark",
      data: "Client confirmed board approval over call.",
      ts: "2026-05-26 09:40",
      user: "B. Navarro",
    },
    {
      type: "Status Change",
      data: "Waiting for Client Response → Acknowledged",
      ts: "2026-05-22 16:00",
      user: "BDD Staff",
    },
  ],
};

export const EVENT_TONE: Record<string, Tone> = {
  "Status Change": "info",
  "P.O./NOA Received": "success",
  "COC Date": "info",
  Receipt: "success",
  Remark: "neutral",
  "Sales Order Linked": "success",
  "Price Recorded": "info",
  "Selected as Winner": "success",
  "Note Added": "neutral",
};

export type OfferState = {
  status: string;
  noa: string | null;
  linkedSO: string | null;
};

/** Current offer state DERIVED from the append-only event stream (B4). Events
 *  are newest-first, so the first match wins. (bdd-flagships.jsx:18-23) */
export function offerState(
  events: readonly OfferEvent[],
  fallbackStatus: string,
): OfferState {
  const statusEvt = events.find((e) => e.type === "Status Change");
  const status = statusEvt
    ? (statusEvt.data.split("→").pop() ?? fallbackStatus).trim()
    : fallbackStatus;
  const noa = events.find((e) => e.type === "P.O./NOA Received")?.data ?? null;
  const linkedSO =
    events.find((e) => e.type === "Sales Order Linked")?.data ?? null;
  return { status, noa, linkedSO };
}

// ---- B5/B6 · Quotations (EC · Workshop · Solar) ----------------------------
export type QuotationCat = "EC" | "Workshop" | "Solar";

export type Quotation = {
  ref: string;
  cat: QuotationCat;
  item: string;
  client: string;
  date: string;
  responded: number;
  invited: number;
  winner: string | null;
  offer: string | null;
  so: string;
};

export const QUOTATIONS: readonly Quotation[] = [
  {
    ref: "Q-EC-26031",
    cat: "EC",
    item: "Power transformer 10MVA",
    client: "NORECO II",
    date: "2026-05-18",
    responded: 2,
    invited: 3,
    winner: "ABB Inc.",
    offer: "NER2-26-021",
    so: "26-05-378",
  },
  {
    ref: "Q-WS-26012",
    cat: "Workshop",
    item: "Steel fabrication — gantry",
    client: "Internal",
    date: "2026-05-20",
    responded: 3,
    invited: 3,
    winner: null,
    offer: null,
    so: "WORKSHOP",
  },
  {
    ref: "Q-SP-26008",
    cat: "Solar",
    item: "PV modules 550Wp",
    client: "SMC Global",
    date: "2026-04-28",
    responded: 2,
    invited: 4,
    winner: "JinkoSolar Intl.",
    offer: null,
    so: "25-11-290",
  },
] as const;

export type SupplierQuote = {
  supplier: string;
  respDate: string;
  status: string;
  price: number | null;
  winner: boolean;
  note: string;
};

// B6 supplier quotes for Q-EC-26031.
export const SUPPLIER_QUOTES: Record<string, readonly SupplierQuote[]> = {
  "Q-EC-26031": [
    {
      supplier: "ABB Inc.",
      respDate: "2026-05-22",
      status: "Done (Quote Received)",
      price: 128500,
      winner: true,
      note: "Best price + 30d lead",
    },
    {
      supplier: "Shenda Electric Co.",
      respDate: "2026-05-23",
      status: "Done (Quote Received)",
      price: 142000,
      winner: false,
      note: "45d lead",
    },
    {
      supplier: "Meralco Industrial",
      respDate: "—",
      status: "Waiting",
      price: null,
      winner: false,
      note: "Reminder sent",
    },
  ],
};

export const QRESP_TONE: Record<string, Tone> = {
  Waiting: "pending",
  "For Revision": "pending",
  "Done (Quote Received)": "success",
  "No Quote": "danger",
  Other: "neutral",
};

/** Lowest price over the non-null quotes (B6 best-value highlight). */
export function lowestPrice(quotes: readonly SupplierQuote[]): number | null {
  const prices = quotes
    .map((q) => q.price)
    .filter((p): p is number => p != null);
  return prices.length ? Math.min(...prices) : null;
}

// ---- B7/B8/B9 · Website content CMS ----------------------------------------
export type WebStatus = "Published" | "Draft" | "Hidden";

export type WebProject = {
  name: string;
  client: string;
  showClient: boolean;
  loc: string;
  done: string;
  tags: readonly string[];
  status: WebStatus;
  sort: number;
};
export type WebEntry = { name: string; status: WebStatus; sort: number };

export const WEB_PROJECTS: readonly WebProject[] = [
  {
    name: "230KV Substation — Bulacan",
    client: "NGCP",
    showClient: true,
    loc: "Bulacan",
    done: "2026-03",
    tags: ["Substation", "Transmission Line"],
    status: "Published",
    sort: 1,
  },
  {
    name: "Solar Farm — Tarlac 5MWp",
    client: "SMC Global",
    showClient: false,
    loc: "Tarlac",
    done: "2025-12",
    tags: ["Solar", "Renewable Energy"],
    status: "Published",
    sort: 2,
  },
  {
    name: "13.2KV Distribution Line",
    client: "NORECO II",
    showClient: true,
    loc: "Negros Oriental",
    done: "—",
    tags: ["Transmission Line"],
    status: "Draft",
    sort: 3,
  },
] as const;

export const WEB_SERVICES: readonly WebEntry[] = [
  {
    name: "Substation Design and Construction (up to 230 KV)",
    status: "Published",
    sort: 1,
  },
  { name: "Transmission Line Construction", status: "Published", sort: 2 },
  { name: "Solar / Renewable Energy EPC", status: "Published", sort: 3 },
  { name: "Maintenance & Servicing", status: "Draft", sort: 4 },
] as const;

export const WEB_PRODUCTS: readonly WebEntry[] = [
  { name: "Power Transformer (15 KV – 230 KV)", status: "Published", sort: 1 },
  { name: "HVSG / MVSG / LVSG Switchgear", status: "Published", sort: 2 },
  { name: "Distribution Transformers", status: "Hidden", sort: 3 },
] as const;

export const WEB_STATUS_TONE: Record<WebStatus, Tone> = {
  Published: "success",
  Draft: "pending",
  Hidden: "neutral",
};
export const WEB_STATUS_OPTIONS: readonly WebStatus[] = [
  "Published",
  "Draft",
  "Hidden",
];

// ---- B10 · inquiry status tones (inquiries live in lib/mock/inquiries.ts) ---
export const INQ_TONE: Record<string, Tone> = {
  New: "info",
  "In Review": "pending",
  Replied: "success",
  Closed: "neutral",
  Spam: "danger",
};

// ---- B11 · BDD audit -------------------------------------------------------
export type BddAuditEntry = {
  ts: string;
  user: string;
  area: string;
  action: string;
  rec: string;
  field: string;
  delta: string;
};

export const BDD_AUDIT: readonly BddAuditEntry[] = [
  {
    ts: "2026-06-01 14:22",
    user: "B. Navarro",
    area: "Offer",
    action: "Event Appended",
    rec: "NER2-26-021",
    field: "Sales Order Linked",
    delta: "→ SO# 26-05-378",
  },
  {
    ts: "2026-06-01 14:20",
    user: "B. Navarro",
    area: "Offer",
    action: "Status Change",
    rec: "NER2-26-021",
    field: "Status",
    delta: "Acknowledged → Awarded",
  },
  {
    ts: "2026-05-28 09:10",
    user: "BDD Staff",
    area: "Sales Order",
    action: "Edited",
    rec: "26-05-378",
    field: "Contract Amount",
    delta: "₱52.0M → ₱53,277,688 (sensitive)",
  },
  {
    ts: "2026-05-22 10:30",
    user: "B. Navarro",
    area: "Supplier Quote",
    action: "Event Appended",
    rec: "Q-EC-26031",
    field: "Selected as Winner",
    delta: "ABB Inc. (sensitive)",
  },
] as const;

export const BDD_AUDIT_AREAS = [
  "All",
  "Sales Order",
  "Offer",
  "Quotation",
  "Supplier Quote",
  "Website Project",
  "Inquiry",
] as const;
