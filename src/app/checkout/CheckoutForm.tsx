"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/hooks/useCartStore";
import { BADGE_OPTIONS, NATIONAL_BADGE_OPTIONS } from "@/lib/football-customization";
import { Button } from "@/components/ui/Button";
import {
  FulfillmentMethod,
  PaymentMethod,
  CheckoutFormData,
} from "@/lib/supabase/types";
import {
  Truck,
  MapPin,
  Smartphone,
  X,
  Lock,
  RefreshCw,
} from "lucide-react";

import CustomerAddressBook from "@/components/storefront/CustomerAddressBook";

const inputClass =
  "w-full rounded-xl bg-slate-100 border-0 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-shadow";

const fulfillmentOptions = [
  {
    value: "delivery" as FulfillmentMethod,
    label: "Home Delivery",
    sub: "1–3 business days across Kenya",
    icon: <Truck className="w-5 h-5" />,
  },
  {
    value: "pickup" as FulfillmentMethod,
    label: "Store Pickup",
    sub: "Ready next business day",
    icon: <MapPin className="w-5 h-5" />,
  },
];

const paymentOptions = [
  {
    value: "mpesa" as PaymentMethod,
    label: "M-Pesa",
    sub: "STK push sent to your phone — instant",
    icon: <Smartphone className="w-5 h-5" />,
    badge: "Popular",
  },
];

export function CheckoutForm() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const checkoutSuccess = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && items.length === 0 && !checkoutSuccess.current) router.push("/cart");
  }, [mounted, items.length, router]);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    fulfillmentMethod: "delivery",
    paymentMethod: "mpesa",
    deliveryAddress: null,
  });

  const finalTotal = getTotal();

  // Show address book once the phone number looks complete (10+ digits)
  const showAddressBook =
    formData.fulfillmentMethod === "delivery" &&
    formData.customerPhone.replace(/\D/g, "").length >= 10;

  const handleFulfillmentChange = (method: FulfillmentMethod) => {
    setFormData({ ...formData, fulfillmentMethod: method, deliveryAddress: null });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
          total: finalTotal,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order");
      }

      checkoutSuccess.current = true;
      clearCart();
      router.push(`/order-confirmation/${result.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || items.length === 0) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]"
    >
      {/* ── Left column ── */}
      <div className="space-y-5">
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            <X className="w-4 h-4 mt-0.5 flex-none" />
            {error}
          </div>
        )}

        {/* Step 1 — Contact */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex-none">1</span>
            <h2 className="text-base font-bold text-slate-900">Contact Information</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Full Name <span className="text-sky-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Your full name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Phone Number <span className="text-sky-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="254700000000"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Email <span className="text-slate-400 font-normal">(optional — for order updates)</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Step 2 — Fulfillment */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex-none">2</span>
            <h2 className="text-base font-bold text-slate-900">Fulfillment Method</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {fulfillmentOptions.map((opt) => {
              const active = formData.fulfillmentMethod === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`cursor-pointer flex items-start gap-3.5 rounded-2xl border p-4 transition ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfillmentMethod"
                    value={opt.value}
                    checked={active}
                    onChange={(e) => handleFulfillmentChange(e.target.value as FulfillmentMethod)}
                    className="sr-only"
                  />
                  <span className={`mt-0.5 flex-none ${active ? "text-sky-400" : "text-slate-400"}`}>
                    {opt.icon}
                  </span>
                  <div>
                    <p className="text-sm font-bold leading-tight">{opt.label}</p>
                    <p className={`text-xs mt-0.5 ${active ? "text-slate-300" : "text-slate-400"}`}>{opt.sub}</p>
                  </div>
                </label>
              );
            })}
          </div>

          {formData.fulfillmentMethod === "delivery" && (
            <div className="mt-5 space-y-4">
              {/* Saved address book — visible once phone number is complete */}
              {showAddressBook && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <CustomerAddressBook
                    customerId={formData.customerPhone}
                    onSelectAddress={(addr) =>
                      setFormData({
                        ...formData,
                        deliveryAddress: {
                          street: addr.street_address,
                          city: addr.city,
                          area: addr.postal_code ?? "",
                        },
                      })
                    }
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  Street Address <span className="text-sky-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12 Kenyatta Ave"
                  value={formData.deliveryAddress?.street || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryAddress: {
                        street: e.target.value,
                        city: formData.deliveryAddress?.city || "",
                        area: formData.deliveryAddress?.area || "",
                      },
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">
                    City <span className="text-sky-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nairobi"
                    value={formData.deliveryAddress?.city || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryAddress: {
                          street: formData.deliveryAddress?.street || "",
                          city: e.target.value,
                          area: formData.deliveryAddress?.area || "",
                        },
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">
                    Area <span className="text-sky-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Westlands"
                    value={formData.deliveryAddress?.area || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryAddress: {
                          street: formData.deliveryAddress?.street || "",
                          city: formData.deliveryAddress?.city || "",
                          area: e.target.value,
                        },
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 3 — Payment */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex-none">3</span>
            <h2 className="text-base font-bold text-slate-900">Payment Method</h2>
          </div>

          <div className="space-y-3">
            {paymentOptions.map((opt) => {
              const active = formData.paymentMethod === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`cursor-pointer flex items-center gap-4 rounded-2xl border p-4 transition ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={active}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })
                    }
                    className="sr-only"
                  />
                  <span className={`flex-none ${active ? "text-sky-400" : "text-slate-400"}`}>
                    {opt.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight">{opt.label}</p>
                    <p className={`text-xs mt-0.5 ${active ? "text-slate-300" : "text-slate-400"}`}>{opt.sub}</p>
                  </div>
                  {opt.badge && (
                    <span className={`flex-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      active ? "bg-sky-500 text-white" : "bg-sky-100 text-sky-600"
                    }`}>
                      {opt.badge}
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {formData.paymentMethod === "mpesa" && (
            <p className="mt-4 text-xs text-slate-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              An STK push will be sent to your phone number when you place the order.
            </p>
          )}
        </div>
      </div>

      {/* ── Right column — Order summary ── */}
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-5">Order Summary</h2>

          {/* Items */}
          <div className="space-y-4 mb-5 max-h-64 overflow-y-auto pr-1 no-scrollbar">
            {items.map((item) => {
              const key = item.cartKey ?? item.variantId;
              const unitPrice = item.price + (item.customization?.addOnPrice ?? 0);
              const c = item.customization;
              return (
                <div key={key} className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 leading-tight truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Size {item.size}
                      {" · "}×{item.quantity}
                    </p>
                    {c && (c.printName || c.printNumber) && (
                      <p className="text-xs text-sky-500 mt-0.5">
                        {[c.printName, c.printNumber && `#${c.printNumber}`].filter(Boolean).join(" ")}
                        {c.font && ` · ${c.font}`}
                      </p>
                    )}
                    {(c?.badges ?? (c?.badge && c.badge !== "none" ? [c.badge] : [])).map((b: string) => (
                      <p key={b} className="text-xs text-slate-400">
                        {(BADGE_OPTIONS.find((o) => o.value === b) ?? NATIONAL_BADGE_OPTIONS.find((o) => o.value === b))?.label ?? b}
                      </p>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-slate-900 whitespace-nowrap">
                    KES {(unitPrice * item.quantity).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>KES {finalTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
              <span>Total</span>
              <span>KES {finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-5 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing…</>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Place Order — KES {finalTotal.toLocaleString()}
              </>
            )}
          </Button>

          <p className="mt-3 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            Secured with 256-bit encryption
          </p>

        </div>

        {/* Help */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <p className="text-sm font-bold text-slate-800 mb-1">Need help?</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Call or WhatsApp <span className="font-medium text-slate-700">+254 700 000 000</span> or email{" "}
            <span className="font-medium text-slate-700">support@jerseystore.co.ke</span>
          </p>
        </div>
      </aside>
    </form>
  );
}
