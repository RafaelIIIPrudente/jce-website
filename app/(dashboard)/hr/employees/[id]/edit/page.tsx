import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findEmployee } from "@/lib/mock/hr";
import { EmployeeForm } from "../../employee-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const emp = findEmployee(Number(id));
  return { title: emp ? `Edit — ${emp.name}` : "Edit employee" };
}

// H3 · Edit employee.
export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const emp = findEmployee(Number(id));
  if (!emp) notFound();
  return <EmployeeForm mode="edit" emp={emp} />;
}
