import type { Metadata } from "next";

import { BlanketPos } from "./blanket";

export const metadata: Metadata = { title: "Blanket POs" };

export default function BlanketPage() {
  return <BlanketPos />;
}
