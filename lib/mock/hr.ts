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
};

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

/** Current timekeeping rows (incl. any auto-created leave rows this session). */
export function getTimeRows(): readonly TimeRow[] {
  return [...timeRowStore];
}

/** Auto-create a read-only leave row (an approved RFL/LOA, recording-only). */
export function addLeaveRow(input: {
  date: string;
  leave: string;
  leaveRef: string;
  remarks?: string;
}): void {
  const d = new Date(input.date);
  timeRowStore.push({
    id: Math.max(0, ...timeRowStore.map((r) => r.id)) + 1,
    date: input.date,
    day: WEEKDAYS[d.getDay()] ?? "Mon",
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

export type RequestRecord = {
  no: string;
  filed: string;
  emp: string;
  key: string;
  status: RequestStatus;
  /** scanned signed copy attached — gates Pending → Approved/Recorded */
  scan: boolean;
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

export const REQUESTS: Record<RequestTypeLabel, readonly RequestRecord[]> = {
  "OB/Travel": [
    {
      no: "OB-2026-014",
      filed: "2026-05-30",
      emp: "5 employees · Cavite team",
      key: "Cavite Line site visit",
      status: "Pending",
      scan: false,
    },
    {
      no: "OB-2026-012",
      filed: "2026-05-22",
      emp: "P. Garcia +2",
      key: "Bulacan inspection",
      status: "Approved",
      scan: true,
    },
  ],
  Overtime: [
    {
      no: "OT FORM NO. 2026-022",
      filed: "2026-05-29",
      emp: "Shop · 8 staff",
      key: "Fabrication push",
      status: "Pending",
      scan: false,
    },
    {
      no: "OT FORM NO. 2026-019",
      filed: "2026-05-20",
      emp: "N. Bautista",
      key: "Night energization",
      status: "Approved",
      scan: true,
    },
  ],
  "Request for Leave": [
    {
      no: "RFL-26-051",
      filed: "2026-06-01",
      emp: "R. dela Cruz",
      key: "Vacation Leave · With Pay · 3 days",
      status: "Pending",
      scan: false,
    },
    {
      no: "RFL-26-044",
      filed: "2026-05-26",
      emp: "N. Bautista",
      key: "Sick Leave · With Pay · 1 day",
      status: "Recorded",
      scan: true,
    },
  ],
  "LOA Without Pay": [
    {
      no: "LOA-WP-2026-006",
      filed: "2026-05-18",
      emp: "D. Aguilar",
      key: "Personal · 5 days",
      status: "Recorded",
      scan: true,
    },
  ],
};

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
