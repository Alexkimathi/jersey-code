"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { useCartStore } from "@/hooks/useCartStore";
import { Plus, Check, Minus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  variants: (ProductVariant & { id: string })[];
  index?: number;
}

export function ProductCard({ product, variants, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const inStockVariants = variants.filter(v => v.stock_quantity > 0);
  const inStock = inStockVariants.length > 0;

  const [imageError,   setImageError]   = useState(false);
  const [added,        setAdded]        = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty,          setQty]          = useState(1);
  const [printName,    setPrintName]    = useState("");
  const [printNumber,  setPrintNumber]  = useState("");

  const isTracksuit = product.name.toLowerCase().includes("tracksuit");
  const hasCustomization = (product.sport === "football" || product.sport === "rugby") && !isTracksuit;

  const openQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || added) return;
    setSelectedSize(inStockVariants[0]?.size ?? "");
    setQty(1);
    setPrintName("");
    setPrintNumber("");
    setShowQuickAdd(true);
  };

  const closeQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickAdd(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = inStockVariants.find(v => v.size === selectedSize) ?? inStockVariants[0];
    if (!variant) return;
    const name    = printName.trim();
    const number  = printNumber.trim();
    const addOnPrice = (name ? 200 : 0) + (number ? 200 : 0);
    addItem({
      productId:  product.id,
      variantId:  variant.id,
      name:       product.name,
      size:       variant.size,
      price:      product.price + addOnPrice,
      quantity:   qty,
      image_url:  product.image_url,
      ...(hasCustomization && (name || number) ? {
        customization: {
          edition:     "fan",
          badge:       "none",
          addOnPrice,
          printName:   name   || undefined,
          printNumber: number || undefined,
        },
      } : {}),
    });
    setShowQuickAdd(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const stop = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.42), ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
      className="h-full"
    >
      <Link
        href={`/product/${product.id}`}
        className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-shadow duration-300 h-full w-full"
      >
        {/* Image */}
        <div className="relative flex-none h-64 bg-slate-100 overflow-hidden">
          {product.image_url && !imageError ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              unoptimized
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-300 text-sm font-medium">No Image</div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
          <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">{product.sport}</span>
          {product.is_featured && (
            <span className="absolute top-3 left-3 bg-sky-500 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow">Featured</span>
          )}
          {!inStock && (
            <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">Sold Out</span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
          <h3 className="font-semibold text-slate-900 text-[15px] leading-snug line-clamp-2">{product.name}</h3>
          {product.team && <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">{product.team}</p>}

          <div className="flex items-center justify-between mt-auto pt-3">
            <span className="text-base font-bold text-slate-900">KES {product.price.toLocaleString()}</span>

            <motion.button
              type="button"
              onClick={openQuickAdd}
              disabled={!inStock}
              aria-label={added ? "Added to cart" : "Quick add to cart"}
              whileTap={inStock ? { scale: 0.78 } : {}}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white shadow-sm disabled:cursor-not-allowed transition-colors duration-200 ${
                added ? "bg-green-500" : inStock ? "bg-slate-900 hover:bg-sky-500" : "bg-slate-200 text-slate-400"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span key="check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                    <Check className="w-3.5 h-3.5" />
                  </motion.span>
                ) : (
                  <motion.span key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                    <Plus className="w-3.5 h-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Glass quick-add overlay ── */}
        <AnimatePresence>
          {showQuickAdd && (
            <motion.div
              key="quickadd"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={stop}
              className="absolute inset-0 z-20 rounded-2xl overflow-hidden flex flex-col"
              style={{ background: "rgba(248,250,252,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
            >
              {/* Ghost jersey behind glass */}
              {product.image_url && !imageError && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
                  <Image src={product.image_url} alt="" fill unoptimized className="object-contain p-8" />
                </div>
              )}

              <div className="relative flex flex-col flex-1 px-4 pt-3 pb-3 gap-2.5 overflow-y-auto">

                {/* Header — name + price */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-extrabold text-slate-900 leading-tight line-clamp-2 flex-1">{product.name}</p>
                  <span className="text-[13px] font-extrabold text-sky-600 whitespace-nowrap">KES {product.price.toLocaleString()}</span>
                </div>

                <div className="h-px bg-slate-200/80" />

                {/* Size */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Size</span>
                    {selectedSize && <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{selectedSize}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {variants.map(v => {
                      const available = v.stock_quantity > 0;
                      const active    = selectedSize === v.size;
                      return (
                        <button
                          key={v.size}
                          type="button"
                          disabled={!available}
                          onClick={e => { stop(e); setSelectedSize(v.size); }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all duration-150 ${
                            active
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : available
                              ? "bg-white text-slate-600 border-slate-200 hover:border-slate-500 hover:text-slate-900"
                              : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through"
                          }`}
                        >
                          {v.size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 block mb-2">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={e => { stop(e); setQty(q => Math.max(1, q - 1)); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-all text-sm font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-sm font-extrabold text-slate-900 tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={e => { stop(e); setQty(q => q + 1); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-all text-sm font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Personalise — football / rugby only */}
                {hasCustomization && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 block">
                      Personalise <span className="text-slate-300 normal-case tracking-normal font-normal">· optional</span>
                    </span>
                    <input
                      type="text"
                      placeholder="Name  (+KES 200)"
                      value={printName}
                      onClick={stop}
                      onChange={e => setPrintName(e.target.value.toUpperCase().slice(0, 15))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-900 uppercase tracking-wide placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Number 0–99  (+KES 200)"
                      value={printNumber}
                      onClick={stop}
                      onChange={e => setPrintNumber(e.target.value.replace(/\D/g, "").slice(0, 2))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-0.5">
                  <button
                    type="button"
                    onClick={closeQuickAdd}
                    className="flex-1 py-2 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:border-slate-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    className="flex-[2] py-2 rounded-xl bg-slate-900 text-[11px] font-bold text-white hover:bg-sky-500 transition-colors disabled:opacity-40 tracking-wide"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}
