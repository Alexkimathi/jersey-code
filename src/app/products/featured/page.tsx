import { createServerClient } from "@/lib/supabase/server";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { CategoryTabs } from "@/components/storefront/CategoryTabs";

export const dynamic = "force-dynamic";

const EPL_TEAMS = new Set([
  "Manchester United", "Arsenal", "Liverpool", "Chelsea",
  "Manchester City", "Tottenham Hotspur", "Everton",
  "West Ham United", "Leicester City", "Newcastle United",
]);
const BIG_CLUBS = new Set([
  "Barcelona", "Real Madrid", "Bayern Munich",
  "Borussia Dortmund", "Juventus", "AC Milan", "Inter Milan", "Napoli",
]);

function footballFirst(products: Product[]): Product[] {
  const rank = (p: Product) =>
    EPL_TEAMS.has(p.team ?? "") ? 0 :
    BIG_CLUBS.has(p.team ?? "") ? 1 :
    p.sport === "football" ? 2 : 3;
  return [...products].sort((a, b) => rank(a) - rank(b));
}

async function getNewArrivals(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_hidden", false)
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
    .neq("sport", "accessories")
    .order("created_at", { ascending: false });
  return data || [];
}

async function getProductVariants(): Promise<ProductVariant[]> {
  const supabase = createServerClient();
  const { data } = await supabase.from("product_variants").select("*");
  return (data as ProductVariant[]) || [];
}

export default async function FeaturedPage() {
  const [newArrivals, bestSellers, variants] = await Promise.all([
    getNewArrivals(),
    getBestSellers(),
    getProductVariants(),
  ]);

  const tabs = [
    { label: "New Arrival", products: footballFirst(newArrivals) },
    { label: "Best Seller", products: footballFirst(bestSellers) },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-950 to-sky-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
              Featured Collection
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Featured Jerseys
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-200">
              Our hand-picked selection of top jerseys — new arrivals and fan
              favourites all in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CategoryTabs tabs={tabs} defaultTab="New Arrival" variants={variants} />
      </div>
    </div>
  );
}
