import type { Metadata } from "next";

import { ClientsDirectory } from "./clients-directory";

export const metadata: Metadata = { title: "Clients" };

// A19 · Clients.
export default function ClientsPage() {
  return <ClientsDirectory />;
}
