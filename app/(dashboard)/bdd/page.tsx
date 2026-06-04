import { redirect } from "next/navigation";

// The BDD module (sidebar) points at /bdd; land on Sales Orders (B1, OQ#7).
export default function BddIndexPage() {
  redirect("/bdd/sales-orders");
}
