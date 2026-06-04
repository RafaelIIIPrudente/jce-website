import type { Metadata } from "next";

import { Custody } from "./custody";

export const metadata: Metadata = { title: "Tool custody" };

export default function CustodyPage() {
  return <Custody />;
}
