import { redirect } from "next/navigation";

// The Accounting module (sidebar) points at /accounting; land on Payroll
// Summary (A4, OQ#7 — landing dashboards unspecified, routes to primary register).
export default function AccountingIndexPage() {
  redirect("/accounting/payroll");
}
