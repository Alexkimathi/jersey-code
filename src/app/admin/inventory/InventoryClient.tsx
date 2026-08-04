"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, XCircle, CheckCircle, Package, ChevronLeft, ChevronRight, X } from "lucide-react";

const LOW_STOCK_THRESHOLD = 5;
const PAGE_SIZE = 24;

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

type FilterTab = "all" | "low" | "out";

function productStatus(p: ProductWithVariants): "out" | "low" | "ok" {
  if (p.product_variants.some((v) => v.stock_quantity === 0)) return "out";
  if (p.product_variants.some((v) => v.stock_quantity > 0 && v.stock_quantity <= LOW_STOCK_THRESHOLD)) return "low";
  return "ok";
}

function ProductCard({ product }: { product: ProductWithVariants }) {
  const status = productStatus(product);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 hover:shadow-sm transition flex flex-col gap-2">
      {/* Header row */}
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="block text-xs font-semibold text-gray-900 hover:text-blue-600 leading-snug truncate"
          >
            {product.name}
          </Link>
          {product.team && (
            <p className="text-[11px] text-gray-400 truncate">{product.team}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-none">
          {product.is_hidden && (
            <span className="text-[10px] bg-gray-100 text-gray-400 px-1 py-0.5 rounded">Hidden</span>
          )}
          {status === "out" ? (
            <XCircle className="w-3.5 h-3.5 text-red-500 flex-none" />
          ) : status === "low" ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-none" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-none" />
          )}
        </div>
      </div>

      {/* Size pills */}
      {product.product_variants.length === 0 ? (
        <p className="text-[11px] text-gray-400 italic flex items-center gap-1">
          <Package className="w-3 h-3" /> No sizes
        </p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {product.product_variants.map((v) => {
            const isOut = v.stock_quantity === 0;
            const isLow = v.stock_quantity > 0 && v.stock_quantity <= LOW_STOCK_THRESHOLD;
            return (
              <span
                key={v.id}
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                  isOut
                    ? "bg-red-50 text-red-700 border-red-200"
                    : isLow
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                <span className="font-bold">{v.size}</span>
                <span className="opacity-40">·</span>
                <span>{v.stock_quantity}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function InventoryClient({ products }: { products: ProductWithVariants[] }) {
  const [tab, setTab]               = useState<FilterTab>("all");
  const [page, setPage]             = useState(1);
  const [selectedId, setSelectedId] = useState<string>("");

  const allVariants    = products.flatMap((p) => p.product_variants);
  const outOfStockCount = allVariants.filter((v) => v.stock_quantity === 0).length;
  const lowStockCount   = allVariants.filter((v) => v.stock_quantity > 0 && v.stock_quantity <= LOW_STOCK_THRESHOLD).length;
  const healthyCount    = allVariants.filter((v) => v.stock_quantity > LOW_STOCK_THRESHOLD).length;

  // When a specific product is chosen from the dropdown
  const spotlightProduct = selectedId ? products.find((p) => p.id === selectedId) ?? null : null;

  // Filtered + paginated list (only used when no spotlight)
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (tab === "out") return p.product_variants.some((v) => v.stock_quantity === 0);
      if (tab === "low") return p.product_variants.some(
        (v) => v.stock_quantity > 0 && v.stock_quantity <= LOW_STOCK_THRESHOLD
      );
      return true;
    });
  }, [products, tab]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function changeTab(t: FilterTab) {
    setTab(t);
    setPage(1);
    setSelectedId("");
  }

  function clearSpotlight() {
    setSelectedId("");
  }

  return (
    <div>
      {/* Summary cards — clickable filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { key: "all" as FilterTab, icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: "bg-green-100", count: healthyCount, label: "In stock", activeBorder: "border-blue-300 bg-blue-50" },
          { key: "low" as FilterTab, icon: <AlertTriangle className="w-5 h-5 text-amber-600" />, bg: "bg-amber-100", count: lowStockCount, label: `Low stock (≤${LOW_STOCK_THRESHOLD})`, activeBorder: "border-amber-300 bg-amber-50" },
          { key: "out" as FilterTab, icon: <XCircle className="w-5 h-5 text-red-600" />, bg: "bg-red-100", count: outOfStockCount, label: "Out of stock", activeBorder: "border-red-300 bg-red-50" },
        ].map(({ key, icon, bg, count, label, activeBorder }) => (
          <button
            key={key}
            onClick={() => changeTab(key)}
            className={`rounded-xl border p-5 shadow-sm flex items-center gap-4 text-left transition ${
              tab === key && !spotlightProduct ? activeBorder : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-none`}>{icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick-jump dropdown */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Jump to product
          </label>
          <select
            value={selectedId}
            onChange={(e) => { setSelectedId(e.target.value); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">— Choose a product —</option>
            {products.map((p) => {
              const s = productStatus(p);
              const prefix = s === "out" ? "🔴 " : s === "low" ? "🟡 " : "🟢 ";
              return (
                <option key={p.id} value={p.id}>
                  {prefix}{p.name}{p.team ? ` · ${p.team}` : ""}
                </option>
              );
            })}
          </select>
        </div>
        {spotlightProduct && (
          <button
            onClick={clearSpotlight}
            className="flex items-center gap-1.5 mt-5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Spotlight: single selected product */}
      {spotlightProduct ? (
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Showing: {spotlightProduct.name}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            <ProductCard product={spotlightProduct} />
          </div>
        </div>
      ) : (
        <>
          {/* Paginated grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {pageItems.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl border border-gray-200 py-14 text-center text-gray-400">
                No products in this category.
              </div>
            ) : (
              pageItems.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages} &nbsp;·&nbsp; {filtered.length} products
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                  .reduce<(number | "…")[]>((acc, n, i, arr) => {
                    if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("…");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === "…" ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item as number)}
                        className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition ${
                          currentPage === item
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
