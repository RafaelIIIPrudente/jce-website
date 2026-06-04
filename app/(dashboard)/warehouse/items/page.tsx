import type { Metadata } from "next";

import { ItemMaster } from "./items";

export const metadata: Metadata = { title: "Item master" };

export default function ItemMasterPage() {
  return <ItemMaster />;
}
