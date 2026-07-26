import { createServerClient } from "@/lib/supabase/server";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { CategoryTabs } from "@/components/storefront/CategoryTabs";

export const dynamic = "force-dynamic";

async function getRugbyJerseys(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("sport", "rugby")
    .eq("is_hidden", false)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false });
  return data || [];
}

async function getAccessories(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("sport", "accessories")
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

export default async function RugbyPage() {
  const [jerseys, accessories, variants] = await Promise.all([
    getRugbyJerseys(),
    getAccessories(),
    getProductVariants(),
  ]);

  const tabs = [
    { label: "Jerseys", products: jerseys },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-950 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
              Rugby Collection
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Rugby
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-200">
              Official rugby jerseys and accessories — built for the game, worn
              by the fans.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CategoryTabs tabs={tabs} defaultTab="Jerseys" variants={variants} />
      </div>
    </div>
  );
}
