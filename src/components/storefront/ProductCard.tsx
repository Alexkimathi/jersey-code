"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { useCartStore } from "@/hooks/useCartStore";
import { Plus, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  variants: (ProductVariant & { id: string })[];
  index?: number;
}

export function ProductCard({ product, variants, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const minStock = variants.reduce((min, v) => Math.min(min, v.stock_quantity), Infinity);
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);
  const inStock = variants.length > 0 && minStock > 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || added) return;
    const defaultVariant = variants[0];
    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      size: defaultVariant.size,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.07, 0.42),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
      className="h-full"
    >
      <Link
        href={`/product/${product.id}`}
        className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-shadow duration-300 h-full w-full"
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
            <div className="flex items-center justify-center h-full text-slate-300 text-sm font-medium">
              No Image
            </div>
          )}

          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

          {/* Sport label */}
          <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
            {product.sport}
          </span>

          {/* Featured badge */}
          {product.is_featured && (
            <span className="absolute top-3 left-3 bg-sky-500 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
              Featured
            </span>
          )}

          {/* Sold out badge */}
          {!inStock && (
            <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
              Sold Out
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
          <h3 className="font-semibold text-slate-900 text-[15px] leading-snug line-clamp-2">
            {product.name}
          </h3>
          {product.team && (
            <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">{product.team}</p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3">
            <span className="text-base font-bold text-slate-900">
              KES {product.price.toLocaleString()}
            </span>

            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              aria-label={added ? "Added to cart" : "Add to cart"}
              whileTap={inStock ? { scale: 0.78 } : {}}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white shadow-sm disabled:cursor-not-allowed transition-colors duration-200 ${
                added
                  ? "bg-green-500"
                  : inStock
                  ? "bg-slate-900 hover:bg-sky-500"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="plus"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
