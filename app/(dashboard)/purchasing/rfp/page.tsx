import type { Metadata } from "next";

import { RfpRegister } from "./rfp-register";

export const metadata: Metadata = { title: "RFP register" };

export default function RfpRegisterPage() {
  return <RfpRegister />;
}
