import { useState } from "react";
import Head from "next/head";
import {
  translations,
  portfolioData,
  aiPicksData,
  supercomputingData,
} from "../lib/translations";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const COLORS = ["#c9a84c", "#e8c97a", "#a07832", "#f0d898", "#7a5c20", "#d4b060", "#b08040", "#e0c070"];

const ScoreRing = ({ score }) => {
  const color =
    score >= 90 ? "#00ff88" : score >= 82 ? "#c9a84c" : "#6b9fff";
  const r = 30;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#1a1a1a" strokeWidth="6" />
      <circle
        cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text x="40" y="44" textAnchor="middle" fill={color} fontSize="14" fontFamily="'DM Serif Display', serif" fontWeight="bold">
        {score}
      </text>
    </svg>
  );
};

const RatingBadge = ({ rating, t }) => {
  const map = {
    buy: { label: t.aiPicks.buy, bg: "#003322", color: "#00ff88", border: "#00ff88" },
    hold: { label: t.aiPicks.hold, bg: "#1a1500", color: "#c9a84c", border: "#c9a84c" },
    watch: { label: t.aiPicks.watch, bg: "#001a33", color: "#6b9fff", border: "#6b9fff" },
  };
  const style = map[rating] || map.hold;
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      padding: "2px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}>
      {style.label}
    </span>
  );
};

export default function Home() {
  const [lang, setLang] = useState("en");
  const [activeSection, setActiveSection] = useState("portfolio");
  const [selectedStock, setSelectedStock] = useState(null);
  const t = translations[lang];
  const isRTL = lang === "he";

  const navLinks = [
    { id: "portfolio", label: t.nav.portfolio },
    { id: "criteria", label: t.nav.criteria },
    { id: "ai", label: t.nav.aiPicks },
    { id: "supercomputing", label: t.nav.supercomputing },
  ];

  const allPicks = [...aiPicksData, ...supercomputingData];
  const stock = selectedStock ? allPicks.find((s) => s.ticker === selectedStock) : null;

  const radarData = stock
    ? [
        { subject: "Moat", value: stock.moat },
        { subject: "ROIC", value: stock.roic },
        { subject: "Cash Flow", value: stock.cashflow },
        { subject: "Pricing", value: stock.pricing },
      ]
    : null;

  const pieData = portfolioData.map((s) => ({ name: s.ticker, value: s.weight }));

  const getRationale = (stock) => {
    if (lang === "he") return stock.rationale_he;
    if (lang === "fr") return stock.rationale_fr;
    return stock.rationale;
  };

  return (
    <>
      <Head>
        <title>Ackman Bot | בוט אקמן</title>
        <meta name="description" content="Bill Ackman Portfolio Intelligence" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #0a0a08;
          color: #e8dcc8;
          font-family: 'Libre Baskerville', serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        .ticker-tape {
          background: #111108;
          border-bottom: 1px solid #2a2510;
          overflow: hidden;
          white-space: nowrap;
          padding: 6px 0;
        }
        .ticker-inner {
          display: inline-block;
          animation: scrollLeft 40s linear infinite;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #c9a84c;
        }
        @keyframes scrollLeft {
          from { transform: translateX(100vw); }
          to { transform: translateX(-100%); }
        }
        .nav-glass {
          background: rgba(10,10,8,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #2a2510;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .hero-bg {
          background:
            radial-gradient(ellipse 800px 400px at 60% 0%, rgba(201,168,76,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 600px 300px at 10% 80%, rgba(107,159,255,0.05) 0%, transparent 50%),
            #0a0a08;
        }
        .card {
          background: #111108;
          border: 1px solid #2a2510;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .card:hover {
          border-color: #c9a84c;
          box-shadow: 0 0 30px rgba(201,168,76,0.08);
          transform: translateY(-2px);
        }
        .card.selected {
          border-color: #c9a84c;
          box-shadow: 0 0 40px rgba(201,168,76,0.15);
        }
        .gold { color: #c9a84c; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .serif { font-family: 'DM Serif Display', serif; }
        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          color: #e8dcc8;
          line-height: 1.1;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
          margin: 3rem 0;
        }
        .lang-btn {
          background: transparent;
          border: 1px solid #2a2510;
          color: #888;
          padding: 4px 12px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.1em;
          transition: all 0.2s;
        }
        .lang-btn.active {
          background: #c9a84c;
          border-color: #c9a84c;
          color: #0a0a08;
          font-weight: 700;
        }
        .nav-btn {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          font-family: 'Libre Baskerville', serif;
          font-size: 13px;
          padding: 8px 16px;
          transition: color 0.2s;
          letter-spacing: 0.02em;
        }
        .nav-btn.active { color: #c9a84c; }
        .nav-btn:hover { color: #e8dcc8; }
        .bar-bg {
          background: #1a1a12;
          border-radius: 4px;
          height: 6px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(90deg, #7a5c20, #c9a84c);
          transition: width 1s ease;
        }
        .criterion-card {
          background: linear-gradient(135deg, #111108 0%, #0f0f0a 100%);
          border: 1px solid #2a2510;
          border-radius: 12px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .criterion-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
        }
        table { border-collapse: collapse; width: 100%; }
        th {
          text-align: left;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #666;
          text-transform: uppercase;
          padding: 12px 16px;
          border-bottom: 1px solid #1a1a12;
        }
        td {
          padding: 14px 16px;
          border-bottom: 1px solid #111108;
          font-size: 13px;
        }
        tr:hover td { background: rgba(201,168,76,0.03); }
        .cta-btn {
          background: linear-gradient(135deg, #c9a84c, #a07832);
          color: #0a0a08;
          border: none;
          padding: 14px 32px;
          border-radius: 6px;
          font-family: 'DM Serif Display', serif;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201,168,76,0.3);
        }
        .cta-btn-outline {
          background: transparent;
          color: #c9a84c;
          border: 1px solid #c9a84c;
          padding: 13px 32px;
          border-radius: 6px;
          font-family: 'DM Serif Display', serif;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .cta-btn-outline:hover {
          background: rgba(201,168,76,0.1);
        }
        .positive { color: #00cc66; }
        .negative { color: #ff4455; }
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          th:nth-child(n+4), td:nth-child(n+4) { display: none; }
        }
      `}</style>

      {/* Ticker Tape */}
      <div className="ticker-tape">
        <div className="ticker-inner">
          {portfolioData.concat(aiPicksData, supercomputingData).map((s) => (
            <span key={s.ticker} style={{ marginRight: "3rem" }}>
              <span style={{ opacity: 0.5 }}>{s.ticker}</span>{" "}
              <span>${s.price || "—"}</span>{" "}
              <span style={{ color: (s.ytd || 0) >= 0 ? "#00cc66" : "#ff4455" }}>
                {s.ytd ? `${s.ytd > 0 ? "+" : ""}${s.ytd}%` : ""}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="nav-glass">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "20px" }}>◆</span>
            <span className="serif" style={{ fontSize: "18px", color: "#c9a84c" }}>Ackman Bot</span>
          </div>
          <div className="hide-mobile" style={{ display: "flex", gap: "0.25rem" }}>
            {navLinks.map((l) => (
              <button key={l.id} className={`nav-btn ${activeSection === l.id ? "active" : ""}`} onClick={() => setActiveSection(l.id)}>
                {l.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["en", "he", "fr"].map((l) => (
              <button key={l} className={`lang-btn ${lang === l ? "active" : ""}`} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main dir={isRTL ? "rtl" : "ltr"} style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Hero */}
        <section className="hero-bg" style={{ padding: "6rem 0 4rem", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.1)", border: "1px solid #c9a84c", borderRadius: "20px", padding: "4px 16px", marginBottom: "1.5rem" }}>
            <span className="mono" style={{ fontSize: "11px", color: "#c9a84c", letterSpacing: "0.15em" }}>
              {t.hero.badge}
            </span>
          </div>
          <h1 className="serif" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "#e8dcc8", lineHeight: "1", marginBottom: "0.5rem" }}>
            {t.hero.title}
          </h1>
          <p style={{ color: "#c9a84c", fontStyle: "italic", fontSize: "clamp(1rem, 2vw, 1.3rem)", marginBottom: "1.5rem" }}>
            {t.hero.subtitle}
          </p>
          <p style={{ color: "#888", maxWidth: "640px", margin: "0 auto 2.5rem", lineHeight: "1.8", fontSize: "15px" }}>
            {t.hero.description}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="cta-btn" onClick={() => setActiveSection("portfolio")}>{t.hero.cta}</button>
            <button className="cta-btn-outline" onClick={() => setActiveSection("ai")}>{t.hero.ctaSecondary}</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginTop: "4rem", flexWrap: "wrap" }}>
            {[
              { label: "AUM", value: "$18B+" },
              { label: "Holdings", value: "8 Core" },
              { label: "Ackman Score™", value: "94 max" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div className="serif" style={{ fontSize: "2.5rem", color: "#c9a84c" }}>{s.value}</div>
                <div className="mono" style={{ fontSize: "10px", color: "#666", letterSpacing: "0.15em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* Portfolio Section */}
        {activeSection === "portfolio" && (
          <section style={{ paddingBottom: "4rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <h2 className="section-title">{t.portfolio.title}</h2>
              <p style={{ color: "#888", marginTop: "0.5rem" }}>{t.portfolio.subtitle}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {/* Table */}
              <div className="card" style={{ padding: 0, overflow: "hidden", gridColumn: "1 / -1" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Company</th>
                      <th>{t.portfolio.allocation}</th>
                      <th className="hide-mobile">{t.portfolio.performance}</th>
                      <th className="hide-mobile">{t.portfolio.marketCap}</th>
                      <th className="hide-mobile">{t.portfolio.sector}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioData.map((s) => (
                      <tr key={s.ticker}>
                        <td><span className="mono" style={{ color: "#c9a84c", fontWeight: "600" }}>{s.ticker}</span></td>
                        <td>{s.name}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div className="bar-bg" style={{ width: "80px", flexShrink: 0 }}>
                              <div className="bar-fill" style={{ width: `${(s.weight / 25) * 100}%` }} />
                            </div>
                            <span className="mono" style={{ fontSize: "12px" }}>{s.weight}%</span>
                          </div>
                        </td>
                        <td className="hide-mobile">
                          <span className={`mono ${s.ytd >= 0 ? "positive" : "negative"}`}>
                            {s.ytd >= 0 ? "+" : ""}{s.ytd}%
                          </span>
                        </td>
                        <td className="hide-mobile"><span className="mono">${s.marketCap}</span></td>
                        <td className="hide-mobile">
                          <span style={{ background: "#1a1a12", border: "1px solid #2a2510", borderRadius: "4px", padding: "2px 8px", fontSize: "11px", color: "#888" }}>
                            {s.sector}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pie Chart */}
              <div className="card" style={{ padding: "1.5rem" }}>
                <h3 className="serif" style={{ color: "#c9a84c", marginBottom: "1rem" }}>Allocation</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} strokeWidth={2} stroke="#0a0a08">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#111108", border: "1px solid #2a2510", borderRadius: "8px", color: "#e8dcc8", fontFamily: "JetBrains Mono" }}
                      formatter={(v) => [`${v}%`, "Weight"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="card" style={{ padding: "1.5rem" }}>
                <h3 className="serif" style={{ color: "#c9a84c", marginBottom: "1rem" }}>Legend</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {portfolioData.map((s, i) => (
                    <div key={s.ticker} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span className="mono" style={{ fontSize: "12px", color: "#c9a84c", width: "48px" }}>{s.ticker}</span>
                      <span style={{ fontSize: "12px", color: "#888", flex: 1 }}>{s.name}</span>
                      <span className="mono" style={{ fontSize: "12px" }}>{s.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Criteria Section */}
        {activeSection === "criteria" && (
          <section style={{ paddingBottom: "4rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <h2 className="section-title">{t.criteria.title}</h2>
              <p style={{ color: "#888", marginTop: "0.5rem" }}>{t.criteria.subtitle}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {t.criteria.items.map((item, i) => (
                <div key={i} className="criterion-card">
                  <div className="mono" style={{ fontSize: "10px", color: "#c9a84c", letterSpacing: "0.15em", marginBottom: "0.5rem" }}>
                    0{i + 1}
                  </div>
                  <h3 className="serif" style={{ fontSize: "1.3rem", color: "#e8dcc8", marginBottom: "0.5rem" }}>{item.title}</h3>
                  <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.7" }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div style={{ background: "#111108", border: "1px solid #2a2510", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
              <p className="serif" style={{ fontSize: "1.5rem", color: "#c9a84c", fontStyle: "italic", lineHeight: "1.6" }}>
                "We want simple, predictable, free-cash-flow-generative businesses with dominant market positions, high barriers to entry, and limited exposure to extrinsic risks."
              </p>
              <p className="mono" style={{ marginTop: "1rem", fontSize: "11px", color: "#666", letterSpacing: "0.1em" }}>— BILL ACKMAN, PERSHING SQUARE CAPITAL MANAGEMENT</p>
            </div>
          </section>
        )}

        {/* AI Picks Section */}
        {activeSection === "ai" && (
          <section style={{ paddingBottom: "4rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <h2 className="section-title">{t.aiPicks.title}</h2>
              <p style={{ color: "#888", marginTop: "0.5rem" }}>{t.aiPicks.subtitle}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: selectedStock ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {aiPicksData.map((s) => (
                  <div key={s.ticker} className={`card ${selectedStock === s.ticker ? "selected" : ""}`}
                    style={{ padding: "1.25rem", cursor: "pointer" }}
                    onClick={() => setSelectedStock(selectedStock === s.ticker ? null : s.ticker)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <ScoreRing score={s.score} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                          <span className="mono" style={{ color: "#c9a84c", fontWeight: "600", fontSize: "16px" }}>{s.ticker}</span>
                          <span style={{ color: "#888", fontSize: "13px" }}>{s.name}</span>
                          <RatingBadge rating={s.rating} t={t} />
                        </div>
                        <div style={{ marginTop: "0.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "12px", color: "#888" }}>Price <span className="mono" style={{ color: "#e8dcc8" }}>${s.price}</span></span>
                          <span style={{ fontSize: "12px", color: "#888" }}>Target <span className="mono" style={{ color: "#00cc66" }}>${s.target}</span></span>
                          <span style={{ fontSize: "12px", color: "#888" }}>Upside <span className="mono" style={{ color: "#00cc66" }}>+{((s.target / s.price - 1) * 100).toFixed(1)}%</span></span>
                        </div>
                      </div>
                    </div>
                    <p style={{ marginTop: "0.75rem", fontSize: "12px", color: "#888", lineHeight: "1.6" }}>{getRationale(s)}</p>
                  </div>
                ))}
              </div>
              {stock && radarData && (
                <div className="card" style={{ padding: "1.5rem", position: "sticky", top: "80px", alignSelf: "start" }}>
                  <h3 className="serif" style={{ color: "#c9a84c", marginBottom: "0.25rem" }}>{stock.ticker} Analysis</h3>
                  <p style={{ fontSize: "12px", color: "#888", marginBottom: "1rem" }}>{t.aiPicks.score}: <strong className="gold">{stock.score}/100</strong></p>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#2a2510" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#888", fontSize: 11 }} />
                      <Radar dataKey="value" stroke="#c9a84c" fill="#c9a84c" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
                    {[{ label: "Moat", val: stock.moat }, { label: "ROIC", val: stock.roic }, { label: "Cash Flow", val: stock.cashflow }, { label: "Pricing", val: stock.pricing }].map((m) => (
                      <div key={m.label} style={{ flex: 1, minWidth: "80px", background: "#0a0a08", borderRadius: "8px", padding: "0.5rem", textAlign: "center" }}>
                        <div className="mono" style={{ color: "#c9a84c", fontSize: "18px", fontWeight: "600" }}>{m.val}</div>
                        <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Supercomputing Section */}
        {activeSection === "supercomputing" && (
          <section style={{ paddingBottom: "4rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <h2 className="section-title">{t.supercomputing.title}</h2>
              <p style={{ color: "#888", marginTop: "0.5rem" }}>{t.supercomputing.subtitle}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: selectedStock ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {supercomputingData.map((s) => (
                  <div key={s.ticker} className={`card ${selectedStock === s.ticker ? "selected" : ""}`}
                    style={{ padding: "1.25rem", cursor: "pointer" }}
                    onClick={() => setSelectedStock(selectedStock === s.ticker ? null : s.ticker)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <ScoreRing score={s.score} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                          <span className="mono" style={{ color: "#c9a84c", fontWeight: "600", fontSize: "16px" }}>{s.ticker}</span>
                          <span style={{ color: "#888", fontSize: "13px" }}>{s.name}</span>
                          <RatingBadge rating={s.rating} t={t} />
                        </div>
                        <div style={{ marginTop: "0.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "12px", color: "#888" }}>Price <span className="mono" style={{ color: "#e8dcc8" }}>${s.price}</span></span>
                          <span style={{ fontSize: "12px", color: "#888" }}>Target <span className="mono" style={{ color: "#00cc66" }}>${s.target}</span></span>
                          <span style={{ fontSize: "12px", color: "#888" }}>Upside <span className="mono" style={{ color: "#00cc66" }}>+{((s.target / s.price - 1) * 100).toFixed(1)}%</span></span>
                        </div>
                      </div>
                    </div>
                    <p style={{ marginTop: "0.75rem", fontSize: "12px", color: "#888", lineHeight: "1.6" }}>{getRationale(s)}</p>
                  </div>
                ))}
              </div>
              {stock && radarData && (
                <div className="card" style={{ padding: "1.5rem", position: "sticky", top: "80px", alignSelf: "start" }}>
                  <h3 className="serif" style={{ color: "#c9a84c", marginBottom: "0.25rem" }}>{stock.ticker} Analysis</h3>
                  <p style={{ fontSize: "12px", color: "#888", marginBottom: "1rem" }}>{t.aiPicks.score}: <strong className="gold">{stock.score}/100</strong></p>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#2a2510" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#888", fontSize: 11 }} />
                      <Radar dataKey="value" stroke="#c9a84c" fill="#c9a84c" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
                    {[{ label: "Moat", val: stock.moat }, { label: "ROIC", val: stock.roic }, { label: "Cash Flow", val: stock.cashflow }, { label: "Pricing", val: stock.pricing }].map((m) => (
                      <div key={m.label} style={{ flex: 1, minWidth: "80px", background: "#0a0a08", borderRadius: "8px", padding: "0.5rem", textAlign: "center" }}>
                        <div className="mono" style={{ color: "#c9a84c", fontSize: "18px", fontWeight: "600" }}>{m.val}</div>
                        <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <div style={{ borderTop: "1px solid #1a1a12", padding: "2rem 0", textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "#444", maxWidth: "600px", margin: "0 auto", lineHeight: "1.7" }}>{t.disclaimer}</p>
          <p className="mono" style={{ fontSize: "10px", color: "#333", marginTop: "1rem", letterSpacing: "0.1em" }}>{t.footer.text} · {new Date().getFullYear()}</p>
        </div>
      </main>
    </>
  );
}
