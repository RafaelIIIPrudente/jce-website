import type { Metadata } from "next";

import { PrqRegister } from "./prq-register";

export const metadata: Metadata = { title: "Requisitions" };

export default function RequisitionsPage() {
  return <PrqRegister />;
}
