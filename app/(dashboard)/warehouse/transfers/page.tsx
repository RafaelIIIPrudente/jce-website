import type { Metadata } from "next";

import { TransferRegister } from "./transfer-register";

export const metadata: Metadata = { title: "Transfers" };

export default function TransfersPage() {
  return <TransferRegister />;
}
