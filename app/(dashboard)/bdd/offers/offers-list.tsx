"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import {
  OFFERS,
  OFFER_STATUS_TONE,
  type Offer,
  type OfferEntity,
} from "@/lib/mock/bdd";
import { peso } from "@/lib/mock/format";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Segmented } from "@/components/jce/segmented";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";
import { LedgerGrid, type LedgerColumn } from "@/components/jce/ledger-grid";

// B3 · Offers list (bdd-core.jsx:56-65). JCEPSI / JICA are separate streams with
// separate per-entity Ref. No. counters (CLIENT_CODE-YY-XXX[Rev.NN]).
export function OffersList() {
  const { role } = useJce();
  const readOnly = !canEdit(role, "bdd");
  const router = useRouter();
  const [entity, setEntity] = useState<OfferEntity>("JCEPSI");

  const rows = OFFERS.filter((o) => o.entity === entity);

  const columns: LedgerColumn<Offer>[] = [
    { id: "ref", header: "Ref. No.", cell: (o) => <DocChip code={o.ref} /> },
    {
      id: "date",
      header: "Offer Date",
      cell: (o) => (
        <span className="font-mono text-ui-12 whitespace-nowrap text-jce-ink-2">
          {o.date}
        </span>
      ),
    },
    { id: "client", header: "Client", cell: (o) => o.client },
    {
      id: "subject",
      header: "Subject",
      cell: (o) => (
        <span className="font-medium text-jce-ink">{o.subject}</span>
      ),
    },
    {
      id: "amt",
      header: "Total Amount",
      align: "right",
      cell: (o) => peso(o.amount),
    },
    {
      id: "status",
      header: "Status",
      cell: (o) => (
        <Chip tone={OFFER_STATUS_TONE[o.status] ?? "neutral"}>{o.status}</Chip>
      ),
    },
    {
      id: "rev",
      header: "Rev",
      align: "center",
      cell: (o) =>
        o.rev > 0 ? (
          `Rev.${String(o.rev).padStart(2, "0")}`
        ) : (
          <span className="text-jce-ink-2">—</span>
        ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="BDD · B3"
        title="Offers"
        description="Formal offers per entity stream. Immutable once issued — the record moves only by appended events (OQ#16)."
        actions={!readOnly ? <Button size="sm">+ New offer</Button> : undefined}
      />
      <Segmented
        aria-label="Entity stream"
        options={[
          { value: "JCEPSI", label: "JCEPSI" },
          { value: "JICA", label: "JICA" },
        ]}
        value={entity}
        onValueChange={(v) => setEntity(v as OfferEntity)}
      />
      <LedgerGrid
        columns={columns}
        rows={rows}
        getRowKey={(o) => o.ref}
        onRowClick={(o) =>
          router.push(`/bdd/offers/${encodeURIComponent(o.ref)}`)
        }
        className="max-h-[calc(100dvh-18rem)]"
      />
    </div>
  );
}
