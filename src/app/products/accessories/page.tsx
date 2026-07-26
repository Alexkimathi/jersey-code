import { createServerClient } from "@/lib/supabase/server";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { CategoryTabs } from "@/components/storefront/CategoryTabs";

export const dynamic = "force-dynamic";

async function getAccessoriesByType(type: string): Promise<Product[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("sport", "accessories")
    .eq("team", type)
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

export default async function AccessoriesPage() {
  const [balls, flags, socks, variants] = await Promise.all([
    getAccessoriesByType("Balls"),
    getAccessoriesByType("Flags"),
    getAccessoriesByType("Socks"),
    getProductVariants(),
  ]);

  const tabs = [
    { label: "Balls", products: balls },
    { label: "Flags", products: flags },
    { label: "Socks", products: socks },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-950 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
              Accessories
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Accessories
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-200">
              Balls, flags, socks and more — everything a true fan needs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CategoryTabs tabs={tabs} defaultTab="Balls" variants={variants} />
      </div>
    </div>
  );
}
