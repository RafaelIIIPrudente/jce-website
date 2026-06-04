import type { Metadata } from "next";

import { OffersList } from "./offers-list";

export const metadata: Metadata = { title: "Offers" };

// B3 · Offers list.
export default function OffersPage() {
  return <OffersList />;
}
