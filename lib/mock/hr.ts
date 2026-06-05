// ============================================================================
// JCE SYSTEM — HR module fixtures (Part 4). Ported from hr-data.jsx (+ helpers
// from hr-employees / hr-time / hr-requests).
//
// Two patterns coexist here:
//   • Pure as-const reference data — EMPLOYEES, ARCHIVED, TIME_ROWS, REQUESTS …
//   • A small MUTABLE batch store (verify/re-open) so a Verified timekeeping
//     batch survives across routes and Part 5 (Accounting payroll) can read it —
//     mirrors lib/mock/inquiries.ts.
//
// The Working-Project list (H5/H8/H9) is ALIGNED to the canonical SALES_ORDERS
// registry in lib/mock/bdd.ts (no parallel SO# list) plus the internal
// cost-centres (Workshop / Motorpool). UI/UX mock only — no backend.
// ============================================================================

import { SALES_ORDERS, SO_STATUS_OPTIONS, type Tone } from "@/lib/mock/bdd";

// Compensation is sensitive — masked for every role except Payroll + Owner.
// Single source of truth lives in rbac; re-exported so HR screens import locally.
export { CAN_SEE_COMP } from "@/lib/rbac";

/** Fixed "today" so derived values (years of service, age, contract months,
 * expiry flags) are deterministic — matches the prototype anchor. */
export const HR_TODAY = "2026-06-03";

const MS_DAY = 1000 * 60 * 60 * 24;

/**
 * Add n calendar months to a YYYY-MM-DD date (n may be negative), clamping the
 * day to the target month's last day on overflow (2026-01-31 +1 → 2026-02-28).
 * Deterministic — no Date.now in the path; the contract-renewal computation.
 */
export function addMonths(date: string, n: number): string {
  const parts = date.split("-");
  const y = Number(parts[0] ?? "0");
  const m0 = Number(parts[1] ?? "1") - 1; // 0-based source month
  const d = Number(parts[2] ?? "1");
  const total = m0 + n;
  const ty = y + Math.floor(total / 12);
  const tm = ((total % 12) + 12) % 12; // 0-based target month
  const lastDay = new Date(Date.UTC(ty, tm + 1, 0)).getUTCDate();
  const td = Math.min(d, lastDay);
  return `${ty}-${String(tm + 1).padStart(2, "0")}-${String(td).padStart(2, "0")}`;
}

// ---- Employees -------------------------------------------------------------
export type SalaryCategory = "Daily" | "Weekly" | "Monthly";
export type EmployeeType = "Regular" | "Contractual";

export type Compensation = {
  cat: SalaryCategory;
  daily: number | "—";
  monthly: number | "—";
  allowance: number;
  dutyMeal: number;
  project: number;
};

export type Employee = {
  id: number;
  /** running number within the Salary Rate Category group */
  sn: number;
  no: string;
  name: string;
  bio: string;
  pos: string;
  assign: string;
  cat: SalaryCategory;
  status: string;
  hired: string;
  type: EmployeeType;
  contractEnd?: string;
  birthday: string;
  gender: string;
  contact: string;
  address: string;
  sss: string;
  pagibig: string;
  philhealth: string;
  tin: string;
  emName: string;
  emNum: string;
  /** enrolled status ("Yes" / "No") */
  insurance: string;
  /** insurance enrollment detail — present when insurance === "Yes" */
  insProvider?: string;
  insPolicyNo?: string;
  /** YYYY-MM-DD */
  insEnrolled?: string;
  /** YYYY-MM-DD */
  insExpiry?: string;
  vaccinated: string;
  atm: string;
  atmExp: string;
  remarks: string;
  comp: Compensation;
};

// The 12 hand-authored employees (kept FIRST, lowest ids/sn). A deterministic
// generator appends ~100 more below to exercise the H1 list + dashboard at scale.
const EMPLOYEES_BASE: readonly Employee[] = [
  // ---- MONTHLY ----
  {
    id: 1,
    sn: 1,
    no: "JCE 00001",
    name: "Jose A. Cruz",
    bio: "1001",
    pos: "President / Owner",
    assign: "Main Office",
    cat: "Monthly",
    status: "Regular",
    hired: "1997-03-10",
    type: "Regular",
    birthday: "1962-08-14",
    gender: "Male",
    contact: "0917-100-0001",
    address: "Valenzuela City",
    sss: "03-1234567-8",
    pagibig: "1020-1111-2222",
    philhealth: "02-251111111-1",
    tin: "123-456-789-000",
    emName: "Maria Cruz",
    emNum: "0917-200-0001",
    insurance: "Yes",
    vaccinated: "Yes",
    atm: "00123456789",
    atmExp: "2028-08",
    remarks: "—",
    comp: {
      cat: "Monthly",
      daily: "—",
      monthly: 120000,
      allowance: 25000,
      dutyMeal: 0,
      project: 0,
    },
  },
  {
    id: 2,
    sn: 2,
    no: "JCE 00007",
    name: "Carlos M. Mendoza",
    bio: "1007",
    pos: "Project Manager (PM Head)",
    assign: "26-05-378 · 13.2KV Distribution Line",
    cat: "Monthly",
    status: "Regular",
    hired: "2009-06-01",
    type: "Regular",
    birthday: "1979-02-20",
    gender: "Male",
    contact: "0917-100-0007",
    address: "Bulacan",
    sss: "03-2234567-8",
    pagibig: "1020-3333-4444",
    philhealth: "02-252222222-2",
    tin: "223-456-789-000",
    emName: "Rosa Mendoza",
    emNum: "0917-200-0007",
    insurance: "Yes",
    vaccinated: "Yes",
    atm: "00723456789",
    atmExp: "2027-06",
    remarks: "—",
    comp: {
      cat: "Monthly",
      daily: "—",
      monthly: 78000,
      allowance: 12000,
      dutyMeal: 0,
      project: 8000,
    },
  },
  {
    id: 3,
    sn: 3,
    no: "JCE 00009",
    name: "Ana L. Reyes",
    bio: "1009",
    pos: "CFO / Accounting Lead",
    assign: "Main Office",
    cat: "Monthly",
    status: "Regular",
    hired: "2011-01-15",
    type: "Regular",
    birthday: "1982-11-03",
    gender: "Female",
    contact: "0917-100-0009",
    address: "Quezon City",
    sss: "03-3234567-8",
    pagibig: "1020-5555-6666",
    philhealth: "02-253333333-3",
    tin: "323-456-789-000",
    emName: "Luis Reyes",
    emNum: "0917-200-0009",
    insurance: "Yes",
    vaccinated: "Yes",
    atm: "00923456789",
    atmExp: "2029-01",
    remarks: "—",
    comp: {
      cat: "Monthly",
      daily: "—",
      monthly: 85000,
      allowance: 15000,
      dutyMeal: 0,
      project: 0,
    },
  },
  {
    id: 4,
    sn: 4,
    no: "JCE 00014",
    name: "Maria T. Santos",
    bio: "1014",
    pos: "HR Head",
    assign: "Main Office",
    cat: "Monthly",
    status: "Regular",
    hired: "2013-09-02",
    type: "Regular",
    birthday: "1985-05-19",
    gender: "Female",
    contact: "0917-100-0014",
    address: "Caloocan",
    sss: "03-4234567-8",
    pagibig: "1020-7777-8888",
    philhealth: "02-254444444-4",
    tin: "423-456-789-000",
    emName: "Pedro Santos",
    emNum: "0917-200-0014",
    insurance: "Yes",
    vaccinated: "Yes",
    atm: "01423456789",
    atmExp: "2027-09",
    remarks: "—",
    comp: {
      cat: "Monthly",
      daily: "—",
      monthly: 62000,
      allowance: 10000,
      dutyMeal: 0,
      project: 0,
    },
  },
  {
    id: 5,
    sn: 5,
    no: "JCE 00055",
    name: "Paolo R. Garcia",
    bio: "1055",
    pos: "Site Engineer",
    assign: "26-05-378 · 13.2KV Distribution Line",
    cat: "Monthly",
    status: "Regular",
    hired: "2019-04-22",
    type: "Regular",
    birthday: "1991-07-08",
    gender: "Male",
    contact: "0917-100-0055",
    address: "Bulacan",
    sss: "03-5234567-8",
    pagibig: "1020-9999-0000",
    philhealth: "02-255555555-5",
    tin: "523-456-789-000",
    emName: "Jen Garcia",
    emNum: "0917-200-0055",
    insurance: "Yes",
    vaccinated: "Yes",
    atm: "05523456789",
    atmExp: "2026-12",
    remarks: "On-site · 26-05-378",
    comp: {
      cat: "Monthly",
      daily: "—",
      monthly: 48000,
      allowance: 9000,
      dutyMeal: 0,
      project: 6000,
    },
  },
  // ---- WEEKLY ----
  {
    id: 6,
    sn: 1,
    no: "JCE 00031",
    name: "Ramon D. dela Cruz",
    bio: "2031",
    pos: "Lead Electrician",
    assign: "26-04-355 · Cavite 69KV Transmission Line",
    cat: "Weekly",
    status: "Regular",
    hired: "2016-02-11",
    type: "Regular",
    birthday: "1988-12-01",
    gender: "Male",
    contact: "0917-100-0031",
    address: "Cavite",
    sss: "03-6234567-8",
    pagibig: "1021-1111-2222",
    philhealth: "02-256666666-6",
    tin: "623-456-789-000",
    emName: "Cora dela Cruz",
    emNum: "0917-200-0031",
    insurance: "Yes",
    vaccinated: "Yes",
    atm: "03123456789",
    atmExp: "2027-02",
    remarks: "—",
    comp: {
      cat: "Weekly",
      daily: 1050,
      monthly: "—",
      allowance: 0,
      dutyMeal: 150,
      project: 0,
    },
  },
  {
    id: 7,
    sn: 2,
    no: "JCE 00048",
    name: "Ivan B. Morales",
    bio: "2048",
    pos: "Electrician",
    assign: "26-04-355 · Cavite 69KV Transmission Line",
    cat: "Weekly",
    status: "Suspended",
    hired: "2018-07-30",
    type: "Regular",
    birthday: "1993-03-25",
    gender: "Male",
    contact: "0917-100-0048",
    address: "Cavite",
    sss: "03-7234567-8",
    pagibig: "1021-3333-4444",
    philhealth: "02-257777777-7",
    tin: "723-456-789-000",
    emName: "Lita Morales",
    emNum: "0917-200-0048",
    insurance: "No",
    vaccinated: "Yes",
    atm: "04823456789",
    atmExp: "2026-07",
    remarks: "Suspended — disciplinary",
    comp: {
      cat: "Weekly",
      daily: 900,
      monthly: "—",
      allowance: 0,
      dutyMeal: 150,
      project: 0,
    },
  },
  {
    id: 8,
    sn: 3,
    no: "JCE 00062",
    name: "Danilo P. Aguilar",
    bio: "2062",
    pos: "Helper",
    assign: "Workshop",
    cat: "Weekly",
    status: "On Leave",
    hired: "2021-10-04",
    type: "Regular",
    birthday: "1996-09-12",
    gender: "Male",
    contact: "0917-100-0062",
    address: "Valenzuela City",
    sss: "03-8234567-8",
    pagibig: "1021-5555-6666",
    philhealth: "02-258888888-8",
    tin: "823-456-789-000",
    emName: "Mila Aguilar",
    emNum: "0917-200-0062",
    insurance: "No",
    vaccinated: "Yes",
    atm: "06223456789",
    atmExp: "2027-10",
    remarks: "On VL until 06-09",
    comp: {
      cat: "Weekly",
      daily: 750,
      monthly: "—",
      allowance: 0,
      dutyMeal: 150,
      project: 0,
    },
  },
  // ---- DAILY ----
  {
    id: 9,
    sn: 1,
    no: "JCE 00077",
    name: "Noel V. Bautista",
    bio: "3077",
    pos: "Lineman",
    assign: "26-05-378 · 13.2KV Distribution Line",
    cat: "Daily",
    status: "Regular",
    hired: "2017-05-18",
    type: "Regular",
    birthday: "1990-01-30",
    gender: "Male",
    contact: "0917-100-0077",
    address: "Bulacan",
    sss: "03-9234567-8",
    pagibig: "1022-1111-2222",
    philhealth: "02-259999999-9",
    tin: "923-456-789-000",
    emName: "Aida Bautista",
    emNum: "0917-200-0077",
    insurance: "No",
    vaccinated: "Yes",
    atm: "07723456789",
    atmExp: "2028-05",
    remarks: "—",
    comp: {
      cat: "Daily",
      daily: 720,
      monthly: "—",
      allowance: 0,
      dutyMeal: 120,
      project: 80,
    },
  },
  {
    id: 10,
    sn: 2,
    no: "JCE 00081",
    name: "Roberto S. Villanueva",
    bio: "3081",
    pos: "Welder",
    assign: "Workshop",
    cat: "Daily",
    status: "Probationary",
    hired: "2026-03-03",
    type: "Contractual",
    contractEnd: "2026-09-03",
    birthday: "1995-06-17",
    gender: "Male",
    contact: "0917-100-0081",
    address: "Malabon",
    sss: "04-0234567-8",
    pagibig: "1022-3333-4444",
    philhealth: "02-260000000-0",
    tin: "024-456-789-000",
    emName: "Tess Villanueva",
    emNum: "0917-200-0081",
    insurance: "No",
    vaccinated: "No",
    atm: "08123456789",
    atmExp: "2027-03",
    remarks: "Probationary",
    comp: {
      cat: "Daily",
      daily: 680,
      monthly: "—",
      allowance: 0,
      dutyMeal: 120,
      project: 0,
    },
  },
  {
    id: 11,
    sn: 3,
    no: "JCE 00088",
    name: "Marvin C. Pascual",
    bio: "3088",
    pos: "Driver",
    assign: "Motorpool",
    cat: "Daily",
    status: "Regular",
    hired: "2020-08-14",
    type: "Contractual",
    contractEnd: "2026-11-30",
    birthday: "1987-04-09",
    gender: "Male",
    contact: "0917-100-0088",
    address: "Valenzuela City",
    sss: "04-1234567-8",
    pagibig: "1022-5555-6666",
    philhealth: "02-261111111-1",
    tin: "124-456-789-000",
    emName: "Gina Pascual",
    emNum: "0917-200-0088",
    insurance: "No",
    vaccinated: "Yes",
    atm: "08823456789",
    atmExp: "2027-08",
    remarks: "Contract ends 11-30",
    comp: {
      cat: "Daily",
      daily: 700,
      monthly: "—",
      allowance: 0,
      dutyMeal: 120,
      project: 0,
    },
  },
  {
    id: 12,
    sn: 4,
    no: "JCE 00094",
    name: "Allan G. Tolentino",
    bio: "3094",
    pos: "Lineman",
    assign: "25-11-290 · Solar Farm Tarlac 5MWp",
    cat: "Daily",
    status: "Regular",
    hired: "2022-01-10",
    type: "Contractual",
    contractEnd: "2026-07-10",
    birthday: "1994-10-22",
    gender: "Male",
    contact: "0917-100-0094",
    address: "Tarlac",
    sss: "04-2234567-8",
    pagibig: "1022-7777-8888",
    philhealth: "02-262222222-2",
    tin: "224-456-789-000",
    emName: "Joy Tolentino",
    emNum: "0917-200-0094",
    insurance: "No",
    vaccinated: "Yes",
    atm: "09423456789",
    atmExp: "2026-09",
    remarks: "Contract ends 07-10",
    comp: {
      cat: "Daily",
      daily: 720,
      monthly: "—",
      allowance: 0,
      dutyMeal: 120,
      project: 80,
    },
  },
];

// ---- Deterministic roster fill (scale to 100+; additive) -------------------
// Appends ~100 generated employees on top of the 12 hand-authored ones so H1 /
// the HR dashboard / the timekeeping picker exercise a realistic roster. EVERY
// field derives from the index — NO Math.random / Date.now — so years of
// service, age and the contract-expiry KPI stay stable across builds (HR_TODAY
// anchor). Generated nos/bios start well past the seed (no collisions), and the
// sensitive IDs are obviously synthetic ("SYN-…"); CAN_SEE_COMP masking still
// applies. The 12 above keep the lowest ids/sn.
const GEN_COUNT = 100;

const GEN_FIRST = [
  "Juan",
  "Mateo",
  "Lucas",
  "Gabriel",
  "Rafael",
  "Miguel",
  "Andres",
  "Diego",
  "Emilio",
  "Tomas",
  "Ramon",
  "Felipe",
  "Ignacio",
  "Vicente",
  "Joaquin",
  "Marcos",
  "Cesar",
  "Eduardo",
  "Fernando",
  "Maria",
] as const;
const GEN_LAST = [
  "Reyes",
  "Cruz",
  "Bautista",
  "Ocampo",
  "Ramos",
  "Mercado",
  "Aquino",
  "del Rosario",
  "Salazar",
  "Castillo",
  "Navarro",
  "Velasco",
  "Pascual",
  "Domingo",
  "Espinosa",
  "Gutierrez",
  "Rivera",
  "Flores",
  "Mariano",
  "Tan",
] as const;
const GEN_ASSIGNS = [
  "26-05-378 · 13.2KV Distribution Line",
  "26-04-355 · Cavite 69KV Transmission Line",
  "25-11-290 · Solar Farm Tarlac 5MWp",
  "Main Office",
  "Workshop",
  "Motorpool",
] as const;
const GEN_ADDRESS = [
  "Bulacan",
  "Cavite",
  "Tarlac",
  "Valenzuela City",
  "Caloocan",
  "Malabon",
  "Quezon City",
  "Pampanga",
] as const;
// Daily-heavy distribution (6 / 2 / 2 per 10).
const GEN_CAT: readonly SalaryCategory[] = [
  "Daily",
  "Daily",
  "Daily",
  "Weekly",
  "Daily",
  "Monthly",
  "Daily",
  "Weekly",
  "Daily",
  "Monthly",
];
const GEN_POS: Record<SalaryCategory, readonly string[]> = {
  Daily: [
    "Lineman",
    "Helper",
    "Welder",
    "Driver",
    "Rigger",
    "Electrician's Aide",
  ],
  Weekly: [
    "Electrician",
    "Lead Electrician",
    "Foreman",
    "Mechanic",
    "Crew Lead",
  ],
  Monthly: [
    "Site Engineer",
    "Project Engineer",
    "Admin Staff",
    "Safety Officer",
    "Purchasing Officer",
    "Accounting Staff",
  ],
};

function gpad(n: number, w = 4): string {
  return String(n).padStart(w, "0");
}

function genComp(cat: SalaryCategory, i: number): Compensation {
  if (cat === "Monthly")
    return {
      cat,
      daily: "—",
      monthly: 40000 + (i % 10) * 3000,
      allowance: 8000 + (i % 4) * 2000,
      dutyMeal: 0,
      project: i % 2 === 0 ? 6000 : 0,
    };
  if (cat === "Weekly")
    return {
      cat,
      daily: 800 + (i % 5) * 60,
      monthly: "—",
      allowance: 0,
      dutyMeal: 150,
      project: 0,
    };
  return {
    cat,
    daily: 600 + (i % 6) * 40,
    monthly: "—",
    allowance: 0,
    dutyMeal: 120,
    project: i % 3 === 0 ? 80 : 0,
  };
}

function generateEmployees(): Employee[] {
  // Continue the running S/N within each category past the seed (Daily 4 / Weekly
  // 3 / Monthly 5 already used).
  const sn: Record<SalaryCategory, number> = {
    Daily: 4,
    Weekly: 3,
    Monthly: 5,
  };
  const out: Employee[] = [];
  for (let i = 0; i < GEN_COUNT; i += 1) {
    const cat = GEN_CAT[i % GEN_CAT.length] ?? "Daily";
    sn[cat] += 1;
    const first = GEN_FIRST[i % GEN_FIRST.length] ?? "Juan";
    const last = GEN_LAST[(i * 3 + 1) % GEN_LAST.length] ?? "Cruz";
    const posPool = GEN_POS[cat];
    const pos = posPool[i % posPool.length] ?? "Staff";
    const contractual = i % 5 === 0;
    const expiringSoon = contractual && i % 2 === 0; // ~10 expiring < 6 months
    const contractEnd = contractual
      ? expiringSoon
        ? "2026-09-30"
        : "2027-08-31"
      : undefined;
    const status =
      i % 23 === 0
        ? "Suspended"
        : i % 19 === 0
          ? "On Leave"
          : i % 17 === 0
            ? "Probationary"
            : "Regular";
    out.push({
      id: 13 + i,
      sn: sn[cat],
      no: `JCE 0${1000 + i}`,
      name: `${first} ${last}`,
      bio: String(4000 + i),
      pos,
      assign: GEN_ASSIGNS[i % GEN_ASSIGNS.length] ?? "Main Office",
      cat,
      status,
      hired: `${2010 + (i % 15)}-${gpad((i % 12) + 1, 2)}-${gpad((i % 27) + 1, 2)}`,
      type: contractual ? "Contractual" : "Regular",
      ...(contractEnd ? { contractEnd } : {}),
      birthday: `${1972 + (i % 28)}-${gpad((i % 12) + 1, 2)}-${gpad((i % 27) + 1, 2)}`,
      gender: i % 3 === 0 ? "Female" : "Male",
      contact: `0917-${gpad(300 + i, 3)}-${gpad(1000 + i)}`,
      address: GEN_ADDRESS[i % GEN_ADDRESS.length] ?? "Valenzuela City",
      sss: `SYN-SSS-${gpad(i)}`,
      pagibig: `SYN-HDMF-${gpad(i)}`,
      philhealth: `SYN-PHIC-${gpad(i)}`,
      tin: `SYN-TIN-${gpad(i)}`,
      emName: `${GEN_FIRST[(i * 2) % GEN_FIRST.length] ?? "Maria"} ${last}`,
      emNum: `0918-${gpad(300 + i, 3)}-${gpad(2000 + i)}`,
      insurance: i % 2 === 0 ? "Yes" : "No",
      vaccinated: i % 4 === 0 ? "No" : "Yes",
      atm: `SYN-ATM-${gpad(100000 + i, 6)}`,
      atmExp: `202${7 + (i % 2)}-${gpad((i % 12) + 1, 2)}`,
      remarks: contractEnd ? `Contract ends ${contractEnd}` : "—",
      comp: genComp(cat, i),
    });
  }
  return out;
}

// Seed insurance-enrollment detail for any enrolled employee (insurance ===
// "Yes") that doesn't already carry it — deterministic from the roster index so
// dates stay stable across builds. A deterministic minority land expiring/expired
// to exercise the status Chip; "No" employees keep no provider/dates (graceful —).
const INS_PROVIDERS = [
  "MediCard",
  "Maxicare",
  "PhilCare",
  "Intellicare",
  "ValuCare",
] as const;

function seedInsurance(e: Employee, i: number): Employee {
  if (e.insurance !== "Yes" || e.insProvider) return e;
  const insExpiry =
    i % 9 === 0
      ? addMonths(HR_TODAY, -2) // lapsed
      : i % 9 === 4
        ? addMonths(HR_TODAY, 2) // expiring < 3 months
        : addMonths(HR_TODAY, 10 + (i % 3)); // active, 10–12 months out
  return {
    ...e,
    insProvider: INS_PROVIDERS[i % INS_PROVIDERS.length] ?? "MediCard",
    insPolicyNo: `POL-${String(100000 + i).padStart(6, "0")}`,
    insEnrolled: addMonths(HR_TODAY, -(2 + (i % 10))),
    insExpiry,
  };
}

// In-session MUTABLE employee store (mirrors lib/mock/inquiries.ts): the 12
// hand-authored employees first, then the generated fill, each seeded with
// insurance detail. renewContract() updates `contractEnd` here in place so the
// expiry flags + the HR dashboard KPI recompute live; the frozen base seed
// (EMPLOYEES_BASE) stays intact.
const employeeStore: Employee[] = [
  ...EMPLOYEES_BASE,
  ...generateEmployees(),
].map((e, i) => seedInsurance(e, i));

/** Full roster — the in-session store (renewals update `contractEnd` in place). */
export const EMPLOYEES: readonly Employee[] = employeeStore;

/** The three Salary Rate Categories, in H1 stack order. */
export const SALARY_CATEGORIES: readonly SalaryCategory[] = [
  "Daily",
  "Weekly",
  "Monthly",
];

export const EMP_STATUS_OPTIONS = [
  "Probationary",
  "Regular",
  "On Leave",
  "Suspended",
  "Resigned",
  "Terminated",
] as const;

export const EMP_STATUS_FILTERS = [
  "All",
  "Regular",
  "Probationary",
  "On Leave",
  "Suspended",
] as const;

export const EMP_TYPE_FILTERS = ["All", "Regular", "Contractual"] as const;

/** Distinct Places of Assignment across the live roster (base + generated), for
 *  the H1 list filter. Derived once at module load so generated assignments are
 *  covered. */
export const EMP_ASSIGN_FILTERS: readonly string[] = [
  "All",
  ...Array.from(new Set(EMPLOYEES.map((e) => e.assign))).sort(),
];

export const STATUS_TONE: Record<string, Tone> = {
  Regular: "success",
  Probationary: "info",
  "On Leave": "pending",
  Suspended: "danger",
  Resigned: "neutral",
  Terminated: "danger",
};

// ---- Archived --------------------------------------------------------------
export type ArchivedEmployee = {
  id: number;
  sn: number;
  no: string;
  name: string;
  bio: string;
  pos: string;
  assign: string;
  cat: SalaryCategory;
  status: string;
  hired: string;
  archived: string;
};

export const ARCHIVED: readonly ArchivedEmployee[] = [
  {
    id: 101,
    sn: 1,
    no: "JCE 00061",
    name: "Edgar F. Domingo",
    bio: "9061",
    pos: "Accounting Staff",
    assign: "Main Office",
    cat: "Monthly",
    status: "Resigned",
    hired: "2014-02-01",
    archived: "2026-01-14",
  },
  {
    id: 102,
    sn: 2,
    no: "JCE 00040b",
    name: "Teresa V. Cruz",
    bio: "9040",
    pos: "Helper",
    assign: "Workshop",
    cat: "Daily",
    status: "Terminated",
    hired: "2019-11-20",
    archived: "2025-12-02",
  },
];

// ---- Working projects (ALIGNED to canonical SALES_ORDERS) -------------------
export type WorkingProject = { so: string; label: string; status: string };

function projStatus(soStatus: string): string {
  if (soStatus === "On Hold") return "On Hold";
  if (soStatus.toLowerCase().includes("completed")) return "Completed";
  return "Ongoing";
}

// The Working-Project list is DERIVED from the live Sales Orders by STATUS (SRS
// §4.2 — "Sourced from the Sales Orders list (Ongoing/On Hold/Completed, not
// Archived)"): keep every SO whose status is a current registry status
// (SO_STATUS_OPTIONS); SalesOrder has no archived flag, so "not Archived" is
// satisfied automatically. No hardcoded SO# subset — the list tracks the BDD
// registry. Plus the two internal cost-centres (Workshop / Motorpool).
export const PROJECTS: readonly WorkingProject[] = [
  ...SALES_ORDERS.filter((o) =>
    (SO_STATUS_OPTIONS as readonly string[]).includes(o.status),
  ).map((o) => ({ so: o.so, label: o.name, status: projStatus(o.status) })),
  { so: "WORKSHOP", label: "Internal — Workshop", status: "Ongoing" },
  { so: "MOTORPOOL", label: "Internal — Motorpool", status: "Ongoing" },
];

/** Display label for a project code (SO# kept verbatim — it is the anchor). */
export function projLabel(so: string): string {
  return PROJECTS.find((p) => p.so === so)?.so ?? so;
}

export function projName(so: string): string {
  return PROJECTS.find((p) => p.so === so)?.label ?? so;
}

// ---- Timekeeping -----------------------------------------------------------
export const DAY_TYPES = [
  "Regular Day",
  "Rest Day (Sun)",
  "Special Holiday",
  "Double Special Holiday",
  "Regular Holiday",
  "Double Regular Holiday",
] as const;

export type TimeRow = {
  id: number;
  /** YYYY-MM-DD */
  date: string;
  day: string;
  dayType: string;
  /** project SO# / cost-centre, or "—" */
  proj: string;
  /** "HH:MM" or "—" */
  in: string;
  out: string;
  leave: string | null;
  leaveRef?: string;
  remarks: string;
  /** true for a row auto-created from an approved RFL/LOA — read-only here */
  autoLeave?: boolean;
  /** true for a multi-project working day (distribution splits evenly) */
  multi?: boolean;
  /** owning employee (H5b site board); legacy/seed rows omit it → LEGACY_EMP_NO */
  empNo?: string;
  /** site SNAPSHOT at log time (Employee.assign) — resolves board membership so a
   *  mid-period reassignment doesn't make a posted day's rows vanish */
  site?: string;
  /** the row's day type was set independently of the site default — a site
   *  re-stamp skips it (persisted so protection survives reloads) */
  dayTypeOverridden?: boolean;
};

/** Legacy seed rows (and any row without empNo) are attributed to this employee
 *  (Noel V. Bautista) — the original single-employee timekeeping week. */
export const LEGACY_EMP_NO = "JCE 00077";

// One employee × one week (Noel Bautista, lineman) — incl. a multi-project split
// day and an auto-created leave row. The Manhours Distribution is DERIVED from
// Time In/Out + Day Type (see computeManhours), never stored. Mutable so an
// approved RFL/LOA can append a read-only leave row (recording-only).
const timeRowStore: TimeRow[] = [
  {
    id: 1,
    date: "2026-05-25",
    day: "Sun",
    dayType: "Rest Day (Sun)",
    proj: "—",
    in: "—",
    out: "—",
    leave: null,
    remarks: "Rest day",
  },
  {
    id: 2,
    date: "2026-05-26",
    day: "Mon",
    dayType: "Regular Day",
    proj: "26-05-378",
    in: "07:00",
    out: "17:00",
    leave: null,
    remarks: "",
  },
  {
    id: 3,
    date: "2026-05-27",
    day: "Tue",
    dayType: "Regular Day",
    proj: "26-05-378",
    in: "07:00",
    out: "19:00",
    leave: null,
    remarks: "Multi-project (split)",
    multi: true,
  },
  {
    id: 4,
    date: "2026-05-27",
    day: "Tue",
    dayType: "Regular Day",
    proj: "WORKSHOP",
    in: "07:00",
    out: "19:00",
    leave: null,
    remarks: "Multi-project (split)",
    multi: true,
  },
  {
    id: 5,
    date: "2026-05-28",
    day: "Wed",
    dayType: "Regular Day",
    proj: "26-05-378",
    in: "22:00",
    out: "06:00",
    leave: null,
    remarks: "Night shift",
  },
  {
    id: 6,
    date: "2026-05-29",
    day: "Thu",
    dayType: "Regular Day",
    proj: "—",
    in: "—",
    out: "—",
    leave: "Leave With Pay",
    leaveRef: "RFL-26-044",
    remarks: "Auto from RFL",
    autoLeave: true,
  },
  {
    id: 7,
    date: "2026-05-30",
    day: "Fri",
    dayType: "Regular Day",
    proj: "26-05-378",
    in: "07:00",
    out: "16:00",
    leave: null,
    remarks: "",
  },
  {
    id: 8,
    date: "2026-05-31",
    day: "Sat",
    dayType: "Regular Day",
    proj: "26-05-378",
    in: "07:00",
    out: "12:00",
    leave: null,
    remarks: "Half day (undertime)",
  },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** TZ-SAFE weekday short-name for a "YYYY-MM-DD" — parses the parts as LOCAL
 *  midnight; never `new Date(str)`, which treats the string as UTC and can roll
 *  back a day in negative-offset zones. */
export function weekdayOf(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return "Mon";
  return WEEKDAYS[new Date(y, m - 1, d).getDay()] ?? "Mon";
}

/** TZ-SAFE Sunday check (Rest-day inference) — same local-parse rationale. */
export function isSunday(date: string): boolean {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return false;
  return new Date(y, m - 1, d).getDay() === 0;
}

/** Current timekeeping rows (incl. any auto-created leave rows this session). */
export function getTimeRows(): readonly TimeRow[] {
  return [...timeRowStore];
}

/** Auto-create a read-only leave row (an approved RFL/LOA, recording-only).
 *  empNo defaults to the legacy employee for back-compat with existing callers. */
export function addLeaveRow(input: {
  date: string;
  leave: string;
  leaveRef: string;
  remarks?: string;
  empNo?: string;
}): void {
  timeRowStore.push({
    id: Math.max(0, ...timeRowStore.map((r) => r.id)) + 1,
    empNo: input.empNo ?? LEGACY_EMP_NO,
    date: input.date,
    day: weekdayOf(input.date),
    dayType: "Regular Day",
    proj: "—",
    in: "—",
    out: "—",
    leave: input.leave,
    leaveRef: input.leaveRef,
    remarks: input.remarks ?? "Auto from leave",
    autoLeave: true,
  });
}

export type Distribution = { reg: number; ot: number; nd: number; abs: number };

const ZERO_DIST: Distribution = { reg: 0, ot: 0, nd: 0, abs: 0 };

function toMinutes(t: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return null;
  return Number(m[1] ?? "0") * 60 + Number(m[2] ?? "0");
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

// Fully-spanned break windows (hours): lunch 12–1 PM · OT meal 10–11 PM ·
// night meal 2–3 AM. Deducted only when the work interval fully contains them.
const BREAKS: readonly [number, number][] = [
  [12, 13],
  [22, 23],
  [2, 3],
];

/**
 * Manhours distribution for ONE clock interval, honoring the spec rules exactly:
 *   Regular   = min(net, 8)
 *   OT        = excess over 8
 *   Night Diff= overlap with 23:00–06:00 (separate; may overlap OT)
 *   Abs/UT    = undertime vs an 8-hour standard (gross presence) on a work day
 * Breaks are deducted from net only when the interval fully spans them.
 * For multi-project days, divide the result evenly per rowDistribution().
 */
export function computeManhours(
  tin: string,
  tout: string,
  dayType: string,
): Distribution {
  const a = toMinutes(tin);
  const b0 = toMinutes(tout);
  if (a == null || b0 == null) return ZERO_DIST;
  const b = b0 <= a ? b0 + 1440 : b0; // overnight wrap

  let brk = 0;
  for (const [s, e] of BREAKS) {
    for (const off of [0, 1440]) {
      const bs = s * 60 + off;
      const be = e * 60 + off;
      if (a <= bs && b >= be) brk += be - bs;
    }
  }

  const net = Math.max(0, b - a - brk) / 60;
  const reg = Math.min(net, 8);
  const ot = Math.max(net - 8, 0);

  let ndMin = 0;
  for (const off of [-1440, 0, 1440]) {
    const ns = 23 * 60 + off; // 11 PM
    const ne = 30 * 60 + off; // 6 AM next day
    ndMin += Math.max(0, Math.min(b, ne) - Math.max(a, ns));
  }
  // SRS §4.2 step 5: subtract the 60-min night meal break (02:00–03:00) from the
  // Night-Differential count when the worked window fully spans it. The night
  // meal lies inside the 23:00–06:00 ND window by definition, so a fully-spanned
  // break always falls within the overlap. Mirrors the break-offset loop above;
  // this is a SEPARATE deduction from the net-worked break deduction.
  let nightMealMin = 0;
  for (const off of [0, 1440]) {
    const ms = 2 * 60 + off; // 02:00
    const me = 3 * 60 + off; // 03:00
    if (a <= ms && b >= me) nightMealMin = 60;
  }
  const nd = Math.max(0, ndMin - nightMealMin) / 60;

  const gross = (b - a) / 60;
  const abs = dayType.startsWith("Rest") ? 0 : Math.max(0, 8 - gross);

  return { reg: round1(reg), ot: round1(ot), nd: round1(nd), abs: round1(abs) };
}

/**
 * Distribution for a single grid row, accounting for leave rows (zeros),
 * pure absences, and even multi-project splitting across same-date rows.
 */
export function rowDistribution(
  row: TimeRow,
  rows: readonly TimeRow[],
): Distribution {
  if (row.autoLeave || row.leave) return ZERO_DIST;
  if (row.in === "—" || row.out === "—") {
    return row.dayType.startsWith("Rest")
      ? ZERO_DIST
      : { reg: 0, ot: 0, nd: 0, abs: 8 };
  }
  const d = computeManhours(row.in, row.out, row.dayType);
  const siblings =
    rows.filter(
      (r) =>
        r.date === row.date &&
        (r.empNo ?? LEGACY_EMP_NO) === (row.empNo ?? LEGACY_EMP_NO) &&
        r.in !== "—" &&
        r.out !== "—" &&
        !r.autoLeave &&
        !r.leave,
    ).length || 1;
  if (siblings === 1) return d;
  return {
    reg: round1(d.reg / siblings),
    ot: round1(d.ot / siblings),
    nd: round1(d.nd / siblings),
    abs: round1(d.abs / siblings),
  };
}

/** Sum of per-row distributions — the week totals row. */
export function weekTotals(rows: readonly TimeRow[]): Distribution {
  return rows.reduce<Distribution>((acc, r) => {
    const d = rowDistribution(r, rows);
    return {
      reg: round1(acc.reg + d.reg),
      ot: round1(acc.ot + d.ot),
      nd: round1(acc.nd + d.nd),
      abs: round1(acc.abs + d.abs),
    };
  }, ZERO_DIST);
}

// ============================================================================
// H5b · Site Day Sheet — site-grouped recording over the SAME per-employee rows.
// A timekeeper picks a SITE + DATE; everyone is implicitly Present at the site's
// standard hours under one site Day Type, and only exceptions are touched. Logging
// stays PER EMPLOYEE (one TimeRow each, own in/out, own derived numbers). Purely
// additive — the derived computation, multi-project split, ND, six Day Types,
// SO-sourced Working Project, and per-employee verify→lock batches are preserved.
// ============================================================================

/** Map an Employee.assign (the site) to the TimeRow.proj code: project sites are
 *  "<SO#> · <name>" → the SO# token; Workshop/Motorpool → their codes; Main
 *  Office has no project ("—"). PROJECTS/projLabel/projName are untouched. */
export function projCodeForAssign(assign: string): string {
  if (assign === "Workshop") return "WORKSHOP";
  if (assign === "Motorpool") return "MOTORPOOL";
  if (assign === "Main Office") return "—";
  const code = assign.split(" · ")[0]?.trim();
  return code && code.length > 0 ? code : "—";
}

/** Header DocChip token for a site — never "—" (internal sites read e.g.
 *  "MAIN OFFICE"). */
export function siteToken(assign: string): string {
  const code = projCodeForAssign(assign);
  return code !== "—" ? code : assign.toUpperCase();
}

export const DEFAULT_SITE_HOURS = { in: "07:00", out: "16:00" } as const;

/** Per-site standard hours (pre-fill DATA only — never a hard constraint). Project
 *  sites default to 07:00–16:00; Main Office is 08:00–17:00. */
export const SITE_STANDARD_HOURS: Record<string, { in: string; out: string }> =
  {
    "Main Office": { in: "08:00", out: "17:00" },
  };

export function standardHoursForSite(assign: string): {
  in: string;
  out: string;
} {
  return SITE_STANDARD_HOURS[assign] ?? DEFAULT_SITE_HOURS;
}

// Per-(site,date) site Day Type — in-session, keyed `${site}|${date}`.
const siteDayTypeStore: Record<string, string> = {};
function siteDayKey(site: string, date: string): string {
  return `${site}|${date}`;
}
/** The site Day Type for a (site,date): an explicit override, else Rest Day on a
 *  Sunday (TZ-safe), else Regular Day. */
export function getSiteDayType(site: string, date: string): string {
  return (
    siteDayTypeStore[siteDayKey(site, date)] ??
    (isSunday(date) ? "Rest Day (Sun)" : "Regular Day")
  );
}
export function setSiteDayType(
  site: string,
  date: string,
  dayType: string,
): void {
  siteDayTypeStore[siteDayKey(site, date)] = dayType;
}

// ---- Derived row STATUS (never from abs>0) ---------------------------------
export type RowStatus =
  | "Present"
  | "Absent"
  | "Leave"
  | "OT"
  | "Custom"
  | "Rest";

export const ROW_STATUS_TONE: Record<RowStatus, Tone> = {
  Present: "success",
  Absent: "danger",
  Leave: "info",
  OT: "pending",
  Custom: "neutral",
  Rest: "neutral",
};

/** A valid clock value: "—" or HH:MM in range. */
export function isTimeValue(s: string): boolean {
  return s === "—" || /^([01]?\d|2[0-3]):[0-5]\d$/.test(s.trim());
}

/** Attendance status derived FROM the row's fields (so a Rest-day no-show still
 *  reads Absent, not off abs>0). */
export function rowStatus(
  row: Pick<TimeRow, "in" | "out" | "leave" | "dayType">,
  std: { in: string; out: string } = DEFAULT_SITE_HOURS,
): RowStatus {
  if (row.leave) return "Leave";
  if (row.dayType.startsWith("Rest")) return "Rest";
  if (row.in === "—" || row.out === "—") return "Absent";
  const d = computeManhours(row.in, row.out, row.dayType);
  if (d.ot > 0) return "OT";
  if (row.in === std.in && row.out === std.out) return "Present";
  return "Custom";
}

/** Add n hours to an HH:MM value, wrapping at 24h. null if invalid / "—". */
export function addHoursToTime(t: string, n: number): string | null {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(t.trim());
  if (!m) return null;
  const v =
    (((Number(m[1]) * 60 + Number(m[2]) + n * 60) % 1440) + 1440) % 1440;
  return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
}

// ---- Site-day row materialization ------------------------------------------
/** Build (not persist) the standard rows for a site+date: one per assigned
 *  employee at the site's standard hours under the resolved day type. On Leave →
 *  a Leave row; Suspended → Absent. */
export function buildSiteDayRows(input: {
  site: string;
  date: string;
  dayType?: string;
}): TimeRow[] {
  const { site, date } = input;
  const dayType = input.dayType ?? getSiteDayType(site, date);
  const proj = projCodeForAssign(site);
  const std = standardHoursForSite(site);
  const day = weekdayOf(date);
  const assigned = EMPLOYEES.filter((e) => e.assign === site);
  let nextId = timeRowStore.reduce((m, r) => Math.max(m, r.id), 0) + 1;
  return assigned.map((e) => {
    const onLeave = e.status === "On Leave";
    const suspended = e.status === "Suspended";
    return {
      id: nextId++,
      empNo: e.no,
      site,
      date,
      day,
      dayType,
      proj: onLeave ? "—" : proj,
      in: onLeave || suspended ? "—" : std.in,
      out: onLeave || suspended ? "—" : std.out,
      leave: onLeave ? "On Leave" : null,
      remarks: suspended ? "Suspended" : "",
    };
  });
}

/** Idempotent upsert of a site's day rows into the store (keyed empNo,date,proj);
 *  never clobbers an existing/edited/locked row. Returns added/kept counts. */
export function addSiteDayRows(input: {
  site: string;
  date: string;
  dayType?: string;
}): { added: number; kept: number } {
  const candidates = buildSiteDayRows(input);
  let added = 0;
  let kept = 0;
  for (const c of candidates) {
    const exists = timeRowStore.some(
      (r) =>
        (r.empNo ?? LEGACY_EMP_NO) === c.empNo &&
        r.date === c.date &&
        r.proj === c.proj,
    );
    if (exists) {
      kept += 1;
      continue;
    }
    timeRowStore.push(c);
    added += 1;
  }
  return { added, kept };
}

/** Insert a single time row (e.g. a second project on a multi-project day);
 *  assigns the next id. Returns the created row. In-session. */
export function addTimeRow(row: Omit<TimeRow, "id">): TimeRow {
  const created: TimeRow = {
    ...row,
    id: timeRowStore.reduce((m, r) => Math.max(m, r.id), 0) + 1,
  };
  timeRowStore.push(created);
  return created;
}

/** Per-employee exception edit. Derived manhours stay COMPUTED — never written. */
export function updateTimeRow(
  id: number,
  patch: Partial<
    Pick<
      TimeRow,
      | "in"
      | "out"
      | "dayType"
      | "leave"
      | "leaveRef"
      | "remarks"
      | "proj"
      | "multi"
      | "dayTypeOverridden"
    >
  >,
): void {
  const i = timeRowStore.findIndex((r) => r.id === id);
  const cur = timeRowStore[i];
  if (cur) timeRowStore[i] = { ...cur, ...patch };
}

/** Rows logged for a site+date. Membership is the row's SNAPSHOT (logged site,
 *  or project-code for legacy site-less rows) — NOT the employee's live assign. */
export function getTimeRowsForSite(
  site: string,
  date: string,
): readonly TimeRow[] {
  const proj = projCodeForAssign(site);
  return timeRowStore
    .filter((r) => {
      if (r.date !== date) return false;
      if (r.site != null) return r.site === site;
      // legacy site-less rows: match project sites by proj; internal "—" would
      // collide with leave/absent rows, so never match those.
      return proj !== "—" && r.proj === proj;
    })
    .map((r) => ({ ...r }));
}

/** All rows for one employee (the By-employee grid + cross-tab visibility). */
export function getTimeRowsForEmployee(empNo: string): readonly TimeRow[] {
  return timeRowStore
    .filter((r) => (r.empNo ?? LEGACY_EMP_NO) === empNo)
    .map((r) => ({ ...r }));
}

// ---- Verification batches (MUTABLE store — survives across routes) ----------
export type BatchStatus = "Open" | "Verified" | "Re-opened";

export type Batch = {
  id: number;
  emp: string;
  no: string;
  period: string;
  range: string;
  rows: number;
  status: BatchStatus;
  verifier: string;
  at: string;
};

export const BATCH_TONE: Record<string, Tone> = {
  Open: "neutral",
  Verified: "success",
  "Re-opened": "pending",
};

const batchStore: Batch[] = [
  {
    id: 1,
    emp: "Noel V. Bautista",
    no: "JCE 00077",
    period: "Daily 21–05",
    range: "2026-05-21 — 2026-06-05",
    rows: 11,
    status: "Open",
    verifier: "—",
    at: "—",
  },
  {
    id: 2,
    emp: "Ramon D. dela Cruz",
    no: "JCE 00031",
    period: "Weekly Sun–Sat",
    range: "2026-05-25 — 2026-05-31",
    rows: 7,
    status: "Verified",
    verifier: "R. Timekeeper",
    at: "2026-06-01 09:12",
  },
  {
    id: 3,
    emp: "Carlos M. Mendoza",
    no: "JCE 00007",
    period: "Monthly 23–07",
    range: "2026-05-23 — 2026-06-07",
    rows: 13,
    status: "Open",
    verifier: "—",
    at: "—",
  },
  {
    id: 4,
    emp: "Roberto S. Villanueva",
    no: "JCE 00081",
    period: "Daily 21–05",
    range: "2026-05-21 — 2026-06-05",
    rows: 10,
    status: "Re-opened",
    verifier: "R. Timekeeper",
    at: "reason: corrected OT",
  },
];

/** All batches (Part 5 payroll consumes the Verified · Locked ones). */
export function getBatches(): readonly Batch[] {
  return [...batchStore];
}

export function getBatch(id: number): Batch | undefined {
  return batchStore.find((b) => b.id === id);
}

/** Verify + lock a batch (in-session). */
export function verifyBatch(id: number, verifier: string, at: string): void {
  const i = batchStore.findIndex((b) => b.id === id);
  const cur = batchStore[i];
  if (cur) batchStore[i] = { ...cur, status: "Verified", verifier, at };
}

/** Re-open a verified batch with a required reason (audited to H14). */
export function reopenBatch(id: number, reason: string): void {
  const i = batchStore.findIndex((b) => b.id === id);
  const cur = batchStore[i];
  if (cur)
    batchStore[i] = { ...cur, status: "Re-opened", at: `reason: ${reason}` };
}

/** Is the verified-lock active for an employee's current batch? (drives H5) */
export function isLockedForEmployee(no: string): boolean {
  return batchStore.some((b) => b.no === no && b.status === "Verified");
}

// ---- HR requests -----------------------------------------------------------
export type RequestStatus = "Pending" | "Approved" | "Recorded";

// ---- H7–H11 · HR Requests (SRS §4.3) ---------------------------------------
// One record = one filed form. Common shape (§4.3): manual form number (OB/OT/RFL)
// or a system Internal ID (LOA) · date filed · employee(s) from the DB (auto-
// populated) · signers recorded for audit (names from the DB) · a REQUIRED multi-
// file signed scan (gates the terminal status) · status. Per-form fields are a
// discriminated union (no boolean soup). emp/key/scan are DERIVED summaries kept
// on the record for the register columns (computed on add/update).
export type ReqEmployee = {
  no: string;
  name: string;
  pos: string;
  assign: string;
};
export type ReqSigner = { role: string; empNo?: string; name?: string };
export type ReqFile = { name: string; kind: "pdf" | "jpg" | "png" };

export type RequestDetails =
  | {
      kind: "ob";
      reasons: string;
      projectName: string;
      salesOrderNo: string;
      destination: string;
      departAt: string;
      returnAt: string;
    }
  | {
      kind: "ot";
      section: string;
      project: string;
      otDate: string;
      otType: "Pre-approved" | "After-the-fact";
      requestedFromTo: string;
      actualFromTo: string;
      reason: string;
    }
  | {
      kind: "rfl";
      leaveType: "Vacation Leave" | "Sick Leave" | "Others";
      othersSpecify?: string;
      payType: "With Pay" | "Without Pay";
      from: string;
      to: string;
      days: number;
      daysOverridden?: boolean;
      requestType: "Pre-approved" | "After-the-fact";
      proof: ReqFile[];
    }
  | {
      kind: "loa";
      from: string;
      to: string;
      days: number;
      daysOverridden?: boolean;
      leaveType: "Vacation" | "Sick" | "Paternity" | "Maternity" | "Others";
      reason: string;
    };

export type RequestRecord = {
  /** URL-safe slug of `no` (deduped) — the deep-link route key. */
  id: string;
  no: string;
  filed: string;
  type: RequestTypeLabel;
  /** DERIVED employee summary (register column). */
  emp: string;
  /** DERIVED short per-type descriptor (register column). */
  key: string;
  status: RequestStatus;
  /** DERIVED scans.length > 0 — gates Pending → Approved/Recorded. */
  scan: boolean;
  employees: ReqEmployee[];
  signers: ReqSigner[];
  scans: ReqFile[];
  details: RequestDetails;
  /** Source ref stamped on auto-created timekeeping rows (RFL/LOA) — idempotency. */
  leaveRef?: string;
};

export const REQ_TONE: Record<string, Tone> = {
  Pending: "pending",
  Approved: "success",
  Recorded: "success",
};

export const REQ_STATUS_FILTERS = [
  "All",
  "Pending",
  "Approved",
  "Recorded",
] as const;

export type RequestTypeLabel =
  | "OB/Travel"
  | "Overtime"
  | "Request for Leave"
  | "LOA Without Pay";

export type RequestTypeDef = {
  slug: string;
  label: RequestTypeLabel;
  code: string;
  blurb: string;
  /** terminal status once the signed scan is attached */
  terminal: RequestStatus;
  /** RFL/LOA auto-create read-only timekeeping rows on save */
  autoLeave: boolean;
};

export const REQUEST_TYPES: readonly RequestTypeDef[] = [
  {
    slug: "ob-travel",
    label: "OB/Travel",
    code: "H8",
    blurb: "Off-site work — still a working day",
    terminal: "Approved",
    autoLeave: false,
  },
  {
    slug: "overtime",
    label: "Overtime",
    code: "H9",
    blurb: "Pre-approved or after-the-fact",
    terminal: "Approved",
    autoLeave: false,
  },
  {
    slug: "request-for-leave",
    label: "Request for Leave",
    code: "H10",
    blurb: "Vacation / Sick · With or Without Pay",
    terminal: "Recorded",
    autoLeave: true,
  },
  {
    slug: "loa-without-pay",
    label: "LOA Without Pay",
    code: "H11",
    blurb: "Unpaid leave of absence",
    terminal: "Recorded",
    autoLeave: true,
  },
];

export function typeBySlug(slug: string): RequestTypeDef | undefined {
  return REQUEST_TYPES.find((t) => t.slug === slug);
}

export function typeByLabel(label: string): RequestTypeDef | undefined {
  return REQUEST_TYPES.find((t) => t.label === label);
}

let leaveSeq = 60;
/** Generate the next leave reference number on RFL/LOA save (in-session). */
export function nextLeaveRef(type: RequestTypeLabel): string {
  leaveSeq += 1;
  return type === "LOA Without Pay"
    ? `LOA-WP-2026-0${leaveSeq}`
    : `RFL-26-0${leaveSeq}`;
}

// Signer chains — print-only wet-signature blocks (offline approval).
export const SIGNERS: Record<RequestTypeLabel, readonly string[]> = {
  "OB/Travel": [
    "Requester",
    "Approving Officer / Dept. Head",
    "Admin and Finance",
    "HR Acknowledger",
  ],
  Overtime: [
    "Requester",
    "Department Head",
    "Timekeeper (Noted by)",
    "HR Head (Approved by)",
  ],
  "Request for Leave": [
    "Employee's Signature",
    "Approved by (Dept Head)",
    "Checked by (HR Head)",
    "Noted by (President / VP)",
  ],
  "LOA Without Pay": [
    "Requester",
    "Approved by (Section Head)",
    "Noted by (Plant Operation Head)",
    "Acknowledged by (HR)",
  ],
};

/** Map a request type to its details discriminator. */
export function detailsKindForType(
  type: RequestTypeLabel,
): RequestDetails["kind"] {
  switch (type) {
    case "OB/Travel":
      return "ob";
    case "Overtime":
      return "ot";
    case "Request for Leave":
      return "rfl";
    case "LOA Without Pay":
      return "loa";
  }
}

// ---- mutable request store (mirrors lib/mock/inquiries.ts) ------------------
// Migrated seeds carry the full §4.3 shape; reload resets to seed (intentional
// mock). The register + record routes read THROUGH the accessors.
const requestStore: RequestRecord[] = [
  {
    id: "ob-2026-014",
    no: "OB-2026-014",
    filed: "2026-05-30",
    type: "OB/Travel",
    emp: "5 employees · Cavite team",
    key: "Cavite Line site visit",
    status: "Pending",
    scan: false,
    employees: [
      {
        no: "JCE 00007",
        name: "Carlos M. Mendoza",
        pos: "Project Manager",
        assign: "26-04-355 · Cavite 69KV Transmission Line",
      },
      {
        no: "JCE 00055",
        name: "Paolo R. Garcia",
        pos: "Site Engineer",
        assign: "26-04-355 · Cavite 69KV Transmission Line",
      },
    ],
    signers: SIGNERS["OB/Travel"].map((role) => ({ role })),
    scans: [],
    details: {
      kind: "ob",
      reasons: "Site coordination & inspection",
      projectName: "Cavite 69KV Transmission Line",
      salesOrderNo: "26-04-355",
      destination: "Cavite Line site",
      departAt: "2026-05-31T07:00",
      returnAt: "2026-05-31T17:00",
    },
  },
  {
    id: "ob-2026-012",
    no: "OB-2026-012",
    filed: "2026-05-22",
    type: "OB/Travel",
    emp: "P. Garcia +2",
    key: "Bulacan inspection",
    status: "Approved",
    scan: true,
    employees: [
      {
        no: "JCE 00055",
        name: "Paolo R. Garcia",
        pos: "Site Engineer",
        assign: "26-05-378 · 13.2KV Distribution Line",
      },
      {
        no: "JCE 00007",
        name: "Carlos M. Mendoza",
        pos: "Project Manager",
        assign: "26-05-378 · 13.2KV Distribution Line",
      },
      {
        no: "JCE 00077",
        name: "Noel V. Bautista",
        pos: "Lineman",
        assign: "26-05-378 · 13.2KV Distribution Line",
      },
    ],
    signers: [
      { role: "Requester", empNo: "JCE 00055", name: "Paolo R. Garcia" },
      {
        role: "Approving Officer / Dept. Head",
        empNo: "JCE 00007",
        name: "Carlos M. Mendoza",
      },
      { role: "Admin and Finance", empNo: "JCE 00009", name: "Ana L. Reyes" },
      { role: "HR Acknowledger", empNo: "JCE 00014", name: "Maria T. Santos" },
    ],
    scans: [{ name: "ob-2026-012-signed.pdf", kind: "pdf" }],
    details: {
      kind: "ob",
      reasons: "Pre-construction inspection",
      projectName: "13.2KV Distribution Line",
      salesOrderNo: "26-05-378",
      destination: "Bulacan",
      departAt: "2026-05-22T08:00",
      returnAt: "2026-05-22T16:00",
    },
  },
  {
    id: "ot-form-no-2026-022",
    no: "OT FORM NO. 2026-022",
    filed: "2026-05-29",
    type: "Overtime",
    emp: "Shop · 8 staff",
    key: "Fabrication push",
    status: "Pending",
    scan: false,
    employees: [
      {
        no: "JCE 00055",
        name: "Paolo R. Garcia",
        pos: "Site Engineer",
        assign: "Internal — Workshop",
      },
    ],
    signers: SIGNERS["Overtime"].map((role) => ({ role })),
    scans: [],
    details: {
      kind: "ot",
      section: "Shop / Office",
      project: "Internal — Workshop",
      otDate: "2026-05-29",
      otType: "Pre-approved",
      requestedFromTo: "18:00 – 22:00",
      actualFromTo: "18:00 – 22:00",
      reason: "Fabrication push for Cavite delivery",
    },
  },
  {
    id: "ot-form-no-2026-019",
    no: "OT FORM NO. 2026-019",
    filed: "2026-05-20",
    type: "Overtime",
    emp: "N. Bautista",
    key: "Night energization",
    status: "Approved",
    scan: true,
    employees: [
      {
        no: "JCE 00077",
        name: "Noel V. Bautista",
        pos: "Lineman",
        assign: "26-05-378 · 13.2KV Distribution Line",
      },
    ],
    signers: [
      { role: "Requester", empNo: "JCE 00077", name: "Noel V. Bautista" },
      {
        role: "Department Head",
        empNo: "JCE 00007",
        name: "Carlos M. Mendoza",
      },
      {
        role: "Timekeeper (Noted by)",
        empNo: "JCE 00031",
        name: "Ramon D. dela Cruz",
      },
      {
        role: "HR Head (Approved by)",
        empNo: "JCE 00014",
        name: "Maria T. Santos",
      },
    ],
    scans: [{ name: "ot-2026-019-signed.jpg", kind: "jpg" }],
    details: {
      kind: "ot",
      section: "Project site",
      project: "13.2KV Distribution Line",
      otDate: "2026-05-20",
      otType: "Pre-approved",
      requestedFromTo: "20:00 – 02:00",
      actualFromTo: "20:10 – 02:05",
      reason: "Night line energization",
    },
  },
  {
    id: "rfl-26-051",
    no: "RFL-26-051",
    filed: "2026-06-01",
    type: "Request for Leave",
    emp: "R. dela Cruz",
    key: "Vacation Leave · With Pay · 3 days",
    status: "Pending",
    scan: false,
    leaveRef: "RFL-26-051",
    employees: [
      {
        no: "JCE 00031",
        name: "Ramon D. dela Cruz",
        pos: "Lineman",
        assign: "26-04-355 · Cavite 69KV Transmission Line",
      },
    ],
    signers: SIGNERS["Request for Leave"].map((role) => ({ role })),
    scans: [],
    details: {
      kind: "rfl",
      leaveType: "Vacation Leave",
      payType: "With Pay",
      from: "2026-06-03",
      to: "2026-06-05",
      days: 3,
      requestType: "Pre-approved",
      proof: [],
    },
  },
  {
    id: "rfl-26-044",
    no: "RFL-26-044",
    filed: "2026-05-26",
    type: "Request for Leave",
    emp: "N. Bautista",
    key: "Sick Leave · With Pay · 1 day",
    status: "Recorded",
    scan: true,
    leaveRef: "RFL-26-044",
    employees: [
      {
        no: "JCE 00077",
        name: "Noel V. Bautista",
        pos: "Lineman",
        assign: "26-05-378 · 13.2KV Distribution Line",
      },
    ],
    signers: [
      {
        role: "Employee's Signature",
        empNo: "JCE 00077",
        name: "Noel V. Bautista",
      },
      {
        role: "Approved by (Dept Head)",
        empNo: "JCE 00007",
        name: "Carlos M. Mendoza",
      },
      {
        role: "Checked by (HR Head)",
        empNo: "JCE 00014",
        name: "Maria T. Santos",
      },
      {
        role: "Noted by (President / VP)",
        empNo: "JCE 00001",
        name: "Jose A. Cruz",
      },
    ],
    scans: [{ name: "rfl-26-044-signed.pdf", kind: "pdf" }],
    details: {
      kind: "rfl",
      leaveType: "Sick Leave",
      payType: "With Pay",
      from: "2026-05-26",
      to: "2026-05-26",
      days: 1,
      requestType: "After-the-fact",
      proof: [{ name: "med-cert.jpg", kind: "jpg" }],
    },
  },
  {
    id: "loa-wp-2026-006",
    no: "LOA-WP-2026-006",
    filed: "2026-05-18",
    type: "LOA Without Pay",
    emp: "D. Aguilar",
    key: "Others · 5 days",
    status: "Recorded",
    scan: true,
    leaveRef: "LOA-WP-2026-006",
    employees: [
      {
        no: "JCE 00048",
        name: "Diego R. Aguilar",
        pos: "Warehouseman",
        assign: "Main Office",
      },
    ],
    signers: [
      { role: "Requester", empNo: "JCE 00048", name: "Diego R. Aguilar" },
      {
        role: "Approved by (Section Head)",
        empNo: "JCE 00007",
        name: "Carlos M. Mendoza",
      },
      {
        role: "Noted by (Plant Operation Head)",
        empNo: "JCE 00001",
        name: "Jose A. Cruz",
      },
      {
        role: "Acknowledged by (HR)",
        empNo: "JCE 00014",
        name: "Maria T. Santos",
      },
    ],
    scans: [{ name: "loa-wp-2026-006-signed.pdf", kind: "pdf" }],
    details: {
      kind: "loa",
      from: "2026-05-18",
      to: "2026-05-22",
      days: 5,
      leaveType: "Others",
      reason: "Personal matters",
    },
  },
];

function reqSlug(no: string): string {
  return (
    no
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "req"
  );
}
function uniqueReqId(base: string): string {
  let id = base;
  let n = 2;
  while (requestStore.some((r) => r.id === id)) id = `${base}-${n++}`;
  return id;
}
function summarizeEmp(rec: { employees: readonly ReqEmployee[] }): string {
  const es = rec.employees;
  const first = es[0];
  if (!first) return "—";
  if (es.length === 1) return first.name;
  return `${first.name} +${es.length - 1}`;
}
function summarizeKey(rec: { details: RequestDetails }): string {
  const d = rec.details;
  switch (d.kind) {
    case "ob":
      return d.destination || "Off-site work";
    case "ot":
      return d.reason || d.section || "Overtime";
    case "rfl": {
      const lt =
        d.leaveType === "Others" && d.othersSpecify
          ? `Others (${d.othersSpecify})`
          : d.leaveType;
      return `${lt} · ${d.payType} · ${d.days} day${d.days === 1 ? "" : "s"}`;
    }
    case "loa":
      return `${d.leaveType} · ${d.days} day${d.days === 1 ? "" : "s"}`;
  }
}

/** The editable shape for a new/updated request (emp/key/scan/id are derived). */
export type RequestInput = Omit<RequestRecord, "id" | "emp" | "key" | "scan">;

export function getAllRequests(): readonly RequestRecord[] {
  return requestStore;
}
export function getRequests(type: RequestTypeLabel): readonly RequestRecord[] {
  return requestStore.filter((r) => r.type === type);
}
export function getRequestById(
  type: RequestTypeLabel,
  id: string,
): RequestRecord | undefined {
  return requestStore.find((r) => r.type === type && r.id === id);
}
export function addRequest(input: RequestInput): RequestRecord {
  const rec: RequestRecord = {
    ...input,
    id: uniqueReqId(reqSlug(input.no)),
    emp: summarizeEmp(input),
    key: summarizeKey(input),
    scan: input.scans.length > 0,
  };
  requestStore.unshift(rec);
  return rec;
}
export function updateRequest(
  id: string,
  patch: Partial<RequestInput>,
): RequestRecord | undefined {
  const i = requestStore.findIndex((r) => r.id === id);
  const cur = requestStore[i];
  if (!cur) return undefined;
  const merged: RequestRecord = { ...cur, ...patch };
  merged.emp = summarizeEmp(merged);
  merged.key = summarizeKey(merged);
  merged.scan = merged.scans.length > 0;
  requestStore[i] = merged;
  return merged;
}

// ---- §4.3 helpers ----------------------------------------------------------
function reqPad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Each YYYY-MM-DD in [from,to] that is NOT a Sunday (TZ-safe). Reversed/empty → []. */
export function workingDaysBetween(from: string, to: string): string[] {
  if (!from || !to) return [];
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  if (!fy || !fm || !fd || !ty || !tm || !td) return [];
  const cur = new Date(fy, fm - 1, fd);
  const end = new Date(ty, tm - 1, td);
  if (cur.getTime() > end.getTime()) return [];
  const out: string[] = [];
  let guard = 0;
  while (cur.getTime() <= end.getTime() && guard < 400) {
    const iso = `${cur.getFullYear()}-${reqPad2(cur.getMonth() + 1)}-${reqPad2(cur.getDate())}`;
    if (!isSunday(iso)) out.push(iso);
    cur.setDate(cur.getDate() + 1);
    guard += 1;
  }
  return out;
}

/** "8 yrs 3 mos" from a hire date vs HR_TODAY (deterministic). */
export function lengthOfService(hired: string): string {
  const [hy, hm, hd] = hired.split("-").map(Number);
  const [ty, tm, td] = HR_TODAY.split("-").map(Number);
  if (!hy || !hm || !hd || !ty || !tm || !td) return "—";
  let months = (ty - hy) * 12 + (tm - hm);
  if (td < hd) months -= 1;
  if (months < 0) months = 0;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const parts: string[] = [];
  if (yrs > 0) parts.push(`${yrs} yr${yrs === 1 ? "" : "s"}`);
  parts.push(`${mos} mo${mos === 1 ? "" : "s"}`);
  return parts.join(" ");
}

let loaSeq = 6;
/** System Internal ID for an LOA (in-session sequential). */
export function nextLoaId(): string {
  loaSeq += 1;
  return `LOA-WP-2026-0${loaSeq}`;
}

/** Auto-create a read-only timekeeping row per working day in [from,to]. Idempotent
 *  per source ref — re-running for the same ref skips days already created. */
export function autoCreateLeaveRowsForRange(input: {
  empNo: string;
  from: string;
  to: string;
  leave: string;
  ref: string;
}): number {
  const days = workingDaysBetween(input.from, input.to);
  let created = 0;
  for (const date of days) {
    const exists = timeRowStore.some(
      (r) =>
        (r.empNo ?? LEGACY_EMP_NO) === input.empNo &&
        r.date === date &&
        r.leaveRef === input.ref,
    );
    if (exists) continue;
    addLeaveRow({
      date,
      leave: input.leave,
      leaveRef: input.ref,
      remarks: "Auto from RFL/LOA",
      empNo: input.empNo,
    });
    created += 1;
  }
  return created;
}

// ---- HR audit log (H14, append-only) ---------------------------------------
export type HrAuditEntry = {
  ts: string;
  actor: string;
  rec: string;
  action: string;
  delta: string;
};

export const HR_AUDIT: readonly HrAuditEntry[] = [
  {
    ts: "2026-06-01 14:22",
    actor: "M. Santos (HR Head)",
    rec: "RFL-26-044",
    action: "Status change",
    delta: "Pending → Recorded",
  },
  {
    ts: "2026-06-01 09:12",
    actor: "R. Timekeeper",
    rec: "Batch · JCE 00031",
    action: "Verify",
    delta: "Open → Verified (locked)",
  },
  {
    ts: "2026-05-30 16:40",
    actor: "M. Santos (HR Head)",
    rec: "JCE 00081",
    action: "Employee create",
    delta: "— → Probationary",
  },
  {
    ts: "2026-05-28 11:05",
    actor: "R. Timekeeper",
    rec: "Batch · JCE 00081",
    action: "Re-open (reason)",
    delta: "Verified → Re-opened · “corrected OT”",
  },
  {
    ts: "2026-05-27 10:30",
    actor: "R. Timekeeper",
    rec: "Timekeeping · JCE 00077",
    action: "Edit",
    delta: "OT 0.0 → 1.5 (multi-project)",
  },
  {
    ts: "2026-05-22 08:15",
    actor: "M. Santos (HR Head)",
    rec: "JCE 00048",
    action: "Status change",
    delta: "Regular → Suspended",
  },
];

// ---- Derived helpers (computed, read-only) ---------------------------------
export function monthsLeft(end?: string): number | null {
  if (!end) return null;
  return Math.round(
    (new Date(end).getTime() - new Date(HR_TODAY).getTime()) / (MS_DAY * 30.4),
  );
}

/** Contractual employee with < 6 months left on the contract. */
export function expiringFlag(
  e: Pick<Employee, "type" | "contractEnd">,
): boolean {
  if (e.type !== "Contractual") return false;
  const m = monthsLeft(e.contractEnd);
  return m != null && m < 6;
}

export function yearsOfService(hired: string): number {
  return (
    (new Date(HR_TODAY).getTime() - new Date(hired).getTime()) /
    (MS_DAY * 365.25)
  );
}

export function ageOf(birthday: string): number {
  return Math.floor(
    (new Date(HR_TODAY).getTime() - new Date(birthday).getTime()) /
      (MS_DAY * 365.25),
  );
}

/** Total monthly compensation — Monthly category only (else null). */
export function totalMonthly(c: Compensation): number | null {
  if (c.cat !== "Monthly") return null;
  const m = typeof c.monthly === "number" ? c.monthly : 0;
  return m + c.allowance + c.project;
}

/** Daily basic + allowances — when a daily rate exists (else null). */
export function dailyTotal(c: Compensation): number | null {
  if (typeof c.daily !== "number") return null;
  return c.daily + c.dutyMeal + c.project;
}

export function findEmployee(id: number): Employee | undefined {
  return EMPLOYEES.find((e) => e.id === id);
}

export function findEmployeeByNo(no: string): Employee | undefined {
  return EMPLOYEES.find((e) => e.no === no);
}

/** Append a new employee to the in-session store (H3 create). Assigns the next
 *  id, a running S/N within the Salary Rate Category, and a fallback employee
 *  number when blank. Returns the created record. In-session only. */
export function addEmployee(input: Omit<Employee, "id" | "sn">): Employee {
  const id = employeeStore.reduce((m, e) => Math.max(m, e.id), 0) + 1;
  const sn = employeeStore.filter((e) => e.cat === input.cat).length + 1;
  const no = input.no.trim() === "" ? `JCE 0${9000 + id}` : input.no.trim();
  const created: Employee = { ...input, id, sn, no };
  employeeStore.push(created);
  return created;
}

/** Replace an existing employee in the store, by id (H3 edit). In-session. */
export function updateEmployee(emp: Employee): void {
  const i = employeeStore.findIndex((e) => e.id === emp.id);
  if (i >= 0) employeeStore[i] = emp;
}

// ---- Insurance enrollment status -------------------------------------------
export type InsuranceStatus = "active" | "expiring" | "expired" | "none";

export const INS_STATUS_TONE: Record<InsuranceStatus, Tone> = {
  active: "success",
  expiring: "pending",
  expired: "danger",
  none: "neutral",
};

/** Insurance status for the (non-color-only) Chip. "expiring" = < 3 months out. */
export function insuranceStatus(
  e: Pick<Employee, "insurance" | "insExpiry">,
): InsuranceStatus {
  if (e.insurance !== "Yes") return "none";
  const m = monthsLeft(e.insExpiry);
  if (m == null) return "active"; // enrolled, no expiry on file
  if (m < 0) return "expired";
  if (m < 3) return "expiring";
  return "active";
}

// ---- Contract extensions (append-only history + renew action) --------------
export type ContractExtension = {
  id: string;
  empNo: string;
  /** YYYY-MM-DD the renewal was recorded */
  renewedOn: string;
  term: 3 | 6;
  previousEnd?: string;
  newEnd: string;
  by: string;
};

// In-session append-only extension log, seeded with a couple of examples for
// existing contractual employees so the demo history isn't empty.
const contractExtStore: ContractExtension[] = [
  {
    id: "CE-0001",
    empNo: "JCE 00094", // Allan G. Tolentino (Contractual)
    renewedOn: "2026-01-10",
    term: 6,
    previousEnd: "2026-01-10",
    newEnd: "2026-07-10",
    by: "M. Santos (HR Head)",
  },
  {
    id: "CE-0002",
    empNo: "JCE 00081", // Roberto S. Villanueva (Contractual)
    renewedOn: "2026-03-03",
    term: 6,
    previousEnd: "2026-03-03",
    newEnd: "2026-09-03",
    by: "M. Santos (HR Head)",
  },
];

let contractExtSeq = contractExtStore.length;

/** Contract extensions for an employee, newest-first. */
export function getContractExtensions(
  empNo: string,
): readonly ContractExtension[] {
  return contractExtStore.filter((x) => x.empNo === empNo).reverse();
}

/**
 * Renew a contractual employee's contract by `term` months FROM the renewal date
 * (newEnd = addMonths(on, term)), regardless of the old end. Captures the
 * previous end, updates the employee's contractEnd in the store (so expiry flags
 * + the dashboard KPI recompute), appends the extension and returns it.
 * In-session only.
 */
export function renewContract(input: {
  empNo: string;
  term: 3 | 6;
  by: string;
  on?: string;
}): ContractExtension {
  const on = input.on ?? HR_TODAY;
  const i = employeeStore.findIndex((e) => e.no === input.empNo);
  const cur = employeeStore[i];
  const previousEnd = cur?.contractEnd;
  const newEnd = addMonths(on, input.term);
  if (cur) employeeStore[i] = { ...cur, contractEnd: newEnd };
  contractExtSeq += 1;
  const ext: ContractExtension = {
    id: `CE-${String(contractExtSeq).padStart(4, "0")}`,
    empNo: input.empNo,
    renewedOn: on,
    term: input.term,
    ...(previousEnd ? { previousEnd } : {}),
    newEnd,
    by: input.by,
  };
  contractExtStore.push(ext);
  return ext;
}

// ============================================================================
// H5b · Excel bulk import — PURE parse/map/validate/commit layer (dep-free, so
// it is Vitest-tested without SheetJS). One worksheet row = one TimeRow. Every
// default/rule MIRRORS buildSiteDayRows so export∘import == the on-screen path,
// and commit reuses addTimeRow/updateTimeRow + the (empNo,date,proj) key + the
// per-employee lock check (never a second store, never a key/derived mutation).
// SheetJS lives only in the client wizard and hands RawImportRow[] to here.
// ============================================================================

export type ImportColumn = { label: string; key: string; required: boolean };

/** Canonical column contract. Header matching is case/space-insensitive. */
export const IMPORT_COLUMNS: readonly ImportColumn[] = [
  { label: "Employee No", key: "empNo", required: true },
  { label: "Employee Name", key: "name", required: false },
  { label: "Site / Place of Assignment", key: "site", required: false },
  { label: "Date", key: "date", required: true },
  { label: "Day Type", key: "dayType", required: false },
  { label: "Time In", key: "timeIn", required: false },
  { label: "Time Out", key: "timeOut", required: false },
  { label: "Project Code", key: "proj", required: false },
  { label: "Leave", key: "leave", required: false },
  { label: "Leave Ref", key: "leaveRef", required: false },
  { label: "Remarks", key: "remarks", required: false },
];

/** A worksheet row keyed by the canonical column keys (strings). */
export type RawImportRow = Record<string, string>;

export type StagedAction =
  | "add"
  | "update"
  | "skip-locked"
  | "skip-duplicate"
  | "error";

export type StagedRow = {
  input: RawImportRow;
  row: Omit<TimeRow, "id"> | null;
  severity: "ok" | "warning" | "error";
  action: StagedAction;
  matchId?: number;
  messages: string[];
};

export type ImportSummary = {
  toAdd: number;
  toUpdate: number;
  skippedLocked: number;
  errors: number;
  warnings: number;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

const ABSENT_TOKENS = new Set(["ABSENT", "A", "—", "-"]);

/** Match a raw worksheet header to a canonical column key (case/space-insensitive
 *  + a few common aliases). null when it maps to no canonical column. */
export function importHeaderKey(header: string): string | null {
  const n = header.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const c of IMPORT_COLUMNS)
    if (c.label.toLowerCase().replace(/[^a-z0-9]/g, "") === n) return c.key;
  if (n === "employeeno" || n === "empno" || n === "no") return "empNo";
  if (n === "employeename") return "name";
  if (n === "site" || n === "placeofassignment" || n === "assignment")
    return "site";
  if (n === "timein" || n === "in") return "timeIn";
  if (n === "timeout" || n === "out") return "timeOut";
  if (n === "projectcode" || n === "project" || n === "proj") return "proj";
  if (n === "daytype") return "dayType";
  if (n === "leaveref") return "leaveRef";
  return null;
}

/** ISO "YYYY-MM-DD" / Excel serial number / JS Date → "YYYY-MM-DD" (or null). */
export function normalizeImportDate(v: string | number | Date): string | null {
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return null;
    return `${v.getFullYear()}-${pad2(v.getMonth() + 1)}-${pad2(v.getDate())}`;
  }
  if (typeof v === "number") {
    if (!Number.isFinite(v) || v <= 0) return null;
    // Excel serial: days since 1899-12-30 (25569 = that epoch in Unix days).
    const d = new Date(Math.round((v - 25569) * 86400 * 1000));
    if (Number.isNaN(d.getTime())) return null;
    return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
  }
  const s = v.trim();
  if (s === "") return null;
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (iso) {
    const m = Number(iso[2]);
    const d = Number(iso[3]);
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;
    return `${iso[1]}-${pad2(m)}-${pad2(d)}`;
  }
  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  if (us) {
    const m = Number(us[1]);
    const d = Number(us[2]);
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;
    return `${us[3]}-${pad2(m)}-${pad2(d)}`;
  }
  if (/^\d+(\.\d+)?$/.test(s)) return normalizeImportDate(Number(s));
  return null;
}

/** Trim/collapse-spaces/upper an Employee No for matching against EMPLOYEES.no. */
export function normalizeEmpNo(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").toUpperCase();
}

/** Serialize a TimeRow to canonical column strings — the template writer + the
 *  round-trip test share this so export∘import is provably identity. */
export function timeRowToRaw(row: Omit<TimeRow, "id">): RawImportRow {
  const empNo = row.empNo ?? LEGACY_EMP_NO;
  return {
    empNo,
    name: findEmployeeByNo(empNo)?.name ?? "",
    site: row.site ?? "",
    date: row.date,
    dayType: row.dayType,
    timeIn: row.in === "—" ? "ABSENT" : row.in,
    timeOut: row.out === "—" ? "ABSENT" : row.out,
    proj: row.proj,
    leave: row.leave ?? "",
    leaveRef: row.leaveRef ?? "",
    remarks: row.remarks,
  };
}

function field(raw: RawImportRow, key: string): string {
  return (raw[key] ?? "").trim();
}

/** Map ONE raw row → a staged row (resolve + default + validate; no store probe
 *  yet). Mirrors buildSiteDayRows defaults exactly. */
export function mapImportRow(raw: RawImportRow): StagedRow {
  const messages: string[] = [];
  const err = (msg: string): StagedRow => ({
    input: raw,
    row: null,
    severity: "error",
    action: "error",
    messages: [...messages, msg],
  });

  const rawNo = field(raw, "empNo");
  if (!rawNo) return err("Employee No is required.");
  const wanted = normalizeEmpNo(rawNo);
  const emp = EMPLOYEES.find((e) => normalizeEmpNo(e.no) === wanted);
  if (!emp)
    return err(`Employee No "${rawNo}" not found (unknown or archived).`);
  if (emp.status === "Resigned" || emp.status === "Terminated")
    return err(`${emp.name} is ${emp.status} — cannot record time.`);

  const date = normalizeImportDate(field(raw, "date"));
  if (!date)
    return err(`Date "${field(raw, "date")}" is invalid (use YYYY-MM-DD).`);

  const rawSite = field(raw, "site");
  const site = rawSite || emp.assign;
  if (rawSite && rawSite !== emp.assign)
    messages.push(
      `Site "${rawSite}" differs from ${emp.name}'s assignment "${emp.assign}" — importing with the provided site.`,
    );

  const rawName = field(raw, "name");
  if (rawName && rawName.toLowerCase() !== emp.name.toLowerCase())
    messages.push(`Name "${rawName}" differs from record "${emp.name}".`);

  const siteDefault = getSiteDayType(site, date);
  const rawDayType = field(raw, "dayType");
  let dayType = siteDefault;
  let dayTypeOverridden = false;
  if (rawDayType) {
    if (!(DAY_TYPES as readonly string[]).includes(rawDayType))
      return err(
        `Day Type "${rawDayType}" is invalid. Use one of: ${DAY_TYPES.join(", ")}.`,
      );
    dayType = rawDayType;
    dayTypeOverridden = rawDayType !== siteDefault;
  }

  const std = standardHoursForSite(site);
  const parseTime = (key: string, fallback: string): string | null => {
    const t = field(raw, key);
    if (t === "") return fallback;
    if (ABSENT_TOKENS.has(t.toUpperCase())) return "—";
    if (isTimeValue(t) && t !== "—") return t;
    return null;
  };
  const inT = parseTime("timeIn", std.in);
  if (inT === null)
    return err(
      `Time In "${field(raw, "timeIn")}" is invalid — use HH:MM or ABSENT.`,
    );
  const outT = parseTime("timeOut", std.out);
  if (outT === null)
    return err(
      `Time Out "${field(raw, "timeOut")}" is invalid — use HH:MM or ABSENT.`,
    );

  let proj = field(raw, "proj") || projCodeForAssign(site);
  let inVal = inT;
  let outVal = outT;
  const rawLeave = field(raw, "leave");
  let leave: string | null = null;
  if (rawLeave) {
    leave = rawLeave;
    if (
      inT !== std.in ||
      outT !== std.out ||
      field(raw, "timeIn") ||
      field(raw, "timeOut")
    )
      messages.push("Leave set — Time In/Out forced to — and project cleared.");
    inVal = "—";
    outVal = "—";
    proj = "—";
  }
  const leaveRef = field(raw, "leaveRef");
  const remarks = field(raw, "remarks");

  const row: Omit<TimeRow, "id"> = {
    empNo: emp.no,
    site,
    date,
    day: weekdayOf(date),
    dayType,
    proj,
    in: inVal,
    out: outVal,
    leave,
    remarks,
    ...(leaveRef ? { leaveRef } : {}),
    ...(dayTypeOverridden ? { dayTypeOverridden: true } : {}),
  };
  return {
    input: raw,
    row,
    severity: messages.length > 0 ? "warning" : "ok",
    action: "add",
    messages,
  };
}

/** Map all rows, collapse intra-file (empNo,date,proj) duplicates (keep last),
 *  flag multi-project siblings, then decide each action against the live store +
 *  per-employee lock. */
export function validateImportRows(raws: readonly RawImportRow[]): {
  staged: StagedRow[];
  summary: ImportSummary;
} {
  const staged = raws.map((r) => mapImportRow(r));

  // intra-file duplicate collapse + multi-project sibling detection
  const lastByKey = new Map<string, number>(); // (empNo|date|proj) → staged index
  const byEmpDate = new Map<string, Set<string>>(); // (empNo|date) → set of proj
  staged.forEach((s, i) => {
    if (!s.row || s.severity === "error") return;
    const key = `${s.row.empNo}|${s.row.date}|${s.row.proj}`;
    const prev = lastByKey.get(key);
    if (prev != null) {
      const p = staged[prev];
      if (p) {
        p.action = "skip-duplicate";
        p.severity = "warning";
        p.messages = [
          ...p.messages,
          "Superseded by a later row for the same employee/date/project.",
        ];
      }
    }
    lastByKey.set(key, i);
    const ed = `${s.row.empNo}|${s.row.date}`;
    const set = byEmpDate.get(ed) ?? new Set<string>();
    set.add(s.row.proj);
    byEmpDate.set(ed, set);
  });

  // mark multi-project siblings + resolve store action
  for (const s of staged) {
    if (!s.row || s.action === "skip-duplicate" || s.severity === "error")
      continue;
    const ed = `${s.row.empNo}|${s.row.date}`;
    if ((byEmpDate.get(ed)?.size ?? 0) > 1) s.row = { ...s.row, multi: true };

    const empNo = s.row.empNo ?? LEGACY_EMP_NO;
    const existing = getTimeRowsForEmployee(empNo).find(
      (r) => r.date === s.row?.date && r.proj === s.row?.proj,
    );
    if (existing) {
      if (isLockedForEmployee(empNo)) {
        s.action = "skip-locked";
        s.messages = [
          ...s.messages,
          "Matches a Verified (locked) row — left unchanged.",
        ];
      } else {
        s.action = "update";
        s.matchId = existing.id;
      }
    } else {
      s.action = "add";
    }
  }

  const summary: ImportSummary = {
    toAdd: staged.filter((s) => s.action === "add").length,
    toUpdate: staged.filter((s) => s.action === "update").length,
    skippedLocked: staged.filter((s) => s.action === "skip-locked").length,
    errors: staged.filter((s) => s.severity === "error").length,
    warnings: staged.filter((s) => s.severity === "warning").length,
  };
  return { staged, summary };
}

/** Commit staged rows into the shared store. add → addTimeRow; update →
 *  updateTimeRow(matchId, editable patch only); skips locked/duplicate/error.
 *  Idempotent: a re-commit re-applies the same patches (no-op end state). */
export function commitImportRows(staged: readonly StagedRow[]): {
  added: number;
  updated: number;
  skippedLocked: number;
  errors: number;
} {
  let added = 0;
  let updated = 0;
  let skippedLocked = 0;
  let errors = 0;
  for (const s of staged) {
    if (s.action === "add" && s.row) {
      addTimeRow(s.row);
      added += 1;
    } else if (s.action === "update" && s.row && s.matchId != null) {
      updateTimeRow(s.matchId, {
        in: s.row.in,
        out: s.row.out,
        dayType: s.row.dayType,
        leave: s.row.leave,
        remarks: s.row.remarks,
        dayTypeOverridden: true,
        ...(s.row.leaveRef ? { leaveRef: s.row.leaveRef } : {}),
        ...(s.row.multi ? { multi: true } : {}),
      });
      updated += 1;
    } else if (s.action === "skip-locked") {
      skippedLocked += 1;
    } else if (s.action === "error") {
      errors += 1;
    }
  }
  return { added, updated, skippedLocked, errors };
}

/** Template rows = buildSiteDayRows for each requested (site,date) — the
 *  round-trip source the export writes and the import reads back. */
export function generateTemplateRows(input: {
  sites: readonly string[];
  dates: readonly string[];
}): TimeRow[] {
  const out: TimeRow[] = [];
  for (const site of input.sites)
    for (const date of input.dates)
      out.push(...buildSiteDayRows({ site, date }));
  return out;
}
