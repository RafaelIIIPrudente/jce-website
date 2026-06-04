import type { Metadata } from "next";

import { MrRegister } from "./mr-register";

export const metadata: Metadata = { title: "Material Requests" };

// P11 · Material Request register.
export default function MaterialRequestsPage() {
  return <MrRegister />;
}
