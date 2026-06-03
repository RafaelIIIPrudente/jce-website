// ============================================================================
// JCE SYSTEM — Project Management (PMG) shared data (Stage 5)
//   The PM Head keys ONE judgment per line per period (This Period %);
//   everything else derives. Reference anchor: NORECO2 grand total ₱53,277,688.
// ============================================================================

const CONTRACT = 53277688;
const DP_PCT = 15,
  RET_PCT = 10;

// Projects (portfolio)
const PROJECTS_PMG = [
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

// BOQ for the NORECO II project — categories → lines; staged lines have P/D/I.
// pesoValue = line/stage share of contract; weight = pesoValue/contract×100 (derived, never typed)
const BOQ = [
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
          ["Procure", 9000000],
          ["Deliver", 4500000],
          ["Install", 4500000],
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
          ["Procure", 9000000],
          ["Deliver", 3000000],
          ["Install", 3000000],
        ],
      },
      {
        no: "B.2",
        desc: "ACSR conductors & accessories",
        qty: 1,
        unit: "lot",
        staged: true,
        stages: [
          ["Procure", 6000000],
          ["Deliver", 2000000],
          ["Install", 2000000],
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

// Flatten BOQ to accomplishment rows (one per single line or per stage)
function boqRows() {
  const rows = [];
  BOQ.forEach((c) =>
    c.lines.forEach((l) => {
      if (l.staged)
        l.stages.forEach(([st, v]) =>
          rows.push({
            key: l.no + "-" + st,
            no: l.no,
            desc: l.desc,
            stage: st,
            value: v,
          }),
        );
      else
        rows.push({
          key: l.no,
          no: l.no,
          desc: l.desc,
          stage: null,
          value: l.value,
        });
    }),
  );
  return rows;
}
// Default Previous % and This Period % per row (tuned so PB1 ≈ 11.34% / ₱6,039,221.60)
const PB1_DEFAULTS = {
  "A.1-Procure": [0, 30],
  "A.1-Deliver": [0, 10],
  "A.1-Install": [0, 0],
  "A.2": [0, 15],
  "B.1-Procure": [0, 25],
  "B.1-Deliver": [0, 0],
  "B.1-Install": [0, 0],
  "B.2-Procure": [0, 12],
  "B.2-Deliver": [0, 0],
  "B.2-Install": [0, 0],
  "B.3": [0, 8],
};

// P9 billing history
const BILLING_HISTORY = [
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
const DP_AMOUNT = (CONTRACT * DP_PCT) / 100; // downpayment
// recoupment ledger / retention ledger derived in component

// P10/P11 Material Requests
const MRS = [
  {
    no: "JCE-MR-2026-0142",
    date: "2026-05-26",
    project: "NORECO II — 13.2KV",
    so: "26-05-378",
    lines: 5,
    reserved: 3,
    forPurchase: 2,
    status: "Approved",
    verified: "Verified",
  },
  {
    no: "JCE-MR-2026-0138",
    date: "2026-05-20",
    project: "Cavite 69KV",
    so: "26-04-355",
    lines: 8,
    reserved: 8,
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
const MR_LINES = [
  {
    no: 1,
    desc: "ACSR Conductor 1/0",
    purpose: "Stringing",
    reqQty: 5000,
    reqUnit: "m",
    availQty: 3200,
    forQty: 1800,
    forUnit: "m",
  },
  {
    no: 2,
    desc: "Insulator pin-type 15KV",
    purpose: "Pole hardware",
    reqQty: 240,
    reqUnit: "pcs",
    availQty: 240,
    forQty: 0,
    forUnit: "pcs",
  },
  {
    no: 3,
    desc: "Distribution transformer 100KVA",
    purpose: "Substation",
    reqQty: 6,
    reqUnit: "set",
    availQty: 2,
    forQty: 4,
    forUnit: "set",
  },
];

// P12 timeline
const PMG_TIMELINE = [
  {
    type: "period",
    icon: "check",
    ts: "2026-06-01 14:10",
    actor: "C. Mendoza",
    txt: "PB1 period submitted & locked — 11.34% accomplishment",
    link: "PB1",
  },
  {
    type: "mr",
    icon: "pmg",
    ts: "2026-05-26 10:30",
    actor: "PMG Staff",
    txt: "MR JCE-MR-2026-0142 approved — 2 lines to Purchasing",
    link: "JCE-MR-2026-0142",
  },
  {
    type: "po",
    icon: "pur",
    ts: "2026-05-22 09:00",
    actor: "Purchasing",
    txt: "PO-IMP-26-0188 raised for transformer lot",
    link: "PO-IMP-26-0188",
  },
  {
    type: "stock",
    icon: "wh",
    ts: "2026-05-20 15:40",
    actor: "Warehouse",
    txt: "Stock receipt MRR-2026-0144 — 800 m conductor",
    link: "MRR-2026-0144",
  },
];

// P13 PMG audit
const PMG_AUDIT = [
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

Object.assign(window, {
  CONTRACT,
  DP_PCT,
  RET_PCT,
  PROJECTS_PMG,
  BOQ,
  boqRows,
  PB1_DEFAULTS,
  BILLING_HISTORY,
  DP_AMOUNT,
  MRS,
  MR_LINES,
  PMG_TIMELINE,
  PMG_AUDIT,
});
