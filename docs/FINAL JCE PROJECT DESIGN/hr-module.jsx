// ============================================================================
// JCE SYSTEM — HR module shell: sub-nav + routing across H1–H14
// ============================================================================

function HRModule({ role }) {
  const [tab, setTab] = useState("emp"); // emp | time | req | audit
  const [empView, setEmpView] = useState("list"); // list | record | edit | add | archived
  const [sel, setSel] = useState(null);
  const [timeView, setTimeView] = useState("grid"); // grid | batches

  const TABS = [
    ["emp", "Employees"],
    ["time", "Timekeeping"],
    ["req", "HR Requests"],
    ["audit", "HR Audit Log"],
  ];

  return (
    <div>
      <div className="hr-subnav glass-nav">
        {TABS.map(([id, l]) => (
          <button
            key={id}
            className={"subnav-item" + (tab === id ? " on" : "")}
            onClick={() => {
              setTab(id);
              setEmpView("list");
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "emp" &&
        (empView === "list" ? (
          <H1List
            role={role}
            onOpen={(e) => {
              setSel(e);
              setEmpView("record");
            }}
            onAdd={() => {
              setSel(null);
              setEmpView("add");
            }}
            onArchived={() => setEmpView("archived")}
          />
        ) : empView === "record" ? (
          <H2Record
            role={role}
            emp={sel}
            onBack={() => setEmpView("list")}
            onEdit={() => setEmpView("edit")}
          />
        ) : empView === "archived" ? (
          <H4Archived onBack={() => setEmpView("list")} />
        ) : (
          <H3Form
            role={role}
            emp={empView === "edit" ? sel : null}
            onCancel={() => setEmpView(sel ? "record" : "list")}
          />
        ))}

      {tab === "time" && (
        <React.Fragment>
          <div
            className="seg glass-nav"
            style={{ marginBottom: 16, display: "inline-flex" }}
          >
            <button
              className={timeView === "grid" ? "on" : ""}
              onClick={() => setTimeView("grid")}
            >
              Weekly grid · H5
            </button>
            <button
              className={timeView === "batches" ? "on" : ""}
              onClick={() => setTimeView("batches")}
            >
              Verification · H6
            </button>
          </div>
          {timeView === "grid" ? (
            <H5Grid role={role} />
          ) : (
            <H6Batches role={role} />
          )}
        </React.Fragment>
      )}

      {tab === "req" && <H7Register role={role} />}
      {tab === "audit" && <H14Audit />}
    </div>
  );
}

// Self-service module (My HR — H12/H13)
function SelfServiceModule({ role }) {
  const [view, setView] = useState("home"); // home | chooser | form
  const [type, setType] = useState(null);
  if (view === "chooser")
    return (
      <H13Chooser
        onPick={(t) => {
          setType(t);
          setView("form");
        }}
        onBack={() => setView("home")}
      />
    );
  if (view === "form")
    return (
      <RequestForm
        type={type}
        record={{
          no: "NEW",
          filed: "2026-06-03",
          emp: "N. Bautista (me)",
          key: "",
          status: "Pending",
          scan: false,
        }}
        role="employee"
        selfMode
        onBack={() => setView("chooser")}
      />
    );
  return <H12MyHR onSubmit={() => setView("chooser")} />;
}

Object.assign(window, { HRModule, SelfServiceModule });
