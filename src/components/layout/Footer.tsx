import Link from "next/link";

const sports = ["Football", "Rugby", "Basketball", "Cricket"];

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Jersey Code</h3>
            <p className="text-sm text-slate-400 leading-6">
              Official-quality jerseys backed by fast delivery, secure checkout, and local support.
            </p>
            <a
              href="https://maps.app.goo.gl/i8RcoaucfxFfboaK9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
            >
              <svg className="w-4 h-4 mt-0.5 flex-none text-slate-500 group-hover:text-sky-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>New Generation Exhibition<br />Tom Mboya St, Nairobi</span>
            </a>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 mb-4">
              Shop by Sport
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              {sports.map((sport) => (
                <li key={sport}>
                  <Link
                    href={`/products/${sport.toLowerCase()}`}
                    className="transition hover:text-white"
                  >
                    {sport}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <Link href="/about" className="transition hover:text-white">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">Contact</Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link href="/shipping" className="transition hover:text-white">Shipping</Link>
              </li>
              <li>
                <Link href="/returns" className="transition hover:text-white">Returns</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 mb-4">
              Stay in the Game
            </h4>
            <p className="text-sm text-slate-300 mb-4">
              Get drops, exclusive offers, and restock alerts delivered to your inbox.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-full border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                type="button"
                className="whitespace-nowrap rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Jersey Code. Built for fans and teams across Africa.
        </div>
      </div>
    </footer>
  );
}
