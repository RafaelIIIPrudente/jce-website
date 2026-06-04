import type { Metadata } from "next";

import { StockTake } from "./stock-take";

export const metadata: Metadata = { title: "Stock-take" };

export default function StockTakePage() {
  return <StockTake />;
}
