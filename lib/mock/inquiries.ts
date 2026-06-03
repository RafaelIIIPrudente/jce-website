// ============================================================================
// JCE SYSTEM — shared in-session inquiry store.
// The website S8 contact form writes here; BDD B10 (Part 3) will read here.
// Client-session singleton (module-level) — NO backend, DB, email or
// persistence. Reloading the page resets it; that is intentional for the mock.
// ============================================================================

export type InquiryStatus = "New" | "In Review" | "Replied" | "Closed" | "Spam";

export type InquirySource = "Website Contact Form";

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
  source: InquirySource;
  status: InquiryStatus;
};

/** The fields the website form supplies; id/date/source/status are assigned here. */
export type NewInquiry = Omit<Inquiry, "id" | "date" | "source" | "status">;

// Pre-seeded rows so BDD B10 has sample data on first read (the plan notes some
// rows are pre-seeded "Website Contact Form").
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
    source: "Website Contact Form",
    status: "In Review",
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
    source: "Website Contact Form",
    status: "New",
  },
];

let seq = store.length;

function pad(n: number): string {
  return String(n).padStart(4, "0");
}

/** Append a new inquiry; returns the created record (with id/date/status). */
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

/** Read all inquiries (newest first), for the future BDD B10 inbox. */
export function getInquiries(): readonly Inquiry[] {
  return [...store].reverse();
}
