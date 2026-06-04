import { redirect } from "next/navigation";

// The Warehouse module (sidebar) points at /warehouse; land on the Dashboard
// (W1) — mirrors app/(dashboard)/pmg/page.tsx.
export default function WarehouseIndexPage() {
  redirect("/warehouse/dashboard");
}
