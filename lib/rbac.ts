// ============================================================================
// JCE SYSTEM — RBAC config + helpers.
// One role per user, no unions (brief:116). Ported from shell.jsx:35-75.
//   • Nav is HIDDEN (not disabled) for absent grants  (shell.jsx:82,103)
//   • Read-grants render as static text, not disabled inputs  (brief:175)
//   • Verbs Approve/Post/Lock are ABSENT (not disabled) for roles lacking them
//   • Compensation is masked unless payroll/owner  (hr-data.jsx:6)
// UI/UX mock only — there is no server-side enforcement here. Pure + typed.
// ============================================================================

export type ModuleId =
  | "home"
  | "hr"
  | "acc"
  | "pmg"
  | "pur"
  | "wh"
  | "bdd"
  | "eng"
  | "self"
  | "admin";

/** F = full · E = edit · R = read-only. Absent key = no access (hidden nav). */
export type Grant = "F" | "E" | "R";

export type ModuleDef = {
  id: ModuleId;
  label: string;
  /** semantic icon id, resolved to a lucide component in the client shell */
  icon: string;
  /** dashboard route base for this module (PMG at /pmg — never /projects) */
  href: string;
};

// MODULES — shell.jsx:35-46. Routes per implementation plan §4.
export const MODULES: readonly ModuleDef[] = [
  { id: "home", label: "Home", icon: "home", href: "/dashboard" },
  { id: "hr", label: "HR", icon: "hr", href: "/hr" },
  { id: "acc", label: "Accounting", icon: "acc", href: "/accounting" },
  { id: "pmg", label: "Project Mgmt", icon: "pmg", href: "/pmg" },
  { id: "pur", label: "Purchasing", icon: "pur", href: "/purchasing" },
  { id: "wh", label: "Warehouse", icon: "wh", href: "/warehouse" },
  { id: "bdd", label: "BDD", icon: "bdd", href: "/bdd" },
  { id: "eng", label: "Engineering", icon: "eng", href: "/engineering" },
  { id: "self", label: "My HR", icon: "self", href: "/my-hr" },
  { id: "admin", label: "Admin", icon: "cfg", href: "/admin" },
] as const;

export type RoleId =
  | "owner"
  | "admin"
  | "employee"
  | "hrhead"
  | "timekeeper"
  | "acctglead"
  | "payroll"
  | "pmhead"
  | "purchsup"
  | "warehouse"
  | "siteeng"
  | "bddlead";

export type Role = {
  name: string;
  short: string;
  home: ModuleId;
  access: Partial<Record<ModuleId, Grant>>;
  note?: string;
};

// ROLES — brief §3.2 / shell.jsx:50-75. The prototype ships 12 of 19 roles;
// the remaining 7 (Accounting Staff, PMG Staff, Purchasing Staff, Finance/AP,
// Management/President, BDD Staff, Engineering) are deferred (plan §10).
export const ROLES: Record<RoleId, Role> = {
  owner: {
    name: "Owner",
    short: "Owner",
    home: "home",
    access: {
      home: "F",
      hr: "F",
      acc: "F",
      pmg: "F",
      pur: "F",
      wh: "F",
      bdd: "F",
      eng: "F",
      admin: "F",
    },
  },
  admin: {
    name: "System Admin",
    short: "Admin",
    home: "admin",
    access: {
      home: "R",
      hr: "R",
      acc: "R",
      pmg: "R",
      pur: "R",
      wh: "R",
      bdd: "R",
      eng: "R",
      admin: "F",
    },
  },
  employee: {
    name: "Employee · Self-Service",
    short: "Employee",
    home: "self",
    access: { home: "F", self: "F" },
  },
  hrhead: {
    name: "HR Head",
    short: "HR Head",
    home: "hr",
    access: { home: "F", hr: "F", self: "F" },
    note: "compensation masked",
  },
  timekeeper: {
    name: "Timekeeper",
    short: "Timekeeper",
    home: "hr",
    access: { home: "F", hr: "E", pmg: "R", bdd: "R", self: "F" },
  },
  acctglead: {
    name: "Accounting Lead / CFO",
    short: "Acctg Lead",
    home: "acc",
    access: { home: "F", acc: "F", pur: "R", self: "F" },
    note: "no compensation",
  },
  payroll: {
    name: "Payroll Officer",
    short: "Payroll",
    home: "acc",
    access: { home: "F", acc: "E", hr: "R", self: "F" },
    note: "sees compensation",
  },
  pmhead: {
    name: "PM Head",
    short: "PM Head",
    home: "pmg",
    access: { home: "F", pmg: "F", pur: "R", wh: "R", self: "F" },
  },
  purchsup: {
    name: "Purchasing Supervisor",
    short: "Purch Sup",
    home: "pur",
    access: { home: "F", pur: "F", pmg: "R", wh: "R", self: "F" },
  },
  warehouse: {
    name: "Warehouse Admin",
    short: "Warehouse",
    home: "wh",
    access: { home: "F", wh: "F", pmg: "R", pur: "R", self: "F" },
    note: "Lock/Unlock authority",
  },
  // Site Engineer holds wh:"E" (create/submit MRRs, Releases & off-BOQ rows for
  // assigned sites) — NOT the SRS §3.5 matrix's literal "R", which understated the
  // role. §10.14.1 grants create/submit; Lock/Unlock/Adjustment/Confirm/Promote
  // are withheld via canVerb (F-only) per the §3.4 edit-vs-verb split. Ratified in
  // SRS v1.74 (§3.5 cell aligned to E).
  siteeng: {
    name: "Site Engineer",
    short: "Site Eng",
    home: "wh",
    access: { home: "F", wh: "E", pmg: "R", self: "F" },
    note: "assigned sites only",
  },
  bddlead: {
    name: "BDD Lead / Admin",
    short: "BDD Lead",
    home: "bdd",
    access: { home: "F", bdd: "F", self: "F" },
  },
};

/** Role ids in switcher order (insertion order of ROLES). */
export const ROLE_IDS = Object.keys(ROLES) as RoleId[];

// ---- Helpers ---------------------------------------------------------------

export function getGrant(role: RoleId, module: ModuleId): Grant | undefined {
  return ROLES[role].access[module];
}

/** True when the role can see the module at all (drives visible, not disabled). */
export function hasGrant(role: RoleId, module: ModuleId): boolean {
  return getGrant(role, module) != null;
}

/** Read-only access → render values as static text, never as disabled inputs. */
export function isReadOnly(role: RoleId, module: ModuleId): boolean {
  return getGrant(role, module) === "R";
}

/** Edit or full grant → form inputs are live. */
export function canEdit(role: RoleId, module: ModuleId): boolean {
  const g = getGrant(role, module);
  return g === "F" || g === "E";
}

/**
 * Workflow-verb visibility (Approve/Post/Lock). Full grant only — verbs are
 * ABSENT (conditionally rendered), never disabled, for lesser grants.
 */
export function canVerb(role: RoleId, module: ModuleId): boolean {
  return getGrant(role, module) === "F";
}

/** Modules visible in the nav for a role (hidden ones are filtered out). */
export function visibleModules(role: RoleId): readonly ModuleDef[] {
  return MODULES.filter((m) => hasGrant(role, m.id));
}

/** Compensation is sensitive — masked for everyone except Payroll + Owner. (hr-data.jsx:6) */
export function CAN_SEE_COMP(role: RoleId): boolean {
  return role === "payroll" || role === "owner";
}
