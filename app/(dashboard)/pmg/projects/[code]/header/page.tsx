import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findProject } from "@/lib/mock/pmg";
import { peso } from "@/lib/mock/format";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { PROJECT_STATUS_TONE } from "@/lib/mock/pmg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const p = findProject(code);
  return { title: p ? p.name : "Project" };
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="kicker text-jce-green-600">{label}</div>
      <div className="mt-1 text-ui-13 text-jce-ink">{value}</div>
    </div>
  );
}

// P5 · Project header (pmg-screens.jsx:714). Original / approved-variations /
// revised contract-value strip.
export default async function ProjectHeaderPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const p = findProject(code);
  if (!p) notFound();

  return (
    <div className="flex flex-col gap-5">
      <div className="glass flex flex-wrap items-center gap-4 rounded-(--r-glass) p-5">
        <div className="min-w-0 flex-1">
          <h1 className="text-ui-22 font-bold tracking-tight text-jce-ink">
            {p.name}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-ui-13 text-jce-ink-2">
            <DocChip code={p.code} /> · {p.type}
            {p.so ? (
              <>
                · <DocChip code={p.so} />
              </>
            ) : null}
          </p>
          <div className="mt-2">
            <Chip tone={PROJECT_STATUS_TONE[p.status] ?? "neutral"}>
              {p.status}
            </Chip>
          </div>
        </div>
      </div>

      <div className="solid grid grid-cols-1 gap-4 rounded-(--r-solid) p-5 sm:grid-cols-3">
        <div>
          <div className="kicker text-jce-green-600">
            Original contract value
          </div>
          <div className="mt-1 font-mono tabular-nums text-jce-ink">
            {peso(p.origContract)}
          </div>
        </div>
        <div>
          <div className="kicker text-jce-green-600">
            Approved variations to date
          </div>
          <div className="mt-1 font-mono tabular-nums text-jce-ink">
            {p.variations ? peso(p.variations) : "—"}
          </div>
        </div>
        <div>
          <div className="kicker text-jce-green-600">
            Revised contract value
          </div>
          <div className="mt-1 font-mono text-ui-16 font-bold tabular-nums text-jce-green-900">
            {peso(p.contract)}
          </div>
        </div>
      </div>

      <div className="solid grid gap-x-8 gap-y-4 rounded-(--r-solid) p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Client / Cooperative" value={p.client} />
        <Field label="Location" value="Negros Oriental" />
        <Field label="Sales Order" value={p.so ?? "— (cost center)"} />
        <Field label="Contract amount" value={peso(p.contract)} />
        <Field label="Start date" value={p.start} />
        <Field label="Target date" value={p.target} />
        <Field label="DP recoupment %" value={`${p.dp}%`} />
        <Field label="Retention %" value={`${p.ret}%`} />
      </div>
    </div>
  );
}
