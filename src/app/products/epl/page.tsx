import { createServerClient } from "@/lib/supabase/server";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { CategoryTabs } from "@/components/storefront/CategoryTabs";
import { EPL_TEAMS, NATIONAL_TEAMS } from "@/lib/categories";

export const dynamic = "force-dynamic";

async function getTeamList(listType: "epl" | "national"): Promise<string[]> {
  const supabase = createServerClient() as any;
  const { data } = await supabase
    .from("team_lists")
    .select("name")
    .eq("list_type", listType)
    .order("sort_order", { ascending: true });

  if (!data || data.length === 0) {
    return listType === "epl" ? EPL_TEAMS : NATIONAL_TEAMS;
  }
  return (data as { name: string }[]).map((t) => t.name);
}

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

export default async function EplPage() {
  const [eplTeams, nationalTeams, allFootball, variants] = await Promise.all([
    getTeamList("epl"),
    getTeamList("national"),
    getAllFootballProducts(),
    getProductVariants(),
  ]);

  const isKids = (p: Product) => {
    const n = p.name.toLowerCase();
    return n.includes("kids") || n.includes("youth") || n.includes("junior");
  };
  const isVintage = (p: Product) => p.name.toLowerCase().includes("vintage");
  const isSpecialEdition = (p: Product) => {
    const n = p.name.toLowerCase();
    return n.includes("special") || n.includes("limited") || n.includes("edition");
  };

  const tabs = [
    { label: "League Jerseys",       products: allFootball.filter(p => eplTeams.includes(p.team ?? "") && !isVintage(p) && !isKids(p) && !isSpecialEdition(p)) },
    { label: "Kids Jerseys",         products: allFootball.filter(p => eplTeams.includes(p.team ?? "") && isKids(p)) },
    { label: "Vintage Jerseys",      products: allFootball.filter(p => eplTeams.includes(p.team ?? "") && isVintage(p)) },
    { label: "Special Edition Kits", products: allFootball.filter(p => eplTeams.includes(p.team ?? "") && isSpecialEdition(p)) },
    { label: "National Teams Kits",  products: allFootball.filter(p => nationalTeams.includes(p.team ?? "")) },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-950 to-sky-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Football · England</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Premier League
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-200">
              Official English Premier League jerseys — current kits, vintage classics, Japan editions and international teams.
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
