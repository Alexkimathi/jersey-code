"use client";

import { useCartStore } from "@/hooks/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          >
            <ShoppingBag className="mx-auto mb-5 h-16 w-16 text-slate-300" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Your cart is empty</h1>
          <p className="text-slate-500 mb-8">Add your favourite jersey to get started with your next match-day look.</p>
          <Link href="/products/football">
            <Button className="w-full sm:w-auto">Start Shopping</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10 rounded-[2rem] bg-gradient-to-r from-slate-950 to-sky-700 p-10 text-white shadow-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Cart</p>
              <h1 className="mt-4 text-4xl font-extrabold">Shopping Cart</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-200">
                Review your items, update quantities, and get ready to checkout with confidence.
              </p>
            </div>
            <motion.div
              key={items.length}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="rounded-full bg-white/10 px-5 py-4 text-sm text-slate-100"
            >
              <span className="font-semibold">{items.length}</span> item{items.length > 1 ? "s" : ""} in cart
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.5fr_0.95fr]">
          {/* Items list */}
          <motion.div
            className="space-y-5"
            layout
          >
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const key = item.cartKey ?? item.variantId;
                const unitPrice = item.price + (item.customization?.addOnPrice ?? 0);
                const c = item.customization;
                return (
                  <motion.div
                    key={key}
                    layout
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 32, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-[120px_minmax(0,1fr)] items-center">
                      <div className="relative h-32 w-full overflow-hidden rounded-[1.25rem] bg-slate-100 sm:h-28">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900 leading-tight">{item.name}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">
                              Size: {item.size}
                              {c?.edition === "player" && " · Player Authentic"}
                            </p>
                            {c && (c.printName || c.printNumber) && (
                              <p className="text-xs text-sky-600 font-medium mt-1">
                                {[
                                  c.printName && `#${c.printNumber || ""} ${c.printName}`.trim(),
                                  c.font,
                                  c.printColor,
                                ].filter(Boolean).join(" · ")}
                              </p>
                            )}
                            {c?.badge && c.badge !== "none" && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                {c.badge === "league" ? "League Badge" : "Club Crest"}
                              </p>
                            )}
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => removeItem(key)}
                            className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 flex-none"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(key, Math.max(1, item.quantity - 1))}
                              className="h-10 w-10 flex items-center justify-center text-slate-600 transition hover:bg-slate-100 rounded-l-2xl"
                            >
                              <Minus className="h-4 w-4" />
                            </motion.button>
                            <AnimatePresence mode="popLayout" initial={false}>
                              <motion.span
                                key={item.quantity}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 10, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="inline-flex h-10 min-w-[2.75rem] items-center justify-center text-sm font-semibold text-slate-900"
                              >
                                {item.quantity}
                              </motion.span>
                            </AnimatePresence>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(key, item.quantity + 1)}
                              className="h-10 w-10 flex items-center justify-center text-slate-600 transition hover:bg-slate-100 rounded-r-2xl"
                            >
                              <Plus className="h-4 w-4" />
                            </motion.button>
                          </div>
                          <p className="text-sm font-bold text-slate-900">
                            KES {(unitPrice * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Summary sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-6"
          >
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg font-semibold text-slate-900">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.1, color: "#0ea5e9" }}
                      animate={{ scale: 1, color: "#0f172a" }}
                      transition={{ duration: 0.35 }}
                    >
                      KES {total.toLocaleString()}
                    </motion.span>
                  </div>
                </div>
              </div>
              <Link href="/checkout">
                <Button size="lg" className="mt-6 w-full">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Need help?</h3>
              <p className="text-sm leading-6 text-slate-600">
                Contact our support team for help with sizing, delivery, or order updates.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-700">
                <p>support@jerseystore.co.ke</p>
                <p>+254 700 000 000</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
