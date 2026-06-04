// ============================================================================
// JCE SYSTEM — Accounting module fixtures (Part 5). Ported from acc-data.jsx.
//
// The largest module: Payroll · Sales · Collections · Payable Voucher ·
// Disbursement · Journal · Reporting · Clients (A1–A19).
//
// • peso/pmoney are REUSED from lib/mock/format.ts (not redefined here).
// • SO# tokens + clients ALIGN to the canonical SALES_ORDERS in lib/mock/bdd.ts
//   (26-05-378 / 26-04-355 / 25-11-290) plus the WORKSHOP / MOTORPOOL / MAIN cost
//   centres — no parallel SO registry.
// • A4 CONSUMES the Verified H6 timekeeping batches exported by lib/mock/hr.ts —
//   they are the upstream payroll trigger (see getVerifiedTimekeeping).
// • Stateful screens get mutable stores (payroll stage, voucher status, JV post,
//   disbursement record, billings, collections) mirroring lib/mock/inquiries.ts.
//
// OQ#16 divergence: Accounting allows edit-after-Issue WITH AUDIT; BDD is strict
// no-edit on issued offers. The two messages stay distinct — do not unify.
// UI/UX mock only — no backend.
// ============================================================================

import { SALES_ORDERS, type Tone } from "@/lib/mock/bdd";
import { getBatches as getHrBatches } from "@/lib/mock/hr";

export const inWords =
  "***Thirteen Million Five Hundred Forty Thousand & 00/100 Pesos Only***";

// ---- Working projects (aligned to canonical SALES_ORDERS) ------------------
export type AccProject = { so: string; label: string };

export const ACC_PROJECTS: readonly AccProject[] = [
  ...SALES_ORDERS.map((o) => ({ so: o.so, label: o.name })),
  { so: "WORKSHOP", label: "Internal — Workshop" },
  { so: "MOTORPOOL", label: "Internal — Motorpool" },
  { so: "MAIN", label: "Main Office / Admin" },
];

export function soName(so: string): string {
  return ACC_PROJECTS.find((p) => p.so === so)?.label ?? so;
}

// ---- A2 · Chart of Accounts ------------------------------------------------
export type Normal = "Debit" | "Credit";
export type CoaAccount = {
  code: string;
  name: string;
  type: string;
  subtype: string;
  normal: Normal;
};
export type CoaBand = { band: string; rows: readonly CoaAccount[] };

function acct(
  code: string,
  name: string,
  type: string,
  subtype: string,
  normal: Normal,
): CoaAccount {
  return { code, name, type, subtype, normal };
}

export const COA: readonly CoaBand[] = [
  {
    band: "Assets · 10000s",
    rows: [
      acct("10001", "Cash in Bank — BDO 067-4", "Asset", "Cash", "Debit"),
      acct("10002", "Cash in Bank — BPI 852-5", "Asset", "Cash", "Debit"),
      acct(
        "10005",
        "Cash in Bank — Land Bank 580 (Workshop)",
        "Asset",
        "Cash",
        "Debit",
      ),
      acct("10010", "Petty Cash Fund", "Asset", "Cash", "Debit"),
      acct("10101", "Trade Receivable", "Asset", "Receivable", "Debit"),
      acct("10110", "Retention Receivable", "Asset", "Receivable", "Debit"),
      acct(
        "10112",
        "Local Retention Receivable",
        "Asset",
        "Receivable",
        "Debit",
      ),
      acct("10201", "Cash Advances", "Asset", "Receivable", "Debit"),
    ],
  },
  {
    band: "Liabilities · 20000s",
    rows: [
      acct("20001", "Trade Payable", "Liability", "Payable", "Credit"),
      acct("20004", "Voucher's Payable", "Liability", "Payable", "Credit"),
      acct("20020", "Output VAT", "Liability", "Tax", "Credit"),
      acct("20021", "Withholding Tax Payable", "Liability", "Tax", "Credit"),
      acct(
        "20030",
        "SSS / PhilHealth / Pag-IBIG Payable",
        "Liability",
        "Statutory",
        "Credit",
      ),
    ],
  },
  {
    band: "Equity · 30000s",
    rows: [
      acct("30001", "Owner's Capital", "Equity", "Capital", "Credit"),
      acct("30010", "Retained Earnings", "Equity", "Capital", "Credit"),
    ],
  },
  {
    band: "Revenue · 40000s",
    rows: [
      acct("40001", "Service Income", "Revenue", "Sales", "Credit"),
      acct("40002", "Sales — Goods", "Revenue", "Sales", "Credit"),
      acct("40010", "Zero-Rated Sales", "Revenue", "Sales", "Credit"),
    ],
  },
  {
    band: "Cost / Expenses · 50000s",
    rows: [
      acct("50001", "Cost of Services", "Expense", "COS", "Debit"),
      acct("50032", "Meals Expense", "Expense", "Opex", "Debit"),
      acct("50040", "Project Overhead", "Expense", "Opex", "Debit"),
      acct("50045", "Accommodation Expense", "Expense", "Opex", "Debit"),
      acct("50055", "Depreciation Expense", "Expense", "Opex", "Debit"),
    ],
  },
];

// ---- A4/A5 · Payroll -------------------------------------------------------
export const PAY_STAGES = [
  "Draft",
  "Prepared",
  "Checked",
  "Verified",
  "Approved",
  "Paid",
] as const;
export type PayStage = (typeof PAY_STAGES)[number];

export const PAY_STATUS_TONE: Record<string, Tone> = {
  Draft: "neutral",
  Prepared: "info",
  Checked: "info",
  Verified: "pending",
  Approved: "success",
  Paid: "success",
};

export type PayBatch = {
  id: string;
  freq: "Daily" | "Weekly" | "Monthly";
  period: string;
  cutoff: string;
  scope: string;
  section?: string;
  so?: string;
  status: PayStage;
  workers: number;
  gross: number;
  ded: number;
  net: number;
};

const payBatchStore: PayBatch[] = [
  {
    id: "PB-2026-0512",
    freq: "Daily",
    period: "2026-05-21 — 2026-06-05",
    cutoff: "21–05",
    scope: "Consolidated",
    section: "All",
    status: "Approved",
    workers: 42,
    gross: 712450,
    ded: 188320,
    net: 524130,
  },
  {
    id: "PB-2026-0511",
    freq: "Monthly",
    period: "2026-05-23 — 2026-06-07",
    cutoff: "23–07",
    scope: "Per-Project",
    so: "26-05-378",
    status: "Verified",
    workers: 18,
    gross: 1284000,
    ded: 341200,
    net: 942800,
  },
  {
    id: "PB-2026-0510",
    freq: "Weekly",
    period: "2026-05-25 — 2026-05-31",
    cutoff: "Week 4",
    scope: "Consolidated",
    status: "Checked",
    workers: 24,
    gross: 198600,
    ded: 42100,
    net: 156500,
  },
  {
    id: "PB-2026-0509",
    freq: "Daily",
    period: "2026-05-06 — 2026-05-20",
    cutoff: "06–20",
    scope: "Consolidated",
    status: "Paid",
    workers: 41,
    gross: 698200,
    ded: 181400,
    net: 516800,
  },
];

export function getBatches(): readonly PayBatch[] {
  return [...payBatchStore];
}
export function getBatch(id: string): PayBatch | undefined {
  return payBatchStore.find((b) => b.id === id);
}
export function setBatchStage(id: string, stage: PayStage): void {
  const i = payBatchStore.findIndex((b) => b.id === id);
  const cur = payBatchStore[i];
  if (cur) payBatchStore[i] = { ...cur, status: stage };
}

export type PayDaily = {
  date: string;
  proj: string;
  dayType: string;
  reg: number;
  ot: number;
  nd: number;
  rate: number;
  mult: string;
  basicAmt: number;
  otAmt: number;
  ndAmt: number;
};
export type PayCharge = { proj: string; hrs: number; amt: number };
export type PayLine = {
  ln: number;
  name: string;
  rate: number;
  basic: number;
  ot: number;
  hol: number;
  nd: number;
  allow: number;
  gross: number;
  abs: number;
  late: number;
  sss: number;
  ph: number;
  pi: number;
  wtax: number;
  sssLoan: number;
  piLoan: number;
  coLoan: number;
  ca: number;
  net: number;
  skip?: string;
  daily: readonly PayDaily[];
  charge: readonly PayCharge[];
};

function daily(
  date: string,
  proj: string,
  dayType: string,
  reg: number,
  ot: number,
  nd: number,
  rate: number,
  mult: string,
  basicAmt: number,
  otAmt: number,
  ndAmt: number,
): PayDaily {
  return {
    date,
    proj,
    dayType,
    reg,
    ot,
    nd,
    rate,
    mult,
    basicAmt,
    otAmt,
    ndAmt,
  };
}

// A5 — summary lines for one batch (PB-2026-0512). Names trace to HR employees.
export const PAY_LINES: readonly PayLine[] = [
  {
    ln: 1,
    name: "Noel V. Bautista",
    rate: 720,
    basic: 11520,
    ot: 1350,
    hol: 0,
    nd: 504,
    allow: 1600,
    gross: 14974,
    abs: 0,
    late: 0,
    sss: 540,
    ph: 300,
    pi: 200,
    wtax: 0,
    sssLoan: 450,
    piLoan: 0,
    coLoan: 0,
    ca: 500,
    net: 12484,
    daily: [
      daily(
        "05-26",
        "26-05-378",
        "Regular Day",
        8,
        1,
        0,
        720,
        "100/125",
        720,
        90,
        0,
      ),
      daily(
        "05-27",
        "26-05-378",
        "Regular Day",
        4,
        1.5,
        0,
        720,
        "100/125",
        360,
        135,
        0,
      ),
      daily(
        "05-27",
        "WORKSHOP",
        "Regular Day",
        4,
        1.5,
        0,
        720,
        "100",
        360,
        135,
        0,
      ),
      daily(
        "05-28",
        "26-05-378",
        "Regular Day",
        8,
        0,
        7,
        720,
        "100/110",
        720,
        0,
        55,
      ),
    ],
    charge: [
      { proj: "26-05-378", hrs: 20, amt: 11520 },
      { proj: "WORKSHOP", hrs: 4, amt: 360 },
    ],
  },
  {
    ln: 2,
    name: "Allan G. Tolentino",
    rate: 720,
    basic: 11520,
    ot: 900,
    hol: 1872,
    nd: 0,
    allow: 1600,
    gross: 15892,
    abs: 0,
    late: 0,
    sss: 540,
    ph: 300,
    pi: 200,
    wtax: 0,
    sssLoan: 0,
    piLoan: 300,
    coLoan: 0,
    ca: 0,
    net: 14552,
    skip: "SSS Loan skipped: insufficient net pay",
    daily: [
      daily(
        "05-26",
        "25-11-290",
        "Regular Day",
        8,
        1,
        0,
        720,
        "100/125",
        720,
        90,
        0,
      ),
    ],
    charge: [{ proj: "25-11-290", hrs: 24, amt: 17280 }],
  },
  {
    ln: 3,
    name: "Roberto S. Villanueva",
    rate: 680,
    basic: 9520,
    ot: 0,
    hol: 0,
    nd: 0,
    allow: 0,
    gross: 9520,
    abs: 1,
    late: 0,
    sss: 430,
    ph: 250,
    pi: 200,
    wtax: 0,
    sssLoan: 0,
    piLoan: 0,
    coLoan: 600,
    ca: 0,
    net: 8040,
    daily: [
      daily("05-26", "WORKSHOP", "Regular Day", 8, 0, 0, 680, "100", 680, 0, 0),
    ],
    charge: [{ proj: "WORKSHOP", hrs: 14, amt: 9520 }],
  },
  {
    ln: 4,
    name: "Marvin C. Pascual",
    rate: 700,
    basic: 11200,
    ot: 0,
    hol: 0,
    nd: 0,
    allow: 0,
    gross: 11200,
    abs: 0,
    late: 1,
    sss: 500,
    ph: 300,
    pi: 200,
    wtax: 0,
    sssLoan: 0,
    piLoan: 0,
    coLoan: 0,
    ca: 0,
    net: 9900,
    daily: [
      daily(
        "05-26",
        "MOTORPOOL",
        "Regular Day",
        8,
        0,
        0,
        700,
        "100",
        700,
        0,
        0,
      ),
    ],
    charge: [{ proj: "MOTORPOOL", hrs: 16, amt: 11200 }],
  },
];

export function lineDeductions(l: PayLine): number {
  return l.sss + l.ph + l.pi + l.wtax + l.sssLoan + l.piLoan + l.coLoan + l.ca;
}

// ---- A3 · Loans ------------------------------------------------------------
export type Loan = {
  emp: string;
  type: string;
  subtype: string;
  ref: string;
  principal: number;
  amort: number | null;
  balance: number;
  status: "Active" | "Fully Paid";
};

export const LOANS: readonly Loan[] = [
  {
    emp: "N. Bautista",
    type: "Government Loan",
    subtype: "SSS Salary",
    ref: "SSS-2025-114",
    principal: 18000,
    amort: 450,
    balance: 3600,
    status: "Active",
  },
  {
    emp: "A. Tolentino",
    type: "Government Loan",
    subtype: "Pag-IBIG Calamity",
    ref: "PI-2026-021",
    principal: 12000,
    amort: 300,
    balance: 9900,
    status: "Active",
  },
  {
    emp: "R. Villanueva",
    type: "Company Loan",
    subtype: "—",
    ref: "CO-2026-008",
    principal: 8000,
    amort: 600,
    balance: 2000,
    status: "Active",
  },
  {
    emp: "C. Mendoza",
    type: "Cash Advance",
    subtype: "—",
    ref: "CA-26-0033",
    principal: 95000,
    amort: null,
    balance: 0,
    status: "Fully Paid",
  },
];

export const LOAN_STATUS_TONE: Record<string, Tone> = {
  Active: "info",
  "Fully Paid": "success",
};

// ---- A1 · Settings sections ------------------------------------------------
export type SettingSection = { n: string; title: string; desc: string };
export const SETTINGS_SECTIONS: readonly SettingSection[] = [
  {
    n: "1",
    title: "Pay Rate Multipliers",
    desc: "Ordinary→Double holiday × Regular/Night/OT % matrix (100/110/125 … 390/429/507)",
  },
  {
    n: "2",
    title: "Government Mandatory Contributions",
    desc: "SSS 15% · PhilHealth 5% · Pag-IBIG 1/2% — versioned w/ source circular",
  },
  {
    n: "3",
    title: "Withholding Tax (TRAIN)",
    desc: "Graduated monthly (₱20,832 exempt … 35% over ₱666,667)",
  },
  {
    n: "4",
    title: "Tardiness / Lates Policy",
    desc: "Clock-in windows → deductions",
  },
  {
    n: "5",
    title: "Deduction Calendar",
    desc: "Semi-monthly 15th/30th · weekly W1–W4",
  },
  {
    n: "6",
    title: "Cut-Off Periods",
    desc: "Daily 21–05/06–20 · Monthly 23–07/08–22",
  },
  {
    n: "7",
    title: "Statutory Leave Benefits",
    desc: "SIL 5 · Maternity 105/120/60 · Paternity 7",
  },
  {
    n: "9",
    title: "Financial Statement Mapping",
    desc: "BS Roman-numeral + IS Sched → CoA codes, effectivity-versioned",
  },
];

// ---- A7 · Billings (SI + SOA) ----------------------------------------------
export type BillingType = "SI" | "SOA";
export type BillingStatus =
  | "Issued"
  | "Partially Paid"
  | "Paid"
  | "Cancelled"
  | "Credited";
export type Billing = {
  date: string;
  type: BillingType;
  no: string;
  or: string;
  client: string;
  so: string;
  tin: string;
  particulars: string;
  debit: number;
  credit: number;
  vat: number;
  status: BillingStatus;
  bal: number;
};

export const BILL_TONE: Record<string, Tone> = {
  Issued: "info",
  "Partially Paid": "pending",
  Paid: "success",
  Cancelled: "neutral",
  Credited: "neutral",
};

const billingStore: Billing[] = [
  {
    date: "2026-05-28",
    type: "SI",
    no: "SI-004512",
    or: "CR-0902",
    client: "NORECO II",
    so: "26-05-378",
    tin: "000-111-222-000",
    particulars: "8th progress billing",
    debit: 2410000,
    credit: 2410000,
    vat: 258214,
    status: "Issued",
    bal: 2410000,
  },
  {
    date: "2026-05-20",
    type: "SOA",
    no: "SOA-2026-088",
    or: "—",
    client: "Meralco",
    so: "26-04-355",
    tin: "000-333-444-000",
    particulars: "Progress billing — Net of retention",
    debit: 1880000,
    credit: 0,
    vat: 0,
    status: "Partially Paid",
    bal: 880000,
  },
  {
    date: "2026-05-12",
    type: "SI",
    no: "SI-004498",
    or: "CR-0888",
    client: "NGCP",
    so: "25-09-201",
    tin: "000-555-666-000",
    particulars: "Mobilization",
    debit: 13540000,
    credit: 13540000,
    vat: 1450714,
    status: "Paid",
    bal: 0,
  },
  {
    date: "2026-04-19",
    type: "SOA",
    no: "SOA-2026-071",
    or: "—",
    client: "SMC Global",
    so: "25-11-290",
    tin: "000-777-888-000",
    particulars: "DP recoupment",
    debit: 0,
    credit: 0,
    vat: 0,
    status: "Cancelled",
    bal: 0,
  },
];

export function getBillings(): readonly Billing[] {
  return [...billingStore];
}
export function getBilling(no: string): Billing | undefined {
  return billingStore.find((b) => b.no === no);
}
export function addBilling(b: Billing): void {
  billingStore.unshift(b);
}
/** Apply a collection against a billing — reduces balance, flips status. */
export function applyCollection(no: string, amount: number): void {
  const i = billingStore.findIndex((b) => b.no === no);
  const cur = billingStore[i];
  if (!cur) return;
  const bal = Math.max(0, cur.bal - amount);
  billingStore[i] = {
    ...cur,
    bal,
    status: bal === 0 ? "Paid" : "Partially Paid",
  };
}

// ---- A10 · Collections (CR + AR) -------------------------------------------
export type CollectionType = "CR" | "AR";
export type Collection = {
  date: string;
  type: CollectionType;
  no: string;
  client: string;
  tin: string;
  so: string;
  ref: string;
  particulars: string;
  tr: number;
  cwt: number;
  banks: number;
  status: string;
};

const collectionStore: Collection[] = [
  {
    date: "2026-05-28",
    type: "CR",
    no: "CR-0902",
    client: "NORECO II",
    tin: "000-111-222-000",
    so: "26-05-378",
    ref: "SI-004512",
    particulars: "Full payment 8th billing",
    tr: 2410000,
    cwt: 48200,
    banks: 2361800,
    status: "Issued",
  },
  {
    date: "2026-05-22",
    type: "AR",
    no: "AR-2026-044",
    client: "Meralco",
    tin: "000-333-444-000",
    so: "26-04-355",
    ref: "SOA-2026-088",
    particulars: "Partial",
    tr: 1000000,
    cwt: 20000,
    banks: 980000,
    status: "Issued",
  },
  {
    date: "2026-05-12",
    type: "CR",
    no: "CR-0888",
    client: "NGCP",
    tin: "000-555-666-000",
    so: "25-09-201",
    ref: "SI-004498",
    particulars: "Mobilization",
    tr: 13540000,
    cwt: 270800,
    banks: 13269200,
    status: "Issued",
  },
];

export function getCollections(): readonly Collection[] {
  return [...collectionStore];
}
export function addCollection(c: Collection): void {
  collectionStore.unshift(c);
}

/** CWT is a flat 2% creditable withholding; Banks(Net) = gross − CWT. */
export const CWT_RATE = 0.02;
export function cwtOf(gross: number): number {
  return gross * CWT_RATE;
}

// ---- A13 · Payable Vouchers ------------------------------------------------
export type VoucherStatus =
  | "Draft"
  | "Pending VP-Finance"
  | "Pending President"
  | "Approved"
  | "Paid"
  | "Voided";
export const CV_STAGES = [
  "Draft",
  "Pending VP-Finance",
  "Pending President",
  "Approved",
  "Paid",
] as const;

export const CV_TONE: Record<string, Tone> = {
  Draft: "neutral",
  "Pending VP-Finance": "pending",
  "Pending President": "pending",
  Approved: "info",
  Paid: "success",
  Voided: "danger",
};

export type Voucher = {
  cv: string;
  date: string;
  ptype: string;
  payee: string;
  so: string;
  rfp: string;
  po: string;
  inv: string;
  gross: number;
  wtax: number;
  net: number;
  status: VoucherStatus;
};

const voucherStore: Voucher[] = [
  {
    cv: "CV-1635",
    date: "2026-05-30",
    ptype: "Supplier",
    payee: "Shenda Electric Co.",
    so: "26-05-378",
    rfp: "RFP-PUR-26020188",
    po: "PO-IMP-26-0188",
    inv: "SH-99821",
    gross: 4200000,
    wtax: 42000,
    net: 4158000,
    status: "Pending President",
  },
  {
    cv: "CV-1634",
    date: "2026-05-29",
    ptype: "Supplier",
    payee: "Cebu Steel Corp.",
    so: "WORKSHOP",
    rfp: "RFP-PUR-26020177",
    po: "PO-LOC-26-0204",
    inv: "CS-2231",
    gross: 318450,
    wtax: 6369,
    net: 312081,
    status: "Approved",
  },
  {
    cv: "CV-1633",
    date: "2026-05-28",
    ptype: "Employee",
    payee: "Carlos M. Mendoza",
    so: "26-05-378",
    rfp: "—",
    po: "—",
    inv: "—",
    gross: 95000,
    wtax: 0,
    net: 95000,
    status: "Paid",
  },
  {
    cv: "CV-1632",
    date: "2026-05-26",
    ptype: "Other",
    payee: "Meralco (utilities)",
    so: "MAIN",
    rfp: "—",
    po: "—",
    inv: "ML-5567",
    gross: 48200,
    wtax: 0,
    net: 48200,
    status: "Draft",
  },
];

export function getVouchers(): readonly Voucher[] {
  return [...voucherStore];
}
export function getVoucher(cv: string): Voucher | undefined {
  return voucherStore.find((v) => v.cv === cv);
}
export function setVoucherStatus(cv: string, status: VoucherStatus): void {
  const i = voucherStore.findIndex((v) => v.cv === cv);
  const cur = voucherStore[i];
  if (cur) voucherStore[i] = { ...cur, status };
}

// ---- A15 · Disbursement ----------------------------------------------------
export type Disbursement = {
  date: string;
  cv: string;
  payee: string;
  desc: string;
  checkDate: string;
  checkNo: string;
  bank: string;
  amount: number;
  reversed?: boolean;
};

const disburseStore: Disbursement[] = [
  {
    date: "2026-05-30",
    cv: "CV-1634",
    payee: "Cebu Steel Corp.",
    desc: "Steel — Workshop",
    checkDate: "2026-05-31",
    checkNo: "0098221",
    bank: "067-4",
    amount: 312081,
  },
  {
    date: "2026-05-28",
    cv: "CV-1633",
    payee: "Carlos M. Mendoza",
    desc: "CA — site mobilization",
    checkDate: "2026-05-28",
    checkNo: "0098220",
    bank: "852-5",
    amount: 95000,
  },
  {
    date: "2026-05-12",
    cv: "CV-1620",
    payee: "NGCP refund",
    desc: "Over-collection",
    checkDate: "2026-05-12",
    checkNo: "0098201",
    bank: "067-4",
    amount: 17000,
  },
];

export function getDisbursements(): readonly Disbursement[] {
  return [...disburseStore];
}
export function addDisbursement(d: Disbursement): void {
  disburseStore.unshift(d);
}

// ---- A16 · Journal Vouchers ------------------------------------------------
export type JvStatus = "Draft" | "Pending Check" | "Posted" | "Reversed";
export const JV_TONE: Record<string, Tone> = {
  Draft: "neutral",
  "Pending Check": "pending",
  Posted: "success",
  Reversed: "danger",
};

export type Jv = {
  jv: string;
  date: string;
  cat: string;
  so: string;
  payee: string;
  desc: string;
  total: number;
  status: JvStatus;
};

const jvStore: Jv[] = [
  {
    jv: "JV-2026-0188",
    date: "2026-05-30",
    cat: "Cash Advance Liquidation",
    so: "26-05-378",
    payee: "C. Mendoza",
    desc: "Liquidation of CV-1633 site mobilization",
    total: 95000,
    status: "Posted",
  },
  {
    jv: "JV-2026-0187",
    date: "2026-05-29",
    cat: "VAT Settlement",
    so: "—",
    payee: "—",
    desc: "Output less Input VAT — May",
    total: 1192500,
    status: "Pending Check",
  },
  {
    jv: "JV-2026-0186",
    date: "2026-05-25",
    cat: "Reclassification",
    so: "WORKSHOP",
    payee: "—",
    desc: "Reclass overhead to COS",
    total: 42000,
    status: "Draft",
  },
];

export function getJvs(): readonly Jv[] {
  return [...jvStore];
}
export function getJv(jv: string): Jv | undefined {
  return jvStore.find((j) => j.jv === jv);
}
export function postJv(jv: string): void {
  const i = jvStore.findIndex((j) => j.jv === jv);
  const cur = jvStore[i];
  if (cur) jvStore[i] = { ...cur, status: "Posted" };
}

export type JvLine = {
  ref: string;
  acct: string;
  desc: string;
  dr: number;
  cr: number;
};
export const JV_LINES: readonly JvLine[] = [
  {
    ref: "CV-1633",
    acct: "50001 Cost of Services",
    desc: "Mobilization expenses",
    dr: 72000,
    cr: 0,
  },
  {
    ref: "CV-1633",
    acct: "50032 Meals Expense",
    desc: "Crew meals",
    dr: 18000,
    cr: 0,
  },
  {
    ref: "",
    acct: "50045 Accommodation Expense",
    desc: "Lodging",
    dr: 5000,
    cr: 0,
  },
  {
    ref: "",
    acct: "10201 Cash Advances",
    desc: "Clear advance CA-26-0033",
    dr: 0,
    cr: 95000,
  },
];

// ---- A17 · Cash Advances ---------------------------------------------------
export type AgeBucket = "0–30" | "31–60" | "61–90" | "90+";
export type CashAdvance = {
  ca: string;
  to: string;
  so: string;
  amount: number;
  cv: string;
  status: "Liquidated" | "Outstanding";
  jv: string;
  bal: number;
  age: AgeBucket;
};

export const CA_STATUS_TONE: Record<string, Tone> = {
  Liquidated: "success",
  Outstanding: "pending",
};

export const CASH_ADV: readonly CashAdvance[] = [
  {
    ca: "CA-26-0033",
    to: "C. Mendoza",
    so: "26-05-378",
    amount: 95000,
    cv: "CV-1633",
    status: "Liquidated",
    jv: "JV-2026-0188",
    bal: 0,
    age: "0–30",
  },
  {
    ca: "CA-26-0031",
    to: "P. Garcia",
    so: "26-05-378",
    amount: 40000,
    cv: "CV-1628",
    status: "Outstanding",
    jv: "—",
    bal: 40000,
    age: "31–60",
  },
  {
    ca: "CA-26-0024",
    to: "N. Aquino",
    so: "WORKSHOP",
    amount: 25000,
    cv: "CV-1605",
    status: "Outstanding",
    jv: "—",
    bal: 25000,
    age: "90+",
  },
];

export const AGE_BUCKETS: readonly AgeBucket[] = [
  "0–30",
  "31–60",
  "61–90",
  "90+",
];

export function caAgingBuckets(): Record<AgeBucket, number> {
  const buckets: Record<AgeBucket, number> = {
    "0–30": 0,
    "31–60": 0,
    "61–90": 0,
    "90+": 0,
  };
  CASH_ADV.forEach((c) => {
    if (c.bal > 0) buckets[c.age] += c.bal;
  });
  return buckets;
}

// ---- A19 · Clients ---------------------------------------------------------
export type Client = { name: string; addr: string; tin: string; ar: number };
export const CLIENTS: readonly Client[] = [
  {
    name: "NORECO II",
    addr: "Dumaguete City, Negros Oriental",
    tin: "000-111-222-000",
    ar: 2410000,
  },
  {
    name: "Meralco",
    addr: "Ortigas, Pasig City",
    tin: "000-333-444-000",
    ar: 880000,
  },
  { name: "NGCP", addr: "Quezon City", tin: "000-555-666-000", ar: 0 },
  {
    name: "SMC Global Power",
    addr: "Mandaluyong City",
    tin: "000-777-888-000",
    ar: 0,
  },
];

export function findClient(name: string): Client | undefined {
  return CLIENTS.find((c) => c.name === name);
}

// ---- A18 · Report catalog --------------------------------------------------
export type ReportItem = { name: string; desc: string; tag: string };
export const REPORTS: Record<string, readonly ReportItem[]> = {
  "A · Core financial": [
    {
      name: "Trial Balance",
      desc: "Every CoA account · beginning + activity + cumulative",
      tag: "Landscape Long bond",
    },
    {
      name: "Balance Sheet",
      desc: "Roman-numeral lines I–XXXV · tinted section bands",
      tag: "Comparative",
    },
    {
      name: "Income Statement",
      desc: "BIR-1702 · Sched I–XLI",
      tag: "Comparative",
    },
    {
      name: "Cash Flow",
      desc: "Indirect · Operating / Investing / Financing",
      tag: "—",
    },
  ],
  "B · Statutory": [
    {
      name: "BIR 1601-C",
      desc: "Monthly withholding — compensation",
      tag: "Agency layout",
    },
    { name: "BIR 2550M/Q", desc: "VAT return", tag: "Wizard" },
    { name: "BIR 1702", desc: "Annual income tax", tag: "Wizard" },
    {
      name: "Alphalist 1604-CF/E",
      desc: "Year-end alphalists",
      tag: "Masked TIN",
    },
    {
      name: "SSS R-3/R-5 · PhilHealth ER2 · Pag-IBIG MCRF",
      desc: "Statutory remittance",
      tag: "Agency layout",
    },
  ],
  "C · Operational": [
    { name: "AR Aging", desc: "0–30 / 31–60 / 61–90 / 90+", tag: "Buckets" },
    { name: "AP Aging", desc: "Payables by age", tag: "Buckets" },
    { name: "Cash Position", desc: "Per bank + 30-day trend", tag: "Chart" },
    {
      name: "Project Costing summary",
      desc: "Per SO# cost roll-up",
      tag: "Drill",
    },
    { name: "Collections register", desc: "Period collections", tag: "Legacy" },
  ],
  "D · Custom": [
    {
      name: "GL drill-down",
      desc: "Account → entries → source doc",
      tag: "Interactive",
    },
    {
      name: "Profitability by client",
      desc: "Margin per client",
      tag: "Chart",
    },
    { name: "Cash-flow projection", desc: "30 / 60 / 90 day", tag: "Forecast" },
  ],
};

export type TbRow = { code: string; name: string; dr: number; cr: number };
export const TB_ROWS: readonly TbRow[] = [
  { code: "10001", name: "Cash in Bank — BDO 067-4", dr: 2840000, cr: 0 },
  { code: "10101", name: "Trade Receivable", dr: 3290000, cr: 0 },
  { code: "10110", name: "Retention Receivable", dr: 677000, cr: 0 },
  { code: "10201", name: "Cash Advances", dr: 65000, cr: 0 },
  { code: "20004", name: "Voucher's Payable", dr: 0, cr: 4470081 },
  { code: "20020", name: "Output VAT", dr: 0, cr: 1450714 },
  { code: "30001", name: "Owner's Capital", dr: 0, cr: 5000000 },
  { code: "40001", name: "Service Income", dr: 0, cr: 13540000 },
  { code: "50001", name: "Cost of Services", dr: 9820000, cr: 0 },
  { code: "50032", name: "Meals Expense", dr: 184000, cr: 0 },
];

// ---- A4 ⇄ Part 4 (HR) handoff ----------------------------------------------
// A4 surfaces the Verified H6 timekeeping batches as available payroll sources —
// the HR verification state is the upstream trigger (no parallel batch registry).
export type TimekeepingSource = {
  no: string;
  emp: string;
  period: string;
  range: string;
  rows: number;
};

/** Verified H6 timekeeping batches (from lib/mock/hr) available to prepare into
 * payroll. Empty until HR verifies a batch — drives the A4 "available source"
 * panel and its empty-state. */
export function getVerifiedTimekeeping(): readonly TimekeepingSource[] {
  return getHrBatches()
    .filter((b) => b.status === "Verified")
    .map((b) => ({
      no: b.no,
      emp: b.emp,
      period: b.period,
      range: b.range,
      rows: b.rows,
    }));
}
