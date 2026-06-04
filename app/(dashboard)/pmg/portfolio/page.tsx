import type { Metadata } from "next";

import { Portfolio } from "./portfolio";

export const metadata: Metadata = { title: "Portfolio" };

// P2 · Portfolio.
export default function PortfolioPage() {
  return <Portfolio />;
}
