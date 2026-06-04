import { redirect } from "next/navigation";

// The Purchasing module (sidebar) points at /purchasing; land on the Dashboard
// (U1) — mirrors app/(dashboard)/pmg/page.tsx.
export default function PurchasingIndexPage() {
  redirect("/purchasing/dashboard");
}
