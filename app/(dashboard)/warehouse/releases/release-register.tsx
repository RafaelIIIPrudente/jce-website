"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useJce } from "@/lib/mock/role-context";
import { canEdit } from "@/lib/rbac";
import { RELEASES, GATE_TONE } from "@/lib/mock/warehouse";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/jce/page-header";
import { Chip } from "@/components/jce/chip";
import { DocChip } from "@/components/jce/doc-chip";

// W5 · Release forms register (wh-docs.jsx:406). Lock posts Issue movements.
export function ReleaseRegister() {
  const router = useRouter();
  const { role } = useJce();
  const canCreate = canEdit(role, "wh");
  const scoped = role === "siteeng";
  const rows = scoped
    ? RELEASES.filter((r) => r.project === "NORECO II — 13.2KV")
    : RELEASES;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        kicker="Warehouse · W5"
        title="Release forms"
        actions={
          canCreate ? (
            <Button
              size="sm"
              onClick={() =>
                toast.info(
                  "New Release — encode lines; Lock posts the Issue movements.",
                )
              }
            >
              + New Release
            </Button>
          ) : null
        }
      />
      <div className="solid overflow-auto rounded-(--r-solid) p-0">
        <table className="jtable">
          <thead>
            <tr>
              <th>Release No.</th>
              <th>Date</th>
              <th>Project</th>
              <th>Releasing Location</th>
              <th>Received By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.no}
                onClick={() => router.push(`/warehouse/releases/${r.no}`)}
                className="cursor-pointer"
              >
                <td>
                  <DocChip code={r.no} />
                </td>
                <td className="mono text-ui-12">{r.date}</td>
                <td>{r.project}</td>
                <td>{r.loc}</td>
                <td>{r.recvBy}</td>
                <td>
                  <Chip tone={GATE_TONE[r.status] ?? "neutral"}>
                    {r.status}
                  </Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
