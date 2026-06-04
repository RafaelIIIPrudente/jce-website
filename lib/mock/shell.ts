// ============================================================================
// JCE SYSTEM — cross-cutting shell fixtures (X1–X6).
// Ported from screens-core.jsx (NOTIFS, HOME map, KPI tones) + screens-admin.jsx
// (USERS, ALL_ROLE_NAMES, SETTINGS_NAV/DATA). Typed as-const, mirroring lib/content/.
// ============================================================================

import { ROLES, type RoleId } from "@/lib/rbac";

export type NotifTone = "pending" | "info" | "danger" | "neutral" | "success";

export type Notification = {
  id: number;
  /** originating module label */
  mod: string;
  /** event category */
  type: string;
  tone: NotifTone;
  unread: boolean;
  msg: string;
  /** human relative time string (mock) */
  time: string;
  /** referenced document number, if any */
  doc: string | null;
};

export const NOTIFICATIONS: readonly Notification[] = [
  {
    id: 1,
    mod: "Purchasing",
    type: "Approval",
    tone: "pending",
    unread: true,
    msg: "PO-IMP-26-0188 pending approval > 2 days",
    time: "10 min ago",
    doc: "PO-IMP-26-0188",
  },
  {
    id: 2,
    mod: "Warehouse",
    type: "Lock",
    tone: "info",
    unread: true,
    msg: "MRR-2026-0144 awaiting checking & lock",
    time: "42 min ago",
    doc: "MRR-2026-0144",
  },
  {
    id: 3,
    mod: "HR",
    type: "Contract",
    tone: "danger",
    unread: true,
    msg: "Contract expiring < 6 months — R. dela Cruz",
    time: "1 hr ago",
    doc: null,
  },
  {
    id: 4,
    mod: "PMG",
    type: "Period",
    tone: "pending",
    unread: false,
    msg: "Accomplishment period #4 submitted for 26-05-378",
    time: "3 hr ago",
    doc: "26-05-378",
  },
  {
    id: 5,
    mod: "BDD",
    type: "Sensitive",
    tone: "danger",
    unread: false,
    msg: "Contract Amount edited on OFR-2026-021",
    time: "5 hr ago",
    doc: "OFR-2026-021",
  },
  {
    id: 6,
    mod: "Accounting",
    type: "Approval",
    tone: "pending",
    unread: false,
    msg: "3 vouchers awaiting your approval",
    time: "Yesterday",
    doc: null,
  },
  {
    id: 7,
    mod: "Purchasing",
    type: "Shipment",
    tone: "info",
    unread: false,
    msg: "Shipment ETA approaching (7-day lead) — PO-IMP-26-0177",
    time: "Yesterday",
    doc: "PO-IMP-26-0177",
  },
  {
    id: 8,
    mod: "Warehouse",
    type: "Transfer",
    tone: "neutral",
    unread: false,
    msg: "Stock transfer TRF-2026-0033 unconfirmed",
    time: "2 days ago",
    doc: "TRF-2026-0033",
  },
] as const;

// ============================================================================
// X3 · Role-aware home (screens-core.jsx:90-206). Keyed by RoleId; the dashboard
// re-keys the entire surface when the prototype role switcher changes role.
// KPI tones map to jce/kpi-tile's KpiTone (screens-core.jsx:209).
// ============================================================================

export type KpiTone = "pending" | "success" | "danger" | "info" | "neutral";

export type HomeKpi = { k: string; v: string; d: string; tone: KpiTone };
export type HomeApproval = {
  doc: string;
  t: string;
  /** null = no money on this row (e.g. an HR/leave request) */
  amt: number | null;
  age: string;
  mod: string;
};
export type HomeConfig = {
  hi: string;
  /** Employee → "all caught up" minimal state */
  empty?: boolean;
  /** Site Engineer → "Scoped to assigned sites" pill */
  scoped?: boolean;
  kpis: readonly HomeKpi[];
  approvals: readonly HomeApproval[];
};

export const HOME: Record<RoleId, HomeConfig> = {
  owner: {
    hi: "Good morning",
    kpis: [
      {
        k: "Approvals waiting on you",
        v: "8",
        d: "across 4 modules",
        tone: "pending",
      },
      { k: "Collections this week", v: "₱2.41M", d: "▲ 18%", tone: "success" },
      { k: "Projects needing update", v: "3", d: "period due", tone: "info" },
      { k: "Documents awaiting lock", v: "5", d: "Warehouse", tone: "neutral" },
    ],
    approvals: [
      {
        doc: "RFP-PUR-26020188",
        t: "Shenda Electric — transformer lot",
        amt: 4200000,
        age: "2d",
        mod: "Purchasing",
      },
      {
        doc: "PV-2026-0442",
        t: "Payable voucher — fuel & lubricants",
        amt: 318450,
        age: "1d",
        mod: "Accounting",
      },
      {
        doc: "VO-26-05-378-02",
        t: "Variation order — Bulacan substation",
        amt: 1240000,
        age: "4h",
        mod: "PMG",
      },
    ],
  },
  admin: {
    hi: "Good morning",
    kpis: [
      { k: "Active users", v: "118", d: "of 124 staff", tone: "success" },
      { k: "Locked accounts", v: "2", d: "review", tone: "danger" },
      { k: "Pending invites", v: "3", d: "not yet logged in", tone: "pending" },
      { k: "Role changes (mo)", v: "5", d: "audited", tone: "neutral" },
    ],
    approvals: [],
  },
  employee: {
    hi: "Hi",
    empty: true,
    kpis: [
      { k: "My pending requests", v: "0", d: "all clear", tone: "success" },
      { k: "Last payslip", v: "May 30", d: "available", tone: "neutral" },
    ],
    approvals: [],
  },
  hrhead: {
    hi: "Good morning",
    kpis: [
      {
        k: "Pending HR requests",
        v: "6",
        d: "OB · OT · Leave",
        tone: "pending",
      },
      { k: "Contracts expiring", v: "2", d: "< 6 months", tone: "danger" },
      { k: "Batches to oversee", v: "4", d: "this pay period", tone: "info" },
      { k: "New hires (mo)", v: "3", d: "probationary", tone: "neutral" },
    ],
    approvals: [
      {
        doc: "OB-2026-014",
        t: "Site visit — Cavite line · 5 employees",
        amt: null,
        age: "3h",
        mod: "HR · OB/Travel",
      },
      {
        doc: "RFL-26-051",
        t: "Vacation leave — R. dela Cruz",
        amt: null,
        age: "1d",
        mod: "HR · Leave",
      },
      {
        doc: "OT-2026-022",
        t: "Overtime — shop fabrication · 8 staff",
        amt: null,
        age: "2d",
        mod: "HR · Overtime",
      },
    ],
  },
  timekeeper: {
    hi: "Good morning",
    kpis: [
      { k: "Batches to verify", v: "4", d: "this period", tone: "pending" },
      { k: "Open week entries", v: "11", d: "in progress", tone: "info" },
      {
        k: "Leave rows auto-added",
        v: "6",
        d: "from RFL/LOA",
        tone: "neutral",
      },
    ],
    approvals: [],
  },
  acctglead: {
    hi: "Good morning",
    kpis: [
      { k: "Vouchers pending approval", v: "9", d: "PV + JV", tone: "pending" },
      { k: "Collections this week", v: "₱2.41M", d: "▲ 18%", tone: "success" },
      { k: "Disbursements to post", v: "4", d: "bank recon", tone: "info" },
      { k: "RFPs due", v: "3", d: "≤ 5 days", tone: "danger" },
    ],
    approvals: [
      {
        doc: "PV-2026-0442",
        t: "Payable voucher — fuel & lubricants",
        amt: 318450,
        age: "1d",
        mod: "Accounting",
      },
      {
        doc: "JV-2026-0188",
        t: "CA liquidation — site mobilization",
        amt: 95000,
        age: "5h",
        mod: "Accounting",
      },
      {
        doc: "CV-0903",
        t: "Retention release — Meralco",
        amt: 677000,
        age: "1d",
        mod: "Accounting",
      },
    ],
  },
  payroll: {
    hi: "Good morning",
    kpis: [
      {
        k: "Verified batches ready",
        v: "12",
        d: "for payroll run",
        tone: "success",
      },
      { k: "Loans active", v: "34", d: "this cut-off", tone: "neutral" },
      { k: "Payslips to release", v: "124", d: "30th cut-off", tone: "info" },
      { k: "Cut-off ends", v: "Jun 7", d: "monthly 23–07", tone: "pending" },
    ],
    approvals: [],
  },
  pmhead: {
    hi: "Good morning",
    kpis: [
      {
        k: "Projects needing a period update",
        v: "3",
        d: "accomplishment due",
        tone: "pending",
      },
      { k: "Variation orders to approve", v: "2", d: "awaiting", tone: "info" },
      { k: "To-Date near 100%", v: "1", d: "guardrail", tone: "danger" },
      { k: "MRs to verify", v: "5", d: "material requests", tone: "neutral" },
    ],
    approvals: [
      {
        doc: "VO-26-05-378-02",
        t: "Variation order — Bulacan substation",
        amt: 1240000,
        age: "4h",
        mod: "PMG",
      },
      {
        doc: "ACR-26-05-378-P4",
        t: "Accomplishment period #4 — submit",
        amt: null,
        age: "1d",
        mod: "PMG",
      },
    ],
  },
  purchsup: {
    hi: "Good morning",
    kpis: [
      {
        k: "POs awaiting approval",
        v: "12",
        d: "▲ 4 since Mon",
        tone: "pending",
      },
      { k: "Shipments arriving", v: "4", d: "ETA ≤ 7 days", tone: "info" },
      { k: "Blocked import stages", v: "1", d: "needs docs", tone: "danger" },
      { k: "Suppliers to review", v: "2", d: "data quality", tone: "neutral" },
    ],
    approvals: [
      {
        doc: "PO-IMP-26-0188",
        t: "Shenda Electric — transformer lot",
        amt: 4200000,
        age: "2d",
        mod: "Purchasing",
      },
      {
        doc: "PO-LOC-26-0204",
        t: "Local — consumables",
        amt: 86200,
        age: "6h",
        mod: "Purchasing",
      },
    ],
  },
  warehouse: {
    hi: "Good morning",
    kpis: [
      {
        k: "Documents awaiting lock",
        v: "5",
        d: "MRR · Release",
        tone: "pending",
      },
      {
        k: "MRs awaiting verification",
        v: "3",
        d: "available stock",
        tone: "info",
      },
      { k: "Transfers unconfirmed", v: "2", d: "site → site", tone: "neutral" },
      { k: "Stale reservations", v: "1", d: "> 14 days", tone: "danger" },
    ],
    approvals: [
      {
        doc: "MRR-2026-0144",
        t: "Goods receipt — transformer lot · For Checking",
        amt: null,
        age: "3h",
        mod: "Warehouse",
      },
      {
        doc: "REL-2026-0071",
        t: "Release form — Bulacan site",
        amt: null,
        age: "1d",
        mod: "Warehouse",
      },
    ],
  },
  siteeng: {
    hi: "Good morning",
    scoped: true,
    kpis: [
      { k: "My open documents", v: "2", d: "assigned sites", tone: "info" },
      { k: "Awaiting checking", v: "1", d: "submitted", tone: "pending" },
      { k: "My site", v: "Bulacan", d: "26-05-378", tone: "neutral" },
    ],
    approvals: [],
  },
  bddlead: {
    hi: "Good morning",
    kpis: [
      { k: "Open inquiries", v: "7", d: "from website", tone: "pending" },
      { k: "Quotations in review", v: "4", d: "EC · WS · Solar", tone: "info" },
      {
        k: "Offers awarded (mo)",
        v: "2",
        d: "→ Sales Orders",
        tone: "success",
      },
      { k: "Sensitive changes", v: "1", d: "contract amount", tone: "danger" },
    ],
    approvals: [
      {
        doc: "OFR-2026-021",
        t: "Offer — 230KV substation · approve issue",
        amt: 13540000,
        age: "5h",
        mod: "BDD",
      },
    ],
  },
};

// ============================================================================
// X5 · Admin users & roles (screens-admin.jsx:6-135).
// ============================================================================

export type UserStatus = "Active" | "Locked" | "Deactivated" | "Pending";

export type User = {
  id: number;
  name: string;
  email: string;
  /** display role name (one of ALL_ROLE_NAMES) — one role per user, no unions */
  role: string;
  status: UserStatus;
  /** last login timestamp */
  last: string;
  /** linked employee record no. */
  emp: string;
};

export const USERS: readonly User[] = [
  {
    id: 1,
    name: "Jose Cruz",
    email: "owner@jce.com.ph",
    role: "Owner",
    status: "Active",
    last: "2026-06-03 08:12",
    emp: "JCE 00001",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "hr.head@jce.com.ph",
    role: "HR Head",
    status: "Active",
    last: "2026-06-03 07:55",
    emp: "JCE 00014",
  },
  {
    id: 3,
    name: "Ramon dela Cruz",
    email: "timekeeper@jce.com.ph",
    role: "Timekeeper",
    status: "Active",
    last: "2026-06-02 17:40",
    emp: "JCE 00031",
  },
  {
    id: 4,
    name: "Ana Reyes",
    email: "acctg.lead@jce.com.ph",
    role: "Accounting Lead / CFO",
    status: "Active",
    last: "2026-06-03 08:01",
    emp: "JCE 00009",
  },
  {
    id: 5,
    name: "Liza Tan",
    email: "payroll@jce.com.ph",
    role: "Payroll Officer",
    status: "Active",
    last: "2026-06-02 16:22",
    emp: "JCE 00012",
  },
  {
    id: 6,
    name: "Carlos Mendoza",
    email: "pm.head@jce.com.ph",
    role: "PM Head",
    status: "Active",
    last: "2026-06-03 06:48",
    emp: "JCE 00007",
  },
  {
    id: 7,
    name: "Nestor Aquino",
    email: "purch.sup@jce.com.ph",
    role: "Purchasing Supervisor",
    status: "Active",
    last: "2026-06-02 18:05",
    emp: "JCE 00022",
  },
  {
    id: 8,
    name: "Grace Lim",
    email: "warehouse@jce.com.ph",
    role: "Warehouse Admin",
    status: "Active",
    last: "2026-06-03 07:30",
    emp: "JCE 00040",
  },
  {
    id: 9,
    name: "Paolo Garcia",
    email: "site.eng@jce.com.ph",
    role: "Site Engineer",
    status: "Active",
    last: "2026-06-02 12:10",
    emp: "JCE 00055",
  },
  {
    id: 10,
    name: "Bea Navarro",
    email: "bdd.lead@jce.com.ph",
    role: "BDD Lead / Admin",
    status: "Active",
    last: "2026-06-03 08:20",
    emp: "JCE 00018",
  },
  {
    id: 11,
    name: "Former Staff",
    email: "old.acct@jce.com.ph",
    role: "Accounting Staff",
    status: "Deactivated",
    last: "2026-01-14 09:00",
    emp: "JCE 00061",
  },
  {
    id: 12,
    name: "Ivan Locked",
    email: "ivan@jce.com.ph",
    role: "PMG Staff",
    status: "Locked",
    last: "2026-06-01 11:42",
    emp: "JCE 00048",
  },
] as const;

export const USER_STATUS_TONE: Record<
  UserStatus,
  "success" | "danger" | "neutral" | "pending"
> = {
  Active: "success",
  Locked: "danger",
  Deactivated: "neutral",
  Pending: "pending",
};

// 19 role names — the 12 implemented (from ROLES) + 7 not yet in the prototype
// (screens-admin.jsx:116-125 listed 6; Engineering added for the full 19, plan §10).
export const ALL_ROLE_NAMES: readonly string[] = [
  ...Object.values(ROLES).map((r) => r.name),
  "Accounting Staff",
  "PMG Staff",
  "Purchasing Staff",
  "Finance / AP",
  "Management / President",
  "BDD Staff",
  "Engineering",
] as const;

// ============================================================================
// X6 · System settings (screens-admin.jsx:370-505). 10 admin-editable lookups.
// ============================================================================

export type SettingsTab = { id: string; label: string };

export const SETTINGS_NAV: readonly SettingsTab[] = [
  { id: "sig", label: "Signatories" },
  { id: "appr", label: "Approval thresholds" },
  { id: "terms", label: "Payment terms" },
  { id: "cats", label: "Supplier categories" },
  { id: "banks", label: "JCE Banks" },
  { id: "units", label: "Units" },
  { id: "locs", label: "Locations / Warehouses" },
  { id: "ewt", label: "EWT rates" },
  { id: "fx", label: "FX policy" },
  { id: "notif", label: "Notification thresholds" },
] as const;

export type SettingsTable = {
  title: string;
  desc: string;
  /** OPEN-Q badge number, if any */
  oq?: string;
  cols: readonly string[];
  rows: readonly (readonly string[])[];
};

export const SETTINGS_DATA: Record<string, SettingsTable> = {
  sig: {
    title: "Signatories",
    desc: "Per print template — names + positions feeding the print-only signature blocks (FR-PO-06).",
    cols: ["Template", "Block", "Name", "Position"],
    rows: [
      ["PO (Local)", "Prepared by", "N. Aquino", "Purchasing Supervisor"],
      ["PO (Local)", "Approved by", "J. Cruz", "President"],
      ["PO (Import)", "Verified by", "A. Reyes", "CFO"],
      ["PO (Import)", "Approved by", "J. Cruz", "President"],
      ["RFP", "Noted by", "Finance / AP", ""],
      ["MR · JCE-F-WMS02", "Checked by", "G. Lim", "Warehouse Admin"],
    ],
  },
  appr: {
    title: "Approval thresholds",
    desc: "Per entity type (PR/PO/RFP/Blanket): amount bands × ordered approver chain, per currency. Bands are data (7.15.4).",
    oq: "17",
    cols: ["Entity", "Currency", "Amount band", "Approver chain"],
    rows: [
      ["PO", "PHP", "≤ ₱50,000", "Supervisor"],
      ["PO", "PHP", "₱50,001 – ₱500,000", "Supervisor → CFO"],
      ["PO", "PHP", "> ₱500,000", "Supervisor → CFO → President"],
      ["PO (Import)", "USD", "Stage 4 & 7 gates", "CFO → President"],
      ["PRQ", "PHP", "≥ ₱20,000 (mandatory)", "Department Head"],
    ],
  },
  terms: {
    title: "Payment terms",
    desc: "Controlled Terms-of-Payment list (FR-SUP-08).",
    cols: ["Code", "Description", "Net days"],
    rows: [
      ["COD", "Cash on delivery", "0"],
      ["NET15", "Net 15", "15"],
      ["NET30", "Net 30", "30"],
      ["NET60", "Net 60", "60"],
      ["50/50", "50% DP · 50% on delivery", "—"],
      ["LC", "Letter of credit", "—"],
    ],
  },
  cats: {
    title: "Supplier categories",
    desc: "FR-SUP-09.",
    cols: ["Category", "Active"],
    rows: [
      ["Electrical equipment", "Yes"],
      ["Transformers & switchgear", "Yes"],
      ["Civil works", "Yes"],
      ["Consumables", "Yes"],
      ["Logistics / freight", "Yes"],
      ["Services", "Yes"],
    ],
  },
  banks: {
    title: "JCE Banks lookup",
    desc: "Bank name, SWIFT, country (7.15.2). Accounts per client input: BDO, BPI 852-5, Land Bank 580 Workshop.",
    cols: ["Bank", "Account", "SWIFT", "Country"],
    rows: [
      ["BDO", "00xxx-xxxx-01", "BNORPHMM", "Philippines"],
      ["Land Bank (Workshop)", "580-xxxx", "TLBPPHMM", "Philippines"],
      ["BPI", "852-5", "BOPIPHMM", "Philippines"],
    ],
  },
  units: {
    title: "Units",
    desc: "Shared unit list (§6.3.2 / §10).",
    cols: ["Unit", "Label"],
    rows: [
      ["lot", "Lot"],
      ["set", "Set"],
      ["pcs", "Pieces"],
      ["kg", "Kilogram"],
      ["assy", "Assembly"],
      ["m", "Meter"],
      ["roll", "Roll"],
      ["drum", "Drum"],
    ],
  },
  locs: {
    title: "Locations / Warehouses",
    desc: "Main Office central + sites (FR-LOC-01). Site engineers are scoped to assigned locations.",
    cols: ["Code", "Location", "Type", "Active"],
    rows: [
      ["MAIN", "Main Office — Valenzuela", "Central", "Yes"],
      ["WS", "Workshop", "Internal", "Yes"],
      ["26-05-378", "Bulacan Substation", "Site", "Yes"],
      ["26-04-355", "Cavite Line", "Site", "Yes"],
      ["MOTORPOOL", "Motorpool", "Internal", "Yes"],
    ],
  },
  ewt: {
    title: "EWT rates",
    desc: "Expanded withholding tax (FR-RFP-06).",
    cols: ["Type", "Rate"],
    rows: [
      ["Goods", "1%"],
      ["Services", "2%"],
      ["Rentals", "5%"],
      ["Professional (≤₱3M)", "5%"],
      ["Professional (>₱3M)", "10%"],
    ],
  },
  fx: {
    title: "FX policy",
    desc: "Dual snapshot — PO-date rate + payment-date rate (FR-X-06). Display only; rates captured per document.",
    cols: ["Snapshot", "Source", "When captured"],
    rows: [
      ["PO-date rate", "BSP reference", "On PO issue"],
      ["Payment-date rate", "BSP reference", "On disbursement"],
    ],
  },
  notif: {
    title: "Notification thresholds",
    desc: "Stall days, ETA leads (FR-X-03, FR-IMP-05).",
    cols: ["Trigger", "Threshold"],
    rows: [
      ["PO pending stall", "> 2 days"],
      ["Shipment ETA leads", "7 / 3 / 1 day"],
      ["Contract expiry alert", "< 6 months"],
      ["Stale reservation", "> 14 days"],
    ],
  },
};
