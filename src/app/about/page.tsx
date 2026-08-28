import Link from "next/link";

const stats = [
  { value: "10K+", unit: "",     label: "Jerseys sold" },
  { value: "4",    unit: "",     label: "Sports covered" },
  { value: "1–2",  unit: " days", label: "Delivery time" },
];

const sports = [
  { emoji: "⚽", sport: "Football",    teams: "Harambee Stars · Premier League · Bundesliga · Serie A", href: "/products/football" },
  { emoji: "🏉", sport: "Rugby",       teams: "Kenya Simbas · Springboks · and more",                   href: "/products/rugby" },
  { emoji: "🏀", sport: "Basketball", teams: "NBA teams and international leagues",                      href: "/products/basketball" },
  { emoji: "🏎️", sport: "Formula One", teams: "All 10 F1 teams · current season kits",                  href: "/products/formula-one" },
];

const values = [
  {
    num: "01",
    label: "Authenticity",
    description: "Every jersey is officially licensed and sourced from authorized distributors. No counterfeits, no guesswork just the real thing.",
  },
  {
    num: "02",
    label: "Quality",
    description: "Strict quality checks mean every jersey is durable, comfortable, and built to outlast every match day wash after wash.",
  },
  {
    num: "03",
    label: "Customer First",
    description: "Fast shipping, easy returns, and a team that actually picks up. Your satisfaction is the only metric that matters.",
  },
];

const reasons = [
  { num: "01", title: "Verified Authenticity", detail: "All items are official and licensed" },
  { num: "02", title: "Fast Delivery",          detail: "1–2 days in Nairobi, express available" },
  { num: "03", title: "Competitive Pricing",    detail: "Best prices with regular promotions" },
  { num: "04", title: "Great Support",          detail: "Responsive team Mon–Sat 9AM–7PM" },
];

const services = [
  "Personalization & Customization",
  "Fast Delivery (1–2 days)",
  "Pickup Points Nationwide",
  "Size Guides & Fit Advice",
  "Customer Reviews & Ratings",
];

const TICKER = "FOOTBALL · RUGBY · BASKETBALL · FORMULA ONE · HARAMBEE STARS · KENYA SIMBAS · NAIROBI · OFFICIAL JERSEYS · ";

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .bc  { font-family:'Barlow Condensed',sans-serif; font-weight:900; text-transform:uppercase; line-height:0.92; }
        .dm  { font-family:'DM Sans',sans-serif; }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        .ticker-wrap  { overflow:hidden; }
        .ticker-track { animation:ticker 32s linear infinite; display:flex; width:max-content; will-change:transform; }
        .ticker-track:hover { animation-play-state:paused; }
        .sport-card .sport-emoji { transition:transform 0.3s ease, opacity 0.3s ease; }
        .sport-card:hover .sport-emoji { transform:scale(1.1) rotate(-5deg); opacity:0.35; }
      `}</style>

      <div className="dm min-h-screen">

        {/* ══════════ HERO ══════════ */}
        <section className="bg-slate-950">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 lg:pt-24 pb-14 lg:pb-20">
            <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-end">

              {/* Headline */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.38em] text-sky-400 mb-6">
                  Our story
                </p>
                <h1 className="bc text-[clamp(60px,9.5vw,124px)] text-white">
                  Built for<br />fans across<br />Africa.
                </h1>
              </div>

              {/* Mission + inline stats */}
              <div>
                <p className="text-slate-300 text-[15px] leading-relaxed mb-10">
                  Jersey Code was founded with a single mission to bring authentic, high-quality sports jerseys to passionate fans across Kenya and East Africa. Whether you&apos;re backing Harambee Stars or your favourite F1 team, we&apos;ve got the real thing.
                </p>
                <div className="grid grid-cols-3 divide-x divide-white/[0.08] pt-8 border-t border-white/[0.08]">
                  {stats.map((s) => (
                    <div key={s.label} className="pr-6 first:pl-0 pl-6">
                      <p className="bc text-5xl text-white leading-none whitespace-nowrap">
                        {s.value}
                        {s.unit && <span className="text-2xl text-white/50">{s.unit}</span>}
                      </p>
                      <p className="text-slate-500 text-xs mt-2 leading-snug">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling ticker */}
          <div className="ticker-wrap border-t border-white/[0.06] py-4">
            <div className="ticker-track">
              {[0, 1].map((i) => (
                <span key={i} className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.28em] text-slate-700 pr-0">
                  {TICKER}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ SPORTS WE COVER ══════════ */}
        <section className="bg-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500 mb-2">What we carry</p>
                <h2 className="bc text-[clamp(36px,5vw,64px)] text-slate-900">Sports<br />we cover.</h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs sm:text-right">
                From the terraces of Kasarani to your sofa every sport, every team, genuine jerseys.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {sports.map(({ emoji, sport, teams, href }) => (
                <Link key={sport} href={href}
                  className="sport-card group relative rounded-3xl border border-slate-100 bg-slate-50 p-8 hover:border-sky-200 hover:bg-sky-50/40 transition-all overflow-hidden">
                  <span className="sport-emoji absolute top-5 right-6 text-[64px] opacity-[0.15] select-none leading-none">
                    {emoji}
                  </span>
                  <p className="bc text-[clamp(28px,3vw,36px)] text-slate-900 mb-2">{sport}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{teams}</p>
                  <div className="flex items-center gap-1.5 mt-6 text-xs font-bold text-sky-500 group-hover:gap-2.5 transition-all">
                    <span>Browse jerseys</span>
                    <svg className="w-3 h-3 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ VALUES ══════════ */}
        <section className="bg-slate-950 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="mb-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-400 mb-2">What we stand for</p>
              <h2 className="bc text-[clamp(36px,5vw,64px)] text-white">Our values.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {values.map((v) => (
                <div key={v.num} className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8">
                  <p className="bc text-7xl text-white/[0.07] leading-none mb-5 select-none">{v.num}</p>
                  <h3 className="bc text-3xl text-white mb-3">{v.label}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ WHY US + SERVICES ══════════ */}
        <section className="bg-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">

              {/* Why us */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500 mb-2">Why Jersey Code</p>
                <h2 className="bc text-[clamp(36px,4vw,56px)] text-slate-900 mb-6">Why choose us?</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                  We&apos;ve been where you are — frustrated by fakes, let down by slow shipping, unsure about sizing. Jersey Code was built to fix all of that.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {reasons.map((r) => (
                    <div key={r.num} className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                      <p className="bc text-4xl text-slate-200 leading-none mb-3 select-none">{r.num}</p>
                      <p className="font-bold text-slate-900 text-sm">{r.title}</p>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{r.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500 mb-2">Beyond the jersey</p>
                <h2 className="bc text-[clamp(36px,4vw,56px)] text-slate-900 mb-6">What we offer.</h2>
                <ul className="space-y-0">
                  {services.map((s, i) => (
                    <li key={s} className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
                      <span className="bc text-xs text-slate-300 w-7 flex-none select-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-slate-700 font-medium text-[15px]">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════ CTA ══════════ */}
        <section className="bg-slate-950 py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600/[0.12] via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative">
            <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-400 mb-4">Ready to shop?</p>
                <h2 className="bc text-[clamp(52px,8vw,104px)] text-white">
                  Find your<br />jersey.
                </h2>
              </div>
              <div className="flex flex-row lg:flex-col gap-3">
                <Link href="/products/football"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 hover:bg-sky-400 hover:text-white transition-all whitespace-nowrap">
                  Shop Now →
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all whitespace-nowrap">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
