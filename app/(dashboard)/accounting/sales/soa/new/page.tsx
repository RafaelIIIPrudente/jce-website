import type { Metadata } from "next";

import { IssueSoa } from "./issue-soa";

export const metadata: Metadata = { title: "Issue Statement of Account" };

// A9 · Issue Statement of Account (flagship).
export default function IssueSoaPage() {
  return <IssueSoa />;
}
