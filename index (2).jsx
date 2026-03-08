import React, { useState } from 'react'
import Head from 'next/head'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip,
} from 'recharts'

// ─── ALL DATA INLINE ────────────────────────────────────────────────────────

const translations = {
  en: {
    nav: { portfolio: "Portfolio", aiPicks: "AI Picks", supercomputing: "Supercomputing", criteria: "Criteria" },
    hero: {
      badge: "Powered by Ackman Principles",
      title: "Ackman Bot",
      subtitle: "Bill Ackman's Portfolio Intelligence",
      description: "AI-powered analysis of Bill Ackman's investment portfolio combined with cutting-edge opportunities in Artificial Intelligence and Supercomputing sectors.",
      cta: "Explore Portfolio", ctaSecondary: "View AI Picks",
    },
    portfolio: { title: "Current Portfolio", subtitle: "Bill Ackman's Pershing Square Holdings", allocation: "Portfolio Weight", performance: "YTD Return", marketCap: "Market Cap", sector: "Sector" },
    criteria: {
      title: "Ackman Investment Criteria",
      subtitle: "The principles guiding our AI and Supercomputing picks",
      items: [
        { title: "Strong Moat", desc: "Durable competitive advantages that protect long-term profitability." },
        { title: "Predictable Cash Flows", desc: "Consistent, high-quality earnings with minimal volatility." },
        { title: "Pricing Power", desc: "Ability to raise prices above inflation without losing customers." },
        { title: "High ROIC", desc: "Return on Invested Capital above 15% consistently." },
        { title: "Scalable Business", desc: "Low incremental capital requirements for growth." },
        { title: "Activist Potential", desc: "Undervalued assets where engagement can unlock shareholder value." },
      ],
    },
    aiPicks: { title: "AI Investment Picks", subtitle: "Ackman-criteria filtered AI opportunities", score: "Ackman Score", buy: "Strong Buy", hold: "Hold", watch: "Watchlist" },
    supercomputing: { title: "Supercomputing Picks", subtitle: "Next-gen compute infrastructure plays" },
    disclaimer: "This is not financial advice. For informational purposes only. Always consult a licensed financial advisor.",
    footer: { text: "Ackman Bot — Educational investment intelligence tool" },
  },
  he: {
    nav: { portfolio: "תיק השקעות", aiPicks: "בחירות AI", supercomputing: "סופר-מחשוב", criteria: "קריטריונים" },
    hero: {
      badge: "מונע על ידי עקרונות אקמן",
      title: "בוט אקמן",
      subtitle: "אינטליגנציית תיק ההשקעות של ביל אקמן",
      description: "ניתוח מבוסס AI של תיק ההשקעות של ביל אקמן, בשילוב הזדמנויות חדשניות בתחומי הבינה המלאכותית והסופר-מחשוב.",
      cta: "חקור את התיק", ctaSecondary: "ראה בחירות AI",
    },
    portfolio: { title: "התיק הנוכחי", subtitle: "אחזקות פרשינג סקוור של ביל אקמן", allocation: "משקל בתיק", performance: "תשואה מתחילת השנה", marketCap: "שווי שוק", sector: "מגזר" },
    criteria: {
      title: "קריטריוני ההשקעה של אקמן",
      subtitle: "העקרונות המנחים את בחירות ה-AI והסופר-מחשוב שלנו",
      items: [
        { title: "חפיר תחרותי חזק", desc: "יתרונות תחרותיים עמידים המגנים על רווחיות לטווח ארוך." },
        { title: "תזרים מזומנים צפוי", desc: "רווחים עקביים ואיכותיים עם תנודתיות מינימלית." },
        { title: "כוח תמחור", desc: "יכולת להעלות מחירים מעל האינפלציה מבלי לאבד לקוחות." },
        { title: "ROIC גבוה", desc: "תשואה על ההון המושקע מעל 15% ברציפות." },
        { title: "עסק ניתן להרחבה", desc: "דרישות הון תוספתיות נמוכות לצמיחה." },
        { title: "פוטנציאל אקטיביסטי", desc: "נכסים מוערכים בחסר שבהם מעורבות יכולה לפתוח ערך לבעלי מניות." },
      ],
    },
    aiPicks: { title: "בחירות השקעה ב-AI", subtitle: "הזדמנויות AI מסוננות לפי קריטריוני אקמן", score: "ציון אקמן", buy: "קנייה חזקה", hold: "החזקה", watch: "רשימת מעקב" },
    supercomputing: { title: "בחירות סופר-מחשוב", subtitle: "השקעות בתשתיות מחשוב הדור הבא" },
    disclaimer: "זו אינה ייעוץ פיננסי. למטרות מידע בלבד. תמיד התייעץ עם יועץ פיננסי מורשה.",
    footer: { text: "בוט אקמן — כלי אינטליגנציית השקעות חינוכי" },
  },
  fr: {
    nav: { portfolio: "Portefeuille", aiPicks: "Selections IA", supercomputing: "Supercalcul", criteria: "Criteres" },
    hero: {
      badge: "Base sur les principes d'Ackman",
      title: "Ackman Bot",
      subtitle: "Intelligence de Portefeuille de Bill Ackman",
      description: "Analyse alimentee par l'IA du portefeuille d'investissement de Bill Ackman, combinee aux opportunites de pointe dans l'IA et le supercalcul.",
      cta: "Explorer le Portefeuille", ctaSecondary: "Voir les Selections IA",
    },
    portfolio: { title: "Portefeuille Actuel", subtitle: "Participations Pershing Square de Bill Ackman", allocation: "Poids du Portefeuille", performance: "Rendement YTD", marketCap: "Capitalisation", sector: "Secteur" },
    criteria: {
      title: "Criteres d'Investissement d'Ackman",
      subtitle: "Les principes guidant nos selections IA et Supercalcul",
      items: [
        { title: "Fosse Competitif Fort", desc: "Avantages concurrentiels durables protegeant la rentabilite a long terme." },
        { title: "Flux de Tresorerie Previsibles", desc: "Benefices coherents et de haute qualite avec une volatilite minimale." },
        { title: "Pouvoir de Fixation des Prix", desc: "Capacite a augmenter les prix au-dessus de l'inflation sans perdre de clients." },
        { title: "ROIC Eleve", desc: "Rendement du capital investi superieur a 15% de maniere constante." },
        { title: "Entreprise Evolutive", desc: "Faibles besoins en capital supplementaire pour la croissance." },
        { title: "Potentiel Activiste", desc: "Actifs sous-evalues ou l'engagement peut debloquer de la valeur pour les actionnaires." },
      ],
    },
    aiPicks: { title: "Selections d'Investissement IA", subtitle: "Opportunites IA filtrees selon les criteres d'Ackman", score: "Score Ackman", buy: "Achat Fort", hold: "Conserver", watch: "Surveillance" },
    supercomputing: { title: "Selections Supercalcul", subtitle: "Investissements en infrastructure de calcul nouvelle generation" },
    disclaimer: "Ceci n'est pas un conseil financier. A titre informatif uniquement. Consultez toujours un conseiller financier agree.",
    footer: { text: "Ackman Bot — Outil d'intelligence d'investissement educatif" },
  },
}

const portfolioData = [
  { ticker: "HHH",   name: "Howard Hughes Holdings",      weight: 22.5, ytd: 18.3,  marketCap: "5.2B",  sector: "Real Estate" },
  { ticker: "BN",    name: "Brookfield Corporation",       weight: 18.2, ytd: 24.7,  marketCap: "82B",   sector: "Asset Management" },
  { ticker: "HLT",   name: "Hilton Worldwide",             weight: 14.8, ytd: 12.1,  marketCap: "54B",   sector: "Hospitality" },
  { ticker: "QSR",   name: "Restaurant Brands",            weight: 12.3, ytd: 8.4,   marketCap: "21B",   sector: "Consumer" },
  { ticker: "CP",    name: "Canadian Pacific Kansas City", weight: 11.7, ytd: 15.9,  marketCap: "87B",   sector: "Transportation" },
  { ticker: "GOOGL", name: "Alphabet Inc.",                weight: 10.5, ytd: 31.2,  marketCap: "2.1T",  sector: "Technology" },
  { ticker: "UDR",   name: "UDR Inc.",                     weight: 5.8,  ytd: -4.2,  marketCap: "12B",   sector: "Real Estate" },
  { ticker: "SFM",   name: "Sprouts Farmers Market",       weight: 4.2,  ytd: 22.8,  marketCap: "9B",    sector: "Consumer" },
]

const aiPicksData = [
  { ticker: "NVDA",  name: "NVIDIA Corporation",    score: 94, rating: "buy",  price: 875.5,  target: 1100, moat: 98, roic: 92, cashflow: 95, pricing: 96, rationale: "Dominant AI chip ecosystem with unmatched CUDA moat. Pricing power extraordinary. High ROIC from fabless model.", rationale_he: "מערכת שבבי AI דומיננטית עם חפיר CUDA ייחודי. כוח תמחור יוצא דופן. ROIC גבוה ממודל ללא מפעלים.", rationale_fr: "Ecosysteme de puces IA dominant avec un fosse CUDA inegale. Pouvoir de tarification extraordinaire." },
  { ticker: "MSFT",  name: "Microsoft Corporation", score: 91, rating: "buy",  price: 415.2,  target: 520,  moat: 97, roic: 89, cashflow: 94, pricing: 93, rationale: "Azure + OpenAI partnership creates unassailable position. Enterprise lock-in through Office 365. Predictable recurring revenues.", rationale_he: "שותפות Azure + OpenAI יוצרת עמדה בלתי ניתנת לתקיפה. כבילת ארגונים דרך מערכת Office 365.", rationale_fr: "Le partenariat Azure + OpenAI cree une position inattaquable. Verrouillage des entreprises via Office 365." },
  { ticker: "META",  name: "Meta Platforms",        score: 87, rating: "buy",  price: 512.3,  target: 650,  moat: 93, roic: 85, cashflow: 90, pricing: 88, rationale: "3.2B user network effect is Ackman-grade moat. AI-powered ad targeting driving ARPU expansion.", rationale_he: "אפקט הרשת של 3.2 מיליארד משתמשים הוא חפיר ברמת אקמן. טירגוט מודעות מבוסס AI מניע הרחבת ARPU.", rationale_fr: "L'effet reseau de 3,2 milliards d'utilisateurs est un fosse de niveau Ackman." },
  { ticker: "GOOGL", name: "Alphabet / Google",     score: 89, rating: "buy",  price: 178.4,  target: 230,  moat: 96, roic: 87, cashflow: 92, pricing: 85, rationale: "Search monopoly + Gemini AI + YouTube + GCP. Already in Ackman portfolio. DeepMind is a hidden gem.", rationale_he: "מונופול חיפוש + Gemini AI + YouTube + GCP. כבר בתיק של אקמן. DeepMind הוא אבן חן נסתרת.", rationale_fr: "Monopole de recherche + Gemini AI + YouTube + GCP. Deja dans le portefeuille d'Ackman." },
  { ticker: "ORCL",  name: "Oracle Corporation",   score: 82, rating: "hold", price: 127.8,  target: 155,  moat: 88, roic: 79, cashflow: 86, pricing: 87, rationale: "OCI cloud momentum accelerating. AI training cluster deals with xAI and Microsoft. Database lock-in is fortress-level.", rationale_he: "תנופת ענן OCI מתגברת. עסקות אשכול אימון AI עם xAI ו-Microsoft. נעילת מסד נתונים ברמת מבצר.", rationale_fr: "L'elan du cloud OCI s'accelere. Accords de clusters IA avec xAI et Microsoft." },
  { ticker: "AMZN",  name: "Amazon.com Inc.",       score: 85, rating: "buy",  price: 198.7,  target: 255,  moat: 94, roic: 82, cashflow: 88, pricing: 84, rationale: "AWS + Bedrock AI platform. Prime ecosystem moat. Logistics flywheel creates structural cost advantage.", rationale_he: "AWS + פלטפורמת Bedrock AI. חפיר מערכת Prime. גלגל הלוגיסטיקה יוצר יתרון עלות מבני.", rationale_fr: "AWS + plateforme Bedrock AI. Fosse de l'ecosysteme Prime." },
]

const supercomputingData = [
  { ticker: "SMCI", name: "Super Micro Computer",    score: 78, rating: "watch", price: 892.4, target: 1100, moat: 72, roic: 75, cashflow: 68, pricing: 74, rationale: "Dominant server rack supplier for AI data centers. Custom liquid cooling solutions. Governance concerns temper score.", rationale_he: "ספק מדפי שרתים דומיננטי למרכזי נתוני AI. פתרונות קירור נוזלי מותאמים.", rationale_fr: "Fournisseur dominant de racks de serveurs pour les centres de donnees IA." },
  { ticker: "CDNS", name: "Cadence Design Systems", score: 86, rating: "buy",   price: 278.5, target: 360,  moat: 91, roic: 83, cashflow: 87, pricing: 89, rationale: "EDA software monopoly. Every chip must be designed with their tools. AI chip design complexity is a massive tailwind.", rationale_he: "מונופול תוכנת EDA. כל שבב חייב להיות מתוכנן עם הכלים שלהם. מורכבות עיצוב שבבי AI היא רוח גב עצומה.", rationale_fr: "Monopole logiciel EDA. Chaque puce doit etre concue avec leurs outils." },
  { ticker: "ANET", name: "Arista Networks",        score: 88, rating: "buy",   price: 318.9, target: 420,  moat: 87, roic: 85, cashflow: 89, pricing: 88, rationale: "AI data center networking backbone. 400G/800G Ethernet displacing InfiniBand. Cloud titan customers locked in.", rationale_he: "עמוד השדרה של רשת מרכז נתוני AI. אתרנט 400G/800G מחליף InfiniBand.", rationale_fr: "Epine dorsale de reseau des centres de donnees IA." },
  { ticker: "VRT",  name: "Vertiv Holdings",        score: 84, rating: "buy",   price: 98.2,  target: 130,  moat: 80, roic: 78, cashflow: 82, pricing: 83, rationale: "Critical power and thermal management for AI data centers. Massive infrastructure capex cycle benefits.", rationale_he: "ניהול חשמל וחום קריטי למרכזי נתוני AI. מחזור השקעות הון תשתית עצום מועיל.", rationale_fr: "Gestion critique de l'alimentation et de la chaleur pour les centres de donnees IA." },
  { ticker: "CEG",  name: "Constellation Energy",   score: 81, rating: "buy",   price: 248.6, target: 320,  moat: 85, roic: 76, cashflow: 83, pricing: 82, rationale: "Nuclear power for AI data centers. Microsoft deal signals structural demand. Carbon-free baseload is rare and valuable.", rationale_he: "אנרגיה גרעינית למרכזי נתוני AI. עסקת Microsoft מאותתת על ביקוש מבני.", rationale_fr: "Energie nucleaire pour les centres de donnees IA. Le deal Microsoft signale une demande structurelle." },
]

// ─── COLORS ──────────────────────────────────────────────────────────────────
const COLORS = ['#c9a84c','#e8c97a','#a07832','#f0d898','#7a5c20','#d4b060','#b08040','#e0c070']

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const color = score >= 90 ? '#00ff88' : score >= 82 ? '#c9a84c' : '#6b9fff'
  const r = 30
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#1a1a1a" strokeWidth="6" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={dash + ' ' + circ} strokeLinecap="round" transform="rotate(-90 40 40)" />
      <text x="40" y="45" textAnchor="middle" fill={color} fontSize="14" fontWeight="bold">{score}</text>
    </svg>
  )
}

function RatingBadge({ rating, t }) {
  const map = {
    buy:   { bg: '#003322', color: '#00ff88', border: '#00ff88', label: t.aiPicks.buy },
    hold:  { bg: '#1a1500', color: '#c9a84c', border: '#c9a84c', label: t.aiPicks.hold },
    watch: { bg: '#001a33', color: '#6b9fff', border: '#6b9fff', label: t.aiPicks.watch },
  }
  const s = map[rating] || map.hold
  return (
    <span style={{ background: s.bg, color: s.color, border: '1px solid ' + s.border, padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {s.label}
    </span>
  )
}

function StockCard({ s, selected, onClick, lang, t }) {
  const rationale = lang === 'he' ? s.rationale_he : lang === 'fr' ? s.rationale_fr : s.rationale
  const upside = ((s.target / s.price - 1) * 100).toFixed(1)
  return (
    <div onClick={onClick} style={{ background: '#111108', border: '1px solid ' + (selected ? '#c9a84c' : '#2a2510'), borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: selected ? '0 0 30px rgba(201,168,76,0.15)' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ScoreRing score={s.score} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'monospace', color: '#c9a84c', fontWeight: '700', fontSize: '16px' }}>{s.ticker}</span>
            <span style={{ color: '#888', fontSize: '13px' }}>{s.name}</span>
            <RatingBadge rating={s.rating} t={t} />
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Price <span style={{ fontFamily: 'monospace', color: '#e8dcc8' }}>${s.price}</span></span>
            <span style={{ fontSize: '12px', color: '#888' }}>Target <span style={{ fontFamily: 'monospace', color: '#00cc66' }}>${s.target}</span></span>
            <span style={{ fontSize: '12px', color: '#888' }}>Upside <span style={{ fontFamily: 'monospace', color: '#00cc66' }}>+{upside}%</span></span>
          </div>
        </div>
      </div>
      <p style={{ marginTop: '0.75rem', fontSize: '12px', color: '#888', lineHeight: '1.6' }}>{rationale}</p>
    </div>
  )
}

function RadarPanel({ stock, t }) {
  const data = [
    { subject: 'Moat', value: stock.moat },
    { subject: 'ROIC', value: stock.roic },
    { subject: 'Cash Flow', value: stock.cashflow },
    { subject: 'Pricing', value: stock.pricing },
  ]
  return (
    <div style={{ background: '#111108', border: '1px solid #c9a84c', borderRadius: '12px', padding: '1.5rem', position: 'sticky', top: '80px' }}>
      <h3 style={{ fontFamily: 'Georgia,serif', color: '#c9a84c', marginBottom: '0.25rem', fontSize: '1.3rem' }}>{stock.ticker} Analysis</h3>
      <p style={{ fontSize: '12px', color: '#888', marginBottom: '1rem' }}>{t.aiPicks.score}: <strong style={{ color: '#c9a84c' }}>{stock.score}/100</strong></p>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data}>
          <PolarGrid stroke="#2a2510" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 11 }} />
          <Radar dataKey="value" stroke="#c9a84c" fill="#c9a84c" fillOpacity={0.15} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        {[['Moat', stock.moat], ['ROIC', stock.roic], ['Cash Flow', stock.cashflow], ['Pricing', stock.pricing]].map(([label, val]) => (
          <div key={label} style={{ flex: 1, background: '#0a0a08', borderRadius: '8px', padding: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', color: '#c9a84c', fontSize: '18px', fontWeight: '700' }}>{val}</div>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  const [lang, setLang] = useState('en')
  const [section, setSection] = useState('portfolio')
  const [selected, setSelected] = useState(null)

  const t = translations[lang]
  const isRTL = lang === 'he'
  const allStocks = [...aiPicksData, ...supercomputingData]
  const selectedStock = selected ? allStocks.find((s) => s.ticker === selected) : null
  const pieData = portfolioData.map((s) => ({ name: s.ticker, value: s.weight }))
  const navLinks = [
    { id: 'portfolio', label: t.nav.portfolio },
    { id: 'criteria',  label: t.nav.criteria },
    { id: 'ai',        label: t.nav.aiPicks },
    { id: 'supercomputing', label: t.nav.supercomputing },
  ]

  return (
    <>
      <Head>
        <title>Ackman Bot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Libre+Baskerville:wght@400;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#0a0a08;color:#e8dcc8;font-family:'Libre Baskerville',serif;min-height:100vh;overflow-x:hidden}
        .serif{font-family:'DM Serif Display',serif}
        .mono{font-family:'JetBrains Mono',monospace}
        .tape{background:#111108;border-bottom:1px solid #2a2510;overflow:hidden;white-space:nowrap;padding:6px 0}
        .tape-inner{display:inline-block;animation:scroll 50s linear infinite;font-family:'JetBrains Mono',monospace;font-size:11px;color:#c9a84c}
        @keyframes scroll{from{transform:translateX(100vw)}to{transform:translateX(-100%)}}
        .nav{background:rgba(10,10,8,0.97);border-bottom:1px solid #2a2510;position:sticky;top:0;z-index:100}
        .nav-inner{max-width:1200px;margin:0 auto;padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between;height:60px}
        .nb{background:transparent;border:none;color:#888;cursor:pointer;font-family:'Libre Baskerville',serif;font-size:13px;padding:8px 14px;transition:color 0.2s}
        .nb.active{color:#c9a84c} .nb:hover{color:#e8dcc8}
        .lb{background:transparent;border:1px solid #2a2510;color:#888;padding:4px 12px;border-radius:20px;cursor:pointer;font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:0.1em;transition:all 0.2s}
        .lb.active{background:#c9a84c;border-color:#c9a84c;color:#0a0a08;font-weight:700}
        .wrap{max-width:1200px;margin:0 auto;padding:0 1.5rem}
        .div{height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:3rem 0}
        .cta{background:linear-gradient(135deg,#c9a84c,#a07832);color:#0a0a08;border:none;padding:14px 32px;border-radius:6px;font-family:'DM Serif Display',serif;font-size:16px;cursor:pointer;transition:all 0.3s}
        .cta:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(201,168,76,0.3)}
        .cta2{background:transparent;color:#c9a84c;border:1px solid #c9a84c;padding:13px 32px;border-radius:6px;font-family:'DM Serif Display',serif;font-size:16px;cursor:pointer;transition:all 0.3s}
        .cta2:hover{background:rgba(201,168,76,0.1)}
        table{border-collapse:collapse;width:100%}
        th{text-align:left;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.15em;color:#666;text-transform:uppercase;padding:12px 16px;border-bottom:1px solid #1a1a12}
        td{padding:14px 16px;border-bottom:1px solid #111108;font-size:13px}
        tr:hover td{background:rgba(201,168,76,0.03)}
        .bar-bg{background:#1a1a12;border-radius:4px;height:6px;overflow:hidden}
        .bar-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#7a5c20,#c9a84c)}
        .cc{background:#111108;border:1px solid #2a2510;border-radius:12px;padding:1.5rem;position:relative;overflow:hidden}
        .cc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent)}
        @media(max-width:768px){.hm{display:none!important}}
      `}</style>

      {/* Ticker */}
      <div className="tape">
        <div className="tape-inner">
          {[...portfolioData, ...aiPicksData, ...supercomputingData].map((s) => (
            <span key={s.ticker} style={{ marginRight: '3rem' }}>
              <span style={{ opacity: 0.5 }}>{s.ticker}</span>{' '}
              <span>${s.price || '-'}</span>{' '}
              {s.ytd != null && <span style={{ color: s.ytd >= 0 ? '#00cc66' : '#ff4455' }}>{s.ytd >= 0 ? '+' : ''}{s.ytd}%</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '18px', color: '#c9a84c' }}>◆</span>
            <span className="serif" style={{ fontSize: '18px', color: '#c9a84c' }}>Ackman Bot</span>
          </div>
          <div className="hm" style={{ display: 'flex' }}>
            {navLinks.map((l) => (
              <button key={l.id} className={'nb' + (section === l.id ? ' active' : '')} onClick={() => { setSection(l.id); setSelected(null) }}>{l.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['en', 'he', 'fr'].map((l) => (
              <button key={l} className={'lb' + (lang === l ? ' active' : '')} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </nav>

      <main className="wrap" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* Hero */}
        <section style={{ padding: '6rem 0 4rem', textAlign: 'center', background: 'radial-gradient(ellipse 800px 400px at 60% 0%, rgba(201,168,76,0.07) 0%, transparent 60%)' }}>
          <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.1)', border: '1px solid #c9a84c', borderRadius: '20px', padding: '4px 16px', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#c9a84c', letterSpacing: '0.15em' }}>{t.hero.badge}</span>
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(3rem,8vw,6rem)', color: '#e8dcc8', lineHeight: '1', marginBottom: '0.5rem' }}>{t.hero.title}</h1>
          <p style={{ color: '#c9a84c', fontStyle: 'italic', fontSize: 'clamp(1rem,2vw,1.3rem)', marginBottom: '1.5rem' }}>{t.hero.subtitle}</p>
          <p style={{ color: '#888', maxWidth: '640px', margin: '0 auto 2.5rem', lineHeight: '1.8', fontSize: '15px' }}>{t.hero.description}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="cta" onClick={() => setSection('portfolio')}>{t.hero.cta}</button>
            <button className="cta2" onClick={() => setSection('ai')}>{t.hero.ctaSecondary}</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap' }}>
            {[['AUM', '$18B+'], ['Holdings', '8 Core'], ['Ackman Score', '94 max']].map(([label, val]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div className="serif" style={{ fontSize: '2.5rem', color: '#c9a84c' }}>{val}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="div" />

        {/* PORTFOLIO */}
        {section === 'portfolio' && (
          <section style={{ paddingBottom: '4rem' }}>
            <h2 className="serif" style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '0.5rem' }}>{t.portfolio.title}</h2>
            <p style={{ color: '#888', marginBottom: '2rem' }}>{t.portfolio.subtitle}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ background: '#111108', border: '1px solid #2a2510', borderRadius: '12px', overflow: 'hidden', gridColumn: '1 / -1' }}>
                <table>
                  <thead><tr>
                    <th>Ticker</th><th>Company</th><th>{t.portfolio.allocation}</th>
                    <th className="hm">{t.portfolio.performance}</th>
                    <th className="hm">{t.portfolio.marketCap}</th>
                    <th className="hm">{t.portfolio.sector}</th>
                  </tr></thead>
                  <tbody>
                    {portfolioData.map((s) => (
                      <tr key={s.ticker}>
                        <td><span style={{ fontFamily: 'monospace', color: '#c9a84c', fontWeight: '700' }}>{s.ticker}</span></td>
                        <td>{s.name}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="bar-bg" style={{ width: '80px' }}><div className="bar-fill" style={{ width: ((s.weight / 25) * 100) + '%' }} /></div>
                            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{s.weight}%</span>
                          </div>
                        </td>
                        <td className="hm"><span style={{ fontFamily: 'monospace', color: s.ytd >= 0 ? '#00cc66' : '#ff4455' }}>{s.ytd >= 0 ? '+' : ''}{s.ytd}%</span></td>
                        <td className="hm"><span style={{ fontFamily: 'monospace' }}>${s.marketCap}</span></td>
                        <td className="hm"><span style={{ background: '#1a1a12', border: '1px solid #2a2510', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', color: '#888' }}>{s.sector}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ background: '#111108', border: '1px solid #2a2510', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 className="serif" style={{ color: '#c9a84c', marginBottom: '1rem' }}>Allocation</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} strokeWidth={2} stroke="#0a0a08">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111108', border: '1px solid #2a2510', borderRadius: '8px', color: '#e8dcc8', fontFamily: 'monospace' }} formatter={(v) => [v + '%', 'Weight']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#111108', border: '1px solid #2a2510', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 className="serif" style={{ color: '#c9a84c', marginBottom: '1rem' }}>Legend</h3>
                {portfolioData.map((s, i) => (
                  <div key={s.ticker} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#c9a84c', width: '48px' }}>{s.ticker}</span>
                    <span style={{ fontSize: '12px', color: '#888', flex: 1 }}>{s.name}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{s.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CRITERIA */}
        {section === 'criteria' && (
          <section style={{ paddingBottom: '4rem' }}>
            <h2 className="serif" style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '0.5rem' }}>{t.criteria.title}</h2>
            <p style={{ color: '#888', marginBottom: '2rem' }}>{t.criteria.subtitle}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
              {t.criteria.items.map((item, i) => (
                <div key={i} className="cc">
                  <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#c9a84c', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>0{i + 1}</div>
                  <h3 className="serif" style={{ fontSize: '1.3rem', color: '#e8dcc8', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.7' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="div" />
            <div style={{ background: '#111108', border: '1px solid #2a2510', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
              <p className="serif" style={{ fontSize: '1.4rem', color: '#c9a84c', fontStyle: 'italic', lineHeight: '1.7' }}>
                &ldquo;We want simple, predictable, free-cash-flow-generative businesses with dominant market positions, high barriers to entry, and limited exposure to extrinsic risks.&rdquo;
              </p>
              <p style={{ fontFamily: 'monospace', marginTop: '1rem', fontSize: '11px', color: '#666', letterSpacing: '0.1em' }}>— BILL ACKMAN, PERSHING SQUARE CAPITAL MANAGEMENT</p>
            </div>
          </section>
        )}

        {/* AI PICKS */}
        {section === 'ai' && (
          <section style={{ paddingBottom: '4rem' }}>
            <h2 className="serif" style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '0.5rem' }}>{t.aiPicks.title}</h2>
            <p style={{ color: '#888', marginBottom: '2rem' }}>{t.aiPicks.subtitle}</p>
            <div style={{ display: 'grid', gridTemplateColumns: selectedStock ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {aiPicksData.map((s) => (
                  <StockCard key={s.ticker} s={s} selected={selected === s.ticker} onClick={() => setSelected(selected === s.ticker ? null : s.ticker)} lang={lang} t={t} />
                ))}
              </div>
              {selectedStock && <RadarPanel stock={selectedStock} t={t} />}
            </div>
          </section>
        )}

        {/* SUPERCOMPUTING */}
        {section === 'supercomputing' && (
          <section style={{ paddingBottom: '4rem' }}>
            <h2 className="serif" style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '0.5rem' }}>{t.supercomputing.title}</h2>
            <p style={{ color: '#888', marginBottom: '2rem' }}>{t.supercomputing.subtitle}</p>
            <div style={{ display: 'grid', gridTemplateColumns: selectedStock ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {supercomputingData.map((s) => (
                  <StockCard key={s.ticker} s={s} selected={selected === s.ticker} onClick={() => setSelected(selected === s.ticker ? null : s.ticker)} lang={lang} t={t} />
                ))}
              </div>
              {selectedStock && <RadarPanel stock={selectedStock} t={t} />}
            </div>
          </section>
        )}

        {/* Footer */}
        <div style={{ borderTop: '1px solid #1a1a12', padding: '2rem 0', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#444', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>{t.disclaimer}</p>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#333', marginTop: '1rem', letterSpacing: '0.1em' }}>{t.footer.text} · {new Date().getFullYear()}</p>
        </div>
      </main>
    </>
  )
}
