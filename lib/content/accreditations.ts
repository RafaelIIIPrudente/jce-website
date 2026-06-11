// ============================================================================
// JCE — Licenses & Accreditations (single source of truth).
// Authoritative split per docs/JCE-COMPANY-PROFILE-NOTES.md §9 (client-reviewed
// 2026-06-04): ONLY the §9 SAFE list appears here. License/registration numbers
// below are public record and help procurement officers verify the company.
// NEVER add §9 WITHHOLD items (TINs, document scans, permit fee/account numbers,
// personal emails, or officers' names in a tax context).
//
// This file is the canonical home for credential data: the About page renders
// LICENSES directly, and the Home trust bar + footer render the derived
// CREDENTIAL_STRIP. There is no second copy (the former ABOUT.accreditations
// placeholder was removed).
// ============================================================================

export type License = {
  /** Full issuer / registry name. */
  issuer: string;
  /** Short acronym shown in the VoltageTag. */
  acronym: string;
  /** Public registration / license number, where verifiable. Optional. */
  licenseNo?: string;
  /** One-line scope / membership detail. Optional. */
  detail?: string;
  /** "Since" / registration year or date. Optional. */
  since?: string;
  /** Validity end (month + year). Optional. */
  validUntil?: string;
  /**
   * §9-SAFE SEC registered office (FR-WEB-19), rendered as a labelled
   * "Registered office" line. This is DISTINCT from the contact NAP
   * (3074 F. Bautista St.) and must never be normalized to it. Optional.
   */
  address?: string;
};

// §9 SAFE list only. Optional fields are omitted (not nulled) where the source
// has no public value — the UI renders missing fields with no dangling
// separators.
export const LICENSES: readonly License[] = [
  {
    issuer: "Securities and Exchange Commission",
    acronym: "SEC",
    licenseNo: "CS200711697",
    detail: "Registered corporation",
    // §9-SAFE SEC registered office (FR-WEB-19) — distinct from the contact NAP.
    address: "2129 La Mesa St., Ugong, Valenzuela City",
    since: "July 24, 2007",
  },
  {
    issuer: "Philippine Contractors Accreditation Board",
    acronym: "PCAB",
    licenseNo: "37783",
    detail:
      "Regular Contractor's License — General Engineering Category A, General Building, Specialty Electrical",
    since: "2014",
    validUntil: "April 2027",
  },
  {
    issuer: "Philippine Government Electronic Procurement System",
    acronym: "PhilGEPS",
    detail: "Platinum Membership",
    since: "2012",
    validUntil: "January 2027",
  },
  {
    issuer: "National Grid Corporation of the Philippines",
    acronym: "NGCP",
    detail: "Accredited Local Contractor — Substation Erection",
    since: "2016",
  },
  {
    issuer: "Department of Energy",
    acronym: "DOE",
    detail: "Feed-in-Tariff (FIT) service contracts",
  },
  {
    issuer: "Energy Regulatory Commission",
    acronym: "ERC",
    detail: "Point-to-point approval",
  },
] as const;

// Derived compact strip for the Home trust bar + footer — acronym + a 2–3 word
// label. Hand-authored (the labels are tighter than the full `detail`) and
// ordered most-recognizable-first for procurement audiences.
export type Credential = { acronym: string; label: string };

export const CREDENTIAL_STRIP: readonly Credential[] = [
  { acronym: "PCAB", label: "Category A" },
  { acronym: "PhilGEPS", label: "Platinum" },
  { acronym: "NGCP", label: "Accredited" },
  { acronym: "SEC", label: "Registered" },
] as const;
