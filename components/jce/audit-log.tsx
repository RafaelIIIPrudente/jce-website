import { cn } from "@/lib/utils";

import { DocChip } from "@/components/jce/doc-chip";

// Audit log — append-only (Foundations.html:828-842). actor / time / entity /
// before→after. Used on H14, P13, U13, W9, B11. Tag: Solid.

export type AuditEntry = {
  ts: string;
  actor: string;
  record?: string;
  action: string;
  before?: React.ReactNode;
  after: React.ReactNode;
};

export function AuditLog({
  entries,
  className,
  stickyFirstColumn = false,
}: {
  entries: readonly AuditEntry[];
  className?: string;
  /** Opt-in (default off): freezes the leading Timestamp column while the row
   *  scrolls horizontally — a narrow-viewport overflow safeguard for dense logs
   *  (B11). Other consumers (H14/P13/U13/W9) keep the original render. */
  stickyFirstColumn?: boolean;
}) {
  return (
    <div
      data-slot="audit-log"
      className={cn("solid max-h-105 overflow-auto p-0", className)}
    >
      <table
        className={cn("jtable", stickyFirstColumn && "jtable-sticky-first")}
      >
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Actor</th>
            <th>Record</th>
            <th>Action</th>
            <th>Before → After</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i}>
              <td className="mono text-ui-12 whitespace-nowrap">{e.ts}</td>
              <td>{e.actor}</td>
              <td>
                {e.record ? (
                  <DocChip code={e.record} />
                ) : (
                  <span className="text-jce-ink-2">—</span>
                )}
              </td>
              <td>{e.action}</td>
              <td>
                {e.before != null ? (
                  <>
                    {e.before} →{" "}
                    <strong className="font-semibold text-jce-ink">
                      {e.after}
                    </strong>
                  </>
                ) : (
                  <strong className="font-semibold text-jce-ink">
                    {e.after}
                  </strong>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
