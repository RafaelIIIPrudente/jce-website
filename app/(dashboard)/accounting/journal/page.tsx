import type { Metadata } from "next";

import { JournalSubNav } from "../acc-sub-nav";
import { JournalVouchers } from "./journal-vouchers";

export const metadata: Metadata = { title: "Journal Vouchers" };

// A16 · Journal Vouchers.
export default function JournalPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <JournalSubNav />
      <JournalVouchers />
    </div>
  );
}
