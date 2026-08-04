"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, XCircle, CheckCircle, Package, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

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

function StatusIcon({ status, className = "w-3.5 h-3.5" }: { status: "out" | "low" | "ok"; className?: string }) {
  if (status === "out") return <XCircle className={`${className} text-red-500`} />;
  if (status === "low") return <AlertTriangle className={`${className} text-amber-500`} />;
  return <CheckCircle className={`${className} text-green-500`} />;
}

// ── Combobox ─────────────────────────────────────────────────────────────────

function ProductCombobox({
  products,
  selectedId,
  onSelect,
}: {
  products: ProductWithVariants[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery]       = useState("");
  const [open, setOpen]         = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);
  const listRef                 = useRef<HTMLDivElement>(null);

  const selectedProduct = selectedId ? products.find((p) => p.id === selectedId) : null;

  // Show suggestions when query ≥ 3 chars OR when focused with empty query (show all, capped)
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 40); // show first 40 when no query
    if (q.length < 3) return [];          // wait for 3 chars
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.team ?? "").toLowerCase().includes(q)
    ).slice(0, 20);
  }, [products, query]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSelect(id: string, name: string) {
    onSelect(id);
    setQuery(name);
    setOpen(false);
  }

  function handleClear() {
    onSelect("");
    setQuery("");
    inputRef.current?.focus();
  }

  // Sync display text when selectedId is cleared externally
  useEffect(() => {
    if (!selectedId) setQuery("");
  }, [selectedId]);

  return (
    <div className="relative w-72">
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search product…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="w-full pl-8 pr-7 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        />
        {(query || selectedId) && (
          <button
            onClick={handleClear}
            className="absolute right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Hint */}
      {open && query.length > 0 && query.length < 3 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs text-gray-400">
          Type {3 - query.length} more character{3 - query.length > 1 ? "s" : ""}…
        </div>
      )}

      {/* Suggestion list */}
      {open && (query.length === 0 || query.length >= 3) && suggestions.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="max-h-56 overflow-y-auto divide-y divide-gray-100">
            {suggestions.map((p) => {
              const s = productStatus(p);
              const isSelected = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  onMouseDown={(e) => e.preventDefault()} // prevent input blur
                  onClick={() => handleSelect(p.id, p.name)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <StatusIcon status={s} className="w-3 h-3 flex-none" />
                  <span className="text-xs font-medium text-gray-800 truncate flex-1">{p.name}</span>
                  {p.team && (
                    <span className="text-[11px] text-gray-400 truncate max-w-[80px]">{p.team}</span>
                  )}
                </button>
              );
            })}
          </div>
          {query.length === 0 && products.length > 40 && (
            <p className="px-3 py-1.5 text-[11px] text-gray-400 border-t border-gray-100">
              Type to search all {products.length} products
            </p>
          )}
        </div>
      )}

      {open && query.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs text-gray-400">
          No matches for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: ProductWithVariants }) {
  const status = productStatus(product);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 hover:shadow-sm transition flex flex-col gap-2">
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="block text-xs font-semibold text-gray-900 hover:text-blue-600 leading-snug truncate"
          >
            {product.name}
          </Link>
          {product.team && <p className="text-[11px] text-gray-400 truncate">{product.team}</p>}
        </div>
        <div className="flex items-center gap-1 flex-none">
          {product.is_hidden && (
            <span className="text-[10px] bg-gray-100 text-gray-400 px-1 py-0.5 rounded">Hidden</span>
          )}
          <StatusIcon status={status} />
        </div>
      </div>

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

// ── Main ──────────────────────────────────────────────────────────────────────

export function InventoryClient({ products }: { products: ProductWithVariants[] }) {
  const [tab, setTab]               = useState<FilterTab>("all");
  const [page, setPage]             = useState(1);
  const [selectedId, setSelectedId] = useState<string>("");

  const allVariants     = products.flatMap((p) => p.product_variants);
  const outOfStockCount = allVariants.filter((v) => v.stock_quantity === 0).length;
  const lowStockCount   = allVariants.filter((v) => v.stock_quantity > 0 && v.stock_quantity <= LOW_STOCK_THRESHOLD).length;
  const healthyCount    = allVariants.filter((v) => v.stock_quantity > LOW_STOCK_THRESHOLD).length;

  const spotlightProduct = selectedId ? (products.find((p) => p.id === selectedId) ?? null) : null;

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

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { key: "all" as FilterTab, icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: "bg-green-100", count: healthyCount,    label: "In stock",                  active: "border-blue-300 bg-blue-50"   },
          { key: "low" as FilterTab, icon: <AlertTriangle className="w-5 h-5 text-amber-600" />, bg: "bg-amber-100", count: lowStockCount, label: `Low stock (≤${LOW_STOCK_THRESHOLD})`, active: "border-amber-300 bg-amber-50" },
          { key: "out" as FilterTab, icon: <XCircle className="w-5 h-5 text-red-600" />,         bg: "bg-red-100",   count: outOfStockCount, label: "Out of stock",              active: "border-red-300 bg-red-50"     },
        ].map(({ key, icon, bg, count, label, active }) => (
          <button
            key={key}
            onClick={() => changeTab(key)}
            className={`rounded-xl border p-4 shadow-sm flex items-center gap-3 text-left transition ${
              tab === key && !spotlightProduct ? active : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center flex-none`}>{icon}</div>
            <div>
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Search combobox + clear */}
      <div className="flex items-center gap-2 mb-4">
        <ProductCombobox
          products={products}
          selectedId={selectedId}
          onSelect={(id) => { setSelectedId(id); }}
        />
        {spotlightProduct && (
          <span className="text-xs text-gray-500">
            Showing: <span className="font-semibold text-gray-700">{spotlightProduct.name}</span>
          </span>
        )}
      </div>

      {/* Spotlight or paginated grid */}
      {spotlightProduct ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          <ProductCard product={spotlightProduct} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {pageItems.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl border border-gray-200 py-12 text-center text-gray-400 text-sm">
                No products in this category.
              </div>
            ) : (
              pageItems.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages} · {filtered.length} products
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
                      <span key={`e-${i}`} className="px-1 text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item as number)}
                        className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition ${
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
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
