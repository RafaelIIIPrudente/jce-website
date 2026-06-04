import type { Metadata } from "next";

import { VoucherRegister } from "./voucher-register";

export const metadata: Metadata = { title: "Voucher register" };

// A13 · Payable Voucher register.
export default function VouchersPage() {
  return <VoucherRegister />;
}
