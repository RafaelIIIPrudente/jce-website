import type { Metadata } from "next";

import { type Rfp } from "@/lib/mock/purchasing";
import { RfpForm } from "../rfp-form";

export const metadata: Metadata = { title: "New RFP" };

// A new RFP is raised from an Approved PO (2605-0204 · Cebu Steel) as a Draft —
// the three-way gate must pass before it can be Submitted.
const DRAFT_RFP: Rfp = {
  no: "RFP-PUR-2606####",
  date: "2026-06-03",
  po: "2605-0204",
  supplier: "Cebu Steel Corp.",
  project: "Workshop",
  type: "Single",
  due: "2026-06-18",
  net: 312081,
  status: "Draft",
};

export default function NewRfpPage() {
  return <RfpForm rfp={DRAFT_RFP} />;
}
