import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Product, Banner, ProductVariant } from "@/lib/supabase/types";
import { BannerCarousel } from "@/components/storefront/BannerCarousel";
import { MarqueeBanner } from "@/components/storefront/MarqueeBanner";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { ProductCard } from "@/components/storefront/ProductCard";

const sportCategories = [
  { name: "Football", slug: "football", emoji: "⚽" },
  { name: "Rugby", slug: "rugby", emoji: "🏉" },
  { name: "Basketball", slug: "basketball", emoji: "🏀" },
  { name: "Cricket", slug: "cricket", emoji: "🏏" },
];

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_hidden", false)
    .order("image_url", { ascending: false, nullsFirst: false })
    .limit(10);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return data || [];
}

async function getBanners(): Promise<Banner[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }

  return data || [];
}

async function getProductVariants(): Promise<ProductVariant[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("product_variants").select("*");
  if (error) {
    console.error("Error fetching variants:", error);
    return [];
  }
  return data || [];
}

async function getProductsByTeam(team: string): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("team", `%${team}%`)
    .eq("is_hidden", false)
    .not("image_url", "is", null)
    .order("image_url", { ascending: false, nullsFirst: false })
    .limit(10);

  if (error) {
    console.error("Error fetching products by team:", error);
    return [];
  }

  return data || [];
}

async function getProductsBySport(sport: string): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("sport", sport)
    .eq("is_hidden", false)
    .limit(10);

  if (error) {
    console.error("Error fetching products by sport:", error);
    return [];
  }

  return data || [];
}

async function getProductsByTeams(teams: string[]): Promise<Product[]> {
  if (teams.length === 0) {
    return [];
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("team", teams)
    .eq("is_hidden", false)
    .not("image_url", "is", null)
    .order("image_url", { ascending: false, nullsFirst: false })
    .limit(10);

  if (error) {
    console.error("Error fetching products by teams:", error);
    return [];
  }

  return data || [];
}

function expandToScrollItems<T>(items: T[], minCount = 10): T[] {
  if (items.length === 0) {
    return items;
  }

  return Array.from({ length: Math.max(minCount, items.length) }, (_, index) => {
    return items[index % items.length];
  });
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProductsRaw, banners, variants]: [Product[], Banner[], ProductVariant[]] = await Promise.all([
    getFeaturedProducts(),
    getBanners(),
    getProductVariants(),
  ]);

  const featuredProducts = expandToScrollItems(featuredProductsRaw, 10);
  const harambee = expandToScrollItems(await getProductsByTeam("Harambee"), 10);
  const premier = expandToScrollItems(
    await getProductsByTeams([
      "Manchester United",
      "Arsenal",
      "Chelsea",
      "Liverpool",
      "Manchester City",
    ]),
    10
  );
  const bundesliga = expandToScrollItems(
    await getProductsByTeams([
      "Bayern Munich",
      "Borussia Dortmund",
      "RB Leipzig",
      "Bayer Leverkusen",
    ]),
    10
  );
  const seriea = expandToScrollItems(
    await getProductsByTeams([
      "Juventus",
      "AC Milan",
      "Inter Milan",
      "Napoli",
    ]),
    10
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {banners.length > 0 && (
        <BannerCarousel banners={banners} />
      )}

      {/* Scrolling ad ticker */}
      <MarqueeBanner />

<main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-12">

        {/* Sport category chips */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-12 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 no-scrollbar">
          {sportCategories.map((cat) => (
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

        {featuredProducts.length > 0 && (
          <FeaturedProducts products={featuredProducts} />
        )}

        {/* League / team rows */}
        <section className="mt-12 space-y-14">

          {harambee.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Football · Kenya</p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Harambee Stars</h2>
                </div>
                <Link href="/products/football" className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                  View all →
                </Link>
              </div>
              <div className="overflow-x-auto pb-4 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 no-scrollbar">
                <div className="flex gap-5 min-w-max">
                  {harambee.map((product, index) => {
                    const productVariants = variants.filter((v: any) => v.product_id === product.id);
                    return (
                      <div key={`${product.id}-${index}`} className="min-w-[72vw] sm:min-w-[260px] md:min-w-[300px] h-[420px]">
                        <ProductCard product={product} variants={productVariants} index={index} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {premier.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Football · England</p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Premier League</h2>
                </div>
                <Link href="/products/football" className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                  View all →
                </Link>
              </div>
              <div className="overflow-x-auto pb-4 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 no-scrollbar">
                <div className="flex gap-5 min-w-max">
                  {premier.map((product, index) => {
                    const productVariants = variants.filter((v: any) => v.product_id === product.id);
                    return (
                      <div key={`${product.id}-${index}`} className="min-w-[72vw] sm:min-w-[260px] md:min-w-[300px] h-[420px]">
                        <ProductCard product={product} variants={productVariants} index={index} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {bundesliga.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Football · Germany</p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Bundesliga</h2>
                </div>
                <Link href="/products/football" className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                  View all →
                </Link>
              </div>
              <div className="overflow-x-auto pb-4 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 no-scrollbar">
                <div className="flex gap-5 min-w-max">
                  {bundesliga.map((product, index) => {
                    const productVariants = variants.filter((v: any) => v.product_id === product.id);
                    return (
                      <div key={`${product.id}-${index}`} className="min-w-[72vw] sm:min-w-[260px] md:min-w-[300px] h-[420px]">
                        <ProductCard product={product} variants={productVariants} index={index} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {seriea.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Football · Italy</p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Serie A</h2>
                </div>
                <Link href="/products/football" className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                  View all →
                </Link>
              </div>
              <div className="overflow-x-auto pb-4 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 no-scrollbar">
                <div className="flex gap-5 min-w-max">
                  {seriea.map((product, index) => {
                    const productVariants = variants.filter((v: any) => v.product_id === product.id);
                    return (
                      <div key={`${product.id}-${index}`} className="min-w-[72vw] sm:min-w-[260px] md:min-w-[300px] h-[420px]">
                        <ProductCard product={product} variants={productVariants} index={index} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </section>

        {/* Bottom CTA hero */}
        <section className="mt-24 rounded-3xl overflow-hidden bg-slate-950 shadow-2xl">
          <div className="relative px-10 py-14 sm:px-16 sm:py-20">
            {/* Subtle gradient blob */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-transparent to-transparent pointer-events-none" />
            <div className="relative max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-4">
                Premium sports marketplace
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Official game jerseys for every fan and every sport.
              </h2>
              <p className="mt-5 text-base text-slate-400 leading-relaxed max-w-lg">
                Football, rugby, basketball and cricket jerseys — with fast local delivery, M-Pesa checkout, and unbeatable fan style.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products/football"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg hover:scale-105 hover:shadow-xl transition-all"
                >
                  Shop Football
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

              {/* Info panel */}
              <div className="flex flex-col justify-center px-10 py-12 sm:px-14 sm:py-16">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-500 mb-3">Come see us</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-8">
                  Visit our store
                </h2>

                <div className="space-y-5">
                  {/* Address */}
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

                  {/* WhatsApp */}
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

                  {/* Hours */}
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

              {/* Map */}
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
