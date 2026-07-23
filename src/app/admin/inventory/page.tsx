import { createServerClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Link from "next/link";
import { AlertTriangle, XCircle, CheckCircle } from "lucide-react";

const LOW_STOCK_THRESHOLD = 5;

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

  const allVariants = products.flatMap((p) => p.product_variants);
  const outOfStock = allVariants.filter((v) => v.stock_quantity === 0).length;
  const lowStock = allVariants.filter(
    (v) => v.stock_quantity > 0 && v.stock_quantity <= LOW_STOCK_THRESHOLD
  ).length;
  const healthy = allVariants.filter((v) => v.stock_quantity > LOW_STOCK_THRESHOLD).length;

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Inventory</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-none">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{healthy}</p>
              <p className="text-sm text-gray-500">In stock</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-none">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{lowStock}</p>
              <p className="text-sm text-gray-500">Low stock (≤{LOW_STOCK_THRESHOLD})</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-red-200 p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-none">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{outOfStock}</p>
              <p className="text-sm text-gray-500">Out of stock</p>
            </div>
          </div>
        </div>

        {/* Inventory table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                if (product.product_variants.length === 0) {
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {product.name}
                        </Link>
                        {product.team && (
                          <span className="text-sm text-gray-500 block">{product.team}</span>
                        )}
                        <span className="text-xs text-gray-400 capitalize">{product.sport}</span>
                      </td>
                      <td colSpan={4} className="px-6 py-4 text-sm text-gray-400 italic">
                        No variants — add sizes in the product editor
                      </td>
                    </tr>
                  );
                }

                return product.product_variants.map((variant, idx) => {
                  const isOut = variant.stock_quantity === 0;
                  const isLow =
                    variant.stock_quantity > 0 &&
                    variant.stock_quantity <= LOW_STOCK_THRESHOLD;

                  return (
                    <tr key={variant.id} className="hover:bg-gray-50">
                      {idx === 0 && (
                        <td
                          className="px-6 py-4 align-top"
                          rowSpan={product.product_variants.length}
                        >
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {product.name}
                          </Link>
                          {product.team && (
                            <span className="text-sm text-gray-500 block">{product.team}</span>
                          )}
                          <span className="text-xs text-gray-400 capitalize">{product.sport}</span>
                        </td>
                      )}
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                        {variant.size}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500 font-mono">
                        {variant.sku ?? "—"}
                      </td>
                      <td className="px-6 py-3 text-sm font-bold">
                        <span
                          className={
                            isOut
                              ? "text-red-600"
                              : isLow
                              ? "text-amber-600"
                              : "text-gray-900"
                          }
                        >
                          {variant.stock_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3" /> Out of stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <AlertTriangle className="w-3 h-3" /> Low stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" /> OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                });
              })}

              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
