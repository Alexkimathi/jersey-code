import { Product } from "@/lib/supabase/types";
import { ProductCard } from "@/components/storefront/ProductCard";
import Link from "next/link";

async function getProductVariants(productId: string) {
  const { createServerClient } = await import("@/lib/supabase/server");
  const supabase = createServerClient();
  const { data } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId);

  return data || [];
}

export async function FeaturedProducts({ products }: { products: Product[] }) {
  const productsWithVariants = await Promise.all(
    products.map(async (product) => ({
      product,
      variants: await getProductVariants(product.id),
    }))
  );

  return (
    <section className="mb-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">Hand-picked</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Featured Products</h2>
        </div>
        <Link
          href="/products/football"
          className="text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors"
        >
          View all →
        </Link>
      </div>
      <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4 no-scrollbar">
        <div className="flex gap-5 min-w-max">
          {productsWithVariants.map(({ product, variants }, index) => (
            <div key={`${product.id}-${index}`} className="min-w-[72vw] sm:min-w-[260px] md:min-w-[300px] h-[420px]">
              <ProductCard product={product} variants={variants} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
