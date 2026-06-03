// ============================================================================
// JCE SYSTEM — Purchasing · U12 approval queue (FLAGSHIP)
// ============================================================================

function U12Queue() {
  const [view, setView] = useState("cards"); // cards | table
  const [items, setItems] = useState(APPROVALS);
  const [peek, setPeek] = useState(null);
  const [vacation, setVacation] = useState(false);
  const decide = (ref, action) => {
    setItems(items.filter((i) => i.ref !== ref));
    setPeek(null);
  };

  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Purchasing · U12</div>
          <h2 className="ph-title">Approval queue</h2>
        </div>
        <div className="ph-actions">
          <label className="toggle-lite">
            <input
              type="checkbox"
              checked={vacation}
              onChange={(e) => setVacation(e.target.checked)}
            />{" "}
            Vacation mode
          </label>
          <div className="seg glass-nav">
            <button
              className={view === "cards" ? "on" : ""}
              onClick={() => setView("cards")}
            >
              Cards
            </button>
            <button
              className={view === "table" ? "on" : ""}
              onClick={() => setView("table")}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {vacation && (
        <div className="solid vacation-banner">
          <Icon name="self" size={15} color="var(--st-info-ink)" /> Vacation
          mode on — decisions delegate to <strong>N. Aquino</strong> for
          2026-06-05 → 2026-06-12. Both names are logged.
        </div>
      )}

      {items.length === 0 ? (
        <div className="solid" style={{ padding: 60 }}>
          <div className="empty">
            <div className="ill">◷</div>
            <div className="et">All caught up</div>
            <div className="ed">Nothing awaiting your decision.</div>
          </div>
        </div>
      ) : view === "cards" ? (
        <div className="queue-cards">
          {items.map((a) => (
            <div key={a.ref} className="glass queue-card">
              <div className="qc-top">
                <span className={"chip chip-" + ENTITY_TONE[a.entity]}>
                  {a.entity}
                </span>
                <span className={"chip chip-" + URGENCY_TONE[a.urgency]}>
                  {a.urgency}
                </span>
              </div>
              <div className="qc-ref">
                <span className="docchip">{a.ref}</span>
              </div>
              <div className="qc-payee">
                {a.payee === "—" ? a.note : a.payee}
              </div>
              <div className="qc-note">{a.note}</div>
              <div className="qc-amt">
                <span className="money">{ccyAmt(a.amount, a.ccy)}</span>
                <span className="qc-age">
                  · {a.requestor} · {a.age}
                </span>
              </div>
              <div className="qc-actions">
                <button
                  className="btn btn-approve btn-sm"
                  onClick={() => decide(a.ref, "approve")}
                >
                  Approve
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setPeek(a)}
                >
                  Peek
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--st-danger)" }}
                  onClick={() => decide(a.ref, "reject")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="solid table-wrap">
          <table className="jtable">
            <thead>
              <tr>
                <th>Entity</th>
                <th>Reference</th>
                <th>Payee</th>
                <th className="num">Amount</th>
                <th>Requestor</th>
                <th>Age</th>
                <th>Urgency</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.ref}>
                  <td>
                    <span className={"chip chip-" + ENTITY_TONE[a.entity]}>
                      {a.entity}
                    </span>
                  </td>
                  <td>
                    <span className="docchip">{a.ref}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{a.payee}</td>
                  <td className="num money">{ccyAmt(a.amount, a.ccy)}</td>
                  <td>{a.requestor}</td>
                  <td>{a.age}</td>
                  <td>
                    <span className={"chip chip-" + URGENCY_TONE[a.urgency]}>
                      {a.urgency}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-approve btn-sm"
                        onClick={() => decide(a.ref, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setPeek(a)}
                      >
                        Peek
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {peek && (
        <div className="jce-scrim" onClick={() => setPeek(null)}>
          <div
            className="drawer glass-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-head">
              <div>
                <div className="drawer-name">
                  <span className={"chip chip-" + ENTITY_TONE[peek.entity]}>
                    {peek.entity}
                  </span>{" "}
                  {peek.ref}
                </div>
                <div className="drawer-sub">
                  {peek.payee} · {ccyAmt(peek.amount, peek.ccy)}
                </div>
              </div>
              <button className="iconbtn" onClick={() => setPeek(null)}>
                ✕
              </button>
            </div>
            <div className="solid drawer-body">
              <div className="rec-grid">
                <Field label="Requestor" value={peek.requestor} />
                <Field label="Age" value={peek.age} />
                <Field label="Urgency" value={peek.urgency} />
                <Field label="Amount" value={ccyAmt(peek.amount, peek.ccy)} />
              </div>
              <div className="muted-note" style={{ margin: "14px 0" }}>
                {peek.note}. Decision updates the record + writes an audit entry
                — a workflow decision, never an e-signature (paper still gets
                wet-signed).
              </div>
              <label className="lbl">Note</label>
              <input className="field" placeholder="Optional decision note…" />
              <div className="drawer-acts">
                <button
                  className="btn btn-approve btn-sm"
                  onClick={() => decide(peek.ref, "approve")}
                >
                  Approve
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--st-pending-ink)" }}
                  onClick={() => decide(peek.ref, "hold")}
                >
                  Hold
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--st-danger)", marginLeft: "auto" }}
                  onClick={() => decide(peek.ref, "reject")}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.U12Queue = U12Queue;
