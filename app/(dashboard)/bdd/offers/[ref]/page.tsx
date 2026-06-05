import type { Metadata } from "next";

import { OFFERS } from "@/lib/mock/bdd";
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

// B4 · Offer record — event stream. The record resolves the offer from the shared
// in-session store on the client (so offers created this session are reachable
// without a 404); a genuinely-absent ref renders an empty state there.
export default async function OfferPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  return <OfferRecord offerRef={ref} />;
}
