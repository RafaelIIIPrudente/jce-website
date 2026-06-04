import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OFFERS, OFFER_EVENTS } from "@/lib/mock/bdd";
import { OfferRecord } from "./offer-record";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ref: string }>;
}): Promise<Metadata> {
  const { ref } = await params;
  const offer = OFFERS.find((x) => x.ref === ref);
  return { title: offer ? offer.ref : "Offer" };
}

// B4 · Offer record — event stream.
export default async function OfferPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const offer = OFFERS.find((x) => x.ref === ref);
  if (!offer) notFound();
  const seedEvents = OFFER_EVENTS[ref] ?? [];
  return <OfferRecord offer={offer} seedEvents={seedEvents} />;
}
