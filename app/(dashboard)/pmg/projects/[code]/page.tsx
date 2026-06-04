import { redirect } from "next/navigation";

// Bare project URL → Header tab (P5).
export default async function ProjectIndexPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(`/pmg/projects/${code}/header`);
}
