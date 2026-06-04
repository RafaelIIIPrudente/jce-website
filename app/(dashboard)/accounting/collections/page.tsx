import type { Metadata } from "next";

import { CollectionsRegister } from "./collections-register";

export const metadata: Metadata = { title: "Collections register" };

// A10 · Collections register.
export default function CollectionsPage() {
  return <CollectionsRegister />;
}
