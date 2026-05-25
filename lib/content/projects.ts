export type ProjectCategory = "solar" | "distribution" | "ngcp";

export type ProjectScope =
  | "supply"
  | "delivery"
  | "installation"
  | "testing"
  | "commissioning"
  | "design"
  | "fabrication"
  | "assembly"
  | "dismantling"
  | "uprating";

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectCapacity = {
  value: number;
  unit: "MWp" | "MVA" | "MVAR" | "kV";
};

export type Project = {
  slug: string;
  category: ProjectCategory;
  name: string;
  location: string;
  client?: string;
  capacity?: ProjectCapacity;
  voltage?: string;
  scope: readonly ProjectScope[];
  year?: number;
  summary: string;
  gallery: readonly ProjectImage[];
};

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  solar: "Solar Farm",
  distribution: "Distribution Utility",
  ngcp: "Projects under NGCP",
};

export const CATEGORY_HREF: Record<ProjectCategory, string> = {
  solar: "/projects/solar-farm",
  distribution: "/projects/distribution-utility",
  ngcp: "/projects/ngcp",
};

const STANDARD_SCOPE: readonly ProjectScope[] = [
  "supply",
  "delivery",
  "installation",
  "testing",
  "commissioning",
] as const;

export const SOLAR_PROJECTS: readonly Project[] = [
  {
    slug: "alaminos-gigasol",
    category: "solar",
    name: "Gigasol Solar Farm",
    location: "Alaminos, Laguna",
    client: "Gigasol",
    capacity: { value: 120, unit: "MWp" },
    scope: STANDARD_SCOPE,
    summary: "Utility-scale photovoltaic generation for Gigasol in Laguna.",
    gallery: [],
  },
  {
    slug: "palauig-zambales",
    category: "solar",
    name: "Palauig Solar Farm",
    location: "Palauig, Zambales",
    scope: STANDARD_SCOPE,
    summary: "Solar generation site on the Zambales coast.",
    gallery: [],
  },
  {
    slug: "san-carlos-negros",
    category: "solar",
    name: "San Carlos City Solar Farm",
    location: "San Carlos City, Negros Occidental",
    scope: STANDARD_SCOPE,
    summary: "PV array commissioning in Negros Occidental.",
    gallery: [],
  },
  {
    slug: "dolores-ormoc",
    category: "solar",
    name: "Dolores Solar Farm",
    location: "Dolores, Ormoc City, Leyte",
    scope: STANDARD_SCOPE,
    summary: "Solar farm in the Eastern Visayas.",
    gallery: [],
  },
  {
    slug: "isla-valenzuela",
    category: "solar",
    name: "Brgy. Isla Urban Solar Farm",
    location: "Brgy. Isla, Valenzuela City",
    capacity: { value: 27, unit: "MWp" },
    scope: STANDARD_SCOPE,
    summary:
      "The Philippines' first largest urban solar farm — built on a constrained metropolitan footprint.",
    gallery: [],
  },
  {
    slug: "tagalag-valenzuela",
    category: "solar",
    name: "Brgy. Tagalag Solar Farm",
    location: "Brgy. Tagalag, Valenzuela City",
    scope: STANDARD_SCOPE,
    summary: "Urban-fringe PV installation in Valenzuela.",
    gallery: [],
  },
  {
    slug: "labuagon-bukidnon",
    category: "solar",
    name: "Labuagon Solar Farm",
    location: "Labuagon, Kibawe, Bukidnon",
    scope: STANDARD_SCOPE,
    summary: "Mindanao solar generation site.",
    gallery: [],
  },
  {
    slug: "curimao-ilocos-norte",
    category: "solar",
    name: "Curimao Solar Farm",
    location: "Curimao, Ilocos Norte",
    scope: STANDARD_SCOPE,
    summary: "Northern Luzon solar installation.",
    gallery: [],
  },
] as const;

export const DISTRIBUTION_PROJECTS: readonly Project[] = [
  {
    slug: "agoo-la-union-luelco",
    category: "distribution",
    name: "Agoo Substation",
    location: "Agoo, La Union",
    client: "LUELCO",
    scope: ["design", "supply", "installation", "testing", "commissioning"],
    summary: "Distribution substation for the La Union Electric Cooperative.",
    gallery: [],
  },
  {
    slug: "sison-pangasinan-luelco",
    category: "distribution",
    name: "Sison Substation",
    location: "Sison, Pangasinan",
    client: "LUELCO",
    scope: ["design", "supply", "installation", "testing", "commissioning"],
    summary:
      "Substation EPC supporting LUELCO's distribution network in Pangasinan.",
    gallery: [],
  },
  {
    slug: "dmpc-step-up",
    category: "distribution",
    name: "DMPC Step-up Substation",
    location: "Philippines",
    client: "DMPC",
    scope: ["design", "supply", "installation", "testing", "commissioning"],
    summary: "Step-up substation for industrial generation interconnect.",
    gallery: [],
  },
  {
    slug: "mopreco-uprating",
    category: "distribution",
    name: "MOPRECO Uprating",
    location: "Philippines",
    client: "MOPRECO",
    scope: ["uprating", "testing", "commissioning"],
    summary: "Capacity uprating for MOPRECO distribution assets.",
    gallery: [],
  },
  {
    slug: "quiling-norte-batac-inec",
    category: "distribution",
    name: "Quiling Norte Substation",
    location: "Brgy. Quiling Norte, Batac, Ilocos Norte",
    client: "INEC",
    scope: ["design", "supply", "installation", "testing", "commissioning"],
    summary:
      "Distribution substation for the Ilocos Norte Electric Cooperative.",
    gallery: [],
  },
  {
    slug: "general-santos-tambler-caap",
    category: "distribution",
    name: "Tambler International Airport Substation",
    location: "General Santos, South Cotabato",
    client: "CAAP",
    scope: ["design", "supply", "installation", "testing", "commissioning"],
    summary:
      "Airport substation for the Civil Aviation Authority of the Philippines.",
    gallery: [],
  },
  {
    slug: "san-carlos-25mva",
    category: "distribution",
    name: "San Carlos 25 MVA Substation",
    location: "San Carlos City, Negros Occidental",
    capacity: { value: 25, unit: "MVA" },
    voltage: "69 kV / 13.2 kV",
    scope: ["design", "supply", "installation", "testing", "commissioning"],
    summary: "25 MVA, 69 kV / 13.2 kV substation in Negros Occidental.",
    gallery: [],
  },
  {
    slug: "aborlan-palawan-dmci",
    category: "distribution",
    name: "Aborlan Substation",
    location: "Aborlan, Palawan",
    client: "DMCI Power Corp.",
    scope: ["design", "supply", "installation", "testing", "commissioning"],
    summary: "Substation EPC for DMCI Power in Palawan.",
    gallery: [],
  },
] as const;

export const NGCP_PROJECTS: readonly Project[] = [
  {
    slug: "laoag",
    category: "ngcp",
    name: "Laoag Substation",
    location: "Laoag, Ilocos Norte",
    client: "NGCP",
    capacity: { value: 50, unit: "MVA" },
    voltage: "115 kV / 69 kV / 13.8 kV",
    scope: ["installation", "testing", "commissioning"],
    summary: "50 MVA transmission substation in Laoag.",
    gallery: [],
  },
  {
    slug: "cabanatuan-luzon-expansion-i",
    category: "ngcp",
    name: "Cabanatuan Substation — Luzon Grid Expansion I",
    location: "Cabanatuan, Nueva Ecija",
    client: "NGCP",
    capacity: { value: 100, unit: "MVA" },
    voltage: "230 kV / 69 kV / 13.8 kV",
    scope: ["installation", "testing", "commissioning"],
    summary: "100 MVA substation for Luzon Grid Expansion I.",
    gallery: [],
  },
  {
    slug: "cabanatuan-300mva",
    category: "ngcp",
    name: "Cabanatuan Substation — Transformer Assembly",
    location: "Cabanatuan, Nueva Ecija",
    client: "NGCP",
    capacity: { value: 300, unit: "MVA" },
    voltage: "230 kV / 69 kV / 13.8 kV",
    scope: ["assembly", "testing", "commissioning"],
    summary: "300 MVA transformer assembly at Cabanatuan substation.",
    gallery: [],
  },
  {
    slug: "bauang-switchyard",
    category: "ngcp",
    name: "Bauang Substation — Switchyard",
    location: "Bauang, La Union",
    client: "NGCP",
    capacity: { value: 100, unit: "MVA" },
    voltage: "230 kV / 69 kV / 13.8 kV",
    scope: ["dismantling", "assembly", "testing", "commissioning"],
    summary:
      "100 MVA switchyard dismantling and assembly at Bauang substation.",
    gallery: [],
  },
  {
    slug: "binan-luzon-expansion-i",
    category: "ngcp",
    name: "Biñan Substation — Transformer Testing",
    location: "Biñan, Laguna",
    client: "NGCP",
    capacity: { value: 300, unit: "MVA" },
    voltage: "230 kV / 115 kV / 13.8 kV",
    scope: ["testing", "commissioning"],
    summary: "300 MVA transformer testing for Luzon Grid Expansion I.",
    gallery: [],
  },
  {
    slug: "mexico-shunt-capacitor",
    category: "ngcp",
    name: "Mexico Substation — Shunt Capacitor",
    location: "Mexico, Pampanga",
    client: "NGCP",
    capacity: { value: 400, unit: "MVAR" },
    voltage: "230 kV",
    scope: ["installation", "testing", "commissioning"],
    summary:
      "Luzon Voltage Improvement Project 3 — 4 × 100 MVAR shunt capacitor bank.",
    gallery: [],
  },
  {
    slug: "dasmarinas-shunt-capacitor",
    category: "ngcp",
    name: "Dasmariñas Substation — Shunt Capacitor",
    location: "Dasmariñas, Cavite",
    client: "NGCP",
    capacity: { value: 400, unit: "MVAR" },
    voltage: "230 kV",
    scope: ["installation", "testing", "commissioning"],
    summary:
      "Luzon Voltage Improvement Project 4 — 4 × 100 MVAR shunt capacitor bank.",
    gallery: [],
  },
  {
    slug: "calatrava-submarine-cable",
    category: "ngcp",
    name: "Calatrava — Cebu-Negros-Panay Backbone Stage 1",
    location: "Calatrava, Negros Occidental",
    client: "NGCP",
    voltage: "230 kV",
    scope: ["installation", "testing", "commissioning"],
    summary:
      "Stage 1 submarine-cable substation for the Cebu-Negros-Panay 230 kV backbone.",
    gallery: [],
  },
] as const;

export const ALL_PROJECTS: readonly Project[] = [
  ...SOLAR_PROJECTS,
  ...DISTRIBUTION_PROJECTS,
  ...NGCP_PROJECTS,
] as const;

export const PROJECTS_BY_CATEGORY: Record<ProjectCategory, readonly Project[]> =
  {
    solar: SOLAR_PROJECTS,
    distribution: DISTRIBUTION_PROJECTS,
    ngcp: NGCP_PROJECTS,
  };

export function formatCapacity(c?: ProjectCapacity): string | null {
  if (!c) return null;
  return `${c.value} ${c.unit}`;
}

export function formatScope(scope: readonly ProjectScope[]): string {
  if (scope.length === 0) return "";
  const titled = scope.map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  if (titled.length === 1) return titled[0]!;
  return titled.slice(0, -1).join(", ") + ", and " + titled[titled.length - 1];
}

export const PORTFOLIO_TOTALS = {
  solar: {
    count: SOLAR_PROJECTS.length,
    mwp:
      SOLAR_PROJECTS.reduce(
        (sum, p) => sum + (p.capacity?.unit === "MWp" ? p.capacity.value : 0),
        0,
      ) || null,
  },
  distribution: {
    count: DISTRIBUTION_PROJECTS.length,
  },
  ngcp: {
    count: NGCP_PROJECTS.length,
  },
} as const;
