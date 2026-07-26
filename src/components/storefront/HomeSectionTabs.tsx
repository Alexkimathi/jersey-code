"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { ProductCard } from "./ProductCard";

export interface HomeSectionTab {
  label: string;
  products: Product[];
  comingSoon?: boolean;
}

interface HomeSectionTabsProps {
  tabs: HomeSectionTab[];
  defaultTab?: string;
  variants: ProductVariant[];
  layout?: "scroll" | "grid";
}

export function HomeSectionTabs({
  tabs,
  defaultTab,
  variants,
  layout = "scroll",
}: HomeSectionTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.label);
  const current = tabs.find((t) => t.label === activeTab) ?? tabs[0];

  return (
    <div>
      {/* Tabs — only render bar when there is more than one tab */}
      {tabs.length > 1 && (
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 pb-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex-none px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab.label
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      )}

      {/* Content */}
      {current?.comingSoon ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-slate-700">Coming Soon</p>
          <p className="mt-1 text-sm text-slate-400">Check back soon.</p>
        </div>
      ) : !current || current.products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">No products found.</p>
        </div>
      ) : layout === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {current.products.map((product, index) => {
            const productVariants = variants.filter(
              (v) => v.product_id === product.id
            );
            return (
              <ProductCard
                key={`${product.id}-${index}`}
                product={product}
                variants={productVariants}
                index={index}
              />
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto pb-4 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 no-scrollbar">
          <div className="flex gap-5 min-w-max">
            {current.products.map((product, index) => {
              const productVariants = variants.filter(
                (v) => v.product_id === product.id
              );
              return (
                <div
                  key={`${product.id}-${index}`}
                  className="min-w-[72vw] sm:min-w-[260px] md:min-w-[300px] h-[420px]"
                >
                  <ProductCard
                    product={product}
                    variants={productVariants}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
