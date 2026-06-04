import type { Metadata } from "next";

import { MyHrHome } from "./my-hr-home";

export const metadata: Metadata = { title: "My HR" };

// H12 · Self-service home — own records only (Employee role lands here).
export default function MyHrPage() {
  return <MyHrHome />;
}
