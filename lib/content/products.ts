export type ProductLine = {
  name: string;
  voltageRange?: string;
  spec: string;
};

// PRODUCT_LINES (the prior 15-item product source) was REMOVED 2026-06-04 during
// the content reconciliation: the authoritative product list now lives in PRODUCTS
// (lib/content/website.ts) as the 16 canonical company-profile items, and that is
// what the Products page renders (web-products-grid). PRODUCT_LINES was confirmed
// unused (no importer). The `ProductLine` type above is RETAINED — it is still
// imported as a prop type by the (currently unrendered) ProductLineGrid component.
//
// FLAGGED, NOT DELETED: SCOPE_OF_WORK / CONSULTING_SCOPE / PROCESS_STEPS below are
// likewise not yet rendered (their components ScopeOfWorkList / ConsultingScope /
// ProcessTimeline exist but aren't mounted on any page). They are kept as
// possibly-wanted content for a future consultancy/process page — a later decision.

export type ScopeItem = {
  number: string;
  title: string;
  body: string;
};

export const SCOPE_OF_WORK: readonly ScopeItem[] = [
  {
    number: "01",
    title: "Electrical consulting, billing, and optimization.",
    body: "Independent review of plant electrical systems with rectification scopes.",
  },
  {
    number: "02",
    title: "Transmission lines up to 138 kV.",
    body: "Design, construction, testing, and commissioning.",
  },
  {
    number: "03",
    title: "Power substations up to 138 kV.",
    body: "Design, construction, testing, and commissioning.",
  },
  {
    number: "04",
    title: "Direct connection to NGCP via 69 kV lines.",
    body: "Application, study coordination, and physical connection.",
  },
  {
    number: "05",
    title: "Automation and controls.",
    body: "SCADA, PLC, and protection and control panel engineering.",
  },
  {
    number: "06",
    title: "Control wiring and motor controls.",
    body: "Industrial process electrical works.",
  },
  {
    number: "07",
    title: "HVSG, MVSG, LVSG fabrication.",
    body: "In-house design, fabrication, and assembly of switchgear.",
  },
  {
    number: "08",
    title: "Substation maintenance and servicing.",
    body: "Preventive and corrective maintenance programs.",
  },
  {
    number: "09",
    title: "Plant electrical maintenance and servicing.",
    body: "Industrial sites under continuous service contracts.",
  },
] as const;

export type ConsultingItem = {
  eyebrow: string;
  title: string;
  body: string;
};

export const CONSULTING_SCOPE: readonly ConsultingItem[] = [
  {
    eyebrow: "DOE FIT",
    title: "FIT preparation and application.",
    body: "End-to-end documentation for the Department of Energy service contract and Feed-in-Tariff application.",
  },
  {
    eyebrow: "NGCP studies",
    title: "Systems Impact and Facility Study.",
    body: "Preparation and execution of NGCP Systems Impact Study and Facility Study reports — including coordination and technical connection compliance.",
  },
  {
    eyebrow: "ERC approval",
    title: "Point-to-point approval.",
    body: "Presentation and application support through Energy Regulatory Commission point-to-point approval.",
  },
] as const;

export type ProcessStep = {
  n: string;
  title: string;
  body: string;
};

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    n: "01",
    title: "Study",
    body: "Systems impact, facility, and feasibility studies for the project envelope.",
  },
  {
    n: "02",
    title: "Permitting",
    body: "FIT, ERC, NGCP, and local government documentation handled in-house.",
  },
  {
    n: "03",
    title: "Design",
    body: "Front-end engineering, single-line diagrams, and protection schemes.",
  },
  {
    n: "04",
    title: "Commissioning",
    body: "Construction, testing, energisation, and connection compliance.",
  },
  {
    n: "05",
    title: "Handover",
    body: "Documentation, training, and optional ongoing maintenance contract.",
  },
] as const;
