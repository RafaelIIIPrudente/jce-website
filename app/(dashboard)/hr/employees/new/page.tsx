import type { Metadata } from "next";

import { EmployeeForm } from "../employee-form";

export const metadata: Metadata = { title: "Add employee" };

// H3 · Add employee.
export default function NewEmployeePage() {
  return <EmployeeForm mode="new" />;
}
