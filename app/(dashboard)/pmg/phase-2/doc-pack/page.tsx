import type { Metadata } from "next";

import { DocPack } from "./doc-pack";

export const metadata: Metadata = { title: "Document pack" };

// P18 · Document pack export.
export default function DocPackPage() {
  return <DocPack />;
}
