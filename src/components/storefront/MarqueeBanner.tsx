"use client";

export function MarqueeBanner({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  // Duplicate so the scroll loop is seamless
  const repeated = [...items, ...items];

  return (
    <div className="w-full bg-slate-900 overflow-hidden border-y border-slate-700 select-none">
      <div className="flex marquee-track whitespace-nowrap py-2">
        {repeated.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-6 text-xs sm:text-sm font-medium text-slate-200 shrink-0"
          >
            {text}
            <span className="text-slate-600" aria-hidden>|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
