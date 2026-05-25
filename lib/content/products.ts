export type ProductLine = {
  name: string;
  voltageRange?: string;
  spec: string;
};

export const PRODUCT_LINES: readonly ProductLine[] = [
  {
    name: "Power Transformer",
    voltageRange: "230 kV – 15 kV",
    spec: "High-voltage substation transformer for transmission and distribution applications.",
  },
  {
    name: "Distribution Transformer",
    voltageRange: "Up to 35 kV",
    spec: "Pole-mount and pad-mount distribution transformers for utility and industrial use.",
  },
  {
    name: "Current Transformer",
    spec: "Measurement and protection CTs for metering, relays, and SCADA systems.",
  },
  {
    name: "Potential Transformer",
    spec: "Voltage transformers for protective relay and metering circuits.",
  },
  {
    name: "Disconnect Switch",
    spec: "Air-break and load-break switches for substation isolation.",
  },
  {
    name: "SF-6 Power Breaker",
    spec: "Gas-insulated circuit breakers for transmission-class substations.",
  },
  {
    name: "Capacitor Bank",
    spec: "Shunt capacitor banks for reactive-power compensation and voltage support.",
  },
  {
    name: "Recloser",
    spec: "Automatic feeder recloser for distribution fault isolation.",
  },
  {
    name: "Power Cables",
    spec: "Medium- and high-voltage cables for substation and distribution feeders.",
  },
  {
    name: "Panel Boards",
    spec: "Industrial panel boards for plant electrical distribution.",
  },
  {
    name: "HVSG / MVSG / LVSG",
    spec: "In-house design, fabrication, and assembly of high-, medium-, and low-voltage switchgear.",
  },
  {
    name: "Lightning Arrester",
    spec: "Surge protection for substation and line equipment.",
  },
  {
    name: "Pole Line Hardware",
    spec: "Insulators, cross-arms, hardware for overhead distribution.",
  },
  {
    name: "Air Circuit Breaker (ACB)",
    spec: "Low-voltage circuit breakers for industrial main distribution panels.",
  },
  {
    name: "Power Circuit Breaker (PCB)",
    spec: "Medium- and high-voltage circuit breakers for substation feeders.",
  },
] as const;

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
