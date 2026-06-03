// ============================================================================
// JCE SYSTEM — BDD module shell: sub-nav + routing across B1–B11
// ============================================================================

function BDDModule({ role }) {
  const [tab, setTab] = useState("inquiries");
  const [so, setSo] = useState(null);
  const [offer, setOffer] = useState(null);
  const [quote, setQuote] = useState(null);
  const [webKind, setWebKind] = useState("Projects");

  const TABS = [
    ["so", "Sales Orders"],
    ["offers", "Offers"],
    ["quotes", "Quotations"],
    ["web", "Website"],
    ["inquiries", "Inquiries"],
    ["audit", "Audit Log"],
  ];

  return (
    <div>
      <div className="hr-subnav glass-nav acc-subnav">
        {TABS.map(([id, l]) => (
          <button
            key={id}
            className={"subnav-item" + (tab === id ? " on" : "")}
            onClick={() => {
              setTab(id);
              setSo(null);
              setOffer(null);
              setQuote(null);
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "so" &&
        (so ? (
          <B2Record so={so} onBack={() => setSo(null)} />
        ) : (
          <B1List onOpen={setSo} />
        ))}
      {tab === "offers" &&
        (offer ? (
          <B4Offer offer={offer} onBack={() => setOffer(null)} />
        ) : (
          <B3Offers onOpen={setOffer} />
        ))}
      {tab === "quotes" &&
        (quote ? (
          <B6Comparison quote={quote} onBack={() => setQuote(null)} />
        ) : (
          <B5Quotations onOpen={setQuote} />
        ))}
      {tab === "web" && (
        <React.Fragment>
          <div
            className="seg glass-nav"
            style={{ marginBottom: 16, display: "inline-flex" }}
          >
            {["Projects", "Services", "Products"].map((k) => (
              <button
                key={k}
                className={webKind === k ? "on" : ""}
                onClick={() => setWebKind(k)}
              >
                {k} · B{k === "Projects" ? 7 : k === "Services" ? 8 : 9}
              </button>
            ))}
          </div>
          <WebContent kind={webKind} />
        </React.Fragment>
      )}
      {tab === "inquiries" && <B10Inbox />}
      {tab === "audit" && <B11Audit />}
    </div>
  );
}

window.BDDModule = BDDModule;
