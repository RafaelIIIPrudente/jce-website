// ============================================================================
// JCE SYSTEM — Accounting module shell: sub-nav + routing across A1–A19
// ============================================================================

function AccModule({ role }) {
  const [tab, setTab] = useState("payroll");
  // payroll
  const [paySub, setPaySub] = useState("summary"); // summary|payslip|loans|coa|settings
  const [batch, setBatch] = useState(null);
  // sales / collections / vouchers
  const [salesView, setSalesView] = useState("register"); // register|si|soa
  const [collView, setCollView] = useState("register"); // register|cr|ar
  const [vView, setVView] = useState("register"); // register|form
  const [cv, setCv] = useState(null);

  const TABS = [
    ["payroll", "Payroll"],
    ["sales", "Sales"],
    ["coll", "Collections"],
    ["vouchers", "Payable Voucher"],
    ["disb", "Disbursement"],
    ["journal", "Journal"],
    ["report", "Reporting"],
    ["clients", "Clients"],
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
              setBatch(null);
              setSalesView("register");
              setCollView("register");
              setVView("register");
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "payroll" && (
        <React.Fragment>
          <div
            className="seg glass-nav"
            style={{
              marginBottom: 16,
              display: "inline-flex",
              flexWrap: "wrap",
            }}
          >
            {[
              ["summary", "Summary · A4/A5"],
              ["payslip", "Payslips · A6"],
              ["loans", "Loans · A3"],
              ["coa", "Chart of Accounts · A2"],
              ["settings", "Settings · A1"],
            ].map(([id, l]) => (
              <button
                key={id}
                className={paySub === id ? "on" : ""}
                onClick={() => {
                  setPaySub(id);
                  setBatch(null);
                }}
              >
                {l}
              </button>
            ))}
          </div>
          {paySub === "summary" &&
            (batch ? (
              <A5Workspace
                role={role}
                batch={batch}
                onBack={() => setBatch(null)}
              />
            ) : (
              <A4List role={role} onOpen={setBatch} />
            ))}
          {paySub === "payslip" && <A6Payslip role={role} />}
          {paySub === "loans" && <A3Loans role={role} />}
          {paySub === "coa" && <A2CoA role={role} />}
          {paySub === "settings" && <A1Settings role={role} />}
        </React.Fragment>
      )}

      {tab === "sales" &&
        (salesView === "si" ? (
          <A8IssueSI onBack={() => setSalesView("register")} />
        ) : salesView === "soa" ? (
          <A9IssueSOA onBack={() => setSalesView("register")} />
        ) : (
          <A7Register
            role={role}
            onIssueSI={() => setSalesView("si")}
            onIssueSOA={() => setSalesView("soa")}
          />
        ))}

      {tab === "coll" &&
        (collView === "cr" ? (
          <A11A12Issue type="CR" onBack={() => setCollView("register")} />
        ) : collView === "ar" ? (
          <A11A12Issue type="AR" onBack={() => setCollView("register")} />
        ) : (
          <A10Register
            onCR={() => setCollView("cr")}
            onAR={() => setCollView("ar")}
          />
        ))}

      {tab === "vouchers" &&
        (vView === "form" ? (
          <A14Form cv={cv} onBack={() => setVView("register")} />
        ) : (
          <A13Register
            onOpen={(v) => {
              setCv(v);
              setVView("form");
            }}
          />
        ))}

      {tab === "disb" && <A15Disbursement />}
      {tab === "journal" && <JournalAndCA />}
      {tab === "report" && <A18Reporting role={role} />}
      {tab === "clients" && <A19Clients />}
    </div>
  );
}

// small wrapper so Journal tab can flip between A16 and A17
function JournalAndCA() {
  const [v, setV] = useState("jv");
  return (
    <div>
      <div
        className="seg glass-nav"
        style={{ marginBottom: 16, display: "inline-flex" }}
      >
        <button className={v === "jv" ? "on" : ""} onClick={() => setV("jv")}>
          Journal Vouchers · A16
        </button>
        <button className={v === "ca" ? "on" : ""} onClick={() => setV("ca")}>
          Cash Advances · A17
        </button>
      </div>
      {v === "jv" ? <A16JV /> : <A17CA />}
    </div>
  );
}

window.AccModule = AccModule;
