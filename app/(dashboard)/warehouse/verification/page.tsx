import type { Metadata } from "next";

import { MrVerification } from "./verification";

export const metadata: Metadata = { title: "MR verification" };

export default function VerificationPage() {
  return <MrVerification />;
}
