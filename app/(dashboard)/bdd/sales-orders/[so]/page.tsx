import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

// B2 · Sales Order record.
export default async function SalesOrderPage({
  params,
}: {
  params: Promise<{ so: string }>;
}) {
  const { so } = await params;
  const order = SALES_ORDERS.find((x) => x.so === so);
  if (!order) notFound();
  return <SalesOrderRecord order={order} />;
}
