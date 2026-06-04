import type { Metadata } from "next";

import { BoqView } from "./boq-view";

export const metadata: Metadata = { title: "BOQ" };

// P6 · Bill of Quantities.
export default function BoqPage() {
  return <BoqView />;
}
