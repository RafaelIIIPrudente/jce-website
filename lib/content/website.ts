// ============================================================================
// JCE SYSTEM — Public website content (S1–S9).
// Ported from docs/FINAL JCE PROJECT DESIGN/web-content.jsx + the brief §5.I
// (web-pages-a/b.jsx). Typed as-const, mirroring lib/content/projects.ts.
// Canonical facts/NAP come from the brief (brief:1124,1131), NOT the prototype's
// JSX placeholders.
// ============================================================================

import type { LucideIcon } from "lucide-react";
import {
  CableIcon,
  ClipboardListIcon,
  GaugeIcon,
  SunIcon,
  TowerControlIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react";

// ---- S1 hero / S2 stat band ------------------------------------------------
export type Stat = { v: string; k: string };

// Real corporate figures (company profile 2026): since 1997 · 124+ engineers ·
// capability to 230 kV · 45+ projects nationwide · ₱1B authorized capital.
export const STATS: readonly Stat[] = [
  { v: "1997", k: "Power engineering since" },
  { v: "124+", k: "Engineers & technicians" },
  { v: "230 kV", k: "Capability class" },
  { v: "45+", k: "Projects nationwide" },
] as const;

// Verbatim corporate tagline — use exactly, do not paraphrase.
export const TAGLINE =
  "Your need is our concern. Your priority is our priority. Your goal is our goal." as const;

// Numeric stats for the animated home hero (EnergizedCounter count-up). The
// generic Stat[] above still drives inner-page hero strips unchanged.
export type HeroStat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** false → no thousands separator (years). */
  grouping?: boolean;
};

export const HERO_STATS: readonly HeroStat[] = [
  { value: 1997, label: "Engineering since", grouping: false },
  { value: 124, suffix: "+", label: "Engineers & technicians" },
  { value: 230, suffix: " kV", label: "Capability class" },
  { value: 45, suffix: "+", label: "Projects nationwide" },
  { value: 1, prefix: "₱", suffix: "B", label: "Authorized capital" },
] as const;

// Marquee clients / credentials — NGCP leads (300 MVA / 230 kV substation work,
// the Cebu–Negros–Panay 230 kV submarine-cable backbone). JCE is also the
// exclusive Philippine distributor of Shenda Electric power transformers.
export const MARQUEE_CLIENTS: readonly string[] = [
  "NGCP",
  "Pilipinas Shell",
  "DMCI Power",
  "Steel Asia",
  "BATELEC",
  "LUELCO",
  "BOHECO",
] as const;

// ---- S3 Services (6 EPC capabilities + Engineering Consultancy) ------------
// Engineering Consultancy is folded in from the former /professional-services
// page (no handoff S-screen; maps to the INQ_TYPE "Engineering Consultancy").
// PROPOSED — needs confirmation.
export type Service = {
  slug: string;
  icon: LucideIcon;
  name: string;
  spec: string;
  desc: string;
};

export const SERVICES: readonly Service[] = [
  {
    slug: "substation-design-construction",
    icon: TowerControlIcon,
    name: "Substation Design & Construction",
    spec: "Up to 230 KV",
    desc: "Turnkey EPC for distribution and transmission substations — design, supply, civil, electromechanical, testing and commissioning.",
  },
  {
    slug: "transmission-line-construction",
    icon: CableIcon,
    name: "Transmission Line Construction",
    spec: "Up to 230 KV",
    desc: "Overhead transmission and distribution lines: surveying, foundations, tower/pole erection, stringing and energization.",
  },
  {
    slug: "solar-renewable-epc",
    icon: SunIcon,
    name: "Solar / Renewable Energy EPC",
    spec: "Utility & C&I scale",
    desc: "Ground-mount and rooftop PV plants from feasibility through grid connection and performance handover.",
  },
  {
    slug: "switchgear-supply",
    icon: GaugeIcon,
    name: "Switchgear Supply",
    spec: "HVSG · MVSG · LVSG",
    desc: "High-, medium- and low-voltage switchgear — specification, supply, and integration with protection schemes.",
  },
  {
    slug: "direct-connection-application",
    icon: ZapIcon,
    name: "Direct Connection Application",
    spec: "NGCP via 69 KV",
    desc: "End-to-end facilitation of NGCP direct-connection projects, from application through energization.",
  },
  {
    slug: "maintenance-servicing",
    icon: WrenchIcon,
    name: "Maintenance & Servicing",
    spec: "Preventive · corrective",
    desc: "Scheduled maintenance, testing, and emergency servicing for substations, lines and power equipment.",
  },
  {
    slug: "engineering-consultancy",
    icon: ClipboardListIcon,
    name: "Engineering Consultancy",
    spec: "Studies · FIT · ERC",
    desc: "Independent electrical review and pre-development consultancy — DOE Feed-in-Tariff, NGCP Systems Impact & Facility studies, and ERC point-to-point approval.",
  },
] as const;

// ---- S5 Products (kept distinct from services) -----------------------------
export type Product = { name: string; spec: string; tag: string };

export const PRODUCTS: readonly Product[] = [
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
] as const;

// ---- S4 Projects (curated public showcase — distinct from lib/content/projects) ---
export type WebProject = {
  name: string;
  /** null = client name withheld → render "Confidential client" */
  client: string | null;
  loc: string;
  year: string;
  tags: readonly string[];
};

export const WEB_PROJECTS: readonly WebProject[] = [
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
] as const;

export const PROJECT_TAGS: readonly string[] = [
  "All",
  ...Array.from(new Set(WEB_PROJECTS.flatMap((p) => p.tags))),
] as const;

// ---- S1 featured rail — real photographed projects (company profile 2026) ---
// Facts/capacities transcribed from the source slide captions; photos extracted
// + cropped to public/projects/. `cap` drives a VoltageTag; `img` is the full
// webp path for next/image. Distinct from WEB_PROJECTS (kept for the S4 index).
export type FeaturedProject = {
  name: string;
  /** null = client withheld → "Confidential client". */
  client: string | null;
  loc: string;
  cap: string;
  img: string;
  tags: readonly string[];
};

export const FEATURED_PROJECTS: readonly FeaturedProject[] = [
  {
    name: "GigaSol Alaminos Solar Farm",
    client: null,
    loc: "Alaminos, Laguna",
    cap: "120 MWp",
    img: "/projects/solar-alaminos.webp",
    tags: ["Solar", "Renewable"],
  },
  {
    name: "Cebu–Negros–Panay 230 kV Backbone",
    client: "NGCP",
    loc: "Barotac Viejo, Iloilo",
    cap: "230 kV",
    img: "/projects/controlroom-cnp.webp",
    tags: ["Substation", "SCADA"],
  },
  {
    name: "San Jose Shunt Capacitor Bank",
    client: "NGCP",
    loc: "San Jose, Luzon",
    cap: "4×100 MVAr",
    img: "/projects/capacitors-mexico.webp",
    tags: ["Testing & Commissioning"],
  },
  {
    name: "Bauang Switchyard Upgrade",
    client: "NGCP",
    loc: "Bauang, La Union",
    cap: "100 MVA · 230/69 kV",
    img: "/projects/switchyard-bauang.webp",
    tags: ["Substation"],
  },
  {
    name: "Casisang Power Transformer",
    client: "BUSECO",
    loc: "Malaybalay, Bukidnon",
    cap: "20/25 MVA",
    img: "/projects/night-buseco.webp",
    tags: ["Substation", "Transformer"],
  },
  {
    name: "Balayan Substation Transformer",
    client: "BATELEC I",
    loc: "Balayan, Batangas",
    cap: "10 MVA",
    img: "/projects/transformer-balayan.webp",
    tags: ["Transformer", "Shenda"],
  },
  {
    name: "NuevaSol Solar PV Facility",
    client: "NuevaSol Energy Corp.",
    loc: "Gamu, Nueva Ecija",
    cap: "55 MWp",
    img: "/projects/solar-nuevasol.webp",
    tags: ["Solar", "Renewable"],
  },
  {
    name: "San Carlos Sun Power Substation",
    client: null,
    loc: "San Carlos, Negros Occ.",
    cap: "58.98 MWp",
    img: "/projects/switchyard-sancarlos.webp",
    tags: ["Substation", "Solar"],
  },
] as const;

// S1 capability band — six EPC capabilities backed by real cropped textures.
export type CapabilityCard = {
  name: string;
  spec: string;
  img: string;
  href: string;
};

export const HOME_CAPABILITIES: readonly CapabilityCard[] = [
  {
    name: "Substations to 230 kV",
    spec: "Design–build EPC",
    img: "/projects/switchyard-sancarlos.webp",
    href: "/services",
  },
  {
    name: "Transmission Lines",
    spec: "Switchyard & towers",
    img: "/projects/switchyard-bauang.webp",
    href: "/services",
  },
  {
    name: "Solar PV / Renewables",
    spec: "Utility & C&I scale",
    img: "/projects/solar-alaminos.webp",
    href: "/services",
  },
  {
    name: "Testing & Commissioning",
    spec: "Energization-ready",
    img: "/projects/capacitors-mexico.webp",
    href: "/services",
  },
  {
    name: "Switchgear HVSG/MVSG/LVSG",
    spec: "Supply & integration",
    img: "/projects/transformer-balayan.webp",
    href: "/products",
  },
  {
    name: "NGCP Direct Connection",
    spec: "Application → energization",
    img: "/projects/controlroom-cnp.webp",
    href: "/services",
  },
] as const;

// ---- S6 News ---------------------------------------------------------------
export type NewsArticle = {
  slug: string;
  title: string;
  date: string;
  cat: string;
  excerpt: string;
};

export const NEWS: readonly NewsArticle[] = [
  {
    slug: "ngcp-230kv-substation-bulacan",
    title: "JCE energizes 230KV substation for NGCP in Bulacan",
    date: "2026-03-18",
    cat: "Projects",
    excerpt:
      "A milestone transmission-class substation reaches commercial operation ahead of schedule.",
  },
  {
    slug: "5mwp-solar-farm-tarlac",
    title: "Breaking ground on a 5MWp solar farm in Tarlac",
    date: "2025-11-02",
    cat: "Renewable",
    excerpt:
      "JCE expands its renewable-energy portfolio with a utility-scale PV plant.",
  },
  {
    slug: "direct-connection-69kv-explainer",
    title: "What ‘direct connection’ via 69 KV means for large loads",
    date: "2025-09-10",
    cat: "Insight",
    excerpt:
      "A primer on NGCP direct connection and when it makes sense for industrial off-takers.",
  },
] as const;

// ---- S7 Careers (application mechanism unconfirmed — OPEN-Q #11) ------------
export type CareerRole = {
  title: string;
  dept: string;
  loc: string;
  type: string;
};

export const CAREERS: readonly CareerRole[] = [
  {
    title: "Senior Electrical Engineer",
    dept: "Engineering",
    loc: "Valenzuela City / Project Sites",
    type: "Full-time",
  },
  {
    title: "Project Manager — Substations",
    dept: "Project Management",
    loc: "Nationwide",
    type: "Full-time",
  },
  {
    title: "Site Engineer",
    dept: "Construction",
    loc: "Bulacan / Cavite",
    type: "Project-based",
  },
  {
    title: "Purchasing Officer",
    dept: "Purchasing",
    loc: "Valenzuela City",
    type: "Full-time",
  },
] as const;

// ---- S9 FAQ (FAQPage-schema-friendly; location reconciled to canonical NAP) ---
export type Faq = { q: string; a: string };

export const FAQS: readonly Faq[] = [
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
    a: "JCE is headquartered at 3074 F. Bautista St., Brgy. Ugong, Valenzuela City, Metro Manila, Philippines, and executes projects nationwide.",
  },
  {
    q: "What voltage classes does JCE work with?",
    a: "From distribution voltages up to 230 KV transmission class — substations, transmission and distribution lines, and switchgear (HVSG/MVSG/LVSG).",
  },
  {
    q: "Does JCE supply power transformers?",
    a: "Yes — JCE supplies power and distribution transformers from 15 KV to 230 KV, including CT/PT, alongside switchgear and protection equipment. JCE is the exclusive Philippine distributor of Shenda Electric.",
  },
  {
    q: "Does JCE undertake solar and renewable energy projects?",
    a: "Yes. JCE delivers utility-scale and commercial/industrial solar PV projects on an EPC basis, from feasibility through grid connection.",
  },
] as const;

// ---- S2 About — narrative depth (brief:31,1131) ----------------------------
export const ABOUT = {
  mission:
    "To energize Philippine progress with safe, reliable, world-class power infrastructure.",
  vision: "The most trusted EPC partner for power up to 230 KV in the region.",
  values: [
    {
      title: "Safety first",
      body: "Every site, every crew, every day — zero-harm is the baseline, not the goal.",
    },
    {
      title: "Engineering integrity",
      body: "Designs that hold up under load, audit and time — no shortcuts to energization.",
    },
    {
      title: "Delivered on schedule",
      body: "Single-vendor accountability from study to handover, on the dates we commit to.",
    },
  ],
  history:
    "Founded in 1997 and headquartered in Valenzuela City, JC Electrofields Power System, Inc. has spent more than two decades building the power infrastructure that energizes Philippine industry — from distribution substations to 230 KV transmission-class projects, nationwide.",
  leadership: { role: "President", name: "Engr. Jimwel C. Capillo" },
  coverage:
    "Headquartered in Valenzuela City, Metro Manila — executing projects nationwide across Luzon, Visayas and Mindanao.",
  accreditations: [
    { code: "NGCP", note: "Direct-connection accredited (69 KV)" },
    { code: "DOE", note: "Feed-in-Tariff service contracts" },
    { code: "ERC", note: "Point-to-point approval" },
    { code: "PCAB", note: "Licensed general engineering contractor" },
  ],
  // Plain, extractable sentences for GEO / AI answer engines (FR-WEB-16).
  canonicalFacts: [
    "JC Electrofields Power System, Inc. (JCE) was founded in 1997 and is headquartered in Valenzuela City, Metro Manila, Philippines.",
    "JCE designs and constructs power substations and transmission lines up to 230 KV nationwide.",
    "JCE is the exclusive Philippine distributor of Shenda Electric power transformers.",
    "JCE builds utility-scale and commercial/industrial solar PV plants on an EPC basis.",
    "JCE facilitates NGCP direct-connection projects via 69 KV, from application through to energization.",
    "JCE employs approximately 124 engineers and technicians.",
    "JCE is led by its President, Engr. Jimwel C. Capillo.",
  ],
} as const;

// ---- S2 About — YouTube channel + curated video showcase -------------------
// Channel resolved from the @JCEPOWER handle (stable UC id). ABOUT_VIDEOS is the
// hand-picked featured set (always shown); the live "Latest from our channel"
// strip pulls the channel RSS feed at request time and de-dupes against these.
export const YOUTUBE_CHANNEL = {
  handle: "@JCEPOWER",
  url: "https://www.youtube.com/@JCEPOWER",
  channelId: "UCXamieRB1XJ4um7Rr_qo9zw",
} as const;

export type AboutVideo = { id: string; title: string };

// Verbatim from the channel (title typo/casing lightly normalized for display).
export const ABOUT_VIDEOS: readonly AboutVideo[] = [
  { id: "7K6cMIvBnmo", title: "69 kV transmission line and substation" },
  { id: "SerRpr5E_AA", title: "JCE Projects" },
  { id: "-WTmKPsrxjE", title: "JCE Christmas Party 2025" },
] as const;

// ============================================================================
// S8 inquiry-form option sets (verbatim from the brief / web-content.jsx)
// ============================================================================
export const INQ_INDUSTRY = [
  "Electric Cooperative",
  "Manufacturing",
  "Solar/Renewable Energy",
  "Commercial/Industrial",
  "Government/Public Sector",
  "Other",
] as const;

export const INQ_TYPE = [
  "Power Transformer Supply (Distribution/Power/CT/PT)",
  "Substation Design & Construction (up to 230 KV)",
  "Transmission Line Design & Construction (up to 230 KV)",
  "Switchgear (HVSG/MVSG/LVSG)",
  "Solar/Renewable Energy Project",
  "Maintenance & Servicing",
  "Direct Connection Application (NGCP via 69 KV)",
  "Engineering Consultancy",
  "Other",
] as const;

export const INQ_TIMELINE = [
  "Immediate / Emergency",
  "Less than 3 months",
  "3–6 months",
  "6–12 months",
  "More than 12 months",
] as const;

export const INQ_BUDGET = [
  "Under ₱1M",
  "₱1M – ₱10M",
  "₱10M – ₱50M",
  "₱50M – ₱100M",
  "Over ₱100M",
  "Prefer not to say",
] as const;

export const INQ_HEARD = [
  "Google / Web search",
  "Referral",
  "Past Project",
  "Trade Show / Event",
  "Other",
] as const;
