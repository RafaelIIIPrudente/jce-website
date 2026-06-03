// ============================================================================
// JCE SYSTEM — Warehouse core: W1 dashboard · W2 stock ledger (FLAGSHIP)
//   W3 item master · W7 movements · W8 MR verification · W9 audit
// ============================================================================

// ---------------------------------------------------------------------------
// W1 · Dashboard (ARSD: project cards + queues)
// ---------------------------------------------------------------------------
function W1Dashboard({ role, onLedger }) {
  const scoped = role === "siteeng";
  const cards = scoped
    ? WH_PROJECTS.filter((p) => p.so === "26-05-378")
    : WH_PROJECTS;
  return (
    <div className="screen">
      <div className="home-greet">
        <h1>Warehouse</h1>
        <p>
          Project ledgers and work queues.{" "}
          {scoped && <span className="scope-pill">assigned sites only</span>}
        </p>
      </div>
      <div className="portfolio-grid" style={{ marginBottom: 20 }}>
        {cards.map((p) => (
          <button key={p.name} className="glass proj-card" onClick={onLedger}>
            <div className="proj-top">
              {p.so ? (
                <span className="docchip sm">{p.so}</span>
              ) : (
                <span className="chip chip-neutral">{p.type}</span>
              )}
              <span className="chip chip-info">{p.open} open</span>
            </div>
            <div className="proj-name">{p.name}</div>
            <div className="proj-client">{p.type}</div>
            <div className="wh-figs">
              <div>
                <span className="ps-k">Items</span>
                <span className="ps-v">{p.items}</span>
              </div>
              <div>
                <span className="ps-k">On-hand</span>
                <span className="ps-v">{qn(p.onhand)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="home-cols">
        <div className="glass home-panel">
          <div className="panel-head">
            <h3>Documents awaiting checking / lock</h3>
          </div>
          <div className="solid approval-list">
            <div className="approval-row">
              <span className="docchip sm">MRR-2026-0144</span>
              <div className="ap-main">
                <div className="ap-t">Cebu Steel — steel receipt</div>
                <div className="ap-m">For Checking · DR photo missing</div>
              </div>
              <span className="chip chip-pending">Lock</span>
            </div>
            <div className="approval-row">
              <span className="docchip sm">REL-2026-0071</span>
              <div className="ap-main">
                <div className="ap-t">Bulacan site release</div>
                <div className="ap-m">For Checking</div>
              </div>
              <span className="chip chip-pending">Lock</span>
            </div>
          </div>
        </div>
        <div className="glass home-panel">
          <div className="panel-head">
            <h3>Queues</h3>
          </div>
          <div className="solid notif-mini">
            <div className="nm-row">
              <span
                className="nm-dot chip chip-info"
                style={{ padding: 0, width: 8, height: 8 }}
              ></span>
              <div>
                <div className="nm-t">1 MR awaiting verification</div>
                <div className="nm-time">JCE-MR-2026-0142</div>
              </div>
            </div>
            <div className="nm-row">
              <span
                className="nm-dot chip chip-info"
                style={{ padding: 0, width: 8, height: 8 }}
              ></span>
              <div>
                <div className="nm-t">1 transfer in transit</div>
                <div className="nm-time">TRF-2026-0033 · 800 units</div>
              </div>
            </div>
            <div className="nm-row">
              <span
                className="nm-dot chip chip-pending"
                style={{ padding: 0, width: 8, height: 8 }}
              ></span>
              <div>
                <div className="nm-t">Items with outstanding reservations</div>
                <div className="nm-time">2 items</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// W2 · Stock monitoring ledger (FLAGSHIP)
// ---------------------------------------------------------------------------
function W2Ledger({ role }) {
  const [proj, setProj] = useState("NORECO II — 13.2KV");
  const [expand, setExpand] = useState(null);
  const isCostCtr =
    proj === "WORKSHOP" || proj === "JCE STOCK" || proj === "MOTORPOOL";

  return (
    <div className="screen wide">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W2</div>
          <h2 className="ph-title">Stock monitoring ledger</h2>
        </div>
        <div className="ph-actions">
          <select
            className="field"
            style={{ width: "auto" }}
            value={proj}
            onChange={(e) => setProj(e.target.value)}
          >
            {WH_PROJECTS.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
          <select className="field" style={{ width: "auto" }}>
            <option>All locations</option>
            <option>Main Office</option>
            <option>Bulacan site</option>
          </select>
          <button className="btn btn-ghost btn-sm">Export</button>
        </div>
      </div>
      {isCostCtr && (
        <div className="muted-note" style={{ marginBottom: 12 }}>
          Cost-centre ledger — Planned / Variance hidden. Balance = Delivered −
          Utilized.
        </div>
      )}

      <div className="solid table-wrap grid-wrap">
        <table className="jtable whledger">
          <thead>
            <tr>
              <th className="frz">WBS</th>
              <th>Item description</th>
              <th>Unit</th>
              <th className="num">Unit cost</th>
              {!isCostCtr && <th className="num grp-e">Planned</th>}
              {!isCostCtr && <th className="num">Undelivered</th>}
              <th className="num grp-e">Delivered</th>
              <th className="num grp-d">Utilized</th>
              <th className="num grp-n">Balance</th>
              {!isCostCtr && <th className="num">Variance</th>}
            </tr>
          </thead>
          <tbody>
            {WH_LEDGER.map((r, i) => {
              const undelivered =
                r.planned != null ? r.planned - r.delivered : null;
              const balance = r.delivered - r.utilized;
              const variance =
                r.planned != null ? r.delivered - r.planned : null;
              const open = expand === i;
              return (
                <React.Fragment key={i}>
                  <tr
                    onClick={() => setExpand(open ? null : i)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="frz mono">
                      {r.wbs || <span className="noplan">no plan</span>}
                    </td>
                    <td>
                      {open ? "▾ " : "▸ "}
                      {r.item}
                      {r.offBoq && <span className="offboq-tag">off-BOQ</span>}
                    </td>
                    <td>{r.unit}</td>
                    <td className="num">{r.cost ? qn(r.cost) : "—"}</td>
                    {!isCostCtr && (
                      <td className="num grp-e">
                        {r.planned != null ? (
                          qn(r.planned)
                        ) : (
                          <span className="noplan">—</span>
                        )}
                      </td>
                    )}
                    {!isCostCtr && (
                      <td className="num">
                        {undelivered != null ? qn(undelivered) : "—"}
                      </td>
                    )}
                    <td className="num grp-e computed">{qn(r.delivered)}</td>
                    <td className="num grp-d computed">{qn(r.utilized)}</td>
                    <td
                      className="num grp-n computed"
                      style={{ fontWeight: 700 }}
                    >
                      {qn(balance)}
                    </td>
                    {!isCostCtr && (
                      <td className="num">
                        {variance != null ? (
                          <span
                            className={variance < 0 ? "var-neg" : "var-pos"}
                          >
                            {variance > 0 ? "+" : ""}
                            {qn(variance)}
                          </span>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                  {open && (
                    <tr className="daily-detail-row">
                      <td></td>
                      <td colSpan={isCostCtr ? 5 : 9}>
                        <div className="daily-detail">
                          <div className="dd-title">
                            Per-location breakdown · {r.item}
                          </div>
                          <table className="jtable dd-table">
                            <thead>
                              <tr>
                                <th>Location</th>
                                <th className="num">Delivered</th>
                                <th className="num">Utilized</th>
                                <th className="num">Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Main Office</td>
                                <td className="num">
                                  {qn(Math.round(r.delivered * 0.4))}
                                </td>
                                <td className="num">
                                  {qn(Math.round(r.utilized * 0.3))}
                                </td>
                                <td className="num">
                                  {qn(
                                    Math.round(
                                      r.delivered * 0.4 - r.utilized * 0.3,
                                    ),
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>Bulacan site</td>
                                <td className="num">
                                  {qn(Math.round(r.delivered * 0.6))}
                                </td>
                                <td className="num">
                                  {qn(Math.round(r.utilized * 0.7))}
                                </td>
                                <td className="num">
                                  {qn(
                                    Math.round(
                                      r.delivered * 0.6 - r.utilized * 0.7,
                                    ),
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          {r.offBoq &&
                            (role === "warehouse" || role === "owner") && (
                              <button
                                className="btn btn-ghost btn-sm"
                                style={{ marginTop: 8 }}
                              >
                                Promote to plan (set planned qty — audited)
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Delivered = Σ Locked MRR receipts · Utilized = Σ Locked Release issues ·
        Balance = Delivered − Utilized · Variance = Delivered − Planned (“—” for
        off-BOQ rows, never a misleading negative). Derived columns are
        non-editable.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// W3 · Item master
// ---------------------------------------------------------------------------
function W3Items() {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W3</div>
          <h2 className="ph-title">Inventory item master</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">+ Add item</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Item code</th>
              <th>Description</th>
              <th>Unit</th>
              <th className="num">Main Office</th>
              <th className="num">Sites</th>
              <th className="num">Reserved</th>
              <th className="num">Available</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {WH_ITEMS.map((it) => {
              const onhand = it.main + it.sites;
              const avail = onhand - it.reserved;
              return (
                <tr key={it.code} style={{ cursor: "pointer" }}>
                  <td className="mono" style={{ fontWeight: 600 }}>
                    {it.code}
                  </td>
                  <td style={{ fontWeight: 600 }}>{it.desc}</td>
                  <td>{it.unit}</td>
                  <td className="num computed">{qn(it.main)}</td>
                  <td className="num computed">{qn(it.sites)}</td>
                  <td className="num">{qn(it.reserved)}</td>
                  <td
                    className="num computed"
                    style={{
                      fontWeight: 700,
                      color: avail < 0 ? "var(--st-danger)" : "inherit",
                    }}
                  >
                    {qn(avail)}
                  </td>
                  <td style={{ color: "var(--jce-ink-2)" }}>{it.cat}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        On-hand / Available are derived from movements — never typed. Item codes
        are system-generated; duplicate-code prevention on create.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// W7 · Stock movements ledger (immutable)
// ---------------------------------------------------------------------------
function W7Movements({ role }) {
  const [adj, setAdj] = useState(false);
  const canAdjust = role === "warehouse" || role === "owner";
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W7</div>
          <h2 className="ph-title">Stock movements — ACSR conductor 1/0</h2>
        </div>
        <div className="ph-actions">
          {canAdjust && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setAdj(true)}
            >
              Post Adjustment
            </button>
          )}
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Type</th>
              <th className="num">Qty (signed)</th>
              <th>Date</th>
              <th>Actor</th>
              <th>Location</th>
              <th>Source</th>
              <th>Reason</th>
              <th className="num">Running balance</th>
            </tr>
          </thead>
          <tbody>
            {MOVEMENTS.map((m, i) => (
              <tr key={i}>
                <td>
                  <span className={"chip chip-" + MOVE_TONE[m.type]}>
                    {m.type}
                  </span>
                </td>
                <td
                  className="num money"
                  style={{
                    color: m.qty < 0 ? "var(--st-danger)" : "var(--st-success)",
                  }}
                >
                  {m.qty > 0 ? "+" : ""}
                  {qn(m.qty)}
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {m.date}
                </td>
                <td>{m.actor}</td>
                <td>{m.loc}</td>
                <td>
                  {m.src === "manual" ? (
                    <span className="muted">manual</span>
                  ) : (
                    <span className="docchip sm">{m.src}</span>
                  )}
                </td>
                <td style={{ color: "var(--jce-ink-2)" }}>{m.reason || "—"}</td>
                <td className="num" style={{ fontWeight: 600 }}>
                  {qn(m.bal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Movements are immutable — corrections are compensating movements or
        document unlocks. Adjustment without a reason is rejected.
      </div>
      {adj && (
        <div className="jce-scrim center">
          <div className="glass-modal idle-modal">
            <h3>Post adjustment</h3>
            <div className="form-grid" style={{ marginTop: 8 }}>
              <L l="Item">
                <div className="field is-computed">ACSR conductor 1/0</div>
              </L>
              <L l="Location">
                <select className="field">
                  <option>Main Office</option>
                  <option>Bulacan site</option>
                </select>
              </L>
              <L l="Signed delta" req>
                <input className="field" placeholder="e.g. -12" />
              </L>
              <L l="Reason" req>
                <input className="field" placeholder="mandatory" />
              </L>
            </div>
            <div className="idle-acts">
              <button className="btn btn-ghost" onClick={() => setAdj(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => setAdj(false)}>
                Post (audited)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// W8 · MR stock-verification
// ---------------------------------------------------------------------------
function W8Verify() {
  const [verified, setVerified] = useState(false);
  const mr = WH_MR_VERIFY[0];
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W8</div>
          <h2 className="ph-title">MR stock-verification</h2>
        </div>
        <div className="ph-actions">
          {verified ? (
            <span className="chip chip-success">Verified by Warehouse</span>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setVerified(true)}
            >
              Verify (records status)
            </button>
          )}
        </div>
      </div>
      <div className="solid form-body">
        <div className="form-grid" style={{ marginBottom: 16 }}>
          <L l="MR No.">
            <div className="field is-computed">{mr.mr}</div>
          </L>
          <L l="Project">
            <div className="field is-computed">{mr.project}</div>
          </L>
        </div>
        <div
          className="solid table-wrap"
          style={{ boxShadow: "none", border: "1px solid var(--jce-line)" }}
        >
          <table className="jtable">
            <thead>
              <tr>
                <th>Item</th>
                <th className="num grp-e">Requested</th>
                <th className="num grp-e">Available (live)</th>
                <th className="num grp-d">For Purchase</th>
                <th>Reservation preview</th>
              </tr>
            </thead>
            <tbody>
              {mr.lines.map((l, i) => {
                const fp = Math.max(0, l.req - l.avail);
                const res = Math.min(l.req, l.avail);
                return (
                  <tr key={i}>
                    <td>{l.item}</td>
                    <td className="num grp-e">
                      {qn(l.req)} {l.unit}
                    </td>
                    <td className="num grp-e computed">
                      {qn(l.avail)} {l.unit}
                    </td>
                    <td
                      className="num grp-d"
                      style={{
                        fontWeight: 600,
                        color:
                          fp > 0 ? "var(--jce-orange-600)" : "var(--jce-ink-2)",
                      }}
                    >
                      {qn(fp)} {l.unit}
                    </td>
                    <td>
                      {res > 0 ? (
                        <span
                          className="chip chip-success"
                          style={{ padding: "1px 7px" }}
                        >
                          reserve {qn(res)}
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="muted-note" style={{ marginTop: 12 }}>
          Available = on_hand − reserved (live). On MR approval the reservations
          create (available down); fulfillment via W5 issues consumes
          reservations. Verify records status only — the offline signature is on
          the printed form.
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// W9 · Warehouse audit log
// ---------------------------------------------------------------------------
function W9Audit() {
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W9</div>
          <h2 className="ph-title">Warehouse audit log</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">Export</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Entity</th>
              <th>Action</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {WH_AUDIT.map((a, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 11 }}>
                  {a.ts}
                </td>
                <td>{a.actor}</td>
                <td>
                  <span className="docchip">{a.entity}</span>
                </td>
                <td>
                  <span
                    className={
                      "chip chip-" +
                      (a.action === "Lock" ? "locked" : "neutral")
                    }
                  >
                    {a.action}
                  </span>
                </td>
                <td>{a.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Every Lock and Unlock is audited, plus item edits, movements,
        reservations, MR verification, off-BOQ add / promote-to-plan.
      </div>
    </div>
  );
}

Object.assign(window, {
  W1Dashboard,
  W2Ledger,
  W3Items,
  W7Movements,
  W8Verify,
  W9Audit,
});
