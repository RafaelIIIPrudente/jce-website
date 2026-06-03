// ============================================================================
// JCE SYSTEM — Public website content (S1–S9)
// ============================================================================

const SERVICES = [
  {
    icon: "acc",
    name: "Substation Design & Construction",
    spec: "Up to 230 KV",
    desc: "Turnkey EPC for distribution and transmission substations — design, supply, civil, electromechanical, testing and commissioning.",
  },
  {
    icon: "bdd",
    name: "Transmission Line Construction",
    spec: "Up to 230 KV",
    desc: "Overhead transmission and distribution lines: surveying, foundations, tower/pole erection, stringing and energization.",
  },
  {
    icon: "eng",
    name: "Solar / Renewable Energy EPC",
    spec: "Utility & C&I scale",
    desc: "Ground-mount and rooftop PV plants from feasibility through grid connection and performance handover.",
  },
  {
    icon: "pur",
    name: "Switchgear Supply",
    spec: "HVSG · MVSG · LVSG",
    desc: "High-, medium- and low-voltage switchgear — specification, supply, and integration with protection schemes.",
  },
  {
    icon: "home",
    name: "Direct Connection Application",
    spec: "NGCP via 69 KV",
    desc: "End-to-end facilitation of NGCP direct-connection projects, from application through energization.",
  },
  {
    icon: "wh",
    name: "Maintenance & Servicing",
    spec: "Preventive · corrective",
    desc: "Scheduled maintenance, testing, and emergency servicing for substations, lines and power equipment.",
  },
];

const PRODUCTS = [
  {
    name: "Power Transformers",
    spec: "15 KV – 230 KV · Distribution / Power / CT / PT",
    tag: "Transformers",
  },
  { name: "Switchgear", spec: "HVSG · MVSG · LVSG", tag: "Switchgear" },
  {
    name: "Distribution Transformers",
    spec: "Single & three-phase, pole & pad mount",
    tag: "Transformers",
  },
  {
    name: "Protection & Control",
    spec: "Relays, RTUs, metering",
    tag: "Protection",
  },
];

const WEB_PROJECTS_PUB = [
  {
    name: "230KV Substation",
    client: "NGCP",
    loc: "Bulacan",
    year: "2026",
    tags: ["Substation", "Transmission"],
  },
  {
    name: "Solar Farm 5MWp",
    client: null,
    loc: "Tarlac",
    year: "2025",
    tags: ["Solar", "Renewable"],
  },
  {
    name: "69KV Transmission Line",
    client: "Meralco",
    loc: "Cavite",
    year: "2026",
    tags: ["Transmission Line"],
  },
  {
    name: "13.2KV Distribution Line",
    client: "NORECO II",
    loc: "Negros Oriental",
    year: "2026",
    tags: ["Distribution"],
  },
  {
    name: "Substation Rehabilitation",
    client: "SMC Global",
    loc: "Batangas",
    year: "2024",
    tags: ["Substation", "Maintenance"],
  },
  {
    name: "Rural Electrification",
    client: "DOE–JICA",
    loc: "Mindanao",
    year: "2024",
    tags: ["Distribution", "Renewable"],
  },
];

const STATS = [
  { v: "25+", k: "Years in power engineering" },
  { v: "230 KV", k: "Maximum voltage class" },
  { v: "150+", k: "Projects energized" },
  { v: "NGCP", k: "Direct-connection accredited" },
];

const FAQS = [
  {
    q: "Who builds power substations up to 230 kV in the Philippines?",
    a: "JC Electrofields Power System, Inc. (JCE) designs and constructs substations up to 230 KV nationwide — full EPC scope including design, supply, civil works, electromechanical installation, testing and commissioning.",
  },
  {
    q: "Is there an NGCP direct-connection (69 kV) contractor?",
    a: "Yes. JCE facilitates and constructs NGCP direct-connection projects via 69 KV, handling the application process through to energization.",
  },
  {
    q: "Where is JC Electrofields located?",
    a: "JCE is headquartered at 2129 La Mesa Street, Ugong, Valenzuela City, Metro Manila, Philippines, and executes projects nationwide.",
  },
  {
    q: "What voltage classes does JCE work with?",
    a: "From distribution voltages up to 230 KV transmission class — substations, transmission and distribution lines, and switchgear (HVSG/MVSG/LVSG).",
  },
  {
    q: "Does JCE supply power transformers?",
    a: "Yes — JCE supplies power and distribution transformers from 15 KV to 230 KV, including CT/PT, alongside switchgear and protection equipment.",
  },
  {
    q: "Does JCE undertake solar and renewable energy projects?",
    a: "Yes. JCE delivers utility-scale and commercial/industrial solar PV projects on an EPC basis, from feasibility through grid connection.",
  },
];

const NEWS = [
  {
    title: "JCE energizes 230KV substation for NGCP in Bulacan",
    date: "2026-03-18",
    cat: "Projects",
    excerpt:
      "A milestone transmission-class substation reaches commercial operation ahead of schedule.",
  },
  {
    title: "Breaking ground on a 5MWp solar farm in Tarlac",
    date: "2025-11-02",
    cat: "Renewable",
    excerpt:
      "JCE expands its renewable-energy portfolio with a utility-scale PV plant.",
  },
  {
    title: "What ‘direct connection’ via 69 KV means for large loads",
    date: "2025-09-10",
    cat: "Insight",
    excerpt:
      "A primer on NGCP direct connection and when it makes sense for industrial off-takers.",
  },
];

const CAREERS = [
  {
    title: "Senior Electrical Engineer",
    loc: "Valenzuela City / Project Sites",
    type: "Full-time",
    dept: "Engineering",
  },
  {
    title: "Project Manager — Substations",
    loc: "Nationwide",
    type: "Full-time",
    dept: "Project Management",
  },
  {
    title: "Site Engineer",
    loc: "Bulacan / Cavite",
    type: "Project-based",
    dept: "Construction",
  },
  {
    title: "Purchasing Officer",
    loc: "Valenzuela City",
    type: "Full-time",
    dept: "Purchasing",
  },
];

// S8 inquiry form option sets (verbatim from brief)
const INQ_INDUSTRY = [
  "Electric Cooperative",
  "Manufacturing",
  "Solar/Renewable Energy",
  "Commercial/Industrial",
  "Government/Public Sector",
  "Other",
];
const INQ_TYPE = [
  "Power Transformer Supply (Distribution/Power/CT/PT)",
  "Substation Design & Construction (up to 230 KV)",
  "Transmission Line Design & Construction (up to 230 KV)",
  "Switchgear (HVSG/MVSG/LVSG)",
  "Solar/Renewable Energy Project",
  "Maintenance & Servicing",
  "Direct Connection Application (NGCP via 69 KV)",
  "Engineering Consultancy",
  "Other",
];
const INQ_TIMELINE = [
  "Immediate / Emergency",
  "Less than 3 months",
  "3–6 months",
  "6–12 months",
  "More than 12 months",
];
const INQ_BUDGET = [
  "Under ₱1M",
  "₱1M – ₱10M",
  "₱10M – ₱50M",
  "₱50M – ₱100M",
  "Over ₱100M",
  "Prefer not to say",
];
const INQ_HEARD = [
  "Google / Web search",
  "Referral",
  "Past Project",
  "Trade Show / Event",
  "Other",
];

Object.assign(window, {
  SERVICES,
  PRODUCTS,
  WEB_PROJECTS_PUB,
  STATS,
  FAQS,
  NEWS,
  CAREERS,
  INQ_INDUSTRY,
  INQ_TYPE,
  INQ_TIMELINE,
  INQ_BUDGET,
  INQ_HEARD,
});
