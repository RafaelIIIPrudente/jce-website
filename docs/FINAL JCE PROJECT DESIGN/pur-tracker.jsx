// ============================================================================
// JCE SYSTEM — Purchasing · U7 import 15-stage tracker (FLAGSHIP) · U8 local
// ============================================================================

function U7Tracker({ po, onBack }) {
  const [stages, setStages] = useState(IMPORT_STAGES);
  const done = stages.filter((s) => s.status === "Done").length;
  const blocked = stages.find((s) => s.status === "Blocked");
  const advance = (n) =>
    setStages(
      stages.map((s) => {
        if (s.n !== n) return s;
        const order = ["Pending", "In Progress", "Done"];
        const nx =
          s.status === "Blocked"
            ? "In Progress"
            : order[Math.min(order.indexOf(s.status) + 1, 2)];
        return {
          ...s,
          status: nx,
          actual: nx === "Done" ? "2026-06-03" : s.actual,
        };
      }),
    );

  return (
    <div className="screen wide">
      <button className="back-link" onClick={onBack}>
        ← PO ledger
      </button>

      <div className="glass track-header">
        <div className="track-head-top">
          <div>
            <div className="kicker">Purchasing · U7 · Import tracker</div>
            <h2 className="ph-title">
              <span className="docchip">{po ? po.no : "2605-0188IC"}</span>
            </h2>
            <div className="pay-meta">
              {po ? po.supplier : "Shenda Electric Co."} · BOM → onsite delivery
            </div>
          </div>
          <div className="track-progress">
            <div
              className="tp-ring"
              style={{
                background: `conic-gradient(var(--jce-green-600) ${(done / 15) * 360}deg, #EEF1EF 0)`,
              }}
            >
              <span>{done}/15</span>
            </div>
          </div>
        </div>
        <div className="track-bar">
          {stages.map((s) => (
            <div
              key={s.n}
              className={"tb-seg " + s.status.replace(" ", "").toLowerCase()}
              title={s.n + " " + s.name}
            ></div>
          ))}
        </div>
      </div>

      {blocked && (
        <div className="gate-banner solid">
          <Icon name="lock" size={18} color="var(--st-danger)" />
          <div>
            <div className="gb-t">
              Stage {blocked.n} blocked — {blocked.name}
            </div>
            <div className="gb-d">
              {blocked.gate ? "Approval gate stalled. " : ""}Needs{" "}
              {blocked.gate ? "President / Finance" : "owner"} action to
              proceed. Balance payment due reconciles with linked RFP.
            </div>
          </div>
          <button
            className="btn btn-lock btn-sm"
            style={{ marginLeft: "auto" }}
            onClick={() => advance(blocked.n)}
          >
            Resolve gate
          </button>
        </div>
      )}

      <div className="stage-list">
        {stages.map((s) => (
          <div
            key={s.n}
            className={"stage-card solid" + (s.gate ? " gate" : "")}
          >
            <div className="stage-num">{s.status === "Done" ? "✓" : s.n}</div>
            <div className="stage-main">
              <div className="stage-name">
                {s.name}
                {s.gate && <span className="gate-tag">approval gate</span>}
              </div>
              <div className="stage-owner">
                {s.owner}
                {s.docs.length > 0 && (
                  <span className="stage-docs">
                    {s.docs.map((d, i) => (
                      <span key={i} className="doc-slot">
                        {d}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>
            <div className="stage-dates">
              <div>
                <span className="sd-k">Target</span>
                <span className="sd-v mono">{s.target}</span>
              </div>
              <div>
                <span className="sd-k">Actual</span>
                <span className="sd-v mono">{s.actual}</span>
              </div>
            </div>
            <span className={"chip chip-" + STAGE_TONE[s.status]}>
              {s.status}
            </span>
            {s.status !== "Done" && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => advance(s.n)}
              >
                Advance
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="muted-note" style={{ marginTop: 12 }}>
        Stages are not strictly sequential (8/9 overlap; stage 11 docs arrive
        incrementally). Stage 15 consolidates with the Warehouse MRR (same
        event, two surfaces). Alerts: ETA 7/3/1-day, balance payment
        due/overdue. Gates 4 &amp; 7 surfaced prominently.
      </div>
    </div>
  );
}

// ---- U8 local 5-stage ------------------------------------------------------
function U8Local({ po, onBack }) {
  const STAGES = [
    ["PO Sent", "auto on Sent"],
    ["Goods Received", "first MRR · Partial/Full"],
    ["Invoice Received", "invoice no. + attachment"],
    ["Paid", "auto when RFP Paid"],
    ["Closed", "Paid + Fully Received"],
  ];
  const cur = po ? po.localStage : 2;
  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← PO ledger
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U8 · Local tracker</div>
          <h2 className="ph-title">
            <span className="docchip">{po ? po.no : "2605-0204"}</span>
          </h2>
        </div>
        <div className="ph-actions">
          <span className="chip chip-pending">Stall alert: 14 days</span>
        </div>
      </div>
      <div className="solid" style={{ padding: "28px 24px" }}>
        <div className="local-stepper">
          {STAGES.map(([n, d], i) => (
            <React.Fragment key={n}>
              <div
                className={
                  "lstep " + (i < cur ? "done" : i === cur ? "curr" : "todo")
                }
              >
                <div className="ls-dot">{i < cur ? "✓" : i + 1}</div>
                <div className="ls-name">{n}</div>
                <div className="ls-desc">{d}</div>
              </div>
              {i < 4 && (
                <div className={"ls-line " + (i < cur ? "done" : "")}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="muted-note" style={{ marginTop: 12 }}>
        Default for POs ≥ ₱20K, opt-in below. Per-stage target/actual dates,
        owner, remarks. Stage 5 Closed auto when Paid + Fully Received
        (Supervisor override).
      </div>
    </div>
  );
}

Object.assign(window, { U7Tracker, U8Local });
