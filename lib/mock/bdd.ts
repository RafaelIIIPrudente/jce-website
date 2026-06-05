// ============================================================================
// JCE SYSTEM — BDD module fixtures (Part 3). Ported from bdd-data.jsx.
// Two record patterns: IMMUTABLE event streams (Offers B4, Quotations B6) +
// standard edit-with-audit (Sales Orders, website content, inquiries).
//
// SALES_ORDERS is the CANONICAL SO# registry every other module (Parts 4–8)
// references — the `so` values (e.g. "26-05-378" NORECO II) are the anchors.
// Inquiries do NOT live here — they share lib/mock/inquiries.ts with the website.
// ============================================================================

import { type LucideIcon, ZapIcon } from "lucide-react";

import {
  ALL_PROJECTS,
  type Project,
  type ProjectImage,
} from "@/lib/content/projects";
import {
  CAREERS,
  NEWS,
  PRODUCTS,
  SERVICES,
  type CareerRole,
  type NewsArticle,
  type Product,
  type Service,
} from "@/lib/content/website";

// Chip tone vocabulary (matches components/jce/chip ChipTone). The B7–B9 Website
// CMS below deliberately imports the public content schemas (lib/content): the CMS
// record types are the public Project/Service/Product &-extended, so they track the
// live site by construction (SRS §9.2) rather than re-declaring a parallel shape.
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
  /** short, factual scope of work — register-cell length (B1 column, B2 header) */
  scope: string;
  amount: number;
  /** cumulative progress-billed to date (sum of issued billings — external) */
  cumBilled: number;
  remarks: string;
  status: string;
  turned: boolean;
  by: string;
};

// Seed registry (frozen). This is the CANONICAL SO# list every other module
// (Parts 4–8) aligns to — keep it exported and immutable for back-compat. The
// in-session mutable store below is seeded from this and is what the BDD UI reads.
export const SALES_ORDERS: readonly SalesOrder[] = [
  {
    so: "26-05-378",
    date: "2026-05-02",
    client: "NORECO II",
    name: "13.2KV Distribution Line",
    scope: "13.2KV distribution line construction",
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
    scope: "69KV transmission line construction",
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
    scope: "5MWp solar farm EPC",
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
    scope: "230KV substation erection",
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
    scope: "Switchgear supply",
    amount: 0,
    cumBilled: 0,
    remarks: "No Offer Yet",
    status: "Ongoing Project",
    turned: false,
    by: "BDD Staff",
  },
] as const;

// ---- B1/B2 · in-session SO store (mirrors lib/mock/inquiries.ts) -----------
// ONE store, no parallel copy. Client-session singleton (module-level) — NO
// backend/DB/persistence. Reloading the page resets it to the seed (intentional
// mock). The BDD list + record read/write THROUGH these helpers so created SOs
// are reachable; other modules keep aligning to the frozen SALES_ORDERS seed.
const soStore: SalesOrder[] = SALES_ORDERS.map((o) => ({ ...o }));

/** The fields a new SO needs; cumBilled/turned default for a fresh order. */
export type NewSalesOrder = Pick<
  SalesOrder,
  | "so"
  | "date"
  | "client"
  | "name"
  | "scope"
  | "amount"
  | "remarks"
  | "status"
  | "by"
>;

/** Current SO registry (newest-created first, then seed order). */
export function getSalesOrders(): readonly SalesOrder[] {
  return soStore;
}

/** Append a new SO at the top so it lands on page 1; returns the created record. */
export function addSalesOrder(input: NewSalesOrder): SalesOrder {
  const created: SalesOrder = { ...input, cumBilled: 0, turned: false };
  soStore.unshift(created);
  return created;
}

/** In-session mutate (B2 status / remarks / contract amount). */
export function updateSalesOrder(
  so: string,
  patch: Partial<Omit<SalesOrder, "so">>,
): void {
  const i = soStore.findIndex((o) => o.so === so);
  const cur = soStore[i];
  if (cur) soStore[i] = { ...cur, ...patch };
}

// ---- B2 · linked records (mock until Acctg/Purchasing/Warehouse are wired) --
// Billings (Part 5) · POs (Part 7) · Material Requests (Part 8), keyed by SO#.
// Amounts use `amount`; date-based rows use `date`. SOs with no activity are
// simply absent (the record falls back to an all-empty group set).
export type SoLinkedRow = {
  doc: string;
  label: string;
  amount?: number;
  date?: string;
  status: string;
  tone: Tone;
};
export type SoLinked = {
  billings: readonly SoLinkedRow[];
  pos: readonly SoLinkedRow[];
  mrs: readonly SoLinkedRow[];
};

export const SO_LINKED: Record<string, SoLinked> = {
  "26-05-378": {
    billings: [
      {
        doc: "PB1",
        label: "Progress Billing 1 · 11.34%",
        amount: 6039221.6,
        status: "Paid",
        tone: "success",
      },
    ],
    pos: [
      {
        doc: "PO-26-0142",
        label: "Power transformer 10MVA — ABB Inc.",
        amount: 4200000,
        status: "Delivered",
        tone: "success",
      },
      {
        doc: "PO-26-0151",
        label: "Conductor & line hardware",
        amount: 1850000,
        status: "In transit",
        tone: "info",
      },
    ],
    mrs: [
      {
        doc: "MR-26-088",
        label: "Site mobilization materials",
        date: "2026-05-15",
        status: "Released",
        tone: "success",
      },
    ],
  },
  "26-04-355": {
    billings: [
      {
        doc: "PB1",
        label: "Progress Billing 1 · 5.00%",
        amount: 1920000,
        status: "For Payment",
        tone: "pending",
      },
    ],
    pos: [
      {
        doc: "PO-26-0160",
        label: "Steel transmission poles",
        amount: 2400000,
        status: "Ordered",
        tone: "info",
      },
    ],
    mrs: [],
  },
  "25-11-290": {
    billings: [
      {
        doc: "PB1",
        label: "Progress Billing 1 · 20.00%",
        amount: 12400000,
        status: "Paid",
        tone: "success",
      },
    ],
    pos: [
      {
        doc: "PO-25-0301",
        label: "PV modules 550Wp — JinkoSolar",
        amount: 9600000,
        status: "Delivered",
        tone: "success",
      },
    ],
    mrs: [
      {
        doc: "MR-25-201",
        label: "Mounting structures & inverters",
        date: "2025-11-28",
        status: "Released",
        tone: "success",
      },
    ],
  },
  "25-09-201": {
    billings: [
      {
        doc: "FB",
        label: "Final Billing · 100.00%",
        amount: 120400000,
        status: "Paid",
        tone: "success",
      },
    ],
    pos: [
      {
        doc: "PO-25-0120",
        label: "230KV GIS switchgear",
        amount: 64000000,
        status: "Delivered",
        tone: "success",
      },
    ],
    mrs: [
      {
        doc: "MR-25-110",
        label: "Substation steelworks",
        date: "2025-09-30",
        status: "Released",
        tone: "success",
      },
    ],
  },
};

const SO_LINKED_EMPTY: SoLinked = { billings: [], pos: [], mrs: [] };

/** Linked billings/POs/MRs for an SO# (all-empty when the SO has no activity). */
export function getSoLinked(so: string): SoLinked {
  return SO_LINKED[so] ?? SO_LINKED_EMPTY;
}

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

// ---- B3/B4 · in-session Offer store (mirrors the SO store above) ------------
// ONE store, no parallel copy. Client-session singleton (module-level) — NO
// backend/DB/persistence. The seed OFFERS above stays frozen for back-compat;
// the BDD list + record read/write THROUGH these helpers so offers created this
// session appear in their entity stream and open a working detail. Reloading the
// page resets to the seed (intentional mock).
const offerStore: Offer[] = OFFERS.map((o) => ({ ...o }));

/** The fields a new offer needs; rev defaults to 0 for a fresh offer. */
export type NewOffer = Pick<
  Offer,
  | "ref"
  | "entity"
  | "date"
  | "emailed"
  | "by"
  | "client"
  | "subject"
  | "amount"
  | "status"
>;

/** Current offer registry (newest-created first, then seed order). */
export function getOffers(): readonly Offer[] {
  return offerStore;
}

/** Prepend a new offer so it lands on page 1 of its entity stream; returns it. */
export function addOffer(input: NewOffer): Offer {
  const created: Offer = { ...input, rev: 0 };
  offerStore.unshift(created);
  return created;
}

/** In-session mutate (parity with updateSalesOrder; ref is the route key). */
export function updateOffer(
  ref: string,
  patch: Partial<Omit<Offer, "ref">>,
): void {
  const i = offerStore.findIndex((o) => o.ref === ref);
  const cur = offerStore[i];
  if (cur) offerStore[i] = { ...cur, ...patch };
}

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

// Status options for the B3 create form. First entry is the initial issued
// status a fresh offer defaults to (its derived state until an event is recorded).
export const OFFER_STATUS_OPTIONS = [
  "Waiting for Client Response",
  "Acknowledged",
  "For Revision",
  "Revised",
  "Awarded",
  "Not Awarded",
  "Offer Lapsed",
  "Cancelled",
] as const;

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

const OFFER_EVENTS_EMPTY: readonly OfferEvent[] = [];

/** Seed event stream for an offer ref (mirrors getSoLinked). Offers created this
 *  session have no entry → an empty stream, so offerState() falls back to the
 *  offer's issued status. */
export function getOfferEvents(ref: string): readonly OfferEvent[] {
  return OFFER_EVENTS[ref] ?? OFFER_EVENTS_EMPTY;
}

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

// ---- B5/B6 · in-session quotation store (mirrors the SO/Offer stores) -------
// ONE store, no parallel copy. Client-session singleton (module-level) — NO
// backend/DB/persistence. The seed QUOTATIONS above stays frozen for back-compat;
// this mutable copy is what the BDD UI reads/writes so created requests are
// reachable. Resets to the seed on reload (intentional mock).
const quotationStore: Quotation[] = QUOTATIONS.map((q) => ({ ...q }));

/** The fields a new request needs; counts + winner default for a fresh request. */
export type NewQuotation = Pick<
  Quotation,
  "ref" | "cat" | "item" | "client" | "date" | "offer" | "so"
>;

/** Current quotation registry (newest-created first, then seed order). */
export function getQuotations(): readonly Quotation[] {
  return quotationStore;
}

/** Append a new request at the top so it lands on page 1 of its category stream. */
export function addQuotation(input: NewQuotation): Quotation {
  const created: Quotation = {
    ...input,
    responded: 0,
    invited: 0,
    winner: null,
  };
  quotationStore.unshift(created);
  return created;
}

/** In-session mutate (B6 winner persistence). */
export function updateQuotation(
  ref: string,
  patch: Partial<Omit<Quotation, "ref">>,
): void {
  const i = quotationStore.findIndex((q) => q.ref === ref);
  const cur = quotationStore[i];
  if (cur) quotationStore[i] = { ...cur, ...patch };
}

// ---- B6 · in-session supplier-quote store (append-only children, OQ#16) -----
// Each logged quote is an immutable child. Seeded from SUPPLIER_QUOTES; quotes
// logged this session are appended in log order. Keyed by quotation ref.
const supplierQuoteStore: Record<string, SupplierQuote[]> = Object.fromEntries(
  Object.entries(SUPPLIER_QUOTES).map(([ref, quotes]) => [
    ref,
    quotes.map((q) => ({ ...q })),
  ]),
);

/** Seed + session-logged supplier quotes for a ref, in log order. */
export function getSupplierQuotes(ref: string): readonly SupplierQuote[] {
  return supplierQuoteStore[ref] ?? [];
}

/** Append a logged supplier quote. */
export function addSupplierQuote(ref: string, quote: SupplierQuote): void {
  const list = supplierQuoteStore[ref];
  if (list) list.push(quote);
  else supplierQuoteStore[ref] = [quote];
}

/** In-session edit of a logged supplier quote, matched by its current supplier
 *  name (the per-request key — each supplier is logged once). */
export function updateSupplierQuote(
  ref: string,
  supplier: string,
  patch: Partial<SupplierQuote>,
): void {
  const list = supplierQuoteStore[ref];
  if (!list) return;
  const i = list.findIndex((s) => s.supplier === supplier);
  const cur = list[i];
  if (cur) list[i] = { ...cur, ...patch };
}

/**
 * Derived response counts for a request: invited = number of logged quotes,
 * responded = those with a price. Falls back to the Quotation's stored counts
 * when nothing has been logged yet, so the seed rows that ship counts but no
 * supplier-quote rows (Q-WS-26012 3/3, Q-SP-26008 2/4) still display correctly.
 */
export function quotationCounts(q: Quotation): {
  responded: number;
  invited: number;
} {
  const logged = getSupplierQuotes(q.ref);
  if (logged.length === 0)
    return { responded: q.responded, invited: q.invited };
  return {
    invited: logged.length,
    responded: logged.filter((s) => s.price != null).length,
  };
}

/** Supplier-quote response statuses (B6 log dialog) — keys of QRESP_TONE, with
 *  "Done (Quote Received)" first as the default for a newly-logged quote. */
export const QRESP_OPTIONS = [
  "Done (Quote Received)",
  "Waiting",
  "For Revision",
  "No Quote",
  "Other",
] as const;

/** Per-category Ref. No. prefix (EC → Q-EC-, Workshop → Q-WS-, Solar → Q-SP-). */
export const QUOTATION_CAT_PREFIX: Record<QuotationCat, string> = {
  EC: "Q-EC-",
  Workshop: "Q-WS-",
  Solar: "Q-SP-",
};

// ---- B7/B8/B9 · Website content CMS (SRS §9.2) -----------------------------
// FIELD-MATCH IS THE POINT: a CMS record IS the public content record &-extended
// with the §9.2 governance fields — never a re-declared parallel shape. Change the
// public Project/Service/Product schema (lib/content) and these track it by
// construction. Stores are in-session singletons SEEDED FROM the live content
// (mirrors lib/mock/inquiries.ts); edits persist for the session and append to the
// BDD audit (§9.6, edit-with-audit — NOT the immutable event-stream of Offers/
// Quotations). Live write-back to the static lib/content is the documented target
// but stays PROPOSED here (lib/content is static TS — never written to from a mock).
export type WebStatus = "Published" | "Draft" | "Hidden";

// Governance layered onto each public type. Projects' `gallery` already carries the
// photos; services/products gain an optional `photos`. `coverIndex` designates the
// row-thumbnail cover; `sort` is the public ordering; `archived` is the soft-delete.
export type CmsProject = Project & {
  showClient: boolean;
  status: WebStatus;
  sort: number;
  coverIndex?: number;
  archived?: boolean;
};
export type CmsService = Service & {
  status: WebStatus;
  sort: number;
  photos?: readonly ProjectImage[];
  coverIndex?: number;
  archived?: boolean;
};
export type CmsProduct = Product & {
  status: WebStatus;
  sort: number;
  photos?: readonly ProjectImage[];
  coverIndex?: number;
  archived?: boolean;
};

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

// The seed icon (LucideIcon) is carried verbatim and shown but is NOT user-editable;
// CMS-created services/products get this sensible default glyph.
export const CMS_DEFAULT_ICON: LucideIcon = ZapIcon;

// ---- in-session stores, SEEDED from the live public content ----------------
// ONE store per entity, no parallel copy. Reloading the page resets to the seed
// (intentional mock). Status defaults Published; showClient mirrors whether the
// seed project named a client; sort = seed index.
const cmsProjectStore: CmsProject[] = ALL_PROJECTS.map((p, i) => ({
  ...p,
  showClient: p.client != null,
  status: "Published",
  sort: i,
  coverIndex: 0,
  archived: false,
}));
const cmsServiceStore: CmsService[] = SERVICES.map((s, i) => ({
  ...s,
  status: "Published",
  sort: i,
  photos: [],
  coverIndex: 0,
  archived: false,
}));
const cmsProductStore: CmsProduct[] = PRODUCTS.map((p, i) => ({
  ...p,
  status: "Published",
  sort: i,
  photos: [],
  coverIndex: 0,
  archived: false,
}));

// New-record inputs — Pick the editable public+governance fields (NO re-declare);
// gallery/photos/sort/archived default inside the add* helpers. `icon` defaults.
export type NewCmsProject = Pick<
  CmsProject,
  | "slug"
  | "name"
  | "category"
  | "location"
  | "client"
  | "showClient"
  | "capacity"
  | "voltage"
  | "scope"
  | "year"
  | "summary"
  | "status"
>;
export type NewCmsService = Pick<
  CmsService,
  "slug" | "name" | "spec" | "desc" | "status"
> & { icon?: LucideIcon };
export type NewCmsProduct = Pick<
  CmsProduct,
  "name" | "spec" | "tag" | "status"
> & { icon?: LucideIcon };

export function getCmsProjects(): readonly CmsProject[] {
  return cmsProjectStore;
}
export function addCmsProject(input: NewCmsProject): CmsProject {
  const created: CmsProject = {
    ...input,
    gallery: [],
    coverIndex: 0,
    sort: cmsProjectStore.length,
    archived: false,
  };
  cmsProjectStore.push(created);
  return created;
}
export function updateCmsProject(
  slug: string,
  patch: Partial<CmsProject>,
): void {
  const i = cmsProjectStore.findIndex((p) => p.slug === slug);
  const cur = cmsProjectStore[i];
  if (cur) cmsProjectStore[i] = { ...cur, ...patch };
}

export function getCmsServices(): readonly CmsService[] {
  return cmsServiceStore;
}
export function addCmsService(input: NewCmsService): CmsService {
  const { icon, ...rest } = input;
  const created: CmsService = {
    ...rest,
    icon: icon ?? CMS_DEFAULT_ICON,
    photos: [],
    coverIndex: 0,
    sort: cmsServiceStore.length,
    archived: false,
  };
  cmsServiceStore.push(created);
  return created;
}
export function updateCmsService(
  slug: string,
  patch: Partial<CmsService>,
): void {
  const i = cmsServiceStore.findIndex((s) => s.slug === slug);
  const cur = cmsServiceStore[i];
  if (cur) cmsServiceStore[i] = { ...cur, ...patch };
}

export function getCmsProducts(): readonly CmsProduct[] {
  return cmsProductStore;
}
export function addCmsProduct(input: NewCmsProduct): CmsProduct {
  const { icon, ...rest } = input;
  const created: CmsProduct = {
    ...rest,
    icon: icon ?? CMS_DEFAULT_ICON,
    photos: [],
    coverIndex: 0,
    sort: cmsProductStore.length,
    archived: false,
  };
  cmsProductStore.push(created);
  return created;
}
/** Products have no slug — `name` is the record key. */
export function updateCmsProduct(
  name: string,
  patch: Partial<CmsProduct>,
): void {
  const i = cmsProductStore.findIndex((p) => p.name === name);
  const cur = cmsProductStore[i];
  if (cur) cmsProductStore[i] = { ...cur, ...patch };
}

// ---- HR News & Careers CMS (reuses the B7–B9 pattern + WebStatus + audit) ---
// Same governance layered onto the public News/Careers types so HR can manage the
// public site's announcements + openings (≤10 photos each). CareerRole has no slug
// — the record gets a generated, deduped slug as its key (like services). Seeded
// from NEWS/CAREERS (status Published); edits persist in-session + append to the
// website audit; live write-back is PROPOSED (identical to B7–B9).
export type CmsNews = NewsArticle & {
  status: WebStatus;
  sort: number;
  photos?: readonly ProjectImage[];
  coverIndex?: number;
  archived?: boolean;
};
export type CmsCareer = CareerRole & {
  slug: string;
  status: WebStatus;
  sort: number;
  photos?: readonly ProjectImage[];
  coverIndex?: number;
  archived?: boolean;
};

function cmsSlug(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const cmsNewsStore: CmsNews[] = NEWS.map(
  (n, i): CmsNews => ({
    ...n,
    status: "Published",
    sort: i,
    photos: [],
    coverIndex: 0,
    archived: false,
  }),
);

const cmsCareerStore: CmsCareer[] = (() => {
  const seen = new Set<string>();
  return CAREERS.map((c, i): CmsCareer => {
    const base = cmsSlug(c.title) || `career-${i + 1}`;
    let slug = base;
    let n = 2;
    while (seen.has(slug)) slug = `${base}-${n++}`;
    seen.add(slug);
    return {
      ...c,
      slug,
      status: "Published",
      sort: i,
      photos: [],
      coverIndex: 0,
      archived: false,
    };
  });
})();

export type NewCmsNews = Pick<
  CmsNews,
  "slug" | "title" | "date" | "cat" | "excerpt" | "status"
>;
export type NewCmsCareer = Pick<
  CmsCareer,
  "slug" | "title" | "dept" | "loc" | "type" | "status"
>;

export function getCmsNews(): readonly CmsNews[] {
  return cmsNewsStore;
}
export function addCmsNews(input: NewCmsNews): CmsNews {
  const created: CmsNews = {
    ...input,
    photos: [],
    coverIndex: 0,
    sort: cmsNewsStore.length,
    archived: false,
  };
  cmsNewsStore.push(created);
  return created;
}
export function updateCmsNews(slug: string, patch: Partial<CmsNews>): void {
  const i = cmsNewsStore.findIndex((n) => n.slug === slug);
  const cur = cmsNewsStore[i];
  if (cur) cmsNewsStore[i] = { ...cur, ...patch };
}

export function getCmsCareers(): readonly CmsCareer[] {
  return cmsCareerStore;
}
export function addCmsCareer(input: NewCmsCareer): CmsCareer {
  const created: CmsCareer = {
    ...input,
    photos: [],
    coverIndex: 0,
    sort: cmsCareerStore.length,
    archived: false,
  };
  cmsCareerStore.push(created);
  return created;
}
export function updateCmsCareer(slug: string, patch: Partial<CmsCareer>): void {
  const i = cmsCareerStore.findIndex((c) => c.slug === slug);
  const cur = cmsCareerStore[i];
  if (cur) cmsCareerStore[i] = { ...cur, ...patch };
}

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
  "Website Service",
  "Website Product",
  "Inquiry",
] as const;

// ---- B11 · live audit channel (in-session) ---------------------------------
// Edits made this session append HERE — never into the frozen BDD_AUDIT seed,
// so history never double-counts. getBddHistory() merges the two newest-first.
const liveAudit: BddAuditEntry[] = [];

/** "YYYY-MM-DD HH:mm" stamp for a freshly-appended audit entry. */
export function bddNow(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Append a live audit entry (B2 edit-with-audit). */
export function appendBddAudit(entry: BddAuditEntry): void {
  liveAudit.push(entry);
}

/** Seed + live history for an SO#, newest-first (live edits on top of seed). */
export function getBddHistory(so: string): readonly BddAuditEntry[] {
  const seed = BDD_AUDIT.filter((a) => a.rec === so);
  const live = liveAudit.filter((a) => a.rec === so).reverse();
  return [...live, ...seed];
}

/** The whole BDD audit log — this-session live edits (newest-first) on top of the
 *  frozen seed — for the B11 register, so Website-CMS edits surface there (§9.6). */
export function getBddLog(): readonly BddAuditEntry[] {
  return [...[...liveAudit].reverse(), ...BDD_AUDIT];
}
