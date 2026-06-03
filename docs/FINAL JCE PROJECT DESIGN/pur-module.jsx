// ============================================================================
// JCE SYSTEM — Purchasing module shell: sub-nav + routing across U1–U24
// ============================================================================

function PurModule({ role }) {
  const [tab, setTab] = useState("ledger");
  const [po, setPo] = useState(null); // PO detail
  const [tracker, setTracker] = useState(null); // PO whose tracker to show
  const [creating, setCreating] = useState(false);
  const [rfp, setRfp] = useState(null);
  const [sup, setSup] = useState(null);
  const [p2, setP2] = useState("rfq");

  const TABS = [
    ["dashboard", "Dashboard"],
    ["ledger", "PO Ledger"],
    ["rfp", "RFP"],
    ["trackers", "Trackers"],
    ["suppliers", "Suppliers"],
    ["prq", "Requisitions"],
    ["approvals", "Approvals"],
    ["phase2", "Phase 2"],
    ["audit", "Audit Log"],
  ];
  const P2TABS = [
    ["rfqlist", "RFQ list · U15"],
    ["rfq", "Comparison · U16"],
    ["catalog", "Catalog · U17"],
    ["price", "Price History · U18"],
    ["blanket", "Blanket POs · U24"],
    ["budget", "Budget · U21"],
    ["leadtime", "Lead-time · U20"],
    ["cycle", "Cycle-time · U23"],
    ["bir", "BIR 2307 · U19"],
    ["mobile", "Mobile · U22"],
    ["merge", "Supplier Merge · U14"],
  ];

  // tracker overlay
  if (tracker) {
    return tracker.type === "Import" ? (
      <U7Tracker po={tracker} onBack={() => setTracker(null)} />
    ) : (
      <U8Local po={tracker} onBack={() => setTracker(null)} />
    );
  }

  return (
    <div>
      <div className="hr-subnav glass-nav acc-subnav">
        {TABS.map(([id, l]) => (
          <button
            key={id}
            className={"subnav-item" + (tab === id ? " on" : "")}
            onClick={() => {
              setTab(id);
              setPo(null);
              setCreating(false);
              setRfp(null);
              setSup(null);
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <U1Dashboard
          onLedger={() => setTab("ledger")}
          onTracker={() => setTab("trackers")}
          onApprovals={() => setTab("approvals")}
        />
      )}

      {tab === "ledger" &&
        (creating ? (
          <U3Create onBack={() => setCreating(false)} />
        ) : po ? (
          <U4Detail
            po={po}
            onBack={() => setPo(null)}
            onTracker={(p) => setTracker(p)}
          />
        ) : (
          <U2Ledger
            role={role}
            onOpen={setPo}
            onTracker={(p) => setTracker(p)}
            onCreate={() => setCreating(true)}
          />
        ))}

      {tab === "rfp" &&
        (rfp ? (
          <U6Form rfp={rfp} onBack={() => setRfp(null)} />
        ) : (
          <U5Register onOpen={setRfp} />
        ))}

      {tab === "trackers" && (
        <U7Tracker po={POS[0]} onBack={() => setTab("ledger")} />
      )}

      {tab === "suppliers" &&
        (sup ? (
          <U10Supplier sup={sup} onBack={() => setSup(null)} />
        ) : (
          <U9Suppliers onOpen={setSup} />
        ))}

      {tab === "prq" && <U11PRQ />}
      {tab === "approvals" && <U12Queue />}
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
          {p2 === "rfqlist" && <U15RFQ />}
          {p2 === "rfq" && <U16Matrix />}
          {p2 === "catalog" && <U17Catalog />}
          {p2 === "price" && <U18Price />}
          {p2 === "blanket" && <U24Blanket />}
          {p2 === "budget" && <U21Budget />}
          {p2 === "leadtime" && <U20LeadTime />}
          {p2 === "cycle" && <U23Cycle />}
          {p2 === "bir" && <U19BIR />}
          {p2 === "mobile" && <U22Mobile />}
          {p2 === "merge" && <U14Merge role={role} />}
        </React.Fragment>
      )}
      {tab === "audit" && <U13Audit />}
    </div>
  );
}

window.PurModule = PurModule;
