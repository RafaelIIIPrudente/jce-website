import type { Metadata } from "next";

import { SalesOrdersList } from "./sales-orders-list";

export const metadata: Metadata = { title: "Sales Orders" };

// B1 · Sales Orders list.
export default function SalesOrdersPage() {
  return <SalesOrdersList />;
}
