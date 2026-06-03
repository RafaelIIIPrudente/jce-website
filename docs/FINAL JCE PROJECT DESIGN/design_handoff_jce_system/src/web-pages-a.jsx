// ============================================================================
// JCE SYSTEM — Public website pages (S1–S9). Mobile-first, responsive.
// ============================================================================
const { useState } = React;
const WIcon = window.Icon;

// ---------------------------------------------------------------------------
// S1 · Home (FLAGSHIP)
// ---------------------------------------------------------------------------
function S1Home({ go }) {
  return (
    <div className="web-page">
      {/* hero */}
      <section className="web-hero jce-backdrop">
        <div className="jce-glow-3"></div>
        <div className="hero-inner">
          <div className="hero-eyebrow">
            JC Electrofields Power System, Inc.
          </div>
          <h1 className="hero-h1">
            Power infrastructure,
            <br />
            <span className="g">engineered to energize.</span>
          </h1>
          <p className="hero-sub">
            Substations, transmission lines and renewable energy — design-build
            EPC up to <strong>230 KV</strong>, delivered across the Philippines.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => go("contact")}>
              Request a consultation
            </button>
            <button className="btn btn-ghost" onClick={() => go("projects")}>
              View projects
            </button>
          </div>
          <div className="hero-stats">
            {STATS.map((s, i) => (
              <div key={i} className="hstat">
                <div className="hstat-v">{s.v}</div>
                <div className="hstat-k">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* capabilities */}
      <section className="web-section">
        <div className="sec-head">
          <div className="sec-eyebrow">What we do</div>
          <h2 className="sec-h2">Full-scope power engineering</h2>
        </div>
        <div className="cap-grid">
          {SERVICES.slice(0, 6).map((s, i) => (
            <button
              key={i}
              className="glass cap-card"
              onClick={() => go("services")}
            >
              <div className="cap-ic">
                <WIcon name={s.icon} size={22} color="var(--jce-green-700)" />
              </div>
              <div className="cap-name">{s.name}</div>
              <div className="cap-spec">{s.spec}</div>
            </button>
          ))}
        </div>
      </section>

      {/* featured projects */}
      <section className="web-section alt">
        <div className="sec-head">
          <div className="sec-eyebrow">Selected work</div>
          <h2 className="sec-h2">Projects energized</h2>
          <button className="sec-link" onClick={() => go("projects")}>
            All projects →
          </button>
        </div>
        <div className="proj-rail">
          {WEB_PROJECTS_PUB.slice(0, 3).map((p, i) => (
            <div key={i} className="solid pcard">
              <div className="pcard-img">
                <div className="pcard-ph">
                  <WIcon name="bdd" size={28} color="var(--jce-ink-2)" />
                </div>
                <span className="pcard-year">{p.year}</span>
              </div>
              <div className="pcard-body">
                <div className="pcard-name">{p.name}</div>
                <div className="pcard-meta">
                  {p.client || "Confidential client"} · {p.loc}
                </div>
                <div className="pcard-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="wtag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* trust band */}
      <section className="web-section">
        <div className="trust-band glass">
          <div className="trust-txt">
            <h2>Accredited for NGCP direct connection via 69 KV</h2>
            <p>
              From application to energization — JCE is the partner of choice
              for cooperatives, industrials and government across the
              archipelago.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => go("contact")}>
            Start a conversation
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="web-cta jce-backdrop">
        <div className="jce-glow-3"></div>
        <div className="cta-inner">
          <h2>Have a project in mind?</h2>
          <p>
            Tell us about your power requirement — we'll respond with a
            capability profile and indicative scope.
          </p>
          <button className="btn btn-primary" onClick={() => go("contact")}>
            Get in touch
          </button>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S2 · About
// ---------------------------------------------------------------------------
function S2About() {
  return (
    <div className="web-page web-inner-page">
      <PageHero
        eyebrow="Who we are"
        title="Built on power, driven by precision"
        sub="JC Electrofields Power System, Inc. is a Filipino power-engineering firm delivering substations, transmission lines and renewable-energy projects nationwide."
      />
      <section className="web-section">
        <div className="about-grid">
          <div className="solid about-card">
            <div className="ac-k">Mission</div>
            <div className="ac-v">
              To energize Philippine progress with safe, reliable, world-class
              power infrastructure.
            </div>
          </div>
          <div className="solid about-card">
            <div className="ac-k">Vision</div>
            <div className="ac-v">
              The most trusted EPC partner for power up to 230 KV in the region.
            </div>
          </div>
          <div className="solid about-card">
            <div className="ac-k">Values</div>
            <div className="ac-v">
              Safety first. Engineering integrity. Delivered on schedule.
            </div>
          </div>
        </div>
        <div className="stat-band glass">
          {STATS.map((s, i) => (
            <div key={i} className="sb-stat">
              <div className="sb-v">{s.v}</div>
              <div className="sb-k">{s.k}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S3 · Services
// ---------------------------------------------------------------------------
function S3Services({ go }) {
  return (
    <div className="web-page web-inner-page">
      <PageHero
        eyebrow="Capabilities"
        title="Services"
        sub="Turnkey EPC and specialized power services from distribution voltages up to 230 KV."
      />
      <section className="web-section">
        <div className="svc-list">
          {SERVICES.map((s, i) => (
            <div key={i} className="glass svc-row">
              <div className="svc-ic">
                <WIcon name={s.icon} size={24} color="var(--jce-green-700)" />
              </div>
              <div className="svc-main">
                <div className="svc-name">
                  {s.name} <span className="svc-spec">{s.spec}</span>
                </div>
                <div className="svc-desc">{s.desc}</div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => go("contact")}
              >
                Enquire
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S4 · Projects (filterable gallery)
// ---------------------------------------------------------------------------
function S4Projects() {
  const [tag, setTag] = useState("All");
  const tags = [
    "All",
    ...Array.from(new Set(WEB_PROJECTS_PUB.flatMap((p) => p.tags))),
  ];
  const rows = WEB_PROJECTS_PUB.filter(
    (p) => tag === "All" || p.tags.includes(tag),
  );
  return (
    <div className="web-page web-inner-page">
      <PageHero
        eyebrow="Portfolio"
        title="Projects"
        sub="A selection of substations, lines and renewable plants delivered across the Philippines."
      />
      <section className="web-section">
        <div className="filter-chips">
          {tags.map((t) => (
            <button
              key={t}
              className={"fchip" + (tag === t ? " on" : "")}
              onClick={() => setTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="proj-gallery">
          {rows.map((p, i) => (
            <div key={i} className="solid pcard">
              <div className="pcard-img">
                <div className="pcard-ph">
                  <WIcon name="bdd" size={28} color="var(--jce-ink-2)" />
                </div>
                <span className="pcard-year">{p.year}</span>
              </div>
              <div className="pcard-body">
                <div className="pcard-name">{p.name}</div>
                <div className="pcard-meta">
                  {p.client || "Confidential client"} · {p.loc}
                </div>
                <div className="pcard-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="wtag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// S5 · Products
// ---------------------------------------------------------------------------
function S5Products({ go }) {
  return (
    <div className="web-page web-inner-page">
      <PageHero
        eyebrow="What we supply"
        title="Products"
        sub="Power equipment specified, supplied and integrated by JCE — kept distinct from our EPC services."
      />
      <section className="web-section">
        <div className="prod-grid">
          {PRODUCTS.map((p, i) => (
            <div key={i} className="solid prod-card">
              <div className="prod-img">
                <div className="pcard-ph">
                  <WIcon name="pur" size={26} color="var(--jce-ink-2)" />
                </div>
              </div>
              <div className="prod-body">
                <span className="wtag">{p.tag}</span>
                <div className="prod-name">{p.name}</div>
                <div className="prod-spec">{p.spec}</div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => go("contact")}
                >
                  Request quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// shared page hero
function PageHero({ eyebrow, title, sub }) {
  return (
    <section className="inner-hero jce-backdrop">
      <div className="jce-glow-3"></div>
      <div className="ih-inner">
        <div className="sec-eyebrow">{eyebrow}</div>
        <h1 className="ih-title">{title}</h1>
        <p className="ih-sub">{sub}</p>
      </div>
    </section>
  );
}

window.S1Home = S1Home;
window.S2About = S2About;
window.S3Services = S3Services;
window.S4Projects = S4Projects;
window.S5Products = S5Products;
window.PageHero = PageHero;
