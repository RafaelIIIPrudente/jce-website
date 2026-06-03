export type Accreditation = {
  name: string;
  acronym: string;
  description: string;
};

/**
 * Placeholder list — accreditations to be confirmed with the client.
 * Until logos are licensed, the AccreditationStrip renders typographic
 * acronyms inside outlined plates.
 */
export const ACCREDITATIONS: readonly Accreditation[] = [
  {
    name: "National Grid Corporation of the Philippines",
    acronym: "NGCP",
    description: "Accredited contractor",
  },
  {
    name: "Department of Energy",
    acronym: "DOE",
    description: "FIT applications",
  },
  {
    name: "Energy Regulatory Commission",
    acronym: "ERC",
    description: "Point-to-point approval",
  },
  {
    name: "Philippine Contractors Accreditation Board",
    acronym: "PCAB",
    description: "Licensed contractor",
  },
] as const;
