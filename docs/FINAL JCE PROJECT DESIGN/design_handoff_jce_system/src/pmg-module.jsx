// ============================================================================
// JCE SYSTEM — PMG module shell: sub-nav + project workspace routing
// ============================================================================

function PMGModule({ role }) {
  const [tab, setTab] = useState("portfolio"); // dashboard|portfolio|new|mr|audit
  const [project, setProject] = useState(null); // open project workspace
  const [pTab, setPTab] = useState("header"); // header|boq|vo|acc|billing|timeline
  const [newView, setNewView] = useState("wizard"); // wizard|manual
  const [mr, setMr] = useState(null);
  const [p2, setP2] = useState("photos");

  const TABS = [
    ["dashboard", "Dashboard"],
    ["portfolio", "Portfolio"],
    ["new", "New Project"],
    ["mr", "Material Requests"],
    ["phase2", "Phase 2"],
    ["audit", "Audit Log"],
  ];
  const P2TABS = [
    ["photos", "Photos · P14"],
    ["templates", "Templates · P15"],
    ["scurve", "S-curve · P16"],
    ["trace", "Traceability · P17"],
    ["pack", "Doc Pack · P18"],
    ["budget", "Budget · P19"],
  ];

  // project workspace
  if (project) {
    const PT = [
      ["header", "Header · P5"],
      ["boq", "BOQ · P6"],
      ["vo", "Variation Orders · P7"],
      ["acc", "Accomplishment · P8"],
      ["billing", "Billing · P9"],
      ["timeline", "Timeline · P12"],
    ];
    return (
      <div>
        <button className="back-link" onClick={() => setProject(null)}>
          ← Portfolio
        </button>
        <div
          className="seg glass-nav"
          style={{ marginBottom: 16, display: "inline-flex", flexWrap: "wrap" }}
        >
          {PT.map(([id, l]) => (
            <button
              key={id}
              className={pTab === id ? "on" : ""}
              onClick={() => setPTab(id)}
            >
              {l}
            </button>
          ))}
        </div>
        {pTab === "header" && <P5Header project={project} />}
        {pTab === "boq" && <P6BOQ role={role} />}
        {pTab === "vo" && <P7VO role={role} />}
        {pTab === "acc" && (
          <P8Accomplishment
            role={role}
            project={project}
            onBack={() => setPTab("header")}
          />
        )}
        {pTab === "billing" && <P9Billing />}
        {pTab === "timeline" && <P12Timeline />}
      </div>
    );
  }

  return (
    <div>
      <div className="hr-subnav glass-nav">
        {TABS.map(([id, l]) => (
          <button
            key={id}
            className={"subnav-item" + (tab === id ? " on" : "")}
            onClick={() => {
              setTab(id);
              setMr(null);
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <P1Dashboard onPortfolio={() => setTab("portfolio")} />
      )}
      {tab === "portfolio" && (
        <P2Portfolio
          role={role}
          onOpen={(p) => {
            setProject(p);
            setPTab(p.type === "Customer" ? "acc" : "header");
          }}
          onNew={() => setTab("new")}
        />
      )}
      {tab === "new" && (
        <React.Fragment>
          <div
            className="seg glass-nav"
            style={{ marginBottom: 16, display: "inline-flex" }}
          >
            <button
              className={newView === "wizard" ? "on" : ""}
              onClick={() => setNewView("wizard")}
            >
              BOQ import · P3
            </button>
            <button
              className={newView === "manual" ? "on" : ""}
              onClick={() => setNewView("manual")}
            >
              Clone / Manual · P4
            </button>
          </div>
          {newView === "wizard" ? (
            <P3Wizard
              onBack={() => setTab("portfolio")}
              onCommit={() => {
                setTab("portfolio");
              }}
            />
          ) : (
            <P4ManualClone onBack={() => setTab("portfolio")} />
          )}
        </React.Fragment>
      )}
      {tab === "mr" &&
        (mr ? (
          <P10MR mr={mr} onBack={() => setMr(null)} />
        ) : (
          <P11MRRegister onOpen={setMr} />
        ))}
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
          {p2 === "photos" && <P14Photos role={role} />}
          {p2 === "templates" && <P15Templates />}
          {p2 === "scurve" && <P16Scurve />}
          {p2 === "trace" && <P17Traceability />}
          {p2 === "pack" && <P18DocPack />}
          {p2 === "budget" && <P19Budget />}
        </React.Fragment>
      )}
      {tab === "audit" && <P13Audit />}
    </div>
  );
}

window.PMGModule = PMGModule;
