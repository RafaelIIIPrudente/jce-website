import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { typeBySlug } from "@/lib/mock/hr";
import { RequestForm } from "../../request-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const def = typeBySlug(type);
  return { title: def ? `New ${def.label}` : "New request" };
}

// H8–H11 · New request form (reached from the H7 register or the H13 chooser).
export default async function NewRequestPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const def = typeBySlug(type);
  if (!def) notFound();
  return <RequestForm type={def.label} slug={def.slug} />;
}
