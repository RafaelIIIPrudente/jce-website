import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { typeBySlug } from "@/lib/mock/hr";
import { RequestForm } from "../../request-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}): Promise<Metadata> {
  const { type, id } = await params;
  const def = typeBySlug(type);
  return { title: def ? `${def.label} · ${id}` : "Request" };
}

// H8–H11 · Deep-linkable request record. Server shell — the form CLIENT-resolves
// the record by (type, id) from the in-session store, so just-created records
// never 404 (an unknown id renders a not-found EmptyState, not a hard 404).
export default async function RequestRecordPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const def = typeBySlug(type);
  if (!def) notFound();
  return <RequestForm type={def.label} slug={def.slug} recordId={id} />;
}
