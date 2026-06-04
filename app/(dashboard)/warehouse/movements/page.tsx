import type { Metadata } from "next";

import { Movements } from "./movements";

export const metadata: Metadata = { title: "Movements" };

export default function MovementsPage() {
  return <Movements />;
}
