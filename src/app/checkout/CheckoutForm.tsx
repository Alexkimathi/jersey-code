"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/hooks/useCartStore";
import { BADGE_OPTIONS, NATIONAL_BADGE_OPTIONS } from "@/lib/football-customization";
import { Button } from "@/components/ui/Button";
import {
  FulfillmentMethod,
  CheckoutFormData,
} from "@/lib/supabase/types";
import {
  Truck,
  MapPin,
  X,
  Lock,
  RefreshCw,
  Info,
  Building2,
  CheckCircle2,
  ArrowRight,
  Smartphone,
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

export function CheckoutForm() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ id: string; total: number } | null>(null);
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
    paymentMethod: "till",
    deliveryAddress: null,
  });

  const finalTotal = getTotal();

  const showAddressBook =
    formData.fulfillmentMethod === "delivery" &&
    formData.customerPhone.replace(/\D/g, "").length >= 10;

  const handleFulfillmentChange = (method: FulfillmentMethod) => {
    setFormData({ ...formData, fulfillmentMethod: method, deliveryAddress: null });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, items, total: finalTotal }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order");
      }

      checkoutSuccess.current = true;
      clearCart();
      setCompletedOrder({ id: result.orderId, total: finalTotal });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || (items.length === 0 && !completedOrder)) return null;

  return (
    <>
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

          {/* Step 2 — Payment Method */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex-none">2</span>
              <h2 className="text-base font-bold text-slate-900">Payment Method</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  value: "mpesa" as const,
                  label: "M-Pesa STK Push",
                  sub: "Get a payment prompt on your phone",
                  icon: <Smartphone className="w-5 h-5" />,
                },
                {
                  value: "till" as const,
                  label: "Pay via Till Manually",
                  sub: "Buy Goods till 8951054",
                  icon: <Building2 className="w-5 h-5" />,
                },
              ].map((opt) => {
                const active = formData.paymentMethod === opt.value;
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
                      name="paymentMethod"
                      value={opt.value}
                      checked={active}
                      onChange={() => setFormData({ ...formData, paymentMethod: opt.value })}
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
          </div>

          {/* Step 3 — Fulfillment */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex-none">3</span>
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

                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
                  <Info className="w-4 h-4 text-amber-500 flex-none mt-0.5" />
                  <div className="text-sm text-amber-800 leading-relaxed">
                    <p className="font-semibold mb-1">Heads up about delivery fees</p>
                    <p className="text-amber-700">
                      Deliveries within <span className="font-medium">Nairobi CBD</span> are handled directly by our team at no extra charge. If your location is <span className="font-medium">outside Nairobi CBD</span>, a delivery fee will apply — your order will be shipped via your preferred courier service. Our delivery team will reach out to you to confirm details.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right column — Order summary ── */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-5">Order Summary</h2>

            <div className="space-y-4 mb-5 max-h-64 overflow-y-auto pr-1 no-scrollbar">
              {items.map((item) => {
                const key = item.cartKey ?? item.variantId;
                const c = item.customization;
                return (
                  <div key={key} className="space-y-1">
                    {/* Base jersey line */}
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 leading-tight truncate">{item.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Size {item.size}{" · "}×{item.quantity}
                        </p>
                        {(c?.badges ?? (c?.badge && c.badge !== "none" ? [c.badge] : [])).map((b: string) => (
                          <p key={b} className="text-xs text-slate-400">
                            {(BADGE_OPTIONS.find((o) => o.value === b) ?? NATIONAL_BADGE_OPTIONS.find((o) => o.value === b))?.label ?? b}
                          </p>
                        ))}
                      </div>
                      <p className="text-sm font-bold text-slate-900 whitespace-nowrap">
                        KES {Math.round(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    {/* Customization add-on line */}
                    {c && (c.printName || c.printNumber) && (c.addOnPrice ?? 0) > 0 && (
                      <div className="flex gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-sky-600">
                            Name &amp; Number —{" "}
                            {[c.printName, c.printNumber && `#${c.printNumber}`].filter(Boolean).join(" ")}
                            {c.font && ` · ${c.font}`}
                          </p>
                        </div>
                        <p className="text-xs font-semibold text-sky-600 whitespace-nowrap">
                          +KES {Math.round((c.addOnPrice ?? 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>KES {Math.round(finalTotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>KES {Math.round(finalTotal).toLocaleString()}</span>
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
                  Proceed to Checkout — KES {Math.round(finalTotal).toLocaleString()}
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
              Call or WhatsApp <span className="font-medium text-slate-700">+254 743 616 717</span> or email{" "}
              <span className="font-medium text-slate-700">jersey.code.ke@gmail.com</span>
            </p>
          </div>
        </aside>
      </form>

      {/* ── Payment dialog (shown after order is created) ── */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 px-6 py-5 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 border border-green-500/25 mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400 mb-1">Order Placed</p>
              <p className="text-white font-bold text-lg">
                {formData.paymentMethod === "mpesa" ? "Check your phone" : "Now complete your payment"}
              </p>
              <p className="text-slate-400 text-xs mt-1 font-mono">#{completedOrder.id.slice(0, 8).toUpperCase()}</p>
            </div>

            {/* Instructions */}
            <div className="px-6 py-5 space-y-4">
              {formData.paymentMethod === "mpesa" ? (
                <>
                  <div className="flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 px-4 py-3">
                    <Smartphone className="w-5 h-5 text-green-700 flex-none" />
                    <div>
                      <p className="text-sm font-bold text-green-900">M-Pesa prompt sent!</p>
                      <p className="text-xs text-green-600 mt-0.5">Enter your PIN on your phone to pay</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-slate-500">Amount</p>
                      <p className="text-lg font-extrabold text-slate-900">KES {Math.round(completedOrder.total).toLocaleString()}</p>
                    </div>
                  </div>
                  <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>An M-Pesa payment request was sent to <span className="font-semibold text-slate-800">{formData.customerPhone}</span></li>
                    <li>A pop-up will appear on your phone — enter your <span className="font-semibold text-slate-800">M-Pesa PIN</span> to confirm</li>
                    <li>You will receive an SMS confirming your payment</li>
                  </ol>
                  <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">
                    Didn&apos;t get a prompt? The request may take a few seconds. Keep your M-Pesa confirmation SMS as proof of payment.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 px-4 py-3">
                    <Building2 className="w-5 h-5 text-green-700 flex-none" />
                    <div>
                      <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Buy Goods Till</p>
                      <p className="text-2xl font-extrabold text-green-900 tracking-widest">8951054</p>
                      <p className="text-xs text-green-600">JERSEY CODE</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-slate-500">Amount</p>
                      <p className="text-lg font-extrabold text-slate-900">KES {Math.round(completedOrder.total).toLocaleString()}</p>
                    </div>
                  </div>
                  <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Open <span className="font-semibold text-slate-800">M-Pesa</span> on your phone</li>
                    <li>Select <span className="font-semibold text-slate-800">Lipa na M-Pesa</span></li>
                    <li>Select <span className="font-semibold text-slate-800">Buy Goods and Services</span></li>
                    <li>Enter till <span className="font-extrabold text-slate-900">8951054</span></li>
                    <li>Enter amount <span className="font-extrabold text-slate-900">KES {Math.round(completedOrder.total).toLocaleString()}</span></li>
                    <li>Enter your M-Pesa PIN and confirm</li>
                  </ol>
                  <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">
                    Keep your M-Pesa confirmation SMS — you may be asked to show it when collecting your order.
                  </p>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => router.push(`/order-confirmation/${completedOrder.id}`)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-sky-600 transition-colors"
              >
                View My Order <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
