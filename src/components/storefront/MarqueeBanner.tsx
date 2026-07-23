"use client";

const ADS = [
  "⚡ Free delivery on orders over KSh 3,000",
  "🏆 Official licensed jerseys — 100% authentic",
  "⚽ New Premier League 2025/26 kits just arrived",
  "🏉 Harambee Stars jersey — limited stock!",
  "🏀 NBA season collection now available",
  "🎽 Custom name & number printing in 24 hrs",
  "🏏 ICC World Cup cricket kits in store",
  "💳 Pay with M-Pesa, card, or cash on delivery",
  "🔥 Members get 10% off every order — sign up free",
];

export function MarqueeBanner() {
  // Duplicate the list so the loop is seamless
  const items = [...ADS, ...ADS];

  return (
    <div className="w-full bg-slate-900 overflow-hidden border-y border-slate-700 select-none">
      <div className="flex marquee-track whitespace-nowrap py-2">
        {items.map((ad, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-6 text-xs sm:text-sm font-medium text-slate-200 shrink-0"
          >
            {ad}
            <span className="text-slate-600" aria-hidden>|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
