import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getVariants(productId: string): Promise<ProductVariant[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("size");

  if (error) {
    return [];
  }

  return data || [];
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [product, variants] = await Promise.all([
    getProduct(id),
    getVariants(id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailClient product={product} variants={variants} />
      </div>
    </div>
  );
}
