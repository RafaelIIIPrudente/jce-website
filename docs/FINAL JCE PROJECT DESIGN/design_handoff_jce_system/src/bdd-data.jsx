// ============================================================================
// JCE SYSTEM — BDD module shared data (Stage 8)
//   Two patterns: immutable event streams (Offers, Quotations) + standard
//   edit-with-audit (Sales Orders, website content, inquiries).
// ============================================================================

// ---- B1 Sales orders -------------------------------------------------------
const SALES_ORDERS = [
  {
    so: "26-05-378",
    date: "2026-05-02",
    client: "NORECO II",
    name: "13.2KV Distribution Line",
    amount: 53277688,
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
    remarks: "No Offer Yet",
    status: "Ongoing Project",
    turned: false,
    by: "BDD Staff",
  },
];
const SO_REMARK_TONE = {
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
const SO_STATUS_TONE = {
  "Ongoing Project": "info",
  "On Hold": "pending",
  "Project Completed": "success",
  Cancelled: "danger",
};

// ---- B3 Offers (JCEPSI · JICA) ---------------------------------------------
const OFFERS = [
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
];
const OFFER_STATUS_TONE = {
  "Waiting for Client Response": "pending",
  Acknowledged: "info",
  "For Revision": "pending",
  Revised: "neutral",
  Awarded: "success",
  "Not Awarded": "danger",
  "Offer Lapsed": "neutral",
  Cancelled: "danger",
};

// B4 event stream for NER2-26-021
const OFFER_EVENTS = [
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
];
const EVENT_TONE = {
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

// ---- B5 Quotations (EC · Workshop · Solar) ---------------------------------
const QUOTATIONS = [
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
];

// B6 supplier quotes for Q-EC-26031
const SUPPLIER_QUOTES = [
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
];
const QRESP_TONE = {
  Waiting: "pending",
  "For Revision": "pending",
  "Done (Quote Received)": "success",
  "No Quote": "danger",
  Other: "neutral",
};

// ---- B7/B8/B9 website content ----------------------------------------------
const WEB_PROJECTS = [
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
];
const WEB_SERVICES = [
  {
    name: "Substation Design and Construction (up to 230 KV)",
    status: "Published",
    sort: 1,
  },
  { name: "Transmission Line Construction", status: "Published", sort: 2 },
  { name: "Solar / Renewable Energy EPC", status: "Published", sort: 3 },
  { name: "Maintenance & Servicing", status: "Draft", sort: 4 },
];
const WEB_PRODUCTS = [
  { name: "Power Transformer (15 KV – 230 KV)", status: "Published", sort: 1 },
  { name: "HVSG / MVSG / LVSG Switchgear", status: "Published", sort: 2 },
  { name: "Distribution Transformers", status: "Hidden", sort: 3 },
];
const WEB_STATUS_TONE = {
  Published: "success",
  Draft: "pending",
  Hidden: "neutral",
};

// ---- B10 inquiries ---------------------------------------------------------
const INQUIRIES = [
  {
    id: 1,
    date: "2026-06-03",
    name: "Engr. Rafael Lim",
    company: "Bohol Electric Coop",
    type: "Project Inquiry",
    subject: "69KV substation upgrade",
    source: "Website Contact Form",
    status: "New",
    assigned: "—",
    position: "Project Head",
    email: "rlim@boheco.ph",
    phone: "0917-555-0001",
    industry: "Electric Cooperative",
    projLoc: "Bohol",
    timeline: "Q3 2026",
    budget: "₱40M–₱60M",
    heard: "Google search",
    message:
      "We need a 69KV substation upgrade for our main line. Please send capability profile and indicative pricing.",
  },
  {
    id: 2,
    date: "2026-06-02",
    name: "Sandra Yu",
    company: "Yu Construction",
    type: "Product Quotation",
    subject: "Switchgear supply",
    source: "Email",
    status: "In Review",
    assigned: "B. Navarro",
    position: "Procurement",
    email: "sandra@yucon.com",
    phone: "0917-555-0002",
    industry: "Construction",
    projLoc: "Cebu",
    timeline: "ASAP",
    budget: "₱5M",
    heard: "Referral",
    message: "Requesting quotation for MV switchgear, 5 units.",
  },
  {
    id: 3,
    date: "2026-05-30",
    name: "Spam Bot",
    company: "—",
    type: "Other",
    subject: "SEO services offer",
    source: "Website Contact Form",
    status: "Spam",
    assigned: "—",
    position: "—",
    email: "x@spam.co",
    phone: "—",
    industry: "—",
    projLoc: "—",
    timeline: "—",
    budget: "—",
    heard: "—",
    message: "Boost your ranking…",
  },
];
const INQ_TONE = {
  New: "info",
  "In Review": "pending",
  Replied: "success",
  Closed: "neutral",
  Spam: "danger",
};

// ---- B11 audit -------------------------------------------------------------
const BDD_AUDIT = [
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
];

Object.assign(window, {
  SALES_ORDERS,
  SO_REMARK_TONE,
  SO_STATUS_TONE,
  OFFERS,
  OFFER_STATUS_TONE,
  OFFER_EVENTS,
  EVENT_TONE,
  QUOTATIONS,
  SUPPLIER_QUOTES,
  QRESP_TONE,
  WEB_PROJECTS,
  WEB_SERVICES,
  WEB_PRODUCTS,
  WEB_STATUS_TONE,
  INQUIRIES,
  INQ_TONE,
  BDD_AUDIT,
});
