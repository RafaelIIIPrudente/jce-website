// ============================================================================
// JCE SYSTEM — shared in-session inquiry store.
// The website S8 contact form writes here; BDD B10 reads + mutates here. ONE
// store, no parallel copy. Client-session singleton (module-level) — NO backend,
// DB, email or persistence. Reloading the page resets it (intentional mock).
// ============================================================================

export type InquiryStatus = "New" | "In Review" | "Replied" | "Closed" | "Spam";

// "Website Contact Form" is the website default; the rest are manually-logged
// lead channels surfaced in B10 (brief:1094).
export type InquirySource =
  | "Website Contact Form"
  | "Email"
  | "Phone"
  | "LinkedIn"
  | "Trade Show";

export type Inquiry = {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  name: string;
  company: string;
  position?: string;
  industry?: string;
  email: string;
  phone: string;
  type: string;
  /** populated when type === "Other" */
  typeOther?: string;
  projectLocation?: string;
  timeline?: string;
  subject: string;
  message: string;
  budget?: string;
  heard?: string;
  // BDD B10 working fields:
  assigned?: string;
  internalNote?: string;
  linkedOffer?: string;
  source: InquirySource;
  status: InquiryStatus;
};

/** The fields the website form supplies; id/date/source/status are assigned here. */
export type NewInquiry = Omit<
  Inquiry,
  | "id"
  | "date"
  | "source"
  | "status"
  | "assigned"
  | "internalNote"
  | "linkedOffer"
>;

// Seed rows — 2 prior website submissions + 3 from the BDD prototype
// (bdd-data.jsx:320-382), all in one store so B10 shows website + manual leads.
const store: Inquiry[] = [
  {
    id: "INQ-WEB-0001",
    date: "2026-05-28",
    name: "Maria Santos",
    company: "Negros Oriental II Electric Cooperative",
    position: "General Manager",
    industry: "Electric Cooperative",
    email: "m.santos@noreco2.example",
    phone: "+63 35 225 0000",
    type: "Substation Design & Construction (up to 230 KV)",
    projectLocation: "Negros Oriental",
    timeline: "3–6 months",
    subject: "13.2KV substation upgrade — feasibility",
    message:
      "We are evaluating a substation upgrade for our distribution backbone and would like a capability profile and indicative scope.",
    budget: "₱10M – ₱50M",
    heard: "Referral",
    assigned: "B. Navarro",
    source: "Website Contact Form",
    status: "In Review",
  },
  {
    id: "INQ-WEB-0005",
    date: "2026-05-30",
    name: "Spam Bot",
    company: "—",
    position: "—",
    industry: "—",
    email: "x@spam.co",
    phone: "—",
    type: "Other",
    projectLocation: "—",
    timeline: "—",
    subject: "SEO services offer",
    message: "Boost your ranking…",
    budget: "—",
    heard: "—",
    assigned: "—",
    source: "Website Contact Form",
    status: "Spam",
  },
  {
    id: "INQ-WEB-0002",
    date: "2026-06-01",
    name: "David Lim",
    company: "Cavite Industrial Park Corp.",
    position: "Plant Engineer",
    industry: "Manufacturing",
    email: "d.lim@cipc.example",
    phone: "+63 46 400 0000",
    type: "Direct Connection Application (NGCP via 69 KV)",
    projectLocation: "Cavite",
    timeline: "6–12 months",
    subject: "Direct connection for a new manufacturing load",
    message:
      "Looking for an EPC partner to facilitate NGCP direct connection via 69 KV for a new facility.",
    budget: "₱50M – ₱100M",
    heard: "Google / Web search",
    assigned: "—",
    source: "Website Contact Form",
    status: "New",
  },
  {
    id: "INQ-WEB-0004",
    date: "2026-06-02",
    name: "Sandra Yu",
    company: "Yu Construction",
    position: "Procurement",
    industry: "Construction",
    email: "sandra@yucon.com",
    phone: "0917-555-0002",
    type: "Product Quotation",
    projectLocation: "Cebu",
    timeline: "ASAP",
    subject: "Switchgear supply",
    message: "Requesting quotation for MV switchgear, 5 units.",
    budget: "₱5M",
    heard: "Referral",
    assigned: "B. Navarro",
    source: "Email",
    status: "In Review",
  },
  {
    id: "INQ-WEB-0003",
    date: "2026-06-03",
    name: "Engr. Rafael Lim",
    company: "Bohol Electric Coop",
    position: "Project Head",
    industry: "Electric Cooperative",
    email: "rlim@boheco.ph",
    phone: "0917-555-0001",
    type: "Project Inquiry",
    projectLocation: "Bohol",
    timeline: "Q3 2026",
    subject: "69KV substation upgrade",
    message:
      "We need a 69KV substation upgrade for our main line. Please send capability profile and indicative pricing.",
    budget: "₱40M–₱60M",
    heard: "Google search",
    assigned: "—",
    source: "Website Contact Form",
    status: "New",
  },
];

let seq = store.length;

function pad(n: number): string {
  return String(n).padStart(4, "0");
}

/** Append a new inquiry (website form); returns the created record. */
export function addInquiry(input: NewInquiry): Inquiry {
  seq += 1;
  const created: Inquiry = {
    ...input,
    id: `INQ-WEB-${pad(seq)}`,
    date: new Date().toISOString().slice(0, 10),
    source: "Website Contact Form",
    status: "New",
  };
  store.push(created);
  return created;
}

/** In-session mutate (B10 status / assign / link offer). */
export function updateInquiry(
  id: string,
  patch: Partial<Omit<Inquiry, "id">>,
): void {
  const i = store.findIndex((x) => x.id === id);
  const cur = store[i];
  if (cur) store[i] = { ...cur, ...patch };
}

/** Read all inquiries (newest first), for the BDD B10 inbox. */
export function getInquiries(): readonly Inquiry[] {
  return [...store].reverse();
}
