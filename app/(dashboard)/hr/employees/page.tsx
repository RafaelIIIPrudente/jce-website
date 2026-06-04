import type { Metadata } from "next";

import { EmployeesList } from "./employees-list";

export const metadata: Metadata = { title: "Employees" };

// H1 · Grouped employee list (flagship). Module landing for HR (OQ#7).
export default function EmployeesPage() {
  return <EmployeesList />;
}
