import type { Metadata } from "next";

import { SALES_ORDERS } from "@/lib/mock/bdd";
import { SalesOrderRecord } from "./sales-order-record";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ so: string }>;
}): Promise<Metadata> {
  const { so } = await params;
  const order = SALES_ORDERS.find((x) => x.so === so);
  return { title: order ? `SO# ${order.so}` : "Sales Order" };
}

// B2 · Sales Order record. The record resolves the order from the shared
// in-session store on the client (so SOs created this session are reachable
// without a 404); a genuinely-absent SO# renders an empty state there.
export default async function SalesOrderPage({
  params,
}: {
  params: Promise<{ so: string }>;
}) {
  const { so } = await params;
  return <SalesOrderRecord so={so} />;
}
