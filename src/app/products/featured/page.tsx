import { createServerClient } from "@/lib/supabase/server";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { ProductCard } from "@/components/storefront/ProductCard";

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_hidden", false)
    .not("image_url", "is", null)
    .order("image_url", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return data || [];
}

async function getProductVariants(): Promise<ProductVariant[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("*");

  if (error) {
    console.error("Error fetching variants:", error);
    return [];
  }

  return data as ProductVariant[];
}

export const dynamic = "force-dynamic";

export default async function FeaturedPage() {
  const products = await getFeaturedProducts();
  const variants = await getProductVariants();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-950 to-sky-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Featured Collection</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Featured Jerseys
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-200">
              Our hand-picked selection of top jerseys — fan favourites and premium kits all in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {products.length === 0 ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">No featured products at the moment.</p>
            <p className="mt-3 text-slate-600">Check back soon for our featured picks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const productVariants = variants.filter(
                (v) => v.product_id === product.id
              );
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  variants={productVariants}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
