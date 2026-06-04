import type { Metadata } from "next";

import { PMG_AUDIT } from "@/lib/mock/pmg";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

export const metadata: Metadata = { title: "PMG audit log" };

// P13 · PMG audit log (pmg-screens.jsx:1241). Append-only before→after snapshots.
export default function PmgAuditPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        kicker="PMG · P13"
        title="PMG audit log"
        description="Append-only · before → after snapshots · read-only."
      />
      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Entity</th>
              <th>Action</th>
              <th>Before → After (snapshot)</th>
            </tr>
          </thead>
          <tbody>
            {PMG_AUDIT.map((a, i) => (
              <tr key={i}>
                <td className="font-mono text-ui-12 whitespace-nowrap">
                  {a.ts}
                </td>
                <td>{a.actor}</td>
                <td>
                  <DocChip code={a.entity} />
                </td>
                <td>
                  <Chip tone="neutral">{a.action}</Chip>
                </td>
                <td className="text-jce-ink">{a.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
