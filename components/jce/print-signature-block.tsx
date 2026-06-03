// Print-only signature block (Foundations.html:224-227,816-822). Hard rule:
// approvals are offline WET signatures everywhere — blank ruled lines + role
// labels on the printed artifact. There is NO in-app e-signing, so this is
// strictly RENDER-ONLY: it takes no handlers and emits no interactive controls.
// The system tracks status and stores the scanned signed copy. Tag: Print.

export type Signatory = { role: string; name?: string };

export function PrintSignatureBlock({
  signatories,
}: {
  signatories: readonly Signatory[];
}) {
  return (
    <div
      data-slot="print-signature-block"
      className="mt-5 grid gap-5"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
    >
      {signatories.map((s) => (
        <div key={s.role}>
          <div className="h-7 border-b border-jce-ink" />
          <div className="mt-1 text-[10px] font-semibold text-jce-ink">
            {s.name ?? " "}
          </div>
          <div className="text-[9px] tracking-wide text-jce-ink-2 uppercase">
            {s.role}
          </div>
        </div>
      ))}
    </div>
  );
}
