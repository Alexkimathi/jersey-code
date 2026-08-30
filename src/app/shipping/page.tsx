import Link from "next/link";

const options = [
  {
    label: "Standard Delivery",
    color: "border-sky-500",
    badge: "bg-sky-50 text-sky-700",
    rows: [
      { area: "Nairobi", time: "Same day", cost: "KSh 100 – 150" },
      { area: "Other areas", time: "1–2 business days", cost: "KSh 100 – 300" },
    ],
    note: "Free delivery on orders above KSh 10,000",
    noteColor: "text-green-600",
  },
  {
    label: "Express Delivery",
    color: "border-amber-500",
    badge: "bg-amber-50 text-amber-700",
    rows: [
      { area: "Nairobi only", time: "Same day", cost: "KSh 250 – 800" },
    ],
    note: "Order early in the day to guarantee same-day dispatch",
    noteColor: "text-amber-600",
  },
  {
    label: "Store Pickup",
    color: "border-slate-400",
    badge: "bg-slate-50 text-slate-700",
    rows: [
      { area: "Nairobi CBD", time: "Ready same day", cost: "Free" },
    ],
    note: "Tom Mboya St, next to Platinum Plaza, 1st floor shop C13",
    noteColor: "text-slate-500",
  },
];

const steps = [
  { n: "1", title: "Order Confirmed", detail: "You receive confirmation with your order number" },
  { n: "2", title: "Processing",      detail: "Our team prepares your order for dispatch" },
  { n: "3", title: "Ready",           detail: "Order packed and ready to ship" },
  { n: "4", title: "Out for Delivery", detail: "Your package is on the way" },
  { n: "5", title: "Delivered",       detail: "Order received — enjoy your jersey!" },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-4">Shipping & Delivery</p>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Fast delivery,<br />your way.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl">
            Same-day delivery in Nairobi, 1–2 day delivery everywhere else, or pick up from our CBD store — free on orders above KSh 10,000.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">

        {/* Delivery options */}
        <div className="grid sm:grid-cols-3 gap-5">
          {options.map((opt) => (
            <div key={opt.label} className={`bg-white rounded-2xl border-l-4 ${opt.color} border border-slate-100 shadow-sm overflow-hidden`}>
              <div className="p-6">
                <span className={`inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 ${opt.badge}`}>
                  {opt.label}
                </span>
                <table className="w-full text-sm mb-4">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider">
                      <th className="text-left pb-2 font-semibold">Area</th>
                      <th className="text-left pb-2 font-semibold">Time</th>
                      <th className="text-right pb-2 font-semibold">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {opt.rows.map((r) => (
                      <tr key={r.area}>
                        <td className="py-2 font-medium text-slate-800">{r.area}</td>
                        <td className="py-2 text-slate-500">{r.time}</td>
                        <td className="py-2 text-right font-semibold text-slate-900">{r.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className={`text-xs leading-relaxed ${opt.noteColor}`}>{opt.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Free delivery callout */}
        <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-5 flex items-start gap-4">
          <span className="text-2xl leading-none mt-0.5">🎉</span>
          <div>
            <p className="font-bold text-green-800 text-sm">Free delivery on orders above KSh 10,000</p>
            <p className="text-green-700 text-sm mt-1">
              Standard delivery across Nairobi and other areas is on us for qualifying orders. No code needed — applied automatically at checkout.
            </p>
          </div>
        </div>

        {/* Pickup info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Store Pickup — Nairobi CBD Only</h2>
          <p className="text-sm text-slate-500 mb-4">Pick up your order for free directly from our store. No delivery wait, no delivery fee.</p>
          <div className="flex items-start gap-3 text-sm text-slate-700">
            <svg className="w-4 h-4 mt-0.5 flex-none text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <div>
              <p className="font-semibold text-slate-800">Tom Mboya St, next to Platinum Plaza</p>
              <p className="text-slate-500">1st floor, shop C13 · Mon–Sat 9AM–7PM</p>
            </div>
          </div>
          <a href="https://maps.app.goo.gl/i8RcoaucfxFfboaK9" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors">
            Open in Google Maps →
          </a>
        </div>

        {/* How tracking works */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">How order tracking works</h2>
          <ol className="space-y-4">
            {steps.map((s) => (
              <li key={s.n} className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center flex-none mt-0.5">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{s.title}</p>
                  <p className="text-slate-500 text-sm">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-slate-400 text-sm mt-6">
            Track your order anytime on our{" "}
            <Link href="/orders" className="text-sky-600 hover:underline font-medium">Order Tracking page</Link>.
          </p>
        </div>

      </div>
    </div>
  );
}
