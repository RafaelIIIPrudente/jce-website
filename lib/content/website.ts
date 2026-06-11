// ============================================================================
// JCE SYSTEM — Public website content (S1–S9).
// Ported from docs/FINAL JCE PROJECT DESIGN/web-content.jsx + the brief §5.I
// (web-pages-a/b.jsx). Typed as-const, mirroring lib/content/projects.ts.
// Canonical facts/NAP come from the brief (brief:1124,1131), NOT the prototype's
// JSX placeholders.
// ============================================================================

import type { LucideIcon } from "lucide-react";
import {
  ActivityIcon,
  BatteryChargingIcon,
  CableIcon,
  CircuitBoardIcon,
  ClipboardListIcon,
  CpuIcon,
  FactoryIcon,
  GaugeIcon,
  LayoutGridIcon,
  LineChartIcon,
  Link2Icon,
  PlugZapIcon,
  PowerIcon,
  RefreshCwIcon,
  ServerIcon,
  Settings2Icon,
  ShieldIcon,
  SunIcon,
  ToggleRightIcon,
  TowerControlIcon,
  UtilityPoleIcon,
  WrenchIcon,
  ZapIcon,
  ZapOffIcon,
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

// ---- S3 Services (faithful to the company profile pp.8–9 = NOTES §3) --------
// All 14 source services, ordered Engineering & Construction (p.8, items 1–10)
// then Professional / Consultancy (p.9, items 11–14). `spec` badges and `desc`
// paraphrases are grounded ONLY in the source — no invented ratings/acronyms and
// no turnkey-PV-EPC claim: renewables appear as CONSULTANCY (items 11–12) plus the
// substation/grid-interconnection JCE actually delivers (portfolio §4), not as a
// PV-plant EPC service. `slug` is a render key only (not routed); the four
// consultancy rows map to the INQ_TYPE "Engineering Consultancy" bucket.
export type Service = {
  slug: string;
  icon: LucideIcon;
  name: string;
  spec: string;
  desc: string;
};

export const SERVICES: readonly Service[] = [
  // ── Engineering & Construction (company profile p.8) ──
  {
    slug: "electrical-consulting-optimization",
    icon: LineChartIcon,
    name: "Electrical Consulting & Optimization",
    spec: "Billing · upgrading",
    desc: "Electrical consulting covering billing analysis, system upgrading and optimization.",
  },
  {
    slug: "transmission-line-construction",
    icon: CableIcon,
    name: "Transmission Line Design & Construction",
    spec: "Up to 230 KV",
    desc: "Design and construction of transmission lines, including testing and commissioning, up to 230 KV.",
  },
  {
    slug: "substation-design-construction",
    icon: TowerControlIcon,
    name: "Substation Design & Construction",
    spec: "Up to 230 KV",
    desc: "Design and construction of power substations, including testing and commissioning, up to 230 KV.",
  },
  {
    slug: "direct-connection-application",
    icon: ZapIcon,
    name: "Direct Connection Application",
    spec: "NGCP via 69 KV",
    desc: "Direct-connection application for NGCP via 69 KV lines — facilitated from application through to connection.",
  },
  {
    slug: "automation-controls",
    icon: CpuIcon,
    name: "Automation & Controls",
    spec: "Controls engineering",
    desc: "Automation and control-systems engineering for power and industrial facilities.",
  },
  {
    slug: "control-wiring-motor-controls",
    icon: Settings2Icon,
    name: "Control Wiring & Motor Controls",
    spec: "Motor controls",
    desc: "Control wiring and motor-control systems for industrial process electrical works.",
  },
  {
    slug: "power-management-system",
    icon: ActivityIcon,
    name: "Power Management Systems",
    spec: "Facility networks",
    desc: "Power management systems for the monitoring and control of facility electrical networks.",
  },
  {
    slug: "switchgear-design-fabrication",
    icon: ServerIcon,
    name: "Switchgear — Design, Fabrication & Assembly",
    spec: "HVSG · MVSG · LVSG",
    desc: "In-house design, fabrication and assembly of high-, medium- and low-voltage switchgear (HVSG, MVSG, LVSG).",
  },
  {
    slug: "maintenance-servicing",
    icon: WrenchIcon,
    name: "Substation Maintenance & Servicing",
    spec: "Preventive · corrective",
    desc: "Maintenance and servicing of substations and power equipment.",
  },
  {
    slug: "plant-electrical-maintenance",
    icon: FactoryIcon,
    name: "Plant Electrical Maintenance & Servicing",
    spec: "Industrial plants",
    desc: "Preventive and corrective electrical maintenance and servicing for industrial plant sites.",
  },
  // ── Professional / Consultancy services (company profile p.9) ──
  {
    slug: "renewable-predevelopment-consultancy",
    icon: ClipboardListIcon,
    name: "Renewable-Energy Pre-Development Consultancy",
    spec: "DOE FIT · NGCP · ERC",
    desc: "Pre-development consultancy for renewable-energy projects: DOE service-contract preparation for Feed-in-Tariff (FIT) availment; the NGCP System Impact Study and Facility Study Report, with coordination and technical-connection compliance; and ERC point-to-point approval.",
  },
  {
    slug: "pv-solar-engineering-consultancy",
    icon: SunIcon,
    name: "PV-Solar & Renewables Engineering Consultancy",
    spec: "PV & renewables",
    desc: "Engineering consultancy for the construction of PV-solar and other renewable-energy generating plants.",
  },
  {
    slug: "substation-transmission-design-consultancy",
    icon: UtilityPoleIcon,
    name: "Substation & Transmission-Line Design Consultancy",
    spec: "Engineering design",
    desc: "Consultancy in the engineering design of power substations and transmission lines.",
  },
  {
    slug: "industrial-plant-electrical-consultancy",
    icon: CircuitBoardIcon,
    name: "Industrial-Plant Electrical Consultancy",
    spec: "Industrial systems",
    desc: "Consultancy in the electrical engineering of industrial-plant electrical systems.",
  },
] as const;

// ---- S5 Products (16 canonical items, company profile — distinct from services) ---
// Order matches the company-profile list. `spec` is a brief factual descriptor of
// what each item is (reusing the honest descriptors from the prior PRODUCT_LINES
// where they map); no invented ratings, capacities, or claims. `tag` is a short
// category for the grid filters. `icon` is a distinct lucide glyph per item so the
// (photo-less) spec cards read differently from one another — symbolic, not literal
// (lucide has no equipment-specific glyphs); real equipment photography lives in
// the PRODUCT_EQUIPMENT band below.
export type Product = {
  name: string;
  spec: string;
  tag: string;
  icon: LucideIcon;
};

export const PRODUCTS: readonly Product[] = [
  {
    name: "Power Transformer",
    spec: "230 KV – 15 KV",
    tag: "Transformers",
    icon: ZapIcon,
  },
  {
    name: "Distribution Transformer (DT)",
    spec: "Single- & three-phase, pole & pad mount",
    tag: "Transformers",
    icon: PlugZapIcon,
  },
  {
    name: "Current Transformer (CT)",
    spec: "Metering & protection",
    tag: "Instrument Transformers",
    icon: ActivityIcon,
  },
  {
    name: "Potential Transformer (PT)",
    spec: "Metering & relay circuits",
    tag: "Instrument Transformers",
    icon: GaugeIcon,
  },
  {
    name: "Disconnect Switch (DS)",
    spec: "Substation isolation",
    tag: "Switchgear",
    icon: ToggleRightIcon,
  },
  {
    name: "SF-6 Power Breaker",
    spec: "Gas-insulated, transmission class",
    tag: "Breakers",
    icon: ZapOffIcon,
  },
  {
    name: "Capacitor Bank",
    spec: "Reactive-power compensation",
    tag: "Power Quality",
    icon: BatteryChargingIcon,
  },
  {
    name: "Recloser",
    spec: "Automatic feeder protection",
    tag: "Distribution",
    icon: RefreshCwIcon,
  },
  {
    name: "Power Cables",
    spec: "MV & HV feeders",
    tag: "Cables",
    icon: CableIcon,
  },
  {
    name: "Panel Boards",
    spec: "Plant electrical distribution",
    tag: "Distribution",
    icon: LayoutGridIcon,
  },
  {
    name: "HVSG, MVSG and LVSG",
    spec: "Design, fabrication & assembly",
    tag: "Switchgear",
    icon: ServerIcon,
  },
  {
    name: "Lightning Arrester",
    spec: "Surge protection",
    tag: "Protection",
    icon: ShieldIcon,
  },
  {
    name: "Pole Line Hardware",
    spec: "Insulators, cross-arms & fittings",
    tag: "Distribution",
    icon: Link2Icon,
  },
  {
    name: "Air Circuit Breaker (ACB)",
    spec: "LV main distribution",
    tag: "Breakers",
    icon: PowerIcon,
  },
  {
    name: "Power Circuit Breaker (PCB)",
    spec: "MV & HV substation feeders",
    tag: "Breakers",
    icon: CircuitBoardIcon,
  },
  {
    name: "Steel & Concrete Poles",
    spec: "Transmission & distribution structures",
    tag: "Structures",
    icon: UtilityPoleIcon,
  },
] as const;

// ---- S5 Products — real-equipment photo band ------------------------------
// Authentic JCE equipment photography extracted & cleaned from the company
// profile (transformer p.59 Dumanjug · switchgear p.51 QUEZELCO I · capacitor
// bank p.67 San Jose 230 kV · NGCP protection panels p.72 CNP). Deployed as a
// section band (NOT one-per-card) so the page shows real photos where they're
// genuinely strong. Captions are factual; `tag` reuses real product/spec terms.
export type EquipmentShot = { img: string; name: string; tag: string };

export const PRODUCT_EQUIPMENT: readonly EquipmentShot[] = [
  {
    img: "/products/transformer-shenda.webp",
    name: "Shenda Electric power transformer",
    tag: "Exclusive distributor",
  },
  {
    img: "/products/switchgear-panels.webp",
    name: "MV switchgear line-up",
    tag: "HVSG · MVSG · LVSG",
  },
  {
    img: "/products/capacitor-bank.webp",
    name: "230 kV shunt capacitor bank",
    tag: "230 kV",
  },
  {
    img: "/projects/controlroom-cnp.webp",
    name: "Protection & control panels",
    tag: "SCADA",
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

// NOTE: the former HOME_CAPABILITIES PhotoCard-grid set + its CapabilityCard
// type were retired from the live content here and inlined into the quarantined
// components/sections/legacy/web-home-capabilities.tsx (its only consumer), so
// this file carries no orphaned export. The live "What we do" surface is the
// orbital HOME_CAPABILITY_NODES below.

// ---- S1 "What we do" — energy-core orbital capabilities ---------------------
// The interactive showpiece: the Ω brand mark as the core, JCE's real EPC
// capabilities orbiting it. Sourced from SERVICES (descriptions verbatim-derived)
// + the Shenda transformer distributorship; photos
// from the 2026 public/home set. `related` cross-links node ids. No invented
// metrics/status — capabilities only.
export type CapabilityNode = {
  id: string;
  title: string;
  /** Short, plain description (GEO-friendly) — drawn from SERVICES copy. */
  blurb: string;
  icon: LucideIcon;
  /** Real services/products page this capability lives on. */
  href: string;
  /** ids of cross-linked capabilities (jump targets in the orbit). */
  related: readonly string[];
  /** Representative photo shown in the expanded card. */
  img: string;
  imgAlt: string;
};

export const HOME_CAPABILITY_CORE = {
  eyebrow: "What we do",
  heading: "Full-scope power engineering",
  intro:
    "Substations and transmission lines to 230 kV, in-house switchgear, automation and maintenance — plus renewable-energy and engineering consultancy. Single-vendor, from study to energization.",
  coreLabel: "Power systems EPC",
} as const;

export const HOME_CAPABILITY_NODES: readonly CapabilityNode[] = [
  {
    id: "substations",
    title: "Substations to 230 kV",
    blurb:
      "Turnkey EPC for distribution and transmission substations — design, supply, civil, electromechanical, testing and commissioning, up to 230 kV.",
    icon: TowerControlIcon,
    href: "/services",
    related: ["transmission", "testing", "ngcp"],
    img: "/home/substation-transformer-mountains.webp",
    imgAlt:
      "Substation with a power transformer and red-roofed control house against a green mountain backdrop",
  },
  {
    id: "transmission",
    title: "Transmission & Distribution Lines",
    blurb:
      "Overhead transmission and distribution lines — surveying, foundations, pole and tower erection, stringing and energization.",
    icon: UtilityPoleIcon,
    href: "/services",
    related: ["substations", "ngcp"],
    img: "/home/distribution-line-bucket-truck-aerial.webp",
    imgAlt:
      "Aerial of a bucket truck servicing a distribution line over green fields",
  },
  {
    id: "solar",
    title: "Solar PV / Renewables",
    blurb:
      "Renewable-energy consultancy and engineering design for PV-solar plants — pre-development studies (DOE FIT, NGCP System Impact & Facility, ERC approval) — plus the substations and grid-interconnection that tie solar farms into the network.",
    icon: SunIcon,
    href: "/services",
    related: ["substations", "testing"],
    img: "/home/solar-farm-rows-aerial.webp",
    imgAlt:
      "Aerial of dense rows of solar panels beside white control buildings",
  },
  {
    id: "testing",
    title: "Testing & Commissioning",
    blurb:
      "Energization-ready testing and commissioning of substations, lines and power equipment — the final proof before handover.",
    icon: GaugeIcon,
    href: "/services",
    related: ["substations", "solar"],
    img: "/home/substation-shenda-transformer-engineer.webp",
    imgAlt:
      "Engineer standing beside a SHENDA power transformer at a substation, rice fields behind",
  },
  {
    id: "switchgear",
    title: "Switchgear & Transformers",
    blurb:
      "HV/MV/LV switchgear designed, fabricated and assembled in-house, with power transformers from 15 kV to 230 kV — JCE is the exclusive Philippine distributor of Shenda Electric.",
    icon: ServerIcon,
    href: "/products",
    related: ["substations", "ngcp"],
    img: "/home/substation-topdown-aerial.webp",
    imgAlt: "Top-down aerial of a substation showing the equipment layout",
  },
  {
    id: "ngcp",
    title: "NGCP Direct Connection",
    blurb:
      "Facilitation of NGCP direct-connection projects via 69 kV — from the application through to connection.",
    icon: PlugZapIcon,
    href: "/services",
    related: ["substations", "transmission"],
    img: "/home/substation-ricefield-aerial.webp",
    imgAlt:
      "Aerial of a substation beside bright green rice paddies and rural houses",
  },
] as const;

// ---- S1 home hero photo + copy (2026 real photography) ---------------------
// Strongest aerial — coastal solar farm + substation switchyard. Drives the
// priority LCP <Image> in HomeHero. Copy lives here (content-from-logic): the
// kicker, the two-part headline, and a DISTINCT scope sub-line — the verbatim
// TAGLINE is reserved for the closing CTA so it is never shown twice on the page.
export const HOME_HERO = {
  img: "/home/solar-farm-substation-coast-hero.webp",
  alt: "Aerial of a coastal solar farm and substation switchyard built by JC Electrofields, the sea on the horizon",
  kicker: "JC Electrofields Power System, Inc.",
  headlineLead: "Power infrastructure,",
  headlineAccent: "engineered to energize.",
  sub: "Single-vendor EPC for substations, transmission and switchgear to 230 kV — plus automation, maintenance and renewable-energy consultancy, nationwide.",
} as const;

// ---- S1 "Proof at scale" — calm photography-led proof band -----------------
// Four corporate aerials + a current-trace divider + figures that count up on
// view. Figures are §9-SAFE delivered-scale facts, deliberately DISTINCT from
// the hero stat strip (no duplicate 230 kV / 45+ / 1997 count-ups): largest
// transformer, largest solar EPC, largest capacitor bank, regions energized.
export type ProofImage = { img: string; alt: string };
export type ProofStat = {
  value: number;
  suffix?: string;
  /** false → no thousands separator (years). */
  grouping?: boolean;
  label: string;
  sub: string;
};

export const HOME_PROOF = {
  eyebrow: "Proof at scale",
  heading: "Built across the archipelago — energized on schedule.",
  intro:
    "From 230 kV transmission substations to the grid-interconnection of utility-scale solar farms, the current we engineer reaches across Luzon, Visayas and Mindanao.",
  images: [
    {
      img: "/home/solar-farm-coast-aerial.webp",
      alt: "Aerial of a coastal solar farm, panels reaching toward the shoreline",
    },
    {
      img: "/home/solar-farm-nsec-hero.webp",
      alt: "Aerial of a vast utility-scale solar panel field stretching toward the horizon",
    },
    {
      img: "/home/substation-solar-panorama-aerial.webp",
      alt: "Panoramic aerial of a substation switchyard with a solar farm behind it under a clear sky",
    },
    {
      img: "/home/distribution-line-bucket-truck-aerial.webp",
      alt: "Aerial of a bucket truck servicing a distribution line over green fields",
    },
  ] satisfies readonly ProofImage[],
  stats: [
    {
      value: 300,
      suffix: " MVA",
      label: "Largest transformer",
      sub: "NGCP 230 kV substation, energized on schedule",
    },
    {
      value: 120,
      suffix: " MWp",
      label: "Largest solar interconnection",
      sub: "Grid-tie substation for a utility-scale PV farm",
    },
    {
      value: 400,
      suffix: " MVAr",
      label: "Largest capacitor bank",
      sub: "NGCP 230 kV shunt bank (4×100 MVAr)",
    },
    {
      value: 3,
      grouping: false,
      label: "Regions energized",
      sub: "Luzon · Visayas · Mindanao",
    },
  ] satisfies readonly ProofStat[],
} as const;

// ---- S1 trust bar copy -----------------------------------------------------
// NGCP credentials split per the company profile (§4): the 300 MVA / 230 kV
// figure is Luzon Grid Expansion I (Cabanatuan/Biñan); the Cebu–Negros–Panay
// 230 kV backbone is a SEPARATE credential with no MVA rating — so the two are
// stated as distinct claims, not joined. `headingAccent` is the highlighted figure.
export const HOME_CLIENTS = {
  eyebrow: "Trusted by",
  headingLead: "Flagship NGCP credentials — ",
  headingAccent: "300 MVA / 230 kV",
  headingTail:
    " Luzon Grid substations, and the Cebu–Negros–Panay 230 kV backbone.",
  distributorLead: "Exclusive Philippine distributor of ",
  distributorName: "Shenda Electric",
  distributorTail: " power transformers.",
} as const;

// ---- S1 "engineering in motion" dark band copy -----------------------------
export const HOME_MOTION_BAND = {
  eyebrow: "On site, after dark",
  heading: "Engineering in motion",
  body1:
    "Night transformer lifts. Live switchyard work. Crews mobilized across Luzon, Visayas and Mindanao — energizing on the dates we commit to.",
  body2:
    "Single-vendor accountability from study to handover, with 124+ engineers and technicians under one roof.",
  tags: ["Up to 230 kV", "300 MVA", "Since 1997"],
  photo: {
    src: "/projects/switchyard-bauang.webp",
    alt: "JC Electrofields crews performing live switchyard assembly at the Bauang 230/69 kV substation",
    tag: "100 MVA · 230/69 kV",
    caption: "Bauang Switchyard — Luzon Grid Expansion I",
  },
} as const;

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
// `category` groups items into accordion sections on the FAQ page; the FAQPage
// JSON-LD still maps every item flat. Answers are plain, self-contained,
// extractable sentences (GEO-friendly, FR-WEB-10/17) drawn ONLY from §9-SAFE
// company-profile facts — never the withheld set (TINs, document scans, permit
// fee/account numbers, personal emails, or officers' names in a tax context).
export type Faq = { q: string; a: string; category?: string };

export const FAQS: readonly Faq[] = [
  // ---- Company & history ----
  {
    category: "Company & history",
    q: "What is JC Electrofields Power System, Inc.?",
    a: "JC Electrofields Power System, Inc. (JCE) is a Filipino power-engineering firm — an EPC contractor and equipment supplier founded in 1997. It designs, supplies and builds power substations, transmission and distribution lines, and switchgear, undertakes solar PV plants, and supplies transformers and protection equipment to the energy sector nationwide.",
  },
  {
    category: "Company & history",
    q: "When was JCE founded, and is it a registered corporation?",
    a: "JCE was founded in 1997 and is a corporation registered with the Securities and Exchange Commission (SEC) since 24 July 2007 under Registration No. CS200711697. It has an authorized capital stock of ₱1,000,000,000 (increased in 2021), reflecting its financial capacity for large-scale power projects.",
  },
  {
    category: "Company & history",
    q: "How did JCE start?",
    a: "JCE began by serving the steel-manufacturing sector — helping plants secure their own power substations for direct connection to the national grid through the NGCP. From early work in the repair and fabrication of electrical equipment, it has grown into a major contractor and supplier across the entire energy sector.",
  },

  // ---- Capabilities ----
  {
    category: "Capabilities",
    q: "Who builds power substations up to 230 kV in the Philippines?",
    a: "JC Electrofields Power System, Inc. (JCE) designs and constructs substations up to 230 KV nationwide — full EPC scope including design, supply, civil works, electromechanical installation, testing and commissioning.",
  },
  {
    category: "Capabilities",
    q: "What voltage classes does JCE work with?",
    a: "From distribution voltages up to 230 KV transmission class — substations, transmission and distribution lines, and switchgear (HVSG/MVSG/LVSG).",
  },
  {
    category: "Capabilities",
    q: "Is there an NGCP direct-connection (69 kV) contractor?",
    a: "Yes. JCE facilitates and constructs NGCP direct-connection projects via 69 KV, handling the application process through to energization.",
  },
  {
    category: "Capabilities",
    q: "Does JCE supply power transformers?",
    a: "Yes — JCE supplies power and distribution transformers from 15 KV to 230 KV, including CT/PT, alongside switchgear and protection equipment. JCE is the exclusive Philippine distributor of Shenda Electric.",
  },
  {
    category: "Capabilities",
    q: "Does JCE design and fabricate switchgear?",
    a: "Yes. JCE designs, fabricates and assembles high-, medium- and low-voltage switchgear (HVSG, MVSG and LVSG), along with panel boards, protection equipment and controls.",
  },
  {
    category: "Capabilities",
    q: "Does JCE provide substation and electrical maintenance?",
    a: "Yes. Beyond new construction, JCE provides preventive and corrective maintenance and servicing of substations and of plant electrical systems.",
  },

  // ---- Renewable energy & consultancy ----
  {
    category: "Renewable energy & consultancy",
    q: "Does JCE undertake solar and renewable energy projects?",
    a: "Yes. JCE delivers utility-scale and commercial/industrial solar PV projects on an EPC basis, from feasibility through grid connection.",
  },
  {
    category: "Renewable energy & consultancy",
    q: "Does JCE provide renewable-energy pre-development consultancy?",
    a: "Yes. JCE prepares Department of Energy (DOE) service contracts to avail of the Feed-in-Tariff (FIT), conducts the NGCP System Impact Study and Facility Study with connection coordination and compliance, and secures Energy Regulatory Commission (ERC) point-to-point approval. It also provides engineering design of substations, transmission lines and PV solar plants.",
  },

  // ---- Licenses & accreditations (§9-SAFE; numbers/validity are public record) ----
  {
    category: "Licenses & accreditations",
    q: "What licenses and accreditations does JCE hold?",
    a: "JCE holds a PCAB Regular Contractor's License (No. 37783 — General Engineering Category A, General Building, and Specialty Electrical Work, valid through April 2027), PhilGEPS Platinum Membership (valid until January 2027), and NGCP accreditation as a Local Contractor for Substation Erection (since 2016). It is an SEC-registered corporation (No. CS200711697), is BIR-registered and tax-compliant, and holds a current Valenzuela City business permit renewed annually. Complete documentation is available upon request for bidding and accreditation purposes.",
  },
  {
    category: "Licenses & accreditations",
    q: "Is JCE PCAB-licensed?",
    a: "Yes. JCE holds PCAB Regular Contractor's License No. 37783, covering General Engineering Category A, General Building, and Specialty Electrical Work. It has been licensed since 2014 and the license is valid through April 2027. Complete documentation is available upon request for bidding and accreditation purposes.",
  },
  {
    category: "Licenses & accreditations",
    q: "Is JCE registered on PhilGEPS?",
    a: "Yes. JCE holds a PhilGEPS Platinum Membership for Philippine government procurement, registered since 2012 and valid until January 2027. Complete documentation is available upon request for bidding and accreditation purposes.",
  },

  // ---- Track record & coverage (published project/client names only) ----
  {
    category: "Track record & coverage",
    q: "Where has JCE delivered projects, and how large is its team?",
    a: "JCE has delivered projects nationwide across Luzon, Visayas and Mindanao, and employs approximately 124 registered civil and electrical engineers and technicians.",
  },
  {
    category: "Track record & coverage",
    q: "What is JCE's track record with NGCP and utilities?",
    a: "JCE has performed substation and transmission work for the National Grid Corporation of the Philippines (NGCP), including the Cebu–Negros–Panay 230 kV backbone. It has built substations for electric cooperatives and private utilities such as LUELCO, INEC and DMCI Power, delivered utility-scale solar including an urban solar farm in Valenzuela, and carried out substation work for Pilipinas Shell.",
  },

  // ---- Working with JCE ----
  {
    category: "Working with JCE",
    q: "Where is JC Electrofields located?",
    a: "JCE is headquartered at 3074 F. Bautista St., Brgy. Ugong, Valenzuela City, Metro Manila, Philippines, and executes projects nationwide.",
  },
  {
    category: "Working with JCE",
    q: "How do I request a quote or start a project with JCE?",
    a: "Send a project brief through the Contact page — whether you are a utility, developer, or industrial client — and JCE's team responds within one business day. Complete documentation for bidding and accreditation is available upon request.",
  },
  {
    category: "Working with JCE",
    q: "What is JCE's commitment to safety and quality?",
    a: "JCE serves every customer in the most responsible way, with safety as the main consideration, backed by reliable service, superior-quality materials, and continuously upskilled engineers and technicians.",
  },
] as const;

// ---- S2 About — narrative depth (brief:31,1131) ----------------------------
export const ABOUT = {
  mission:
    "To energize Philippine progress with safe, reliable, world-class power infrastructure.",
  // Aspirational framing of the §5 "WORLD CLASS" / "Asian Region" ambition —
  // stated as a goal, not a present-day claim.
  vision:
    "To deliver world-class standards of electrical and power solutions — and to grow from a trusted Philippine EPC partner into a player across the Asian region.",
  // The three commitments paraphrase the first three §5 mission bullets:
  // responsible/safety-first service with superior materials; making customers
  // aware of the value of the work; continuously upskilling our people.
  values: [
    {
      title: "Safety first",
      body: "We serve every customer in the most responsible way — safety first — backed by reliable service and superior-quality materials.",
    },
    {
      title: "Clear on the value",
      body: "We keep customers aware of our commitment to their needs, and the real benefits they gain from our products and services.",
    },
    {
      title: "Always upskilling",
      body: "We keep advancing our people's skills and expertise toward modern technology, through ongoing training and development.",
    },
  ],
  // Present-tense paraphrase of the §2 verbatim history (the source is one ESL
  // paragraph — paraphrased, not pasted). Load-bearing facts preserved: 1997
  // founding by a top-graduate EE, steel-manufacturing origin via NGCP
  // direct-connection substations, repair-and-fabrication → major energy-sector
  // contractor/supplier.
  history:
    "Founded in 1997 by a top-graduate electrical engineer, JC Electrofields Power System, Inc. began by serving the steel-manufacturing sector — helping plants secure their own power substations for direct connection to the national grid. From early work in repair and fabrication, JCE has grown into a major contractor and supplier to the entire energy sector.",
  leadership: { role: "President", name: "Engr. Jimwel C. Capillo" },
  // Expansion + scale + distributorship + nationwide reach (also from §2).
  coverage:
    "Today JCE works across power generation, distribution utilities, manufacturing, and industrial and commercial clients — with over 124 registered civil and electrical engineers and technicians, and the exclusive Philippine distributorship of Shenda Electric power transformers. Headquartered in Valenzuela City, it executes projects nationwide across Luzon, Visayas and Mindanao.",
  // Plain, extractable sentences for GEO / AI answer engines (FR-WEB-16). The
  // authorized-capital and BIR/tax-compliance lines are §9-SAFE financial-capacity
  // facts (NOT numbered licenses — those live in lib/content/accreditations.ts).
  canonicalFacts: [
    "JC Electrofields Power System, Inc. (JCE) was founded in 1997 and is headquartered in Valenzuela City, Metro Manila, Philippines.",
    "JCE designs and constructs power substations and transmission lines up to 230 KV nationwide.",
    "JCE is the exclusive Philippine distributor of Shenda Electric power transformers.",
    "JCE supports solar and other renewable-energy projects through pre-development and engineering consultancy, and delivers the substation and grid-interconnection works that bring them online.",
    "JCE facilitates NGCP direct-connection projects via 69 KV, from application through to connection.",
    "JCE employs approximately 124 engineers and technicians.",
    "JCE has an authorized capital stock of ₱1,000,000,000, reflecting its financial capacity for large-scale power projects.",
    "JCE is BIR-registered and tax-compliant, holding a current Tax Clearance Certificate.",
    "JCE is led by its President, Engr. Jimwel C. Capillo.",
  ],
  // Section eyebrows + headings for the inline About blocks — relocated VERBATIM
  // from page.tsx so copy lives with content (AB-HIST-01 / AB-MISS-02 / AB-LIC-03
  // / AB-FACT-03). The section BODIES already live in ABOUT / LICENSES; these are
  // only their headers. Wording unchanged (the JSX `&amp;` was entity-encoding —
  // a literal `&` here renders identically).
  headers: {
    history: {
      eyebrow: "Since 1997",
      heading: "From repair & fabrication to the national grid.",
    },
    mission: { eyebrow: "Mission & commitment" },
    licenses: {
      eyebrow: "Credentials",
      heading: "Licenses & accreditations",
      note: "Complete documentation available upon request for bidding and accreditation purposes.",
    },
    facts: { eyebrow: "The facts", heading: "JCE at a glance" },
  },
  // ---- "Who we are / our HQ" band ---------------------------------------------
  // The established-and-substantial beat. Every fact is the §9-SAFE set already on
  // the page — no new claims. The HQ still is the page hero (priority LCP, single
  // next/image instance → no src collision); this band shows the same building
  // from the air via a muted decorative aerial loop (static poster under reduced
  // motion). Copy is drawn only from the existing safe facts.
  hq: {
    eyebrow: "Our home base",
    heading: "An established Filipino power-engineering firm.",
    body: "Since 1997, JC Electrofields has grown from repair-and-fabrication work into a major contractor and supplier to the energy sector. From our headquarters in Valenzuela City, our engineers run projects nationwide — across Luzon, Visayas and Mindanao.",
    facts: ["Established 1997", "Valenzuela City HQ", "Projects nationwide"],
    video: {
      src: "/home/office-aerial.mp4",
      poster: "/home/office-aerial-poster.webp",
    },
  },
  // ---- "Our people" band (real crew photography) ------------------------------
  // The human layer: directly-employed crews. Portraits are 1200×1600 (3:4) — the
  // band designs for that aspect. "About 124" matches the existing headcount fact
  // (no new claim). Team shot is the 16:9 aerial group (distinct from the home band).
  people: {
    eyebrow: "Our people",
    heading: "The hands behind the current.",
    body: "No subcontracted shortcuts. Our directly-employed engineers, linemen and technicians — over 124 strong — build, test and energize every project, from foundation to handover.",
    portraits: [
      {
        img: "/home/crew-carrying-materials-portrait.webp",
        alt: "A JC Electrofields worker carrying materials on-site past substation equipment",
      },
      {
        img: "/home/crew-rebar-cage-trench-portrait.webp",
        alt: "A JC Electrofields worker tying a steel rebar cage inside a deep foundation trench",
      },
      {
        img: "/home/crew-hauling-bucket-portrait.webp",
        alt: "A JC Electrofields worker hauling a bucket of material across a sunlit construction site",
      },
    ],
    team: {
      img: "/home/team-group-substation-aerial.webp",
      alt: "The JC Electrofields team gathered together inside a completed substation switchyard",
    },
  },
  // ---- History-section imagery (real JCE field photo; no new claims) ----------
  // The Sagada still has its baked-in geotag caption cropped off (1800×1260); no
  // voltage is asserted for it (none is verifiable).
  historyImages: [
    {
      img: "/home/transformer-install-sagada.jpg",
      alt: "JC Electrofields crew installing a large power transformer at a mountain substation in Sagada",
      cap: "Power-transformer installation",
      loc: "Sagada, Cordillera",
    },
  ],
  // ---- Mission-section imagery (ties to the §9-SAFE Shenda distributorship) ----
  missionImage: {
    img: "/home/substation-shenda-transformer-engineer.webp",
    alt: "A JC Electrofields engineer beside a Shenda Electric power transformer at a substation, rice fields behind",
    // Overlay labels for the mission image — relocated verbatim from page.tsx
    // (AB-MISS-02).
    tag: "Shenda Electric",
    caption: "Exclusive Philippine distributor",
  },
} as const;

// Shared closing-CTA copy (the About page's CTA). The home/services CTAs are
// near-identical and MAY adopt this constant in a follow-up; only About consumes
// it now. Relocated verbatim from page.tsx (AB-CTA-01) — pure content-from-logic.
export const CONTACT_CTA = {
  eyebrow: "Get in touch",
  heading: "Talk to the engineers behind the work.",
  body: "Send a project brief — utility, developer, or industrial — and we’ll respond inside one business day.",
  action: "Start a project",
  href: "/contact-us",
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

// Curated PROJECT/TECHNICAL showcase only (title typo/casing lightly normalized
// for display). The "JCE Christmas Party 2025" clip was removed from the curated
// trio (AB-VID-02) — it still surfaces automatically in the live "Latest from our
// channel" strip, which de-dupes against this set.
export const ABOUT_VIDEOS: readonly AboutVideo[] = [
  { id: "7K6cMIvBnmo", title: "69 kV transmission line and substation" },
  { id: "SerRpr5E_AA", title: "JCE Projects" },
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
