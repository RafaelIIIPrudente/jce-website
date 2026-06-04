import type { Metadata } from "next";

import { MrrRegister } from "./mrr-register";

export const metadata: Metadata = { title: "MRR" };

export default function MrrPage() {
  return <MrrRegister />;
}
