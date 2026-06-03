// ============================================================================
// JCE SYSTEM — cross-cutting shell fixtures (notifications bell-feed).
// Ported from screens-core.jsx:285-294. Typed as-const, mirroring lib/content/.
// X4 Notifications Center is Part 2; here we seed the bell-feed + unread badge.
// ============================================================================

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
