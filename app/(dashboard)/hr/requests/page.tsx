import type { Metadata } from "next";

import { RequestsRegister } from "./requests-register";

export const metadata: Metadata = { title: "HR Requests" };

// H7 · HR requests register.
export default function RequestsPage() {
  return <RequestsRegister />;
}
