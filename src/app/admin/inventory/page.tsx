import { createServerClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { InventoryClient } from "./InventoryClient";

interface Variant {
  id: string;
  size: string;
  stock_quantity: number;
  sku: string | null;
}

interface ProductWithVariants {
  id: string;
  name: string;
  sport: string;
  team: string | null;
  is_hidden: boolean;
  product_variants: Variant[];
}

async function getInventory(): Promise<ProductWithVariants[]> {
  const supabase = createServerClient();
  const { data, error } = await (supabase as any)
    .from("products")
    .select("id, name, sport, team, is_hidden, product_variants(id, size, stock_quantity, sku)")
    .order("name");

  if (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }

  return (data ?? []) as ProductWithVariants[];
}

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const products = await getInventory();

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Inventory</h1>
        <InventoryClient products={products} />
      </div>
    </AdminLayout>
  );
}
