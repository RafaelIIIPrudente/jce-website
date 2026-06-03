// ============================================================================
// JCE SYSTEM — Warehouse module shared data (Stage 7)
//   Stock-on-hand is NEVER typed — it's the running sum of immutable movements
//   that post ONLY when a document Locks. 3-state gate: Draft→For Checking→Locked
// ============================================================================

const qn = (n) => n.toLocaleString("en-PH");

// ---- W1 project / cost-centre cards ----------------------------------------
const WH_PROJECTS = [
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
];

// ---- W2 stock monitoring ledger (NORECO II, BOQ-driven) --------------------
// planned from BOQ; delivered = Σ Locked MRR; utilized = Σ Locked Release
const WH_LEDGER = [
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
];

// ---- W3 item master --------------------------------------------------------
const WH_ITEMS = [
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
];

// ---- W4/W5/W6 document registers (3-state gate) ----------------------------
const MRRS = [
  {
    no: "MRR-2026-0144",
    date: "2026-05-22",
    supplier: "Cebu Steel Corp.",
    inv: "CS-2231",
    project: "NORECO II — 13.2KV",
    po: "2605-0204",
    mr: "JCE-MR-2026-0142",
    by: "P. Garcia",
    status: "For Checking",
    drPhoto: false,
  },
  {
    no: "MRR-2026-0140",
    date: "2026-05-20",
    supplier: "ABB Inc.",
    inv: "ABB-5567",
    project: "NORECO II — 13.2KV",
    po: "2604-0166",
    mr: "JCE-MR-2026-0118",
    by: "P. Garcia",
    status: "Locked",
    drPhoto: true,
  },
  {
    no: "MRR-2026-0138",
    date: "2026-05-18",
    supplier: "Meralco Industrial",
    inv: "ML-1102",
    project: "Cavite 69KV",
    po: "2605-0201",
    mr: "JCE-MR-2026-0140",
    by: "Site crew",
    status: "Draft",
    drPhoto: false,
  },
];
const RELEASES = [
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
];
const TRANSFERS = [
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
];
const GATE_TONE = {
  Draft: "neutral",
  "For Checking": "pending",
  Locked: "locked",
  "In Transit": "info",
};

// MRR form lines
const MRR_LINES = [
  {
    item: "Structural steel angle bar",
    desc: "50×50×6mm",
    qty: 120,
    unit: "pcs",
  },
  { item: "Welding rod E6013", desc: "3.2mm", qty: 40, unit: "box" },
];

// ---- W7 movements ledger (immutable) ---------------------------------------
const MOVEMENTS = [
  {
    type: "Receipt",
    qty: 800,
    date: "2026-05-20",
    actor: "Warehouse",
    loc: "Main Office",
    src: "MRR-2026-0140",
    bal: 2000,
  },
  {
    type: "Issue",
    qty: -540,
    date: "2026-05-15",
    actor: "Warehouse",
    loc: "Bulacan site",
    src: "REL-2026-0066",
    bal: 1460,
  },
  {
    type: "Transfer-Out",
    qty: -200,
    date: "2026-05-10",
    actor: "Warehouse",
    loc: "Main Office",
    src: "TRF-2026-0030",
    bal: 1260,
  },
  {
    type: "Transfer-In",
    qty: 200,
    date: "2026-05-11",
    actor: "Warehouse",
    loc: "Cavite site",
    src: "TRF-2026-0030",
    bal: 200,
  },
  {
    type: "Adjustment",
    qty: -12,
    date: "2026-05-22",
    actor: "G. Lim",
    loc: "Main Office",
    src: "manual",
    reason: "Damaged in handling",
    bal: 1448,
  },
];
const MOVE_TONE = {
  Receipt: "success",
  Issue: "danger",
  "Transfer-Out": "pending",
  "Transfer-In": "info",
  Adjustment: "neutral",
};

// ---- W8 MR verification queue ----------------------------------------------
const WH_MR_VERIFY = [
  {
    mr: "JCE-MR-2026-0142",
    project: "NORECO II — 13.2KV",
    status: "Pending",
    lines: [
      { item: "ACSR conductor 1/0", req: 5000, avail: 3200, unit: "m" },
      { item: "Insulator pin-type 15KV", req: 240, avail: 240, unit: "pcs" },
      {
        item: "Distribution transformer 100KVA",
        req: 6,
        avail: 2,
        unit: "set",
      },
    ],
  },
];

// ---- W9 audit --------------------------------------------------------------
const WH_AUDIT = [
  {
    ts: "2026-05-22 16:05",
    actor: "G. Lim (Warehouse Admin)",
    entity: "MRR-2026-0140",
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
];

Object.assign(window, {
  qn,
  WH_PROJECTS,
  WH_LEDGER,
  WH_ITEMS,
  MRRS,
  RELEASES,
  TRANSFERS,
  GATE_TONE,
  MRR_LINES,
  MOVEMENTS,
  MOVE_TONE,
  WH_MR_VERIFY,
  WH_AUDIT,
});
