// ============================================================================
// JCE SYSTEM — Warehouse module shell: sub-nav + routing across W1–W13
// ============================================================================

function WHModule({ role }) {
  const [tab, setTab] = useState("ledger");
  const [p2, setP2] = useState("reorder");
  const TABS = [
    ["dashboard", "Dashboard"],
    ["ledger", "Stock Ledger"],
    ["items", "Item Master"],
    ["mrr", "MRR"],
    ["release", "Release"],
    ["transfer", "Transfer"],
    ["movements", "Movements"],
    ["verify", "MR Verification"],
    ["phase2", "Phase 2"],
    ["audit", "Audit Log"],
  ];
  const P2TABS = [
    ["reorder", "Reorder · W10"],
    ["stocktake", "Stock-take · W11"],
    ["custody", "Tool Custody · W12"],
    ["bins", "Bins & Barcodes · W13"],
  ];
  return (
    <div>
      <div className="hr-subnav glass-nav acc-subnav">
        {TABS.map(([id, l]) => (
          <button
            key={id}
            className={"subnav-item" + (tab === id ? " on" : "")}
            onClick={() => setTab(id)}
          >
            {l}
          </button>
        ))}
      </div>
      {tab === "dashboard" && (
        <W1Dashboard role={role} onLedger={() => setTab("ledger")} />
      )}
      {tab === "ledger" && <W2Ledger role={role} />}
      {tab === "items" && <W3Items />}
      {tab === "mrr" && <W4MRR role={role} />}
      {tab === "release" && <W5Release role={role} />}
      {tab === "transfer" && <W6Transfer role={role} />}
      {tab === "movements" && <W7Movements role={role} />}
      {tab === "verify" && <W8Verify />}
      {tab === "phase2" && (
        <React.Fragment>
          <div
            className="seg glass-nav"
            style={{
              marginBottom: 16,
              display: "inline-flex",
              flexWrap: "wrap",
            }}
          >
            {P2TABS.map(([id, l]) => (
              <button
                key={id}
                className={p2 === id ? "on" : ""}
                onClick={() => setP2(id)}
              >
                {l}
              </button>
            ))}
          </div>
          {p2 === "reorder" && <W10Reorder />}
          {p2 === "stocktake" && <W11StockTake />}
          {p2 === "custody" && <W12Custody />}
          {p2 === "bins" && <W13Bins />}
        </React.Fragment>
      )}
      {tab === "audit" && <W9Audit />}
    </div>
  );
}

window.WHModule = WHModule;
