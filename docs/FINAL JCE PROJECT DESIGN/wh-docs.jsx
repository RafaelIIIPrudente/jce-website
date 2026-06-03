// ============================================================================
// JCE SYSTEM — Warehouse documents: W4 MRR (FLAGSHIP · 3-state lock gate)
//   W5 Release form · W6 Stock transfer
// ============================================================================

// reusable 3-state gate banner: Draft → For Checking → Locked
function LockGate({
  status,
  canLock,
  canSubmit,
  onSubmit,
  onLock,
  onUnlock,
  blockReason,
}) {
  const steps = ["Draft", "For Checking", "Locked"];
  const idx = steps.indexOf(status);
  return (
    <div className="lockgate solid">
      <div className="lg-steps">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div
              className={
                "lg-step " +
                (i < idx ? "done" : i === idx ? "curr" : "todo") +
                (s === "Locked" && idx === 2 ? " locked" : "")
              }
            >
              <span className="lg-dot">
                {i < idx ? "✓" : s === "Locked" ? "🔒" : i + 1}
              </span>
              <span className="lg-label">{s}</span>
            </div>
            {i < 2 && (
              <span className={"lg-line " + (i < idx ? "done" : "")}></span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="lg-actions">
        {status === "Draft" && canSubmit && (
          <button className="btn btn-primary btn-sm" onClick={onSubmit}>
            Submit for checking
          </button>
        )}
        {status === "For Checking" && canLock && (
          <button
            className="btn btn-lock btn-sm"
            onClick={onLock}
            disabled={!!blockReason}
            title={blockReason || ""}
          >
            🔒 Lock
          </button>
        )}
        {status === "For Checking" && canLock && blockReason && (
          <span className="lg-block">{blockReason}</span>
        )}
        {status === "For Checking" && !canLock && (
          <span className="lg-note">Awaiting Warehouse Admin to Lock</span>
        )}
        {status === "Locked" && canLock && (
          <button className="btn btn-ghost btn-sm" onClick={onUnlock}>
            Unlock (reverses movements · audited)
          </button>
        )}
        {status === "Locked" && !canLock && (
          <span className="lg-note">
            <Icon name="lock" size={12} /> Locked — movements posted
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// W4 · MRR (FLAGSHIP)
// ---------------------------------------------------------------------------
function W4MRR({ role }) {
  const [sel, setSel] = useState(null);
  const isAdmin = role === "warehouse" || role === "owner";
  const isEngineer = role === "siteeng";

  if (sel) {
    return (
      <W4Form
        mrr={sel}
        role={role}
        isAdmin={isAdmin}
        isEngineer={isEngineer}
        onBack={() => setSel(null)}
      />
    );
  }
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W4 · Goods Receipt</div>
          <h2 className="ph-title">Material Receiving Reports</h2>
        </div>
        <div className="ph-actions">
          {(isAdmin || isEngineer) && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setSel(MRRS[0])}
            >
              + New MRR
            </button>
          )}
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>MRR No.</th>
              <th>Receive Date</th>
              <th>Supplier</th>
              <th>Invoice</th>
              <th>Project</th>
              <th>PO Number</th>
              <th>MR Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MRRS.map((m) => (
              <tr
                key={m.no}
                onClick={() => setSel(m)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="docchip">{m.no}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {m.date}
                </td>
                <td style={{ fontWeight: 600 }}>{m.supplier}</td>
                <td className="mono" style={{ fontSize: 11 }}>
                  {m.inv}
                </td>
                <td>{m.project}</td>
                <td>
                  <span className="docchip sm">{m.po}</span>
                </td>
                <td>
                  <span className="docchip sm">{m.mr}</span>
                </td>
                <td>
                  <span className={"chip chip-" + GATE_TONE[m.status]}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        A Locked MRR is the single Goods Receipt — it completes Purchasing's
        three-way match and makes the RFP submittable.
      </div>
    </div>
  );
}

function W4Form({ mrr, role, isAdmin, isEngineer, onBack }) {
  const [status, setStatus] = useState(mrr.status);
  const [drPhoto, setDrPhoto] = useState(mrr.drPhoto);
  const locked = status === "Locked";
  const blockReason =
    status === "For Checking" && !drPhoto ? "DR Photo required to Lock" : null;

  return (
    <div className="screen wide">
      <button className="back-link" onClick={onBack}>
        ← MRR list
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W4</div>
          <h2 className="ph-title">
            MRR <span className="docchip">{mrr.no}</span>
          </h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-post btn-sm">⎙ Print for filing</button>
        </div>
      </div>

      <LockGate
        status={status}
        canLock={isAdmin}
        canSubmit={isAdmin || isEngineer}
        blockReason={blockReason}
        onSubmit={() => setStatus("For Checking")}
        onLock={() => setStatus("Locked")}
        onUnlock={() => setStatus("For Checking")}
      />

      {locked && (
        <div className="threeway-done solid">
          <Icon name="check" size={18} color="var(--st-success)" />
          <div>
            <div className="gb-t">Three-way match complete</div>
            <div className="gb-d">
              PO {mrr.po} + Invoice {mrr.inv} + this receipt reconcile → RFP
              submittable. Receipt movements posted; Delivered / Running Balance
              raised.
            </div>
          </div>
        </div>
      )}

      <div className="twopane">
        <div className="solid form-body">
          <div className="form-section-title">Header</div>
          <div className="form-grid">
            <L l="MRR No." computed>
              <div className="field is-computed">{mrr.no}</div>
            </L>
            <L l="Receive Date" req>
              <input
                className="field"
                type="date"
                defaultValue={mrr.date}
                disabled={locked}
              />
            </L>
            <L l="Project (FK)" req>
              <input
                className="field"
                defaultValue={mrr.project}
                disabled={locked}
              />
            </L>
            <L l="Receiving Location" req>
              <select className="field" disabled={locked}>
                <option>Main Office</option>
                <option>Bulacan site</option>
              </select>
            </L>
            <L l="Supplier (FK)" req>
              <input
                className="field"
                defaultValue={mrr.supplier}
                disabled={locked}
              />
            </L>
            <L l="PO Number (FK)" req>
              <input
                className="field"
                defaultValue={mrr.po}
                disabled={locked}
              />
            </L>
            <L l="MR Number (FK)">
              <input
                className="field"
                defaultValue={mrr.mr}
                disabled={locked}
              />
            </L>
            <L l="Invoice Number" req>
              <input
                className="field"
                defaultValue={mrr.inv}
                disabled={locked}
              />
            </L>
            <L l="Requested By">
              <input
                className="field"
                defaultValue={mrr.by}
                disabled={locked}
              />
            </L>
            <L l="Warehouseman" computed>
              <div className="field is-computed">
                {role === "siteeng"
                  ? "P. Garcia (you)"
                  : "G. Lim (logged user)"}
              </div>
            </L>
          </div>

          <div className="form-section-title">Lines</div>
          <div
            className="solid table-wrap"
            style={{ boxShadow: "none", border: "1px solid var(--jce-line)" }}
          >
            <table className="jtable">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th className="num">Qty received</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {MRR_LINES.map((l, i) => (
                  <tr key={i}>
                    <td>{l.item}</td>
                    <td style={{ color: "var(--jce-ink-2)" }}>{l.desc}</td>
                    <td className="num">{l.qty}</td>
                    <td>{l.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="muted-note" style={{ marginTop: 8 }}>
            Partial deliveries: one PO across many MRRs, cumulative tracking, no
            silent over-receive. PO/MR mismatch = warn-and-allow with a
            discrepancy flag to admin.
          </div>
        </div>

        <div className="preview-frame glass">
          <div className="preview-bar">
            <span className="kicker" style={{ margin: 0 }}>
              Attachments
            </span>
          </div>
          <div className="solid" style={{ padding: 16 }}>
            <div className="attach-req">
              <div className="ar-label">
                DR Photo <span className="req">REQUIRED to Lock</span>
              </div>
              {drPhoto ? (
                <div className="ar-done">
                  <span>📷</span> DR_2231.jpg{" "}
                  <span
                    className="chip chip-success"
                    style={{ padding: "1px 7px" }}
                  >
                    attached
                  </span>
                </div>
              ) : (
                <div className="uploader" style={{ padding: 18 }}>
                  <div
                    className="u1"
                    onClick={() => !locked && setDrPhoto(true)}
                    style={{ cursor: "pointer" }}
                  >
                    ⤓ Attach DR Photo
                  </div>
                  <div className="u2">Tap to simulate upload</div>
                </div>
              )}
            </div>
            <div className="attach-req" style={{ marginTop: 14 }}>
              <div className="ar-label">
                Delivery Proof <span className="muted">(optional)</span>
              </div>
              <div className="uploader" style={{ padding: 14 }}>
                <div className="u2">Optional supporting file</div>
              </div>
            </div>
          </div>
          <div className="preview-bar" style={{ marginTop: 14 }}>
            <span className="kicker" style={{ margin: 0 }}>
              MRR form preview
            </span>
          </div>
          <div className="paper" style={{ fontSize: 9 }}>
            <div className="ph">
              <div className="co">JC ELECTROFIELDS</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>MRR · JCE-F-WMS02</div>
                <div className="docn">{mrr.no}</div>
              </div>
            </div>
            <div style={{ fontSize: 9, margin: "4px 0" }}>
              {mrr.supplier} · {mrr.date}
            </div>
            <div
              className="sigblock"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              <div className="sig">
                <div className="line"></div>
                <div className="role">Received by</div>
              </div>
              <div className="sig">
                <div className="line"></div>
                <div className="role">Checked by · Warehouse</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// W5 · Release form
// ---------------------------------------------------------------------------
function W5Release({ role }) {
  const [sel, setSel] = useState(null);
  const isAdmin = role === "warehouse" || role === "owner";
  if (sel) {
    return (
      <W5Form
        rel={sel}
        isAdmin={isAdmin}
        isEngineer={role === "siteeng"}
        onBack={() => setSel(null)}
      />
    );
  }
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W5</div>
          <h2 className="ph-title">Release forms</h2>
        </div>
        <div className="ph-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setSel(RELEASES[0])}
          >
            + New Release
          </button>
        </div>
      </div>
      <div className="solid table-wrap">
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
            {RELEASES.map((r) => (
              <tr
                key={r.no}
                onClick={() => setSel(r)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="docchip">{r.no}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {r.date}
                </td>
                <td>{r.project}</td>
                <td>{r.loc}</td>
                <td>{r.recvBy}</td>
                <td>
                  <span className={"chip chip-" + GATE_TONE[r.status]}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function W5Form({ rel, isAdmin, isEngineer, onBack }) {
  const [status, setStatus] = useState(rel.status);
  const locked = status === "Locked";
  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Release forms
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W5</div>
          <h2 className="ph-title">
            Release <span className="docchip">{rel.no}</span>
          </h2>
        </div>
      </div>
      <LockGate
        status={status}
        canLock={isAdmin}
        canSubmit={isAdmin || isEngineer}
        onSubmit={() => setStatus("For Checking")}
        onLock={() => setStatus("Locked")}
        onUnlock={() => setStatus("For Checking")}
      />
      {!locked && (
        <div
          className="threeway solid"
          style={{ borderLeftColor: "var(--st-danger)" }}
        >
          <Icon name="lock" size={15} color="var(--st-danger)" />
          <span>
            <strong>Negative-stock guard</strong> — a release that would drive
            on-hand below zero is hard-blocked unless an Admin override with
            reason. Lock posts Issue movements, Utilized up, Running Balance
            down.
          </span>
        </div>
      )}
      <div className="solid form-body">
        <div className="form-grid">
          <L l="Release No." computed>
            <div className="field is-computed">{rel.no}</div>
          </L>
          <L l="Date">
            <input
              className="field"
              type="date"
              defaultValue={rel.date}
              disabled={locked}
            />
          </L>
          <L l="Project + Location">
            <input
              className="field"
              defaultValue={rel.project + " · " + rel.loc}
              disabled={locked}
            />
          </L>
          <L l="Received By (free-text)">
            <input
              className="field"
              defaultValue={rel.recvBy}
              placeholder="field crews aren't system users"
              disabled={locked}
            />
          </L>
          <L l="Warehouseman" computed>
            <div className="field is-computed">G. Lim (releaser, logged)</div>
          </L>
        </div>
        <div className="form-section-title">Lines</div>
        <div
          className="solid table-wrap"
          style={{ boxShadow: "none", border: "1px solid var(--jce-line)" }}
        >
          <table className="jtable">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th className="num">Qty</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ACSR conductor 1/0</td>
                <td style={{ color: "var(--jce-ink-2)" }}>Stringing</td>
                <td className="num">540</td>
                <td>m</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// W6 · Stock transfer
// ---------------------------------------------------------------------------
function W6Transfer({ role }) {
  const [sel, setSel] = useState(null);
  if (sel) return <W6Form trf={sel} role={role} onBack={() => setSel(null)} />;
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W6</div>
          <h2 className="ph-title">Stock transfers</h2>
        </div>
        <div className="ph-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setSel(TRANSFERS[0])}
          >
            + New Transfer
          </button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>TRF No.</th>
              <th>Date</th>
              <th>From → To</th>
              <th className="num">Dispatched</th>
              <th className="num">Received</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {TRANSFERS.map((t) => (
              <tr
                key={t.no}
                onClick={() => setSel(t)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="docchip">{t.no}</span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {t.date}
                </td>
                <td>
                  {t.from} → {t.to}
                </td>
                <td className="num">{qn(t.dispatched)}</td>
                <td className="num">
                  {t.received != null ? (
                    qn(t.received)
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
                <td>
                  <span className={"chip chip-" + GATE_TONE[t.status]}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function W6Form({ trf, role, onBack }) {
  const [phase, setPhase] = useState(
    trf.status === "Locked" ? "Confirm Receipt" : "In Transit",
  );
  const isAdmin = role === "warehouse" || role === "owner";
  return (
    <div className="screen">
      <button className="back-link" onClick={onBack}>
        ← Stock transfers
      </button>
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W6</div>
          <h2 className="ph-title">
            Transfer <span className="docchip">{trf.no}</span>
          </h2>
        </div>
        <div className="ph-actions">
          <span className="chip chip-info">
            {trf.from} → {trf.to}
          </span>
        </div>
      </div>
      <div className="transfer-flow solid">
        {["Dispatch", "In Transit", "Confirm Receipt"].map((p, i) => (
          <React.Fragment key={p}>
            <div
              className={
                "tf-step " +
                (p === "Dispatch" ||
                (p === "In Transit" && phase !== "Dispatch") ||
                (p === "Confirm Receipt" && phase === "Confirm Receipt")
                  ? "done"
                  : "todo")
              }
            >
              <div className="tf-dot">{p === "In Transit" ? "⇄" : "✓"}</div>
              <div className="tf-name">{p}</div>
            </div>
            {i < 2 && <div className="tf-line done"></div>}
          </React.Fragment>
        ))}
      </div>
      {phase === "In Transit" && (
        <div
          className="threeway solid"
          style={{ borderLeftColor: "var(--st-info)" }}
        >
          <span style={{ fontSize: 15 }}>⇄</span>
          <span>
            In transit: <strong>{qn(trf.dispatched)} units</strong> counted at{" "}
            <strong>neither</strong> location. Dispatch posted Transfer-Out at{" "}
            {trf.from}.{" "}
            {isAdmin &&
              "Confirm receipt to post Transfer-In at " + trf.to + "."}
          </span>
        </div>
      )}
      {phase === "In Transit" && isAdmin && (
        <div className="solid form-body">
          <div className="form-grid">
            <L l="Received qty at destination" req>
              <input className="field" defaultValue={trf.dispatched} />
            </L>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ marginTop: 12 }}
            onClick={() => setPhase("Confirm Receipt")}
          >
            Confirm receipt (posts Transfer-In)
          </button>
          <div className="muted-note" style={{ marginTop: 10 }}>
            Received ≠ dispatched raises a discrepancy flag for admin review —
            never silently adjusts.
          </div>
        </div>
      )}
      {phase === "Confirm Receipt" && (
        <div className="threeway-done solid">
          <Icon name="check" size={18} color="var(--st-success)" />
          <div>
            <div className="gb-t">Transfer complete</div>
            <div className="gb-d">
              Transfer-In posted at {trf.to}. Received{" "}
              {qn(trf.received || trf.dispatched)} = dispatched{" "}
              {qn(trf.dispatched)} — no discrepancy.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { W4MRR, W5Release, W6Transfer, LockGate });
