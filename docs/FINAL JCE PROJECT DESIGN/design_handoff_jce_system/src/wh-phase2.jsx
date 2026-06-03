// ============================================================================
// JCE SYSTEM — Warehouse Phase 2 (W10–W13)
//   W10 Reorder rules & low-stock · W11 Stock-take / cycle counting
//   W12 Returnable-tool custody · W13 Bins & barcodes
// ============================================================================

// ---- W10 · Reorder rules & low-stock alerts -------------------------------
function W10Reorder() {
  const RULES = [
    {
      item: "ACSR conductor 1/0",
      loc: "Main Office",
      min: 2000,
      reorder: 3000,
      onhand: 1200,
      below: true,
    },
    {
      item: "Insulator pin-type 15KV",
      loc: "Main Office",
      min: 100,
      reorder: 200,
      onhand: 240,
      below: false,
    },
    {
      item: "Welding rod E6013",
      loc: "Workshop",
      min: 50,
      reorder: 80,
      onhand: 32,
      below: true,
    },
    {
      item: "Distribution transformer 100KVA",
      loc: "Main Office",
      min: 2,
      reorder: 4,
      onhand: 2,
      below: true,
    },
  ];
  return (
    <div className="screen wide">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W10 · Phase 2</div>
          <h2 className="ph-title">Reorder rules &amp; low-stock alerts</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">+ Add rule</button>
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi-tile glass">
          <div className="kpi-k">Items below reorder point</div>
          <div className="kpi-v">3</div>
          <div className="kpi-d" style={{ color: "var(--st-danger)" }}>
            draft replenishment ready
          </div>
        </div>
        <div className="kpi-tile glass">
          <div className="kpi-k">Rules configured</div>
          <div className="kpi-v">{RULES.length}</div>
          <div className="kpi-d" style={{ color: "var(--jce-ink-2)" }}>
            item × location
          </div>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Item</th>
              <th>Location</th>
              <th className="num">Min level</th>
              <th className="num">Reorder point</th>
              <th className="num">On-hand (live)</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {RULES.map((r, i) => (
              <tr key={i} className={r.below ? "stale-row" : ""}>
                <td style={{ fontWeight: 600 }}>{r.item}</td>
                <td>{r.loc}</td>
                <td className="num">{qn(r.min)}</td>
                <td className="num">{qn(r.reorder)}</td>
                <td
                  className="num computed"
                  style={{
                    fontWeight: 700,
                    color: r.below ? "var(--st-danger)" : "inherit",
                  }}
                >
                  {qn(r.onhand)}
                </td>
                <td>
                  {r.below ? (
                    <span className="chip chip-danger">● Below reorder</span>
                  ) : (
                    <span className="chip chip-success">OK</span>
                  )}
                </td>
                <td>
                  {r.below && (
                    <button className="btn btn-ghost btn-sm">
                      Draft MR/PR
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Per-item, per-Location minimum levels; below-reorder badge surfaces on
        W2/W3 and alerts feed the notifications center (X4). Draft replenishment
        auto-prepared.
      </div>
    </div>
  );
}

// ---- W11 · Stock-take / cycle counting ------------------------------------
function W11StockTake() {
  const [counts, setCounts] = useState({ a: 1448, b: 238, c: 0, d: 2 });
  const ITEMS = [
    {
      k: "a",
      item: "ACSR conductor 1/0",
      loc: "Main Office",
      system: 1448,
      unit: "m",
    },
    {
      k: "b",
      item: "Insulator pin-type 15KV",
      loc: "Main Office",
      system: 240,
      unit: "pcs",
    },
    {
      k: "c",
      item: "Welding rod E6013",
      loc: "Workshop",
      system: 32,
      unit: "box",
    },
    {
      k: "d",
      item: "Transformer 100KVA",
      loc: "Main Office",
      system: 2,
      unit: "set",
    },
  ];
  return (
    <div className="screen wide">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W11 · Phase 2</div>
          <h2 className="ph-title">Stock-take — count session</h2>
        </div>
        <div className="ph-actions">
          <span className="chip chip-pending">In progress · 4 lines</span>
          <button className="btn btn-primary btn-sm">
            Review &amp; post variances
          </button>
        </div>
      </div>
      <div className="ctx-strip solid">
        <div>
          <span className="ctx-k">Scope</span>
          <span className="ctx-v">Main Office + Workshop</span>
        </div>
        <div>
          <span className="ctx-k">Started</span>
          <span className="ctx-v">2026-06-03 09:00</span>
        </div>
        <div>
          <span className="ctx-k">Counter</span>
          <span className="ctx-v">G. Lim</span>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Item</th>
              <th>Location</th>
              <th className="num grp-e">System on-hand</th>
              <th className="num">Counted</th>
              <th className="num grp-d">Variance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((it) => {
              const counted = counts[it.k];
              const v = counted - it.system;
              return (
                <tr key={it.k}>
                  <td style={{ fontWeight: 600 }}>{it.item}</td>
                  <td>{it.loc}</td>
                  <td className="num grp-e computed">
                    {qn(it.system)} {it.unit}
                  </td>
                  <td className="num">
                    <input
                      className="cell-input num"
                      value={counted}
                      onChange={(e) =>
                        setCounts((c) => ({
                          ...c,
                          [it.k]: Number(e.target.value) || 0,
                        }))
                      }
                    />
                  </td>
                  <td
                    className={"num grp-d"}
                    style={{
                      fontWeight: 700,
                      color:
                        v < 0
                          ? "var(--st-danger)"
                          : v > 0
                            ? "var(--st-success)"
                            : "var(--jce-ink-2)",
                    }}
                  >
                    {v > 0 ? "+" : ""}
                    {qn(v)}
                  </td>
                  <td>
                    {v !== 0 ? (
                      <span className="chip chip-pending">
                        Adj. {v > 0 ? "+" : ""}
                        {v}
                      </span>
                    ) : (
                      <span className="chip chip-success">Match</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Scheduled physical counts reconciled to system on-hand. Review → posts
        variance <strong>Adjustments</strong> (signed movements, mandatory
        reason) with full audit. On-hand is never typed directly — the count
        posts a movement.
      </div>
    </div>
  );
}

// ---- W12 · Returnable-tool custody ledger ---------------------------------
function W12Custody() {
  const [recs, setRecs] = useState([
    {
      id: 1,
      item: "Hydraulic crimping tool",
      code: "TOOL-0042",
      holder: "P. Garcia (Bulacan)",
      out: "2026-05-18",
      back: null,
    },
    {
      id: 2,
      item: "Insulation tester 5KV",
      code: "TOOL-0011",
      holder: "R. dela Cruz (Cavite)",
      out: "2026-05-10",
      back: null,
    },
    {
      id: 3,
      item: "Torque wrench set",
      code: "TOOL-0028",
      holder: "—",
      out: "2026-04-22",
      back: "2026-05-02",
    },
  ]);
  const ret = (id) =>
    setRecs(
      recs.map((r) =>
        r.id === id ? { ...r, holder: "—", back: "2026-06-03" } : r,
      ),
    );
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W12 · Phase 2</div>
          <h2 className="ph-title">Returnable-tool custody</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary btn-sm">+ Issue tool (OUT)</button>
        </div>
      </div>
      <div className="solid table-wrap">
        <table className="jtable">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Accountability code</th>
              <th>Current holder</th>
              <th>OUT date</th>
              <th>Returned</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recs.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.item}</td>
                <td>
                  <span className="docchip sm">{r.code}</span>
                </td>
                <td>
                  {r.holder === "—" ? (
                    <span className="muted">in warehouse</span>
                  ) : (
                    r.holder
                  )}
                </td>
                <td className="mono" style={{ fontSize: 12 }}>
                  {r.out}
                </td>
                <td>
                  {r.back ? (
                    <span className="mono" style={{ fontSize: 12 }}>
                      {r.back}
                    </span>
                  ) : (
                    <span className="chip chip-pending">Out</span>
                  )}
                </td>
                <td>
                  {!r.back && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => ret(r.id)}
                    >
                      Record return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="muted-note" style={{ marginTop: 10 }}>
        Promotes the Accountability Code into a real custody ledger: who holds
        which returnable tool, OUT date, and the Return event.
      </div>
    </div>
  );
}

// ---- W13 · Bins & barcodes -------------------------------------------------
function W13Bins() {
  const BINS = [
    {
      bin: "MO-A-01",
      loc: "Main Office",
      zone: "Aisle A",
      items: 8,
      qty: "1,448 m + 240 pcs",
    },
    {
      bin: "MO-A-02",
      loc: "Main Office",
      zone: "Aisle A",
      items: 3,
      qty: "2 set",
    },
    {
      bin: "MO-B-05",
      loc: "Main Office",
      zone: "Aisle B",
      items: 12,
      qty: "misc hardware",
    },
    {
      bin: "WS-01",
      loc: "Workshop",
      zone: "Rack 1",
      items: 6,
      qty: "32 box + steel",
    },
  ];
  return (
    <div className="screen">
      <div className="page-head glass">
        <div>
          <div className="kicker">Warehouse · W13 · Phase 2</div>
          <h2 className="ph-title">Bins &amp; barcodes</h2>
        </div>
        <div className="ph-actions">
          <button className="btn btn-accent btn-sm">⌗ Scan mode</button>
          <button className="btn btn-primary btn-sm">+ Add bin</button>
        </div>
      </div>
      <div className="scan-banner glass">
        <div className="scan-ic">⌗</div>
        <div>
          <div className="gb-t">Scan-first capture</div>
          <div className="gb-d">
            Camera-first, mobile-friendly flows for receipts, issues and counts
            — scan a bin's QR or an item barcode to jump straight to its
            movement entry.
          </div>
        </div>
      </div>
      <div className="bins-grid">
        {BINS.map((b, i) => (
          <div key={i} className="solid bin-card">
            <div className="bin-qr">
              <div className="qr-pattern"></div>
            </div>
            <div className="bin-body">
              <div className="bin-code">{b.bin}</div>
              <div className="bin-loc">
                {b.loc} · {b.zone}
              </div>
              <div className="bin-items">
                {b.items} items · {b.qty}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="muted-note" style={{ marginTop: 12 }}>
        Structured bin locations within a Location; barcode/QR scanning for
        receipts, issues, and counts.
      </div>
    </div>
  );
}

window.W10Reorder = W10Reorder;
window.W11StockTake = W11StockTake;
window.W12Custody = W12Custody;
window.W13Bins = W13Bins;
