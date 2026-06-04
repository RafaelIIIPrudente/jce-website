import type { Metadata } from "next";

import { Photos } from "./photos";

export const metadata: Metadata = { title: "Field photos" };

// P14 · Field photo evidence.
export default function PhotosPage() {
  return <Photos />;
}
