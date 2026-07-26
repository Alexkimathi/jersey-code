"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { ProductCard } from "./ProductCard";

export interface TabDef {
  label: string;
  products: Product[];
  comingSoon?: boolean;
}

interface CategoryTabsProps {
  tabs: TabDef[];
  defaultTab?: string;
  variants: ProductVariant[];
}

export function CategoryTabs({ tabs, defaultTab, variants }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.label);
  const current = tabs.find((t) => t.label === activeTab) ?? tabs[0];

  return (
    <div>
      {/* Tab buttons — only render when there is more than one tab */}
      {tabs.length > 1 && (
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex-none px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab.label
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:shadow-sm"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      )}

      {/* Content */}
      {current?.comingSoon ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-14 text-center">
          <p className="text-3xl mb-3">🔜</p>
          <p className="text-lg font-semibold text-slate-900">Coming Soon</p>
          <p className="mt-2 text-slate-500">
            We&apos;re working on this collection. Check back soon.
          </p>
        </div>
      ) : !current || current.products.length === 0 ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">No products found.</p>
          <p className="mt-3 text-slate-600">
            Check back soon or explore another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {current.products.map((product) => {
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
  );
}
