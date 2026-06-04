import { redirect } from "next/navigation";

// The HR module (sidebar) points at /hr; land on Employees (H1, OQ#7).
export default function HrIndexPage() {
  redirect("/hr/employees");
}
