import { redirect } from "next/navigation";

// The PMG module (sidebar) points at /pmg; land on the Dashboard (P1, OQ#7).
export default function PmgIndexPage() {
  redirect("/pmg/dashboard");
}
