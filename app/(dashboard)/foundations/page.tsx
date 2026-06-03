import type { Metadata } from "next";

import { FoundationsGallery } from "./foundations-gallery";

export const metadata: Metadata = {
  title: "Foundations",
  description:
    "JCE System — design foundations: tokens, surfaces and the shared component library.",
};

// Dev/verification gallery — renders every jce/ component in its states, mirroring
// docs/FINAL JCE PROJECT DESIGN/Foundations.html. (Routed, not an `_private`
// folder, so it is reachable for visual verification at /foundations.)
export default function FoundationsPage() {
  return <FoundationsGallery />;
}
