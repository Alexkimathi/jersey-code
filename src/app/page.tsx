export const dynamic = "force-dynamic";

import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Product, Banner, ProductVariant } from "@/lib/supabase/types";
import { BannerCarousel } from "@/components/storefront/BannerCarousel";
import { MarqueeBanner } from "@/components/storefront/MarqueeBanner";
import { HomeSectionTabs } from "@/components/storefront/HomeSectionTabs";
function footballFirst(products: Product[]): Product[] {
  const rank = (p: Product) =>
    (p.sub_category?.startsWith("epl")) ? 0 :
    (p.sub_category?.startsWith("world")) ? 1 :
    p.sport === "football" ? 2 : 3;
  return [...products].sort((a, b) => rank(a) - rank(b));
}

const navCategories = [
  { name: "Featured", slug: "featured", emoji: "⭐" },
  { name: "EPL", slug: "epl", emoji: "⚽" },
  { name: "Others", slug: "others", emoji: "🌍" },
  { name: "Rugby", slug: "rugby", emoji: "🏉" },
  { name: "Formula One", slug: "formula-one", emoji: "🏎️" },
  { name: "Accessories", slug: "accessories", emoji: "🛍️" },
];

// ── data fetchers ──────────────────────────────────────────────

async function getBanners(): Promise<Banner[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data || [];
}

async function getVariants(): Promise<ProductVariant[]> {
  const supabase = createServerClient();
  const { data } = await supabase.from("product_variants").select("*");
  return (data as ProductVariant[]) || [];
}

async function getNewestProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_hidden", false)
    .not("image_url", "is", null)
    .neq("sport", "accessories")
    .order("created_at", { ascending: false });
  return data || [];
}

async function getBestSellers(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_hidden", false)
    .not("image_url", "is", null)
    .neq("sport", "accessories")
    .order("created_at", { ascending: false });
  return data || [];
}

async function getAllFootballProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("sport", "football")
    .eq("is_hidden", false)
    .or("image_url.not.is.null,is_clearance.eq.true")
    .order("created_at", { ascending: false });
  return data || [];
}

async function getProductsBySport(sport: string): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("sport", sport)
    .eq("is_hidden", false)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(12);
  return data || [];
}

async function getF1Hoodies(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("sport", "formula_one")
    .eq("is_hidden", false)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false });
  const all = (data ?? []) as Product[];
  return all.filter(p => p.sub_category === "hoodie_polo" || p.name.toLowerCase().includes("hoodie"));
}


// ── page ───────────────────────────────────────────────────────

export default async function HomePage() {
  const [
    banners,
    variants,
    newestProducts,
    bestSellers,
    allFootball,
    rugbyProducts,
    f1Products,
    f1Hoodies,
    accessoriesAll,
  ] = await Promise.all([
    getBanners(),
    getVariants(),
    getNewestProducts(),
    getBestSellers(),
    getAllFootballProducts(),
    getProductsBySport("rugby"),
    getProductsBySport("formula_one"),
    getF1Hoodies(),
    getProductsBySport("accessories"),
  ]);

  // EPL tabs — routed by sub_category
  const eplLeague    = allFootball.filter(p => p.sub_category === "epl_club" && !p.is_clearance);
  const eplClearance = allFootball.filter(p => p.sub_category?.startsWith("epl_") && p.is_clearance);
  const nationalAll  = allFootball.filter(p => p.sub_category === "national");

  // World Football tabs
  const clubLeague     = allFootball.filter(p => p.sub_category === "world_club");
  const clubKids       = allFootball.filter(p => p.sub_category === "world_kids");
  const clubVintage    = allFootball.filter(p => p.sub_category === "world_vintage");
  const clubSpecial    = allFootball.filter(p => p.sub_category === "world_special");
  const clubTracksuits = allFootball.filter(p => p.sub_category === "world_tracksuit");

  // Accessories — sub_category takes priority, team field as legacy fallback
  const balls = accessoriesAll.filter(p => p.sub_category === "Balls" || (!p.sub_category && p.team === "Balls"));
  const flags = accessoriesAll.filter(p => p.sub_category === "Flags" || (!p.sub_category && p.team === "Flags"));
  const socks = accessoriesAll.filter(p => p.sub_category === "Socks" || (!p.sub_category && p.team === "Socks"));

  return (
    <div className="min-h-screen bg-slate-50">
      {banners.length > 0 && <BannerCarousel banners={banners} />}
      <MarqueeBanner />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-12">

        {/* Category chips */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-12 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 no-scrollbar">
          {navCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="flex-none inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </Link>
          ))}
        </div>

        {/* ── Featured ── */}
        <section className="mb-14">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Hand-picked</p>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Featured</h2>
            </div>
            <Link href="/products/featured" className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
              View all →
            </Link>
          </div>
          <HomeSectionTabs
            tabs={[
              { label: "New Arrival", products: footballFirst(newestProducts).slice(0, 12) },
              { label: "Best Seller", products: footballFirst(bestSellers).slice(0, 12) },
            ]}
            defaultTab="New Arrival"
            variants={variants}
          />
        </section>

        {/* ── League / team rows ── */}
        <section className="space-y-14">

          {/* EPL */}
          {(eplLeague.length > 0 || eplClearance.length > 0) && (
            <div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Football · England</p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Premier League</h2>
                </div>
                <Link href="/products/epl" className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                  View all →
                </Link>
              </div>
              <HomeSectionTabs
                tabs={[
                  { label: "Club Jerseys",   products: eplLeague },
                  { label: "Clearance Sale", products: eplClearance },
                ]}
                defaultTab="Club Jerseys"
                variants={variants}
              />
            </div>
          )}

          {/* Others */}
          {(clubLeague.length > 0 || nationalAll.length > 0 || clubKids.length > 0 || clubVintage.length > 0 || clubSpecial.length > 0 || clubTracksuits.length > 0) && (
            <div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Football · World</p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">World Football</h2>
                </div>
                <Link href="/products/others" className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                  View all →
                </Link>
              </div>
              <HomeSectionTabs
                tabs={[
                  { label: "Club Jerseys",            products: clubLeague },
                  { label: "National Teams Jerseys",  products: nationalAll },
                  { label: "Kids Jerseys",            products: clubKids },
                  { label: "Retro Jerseys",           products: clubVintage },
                  { label: "Special Edition Jerseys", products: clubSpecial },
                  { label: "Tracksuits",              products: clubTracksuits },
                ]}
                defaultTab="Club Jerseys"
                variants={variants}
              />
            </div>
          )}

          {/* Rugby */}
          {rugbyProducts.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Rugby</p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Rugby</h2>
                </div>
                <Link href="/products/rugby" className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                  View all →
                </Link>
              </div>
              <HomeSectionTabs
                tabs={[
                  { label: "Jerseys", products: rugbyProducts },
                ]}
                defaultTab="Jerseys"
                variants={variants}
              />
            </div>
          )}

          {/* Formula One */}
          {f1Products.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Motorsport</p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Formula One</h2>
                </div>
                <Link href="/products/formula-one" className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                  View all →
                </Link>
              </div>
              <HomeSectionTabs
                tabs={[
                  { label: "Jerseys", products: f1Products.filter(p => p.sub_category !== "hoodie_polo" && !p.name.toLowerCase().includes("hoodie")) },
                  { label: "Hoodies & Polos", products: f1Hoodies },
                ]}
                defaultTab="Jerseys"
                variants={variants}
              />
            </div>
          )}

          {/* Accessories */}
          {accessoriesAll.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-1">Shop</p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Accessories</h2>
                </div>
                <Link href="/products/accessories" className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                  View all →
                </Link>
              </div>
              <HomeSectionTabs
                tabs={[
                  { label: "Balls", products: balls },
                  { label: "Flags", products: flags },
                  { label: "Socks", products: socks },
                ]}
                defaultTab="Balls"
                variants={variants}
                layout="grid"
              />
            </div>
          )}

        </section>

        {/* Bottom CTA */}
        <section className="mt-24 rounded-3xl overflow-hidden bg-slate-950 shadow-2xl">
          <div className="relative px-10 py-14 sm:px-16 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-transparent to-transparent pointer-events-none" />
            <div className="relative max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-4">
                Premium sports marketplace
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Official game jerseys for every fan and every sport.
              </h2>
              <p className="mt-5 text-base text-slate-400 leading-relaxed max-w-lg">
                Football, rugby, Formula One and more — with fast local delivery, M-Pesa checkout, and unbeatable fan style.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products/epl"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg hover:scale-105 hover:shadow-xl transition-all"
                >
                  Shop EPL
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm font-bold text-white hover:border-slate-500 hover:bg-white/5 transition-all"
                >
                  Browse all
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Visit our store */}
        <section className="mt-24 mb-12">
          <div className="rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-sm">
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col justify-center px-10 py-12 sm:px-14 sm:py-16">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-500 mb-3">Come see us</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-8">
                  Visit our store
                </h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-none">
                      <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Jersey Code</p>
                      <p className="text-sm text-slate-500 mt-0.5">New Generation Exhibition</p>
                      <p className="text-sm text-slate-500">Tom Mboya St, Nairobi</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-none">
                      <svg className="w-5 h-5 text-slate-600" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.025 7.773L0 32l8.437-2.01A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.27 19.455c-.398-.199-2.354-1.162-2.72-1.294-.365-.133-.631-.199-.897.199-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.199-1.681-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.215-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.199-.232.265-.398.398-.664.133-.265.066-.497-.033-.697-.1-.199-.897-2.162-1.228-2.96-.324-.778-.652-.672-.897-.685l-.764-.013c-.265 0-.697.1-1.062.497-.365.398-1.394 1.362-1.394 3.323 0 1.96 1.428 3.855 1.627 4.12.199.265 2.81 4.29 6.808 6.016.951.41 1.693.655 2.272.839.954.304 1.822.261 2.508.158.765-.114 2.354-.962 2.686-1.892.332-.93.332-1.727.232-1.892-.099-.165-.365-.265-.763-.464z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">WhatsApp</p>
                      <p className="text-sm text-slate-500 mt-0.5">+254 708 353 465</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-none">
                      <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Opening Hours</p>
                      <p className="text-sm text-slate-500 mt-0.5">Mon – Sat: 8:00 AM – 8:00 PM</p>
                      <p className="text-sm text-slate-500">Sun: 10:00 AM – 6:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href="https://maps.app.goo.gl/i8RcoaucfxFfboaK9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow hover:bg-sky-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    Get Directions
                  </a>
                  <a
                    href="https://wa.me/254708353465"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 hover:border-[#25D366] hover:text-[#25D366] transition-colors"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
              <div className="h-72 lg:h-auto min-h-[420px]">
                <iframe
                  src="https://www.google.com/maps?q=Jersey+Code,+New+Generation+Exhibition,+Tom+Mboya+St,+Nairobi,+Kenya&output=embed&z=17"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block", minHeight: "420px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Jersey Code store location"
                />
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
