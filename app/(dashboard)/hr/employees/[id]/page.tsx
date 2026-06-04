import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findEmployee } from "@/lib/mock/hr";
import { EmployeeRecord } from "./employee-record";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const emp = findEmployee(Number(id));
  return { title: emp ? emp.name : "Employee" };
}

// H2 · Employee record.
export default async function EmployeeRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const emp = findEmployee(Number(id));
  if (!emp) notFound();
  return <EmployeeRecord emp={emp} />;
}
