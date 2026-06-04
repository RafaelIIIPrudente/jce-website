import type { Metadata } from "next";

import { PayrollSubNav } from "../acc-sub-nav";
import { PayrollSettings } from "./payroll-settings";

export const metadata: Metadata = { title: "Payroll Settings" };

// A1 · Payroll Settings.
export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PayrollSubNav />
      <PayrollSettings />
    </div>
  );
}
