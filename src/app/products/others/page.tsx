import { createServerClient } from "@/lib/supabase/server";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { CategoryTabs } from "@/components/storefront/CategoryTabs";

export const dynamic = "force-dynamic";

const CLUB_TEAMS = [
  "Barcelona", "Real Madrid", "Bayern Munich", "Borussia Dortmund",
  "RB Leipzig", "Bayer Leverkusen", "Juventus", "AC Milan", "Inter Milan", "Napoli",
];

const NATIONAL_TEAMS = ["Argentina", "Brazil", "Harambee Stars"];

async function getAllFootballProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("sport", "football")
    .eq("is_hidden", false)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false });
  return data || [];
}

async function getProductVariants(): Promise<ProductVariant[]> {
  const supabase = createServerClient();
  const { data } = await supabase.from("product_variants").select("*");
  return (data as ProductVariant[]) || [];
}

export default async function OthersPage() {
  const [allFootball, variants] = await Promise.all([
    getAllFootballProducts(),
    getProductVariants(),
  ]);

  const isVintage = (p: Product) => p.name.toLowerCase().includes("vintage");

  const tabs = [
    { label: "League Jerseys",      products: allFootball.filter(p => CLUB_TEAMS.includes(p.team ?? "") && !isVintage(p)) },
    { label: "Vintage Jerseys",     products: allFootball.filter(p => isVintage(p) && CLUB_TEAMS.includes(p.team ?? "")) },
    { label: "International Teams", products: allFootball.filter(p => NATIONAL_TEAMS.includes(p.team ?? "")) },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-950 to-sky-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Football · World</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              World Football
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-200">
              La Liga, Bundesliga, Serie A, vintage classics, Japan editions, and international nations.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CategoryTabs tabs={tabs} defaultTab="League Jerseys" variants={variants} />
      </div>
    </div>
  );
}
