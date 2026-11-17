import { createServerClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Product } from "@/lib/supabase/types";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ToggleVisibilityButton } from "@/components/admin/ToggleVisibilityButton";
import { Plus, Edit } from "lucide-react";

async function getProducts() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (data || []) as Product[];
}

export const dynamic = "force-dynamic";

type Filter = "all" | "visible" | "hidden";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: rawFilter } = await searchParams;
  const filter: Filter =
    rawFilter === "visible" || rawFilter === "hidden" ? rawFilter : "all";

  const allProducts = await getProducts();
  const visibleCount = allProducts.filter((p) => !p.is_hidden).length;
  const hiddenCount = allProducts.filter((p) => p.is_hidden).length;

  const products =
    filter === "visible"
      ? allProducts.filter((p) => !p.is_hidden)
      : filter === "hidden"
      ? allProducts.filter((p) => p.is_hidden)
      : allProducts;

  const tabs: { label: string; value: Filter; count: number }[] = [
    { label: "All", value: "all", count: allProducts.length },
    { label: "Visible", value: "visible", count: visibleCount },
    { label: "Hidden", value: "hidden", count: hiddenCount },
  ];

  const emptyMessages: Record<Filter, string> = {
    all: "No products yet. Create your first product to get started.",
    visible: "No visible products.",
    hidden: "No hidden products.",
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/products${tab.value === "all" ? "" : `?filter=${tab.value}`}`}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                filter === tab.value
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  filter === tab.value
                    ? "bg-gray-900 text-white"
                    : tab.value === "hidden" && tab.count > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50 ${
                      product.is_hidden && filter !== "hidden" ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.team && (
                          <div className="text-sm text-gray-500">{product.team}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-sm text-gray-900">
                        {product.sport}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      KES {Math.round(product.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.is_hidden
                            ? "bg-gray-100 text-gray-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.is_hidden ? "Hidden" : "Visible"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <ToggleVisibilityButton
                          productId={product.id}
                          isHidden={product.is_hidden}
                        />
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {emptyMessages[filter]}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
