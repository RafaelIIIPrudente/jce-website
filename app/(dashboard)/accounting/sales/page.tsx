import type { Metadata } from "next";

import { SalesRegister } from "./sales-register";

export const metadata: Metadata = { title: "Billing register" };

// A7 · Billing register.
export default function SalesPage() {
  return <SalesRegister />;
}
