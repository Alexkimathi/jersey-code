"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useSupabase } from "@/app/providers";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Link from "next/link";
import { ChevronLeft, Loader2, Tag, Shirt, Palette } from "lucide-react";
import { BADGE_OPTIONS, NATIONAL_BADGE_OPTIONS } from "@/lib/football-customization";
import { Button } from "@/components/ui/Button";

const ORDER_STATUS_OPTIONS = [
  { value: "processing", label: "Processing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

const ORDER_STATUS_CLASSES: Record<string, string> = {
  processing: "bg-yellow-100 text-yellow-800",
  ready: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const PAYMENT_STATUS_CLASSES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

interface CustomizationData {
  edition?: string | null;
  font?: string | null;
  printColor?: string | null;
  badges?: string[];
  addOnPrice?: number;
  size?: string | null;
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  custom_name: string | null;
  custom_number: string | null;
  customization_data?: CustomizationData | null;
  products: { name: string; image_url: string | null } | null;
  product_variants: { size: string } | null;
}

interface OrderDetail {
  id: string;
  customer_name: string | null;
  customer_phone: string;
  customer_email: string | null;
  fulfillment_method: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total_amount: number;
  delivery_address: { street?: string; city?: string; area?: string } | null;
  created_at: string;
  order_items: OrderItem[];
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { supabase } = useSupabase();
  const { adminUser } = useAdminAuth();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`/api/admin/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });
        if (!res.ok) {
          const result = await res.json();
          setError(result.error || "Failed to load order.");
        } else {
          const data = await res.json();
          setOrder(data as OrderDetail);
          setOrderStatus(data.order_status);
          setPaymentStatus(data.payment_status);
        }
      } catch {
        setError("Failed to load order.");
      }
      setLoading(false);
    }

    if (orderId) fetchOrder();
  }, [supabase, orderId]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ order_status: orderStatus, payment_status: paymentStatus }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to update order.");
      } else {
        setSuccess("Order updated successfully.");
        setOrder((prev) =>
          prev ? { ...prev, order_status: orderStatus, payment_status: paymentStatus } : prev
        );
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-64">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-8">
          <p className="text-red-600">{error || "Order not found."}</p>
          <Link href="/admin/orders" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            ← Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const isSuperAdmin = adminUser?.role === "super_admin";

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link
            href="/admin/orders"
            className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Orders</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
        </div>

        {/* Current status badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              ORDER_STATUS_CLASSES[order.order_status] ?? "bg-gray-100 text-gray-800"
            }`}
          >
            {order.order_status.replace(/_/g, " ").toUpperCase()}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              PAYMENT_STATUS_CLASSES[order.payment_status] ?? "bg-gray-100 text-gray-800"
            }`}
          >
            Payment: {order.payment_status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Customer
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium text-gray-900">{order.customer_name || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-medium text-gray-900">{order.customer_phone}</dd>
              </div>
              {order.customer_email && (
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-900">{order.customer_email}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Order Details
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Fulfillment</dt>
                <dd className="font-medium text-gray-900 capitalize">
                  {order.fulfillment_method.replace("_", " ")}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Payment Method</dt>
                <dd className="font-medium text-gray-900 capitalize">
                  {order.payment_method.replace(/_/g, " ")}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Placed On</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(order.created_at).toLocaleString("en-KE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Delivery Address */}
        {order.delivery_address && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Delivery Address
            </h2>
            <p className="text-sm text-gray-900">
              {[
                order.delivery_address.street,
                order.delivery_address.area,
                order.delivery_address.city,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Items
          </h2>
          <div className="divide-y divide-gray-100">
            {order.order_items.map((item) => {
              const cd = item.customization_data;
              const size = cd?.size ?? item.product_variants?.size ?? null;
              const badges = cd?.badges?.length
                ? cd.badges.map(
                    (b) =>
                      (BADGE_OPTIONS.find((o) => o.value === b) ??
                       NATIONAL_BADGE_OPTIONS.find((o) => o.value === b))?.label ?? b
                  )
                : [];
              const hasCustomization =
                item.custom_name || item.custom_number || badges.length > 0 || cd?.font || cd?.edition;

              return (
                <div key={item.id} className="py-4 flex gap-4">
                  {item.products?.image_url && (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        {item.products?.name ?? "Deleted product"}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                        KES {(item.quantity * item.unit_price).toLocaleString()}
                      </p>
                    </div>

                    {/* Size + qty + price */}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {size && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                          <Shirt className="w-3 h-3" /> Size {size}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        Qty: {item.quantity} × KES {item.unit_price.toLocaleString()}
                      </span>
                      {cd?.edition && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium capitalize">
                          {cd.edition} edition
                        </span>
                      )}
                    </div>

                    {/* Customization details */}
                    {hasCustomization && (
                      <div className="mt-2 rounded-lg border border-gray-100 bg-gray-50 divide-y divide-gray-100 text-xs">
                        {item.custom_name && (
                          <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-gray-500">Print Name</span>
                            <span className="font-semibold text-gray-800 tracking-wide">{item.custom_name}</span>
                          </div>
                        )}
                        {item.custom_number && (
                          <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-gray-500">Print Number</span>
                            <span className="font-semibold text-gray-800">#{item.custom_number}</span>
                          </div>
                        )}
                        {cd?.font && (
                          <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-gray-500 flex items-center gap-1"><Palette className="w-3 h-3" />Font</span>
                            <span className="font-semibold text-gray-800">{cd.font}</span>
                          </div>
                        )}
                        {cd?.printColor && (
                          <div className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-gray-500">Print Color</span>
                            <span className="font-semibold text-gray-800">{cd.printColor}</span>
                          </div>
                        )}
                        {badges.map((label) => (
                          <div key={label} className="flex items-center justify-between px-3 py-1.5">
                            <span className="text-gray-500 flex items-center gap-1"><Tag className="w-3 h-3" />Badge</span>
                            <span className="font-semibold text-gray-800">{label}</span>
                          </div>
                        ))}
                        {cd?.addOnPrice != null && cd.addOnPrice > 0 && (
                          <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50 rounded-b-lg">
                            <span className="text-blue-600">Customization add-on</span>
                            <span className="font-semibold text-blue-700">+KES {cd.addOnPrice.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-100 mt-2">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900">
                KES {order.total_amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Update Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Update Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Order Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Payment Status
                {!isSuperAdmin && (
                  <span className="ml-1 text-gray-400 font-normal">(Super Admin only)</span>
                )}
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                disabled={!isSuperAdmin}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {PAYMENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {success}
            </div>
          )}

          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
