"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Package, ChevronLeft } from "lucide-react";
import { BADGE_OPTIONS, NATIONAL_BADGE_OPTIONS } from "@/lib/football-customization";

interface CustomizationData {
  size?: string | null;
  edition?: string | null;
  font?: string | null;
  printColor?: string | null;
  badges?: string[];
  addOnPrice?: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  custom_name?: string;
  custom_number?: string;
  customization_data?: CustomizationData | null;
  products?: { name: string; image_url: string | null };
  product_variants?: { size: string } | null;
}

function resolveBadgeLabel(value: string) {
  return (
    BADGE_OPTIONS.find((o) => o.value === value)?.label ??
    NATIONAL_BADGE_OPTIONS.find((o) => o.value === value)?.label ??
    value
  );
}

interface Order {
  id: string;
  customer_phone: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  fulfillment_method: string;
  created_at: string;
  order_items: OrderItem[];
}

const orderStatusLabel: Record<string, { label: string; className: string }> = {
  processing:       { label: "Processing",       className: "bg-amber-100 text-amber-800" },
  ready:            { label: "Ready",            className: "bg-blue-100 text-blue-800" },
  out_for_delivery: { label: "Out for Delivery", className: "bg-purple-100 text-purple-800" },
  completed:        { label: "Completed",        className: "bg-emerald-100 text-emerald-800" },
  cancelled:        { label: "Cancelled",        className: "bg-red-100 text-red-800" },
};

const paymentStatusLabel: Record<string, { label: string; className: string }> = {
  pending:   { label: "Payment Pending", className: "bg-amber-100 text-amber-800" },
  paid:      { label: "Paid",            className: "bg-emerald-100 text-emerald-800" },
  failed:    { label: "Payment Failed",  className: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelled",       className: "bg-slate-100 text-slate-600" },
};

export default function OrdersPage() {
  const [phone, setPhone]       = useState("");
  const [orders, setOrders]     = useState<Order[] | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    setOrders(null);

    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone.trim())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch orders");
      setOrders(json.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const hasResults = orders !== null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Track Your Order</h1>
          <p className="text-sm text-slate-500 mt-1">Enter the phone number you used at checkout</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0712 345 678 or +254712345678"
              className="w-full rounded-xl bg-white border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !phone.trim()}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-sky-600 transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* No results */}
        {hasResults && orders!.length === 0 && !error && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No orders found</p>
            <p className="text-sm text-slate-400 mt-1">
              No orders were found for <span className="font-medium text-slate-600">{phone}</span>.
              Try a different format (e.g. 0712… or +254712…).
            </p>
          </div>
        )}

        {/* Results */}
        {hasResults && orders!.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                {orders!.length} order{orders!.length !== 1 ? "s" : ""} found
              </p>
              <button
                onClick={() => { setOrders(null); setPhone(""); setError(""); }}
                className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Search again
              </button>
            </div>

            <div className="space-y-5">
              {orders!.map((order) => {
                const os = orderStatusLabel[order.order_status] ?? { label: order.order_status, className: "bg-slate-100 text-slate-600" };
                const ps = paymentStatusLabel[order.payment_status] ?? { label: order.payment_status, className: "bg-slate-100 text-slate-600" };

                return (
                  <div key={order.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                    {/* Order header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Order</p>
                        <p className="font-mono font-bold text-slate-900 text-sm tracking-wide">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-KE", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${os.className}`}>
                          {os.label}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${ps.className}`}>
                          {ps.label}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-slate-50 px-5">
                      {order.order_items.map((item) => {
                        const cd = item.customization_data;
                        const size = cd?.size ?? item.product_variants?.size ?? null;
                        const badges = cd?.badges?.length ? cd.badges.map(resolveBadgeLabel) : [];
                        const hasCustomization = item.custom_name || item.custom_number || size ||
                          cd?.edition || cd?.font || cd?.printColor || badges.length > 0;

                        return (
                        <div key={item.id} className="flex items-start gap-3 py-3">
                          {item.products?.image_url ? (
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-none">
                              <Image
                                src={item.products.image_url}
                                alt={item.products.name ?? ""}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-slate-100 flex-none" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {item.products?.name ?? "Product"}
                              </p>
                              <p className="text-sm font-bold text-slate-900 flex-none">
                                KES {Math.round(item.quantity * item.unit_price).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap mt-0.5">
                              {size && (
                                <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold">
                                  Size {size}
                                </span>
                              )}
                              {cd?.edition && (
                                <span className="inline-flex px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium capitalize">
                                  {cd.edition} edition
                                </span>
                              )}
                              <span className="text-xs text-slate-400">Qty: {item.quantity}</span>
                            </div>
                            {hasCustomization && (
                              <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 divide-y divide-slate-100 text-xs">
                                {item.custom_name && (
                                  <div className="flex justify-between px-3 py-1.5">
                                    <span className="text-slate-400">Print Name</span>
                                    <span className="font-bold text-slate-800 tracking-wide">{item.custom_name}</span>
                                  </div>
                                )}
                                {item.custom_number && (
                                  <div className="flex justify-between px-3 py-1.5">
                                    <span className="text-slate-400">Print Number</span>
                                    <span className="font-bold text-slate-800">#{item.custom_number}</span>
                                  </div>
                                )}
                                {cd?.font && (
                                  <div className="flex justify-between px-3 py-1.5">
                                    <span className="text-slate-400">Font</span>
                                    <span className="font-semibold text-slate-700">{cd.font}</span>
                                  </div>
                                )}
                                {cd?.printColor && (
                                  <div className="flex justify-between px-3 py-1.5">
                                    <span className="text-slate-400">Print Color</span>
                                    <span className="font-semibold text-slate-700">{cd.printColor}</span>
                                  </div>
                                )}
                                {badges.map((label) => (
                                  <div key={label} className="flex justify-between px-3 py-1.5">
                                    <span className="text-slate-400">Badge</span>
                                    <span className="font-semibold text-slate-700">{label}</span>
                                  </div>
                                ))}
                                {(cd?.addOnPrice ?? 0) > 0 && (
                                  <div className="flex justify-between px-3 py-1.5 bg-sky-50 rounded-b-lg">
                                    <span className="text-sky-600">Customization add-on</span>
                                    <span className="font-semibold text-sky-700">+KES {Math.round(cd!.addOnPrice!).toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100">
                      <p className="text-xs text-slate-500 capitalize">
                        {order.fulfillment_method === "pickup" ? "Store Pickup" : "Home Delivery"}
                      </p>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Total</p>
                        <p className="text-base font-extrabold text-slate-900">
                          KES {Math.round(order.total_amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Help */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
          Can&apos;t find your order?{" "}
          <Link href="/contact" className="font-semibold text-sky-600 hover:text-sky-700">
            Contact us
          </Link>{" "}
          and we&apos;ll help you track it down.
        </div>
      </div>
    </div>
  );
}
