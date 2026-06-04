import type { Metadata } from "next";

import { Catalog } from "./catalog";

export const metadata: Metadata = { title: "Catalog" };

export default function CatalogPage() {
  return <Catalog />;
}
