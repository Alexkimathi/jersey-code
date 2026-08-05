import Link from "next/link";

const values = [
  {
    label: "Authenticity",
    description:
      "Every jersey is officially licensed and sourced from authorized distributors to guarantee genuine products.",
    accent: "bg-sky-500",
  },
  {
    label: "Quality",
    description:
      "Strict quality standards mean every jersey is durable, comfortable, and built to last through every match day.",
    accent: "bg-slate-900",
  },
  {
    label: "Customer First",
    description:
      "Fast shipping, easy returns, and a support team that actually picks up. Your satisfaction drives everything.",
    accent: "bg-sky-400",
  },
];

const stats = [
  { value: "10,000+", label: "Jerseys sold" },
  { value: "4", label: "Sports covered" },
  { value: "1–3 days", label: "Delivery time" },
];

const products = [
  { emoji: "⚽", sport: "Football", detail: "Harambee Stars, Premier League, Bundesliga, Serie A" },
  { emoji: "🏉", sport: "Rugby", detail: "Kenya Simbas, Springboks, and more" },
  { emoji: "🏀", sport: "Basketball", detail: "NBA teams and international leagues" },
  { emoji: "🏏", sport: "Cricket", detail: "International cricket teams" },
];

const services = [
  "Personalization & Customization",
  "Fast Delivery (1–3 days)",
  "Pickup Points Nationwide",
  "Size Guides & Fit Advice",
  "Customer Reviews & Ratings",
];

const reasons = [
  { icon: "🎯", title: "Verified Authenticity", detail: "All items are official and licensed" },
  { icon: "⚡", title: "Fast Delivery", detail: "1–3 days in Nairobi, express available" },
  { icon: "💰", title: "Competitive Pricing", detail: "Best prices with regular promotions" },
  { icon: "🤝", title: "Great Support", detail: "Responsive customer service team" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-transparent to-transparent pointer-events-none rounded-3xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-4">Our story</p>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Built for fans<br />across Africa.
            </h1>
            <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
              Jersey Code was founded with a simple mission — to bring authentic, high-quality sports jerseys to passionate fans across Kenya and East Africa. Whether you&apos;re supporting Harambee Stars, Man United, the Kenya Simbas, or your favourite NBA team, we have the jersey for you.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            {stats.map((s) => (
              <div key={s.label} className="py-8 px-6 text-center">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Values */}
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-2">What we stand for</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">Our values</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {values.map((v) => (
              <div key={v.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className={`h-1.5 w-full ${v.accent}`} />
                <div className="p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-2">{v.label}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What we offer */}
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-2">What we carry</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">Products & services</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">Products</h3>
              <ul className="space-y-4">
                {products.map((p) => (
                  <li key={p.sport} className="flex items-start gap-3">
                    <span className="text-xl leading-none mt-0.5">{p.emoji}</span>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{p.sport}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{p.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">Services</h3>
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-sky-50 flex items-center justify-center flex-none">
                      <svg className="w-3 h-3 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Why us */}
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-2">Why Jersey Code</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">Why choose us?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((r) => (
              <div key={r.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-start gap-4">
                <span className="text-2xl leading-none">{r.icon}</span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{r.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-slate-950 px-10 py-12 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-3">Get in touch</p>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Have questions?</h2>
            <p className="text-slate-400 text-sm mb-7 max-w-sm">
              Our support team is available Mon–Sat 9AM–7PM EAT.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg hover:scale-105 hover:shadow-xl transition-all"
              >
                Contact us
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center rounded-full border border-slate-700 px-6 py-3 text-sm font-bold text-white hover:border-slate-500 hover:bg-white/5 transition-all"
              >
                Read FAQ
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
