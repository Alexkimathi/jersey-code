import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, ChevronLeft } from "lucide-react";
import { BADGE_OPTIONS, NATIONAL_BADGE_OPTIONS } from "@/lib/football-customization";

interface Props {
  params: Promise<{ id: string }>;
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

export const dynamic = "force-dynamic";

function resolveBadgeLabel(value: string) {
  return (
    BADGE_OPTIONS.find((o) => o.value === value)?.label ??
    NATIONAL_BADGE_OPTIONS.find((o) => o.value === value)?.label ??
    value
  );
}

async function getOrder(id: string) {
  const supabase = createServiceClient() as any;
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      customer_name,
      customer_phone,
      total_amount,
      order_status,
      payment_status,
      fulfillment_method,
      delivery_address,
      created_at,
      order_items (
        id,
        quantity,
        unit_price,
        custom_name,
        custom_number,
        customization_data,
        products ( name, image_url ),
        product_variants ( size )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function OrderTrackingPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  const os = orderStatusLabel[order.order_status] ?? { label: order.order_status, className: "bg-slate-100 text-slate-600" };
  const ps = paymentStatusLabel[order.payment_status] ?? { label: order.payment_status, className: "bg-slate-100 text-slate-600" };

  // Mask phone: show last 4 digits only e.g. ****5678
  const maskedPhone = order.customer_phone
    ? order.customer_phone.replace(/.(?=.{4})/g, "*")
    : "—";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6">

        {/* Back link */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Track another order
        </Link>

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-slate-400 font-medium mb-1">Order</p>
          <h1 className="font-mono text-2xl font-extrabold text-slate-900 tracking-wide">
            #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Status + customer card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">Status</p>
              <div className="flex gap-2 flex-wrap">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${os.className}`}>
                  {os.label}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${ps.className}`}>
                  {ps.label}
                </span>
              </div>
            </div>
            <Package className="w-8 h-8 text-slate-200" />
          </div>

          <div className="px-5 py-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Customer</p>
              <p className="font-semibold text-slate-800">{order.customer_name || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Phone</p>
              <p className="font-semibold text-slate-800">{maskedPhone}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Fulfillment</p>
              <p className="font-semibold text-slate-800 capitalize">
                {order.fulfillment_method === "pickup" ? "Store Pickup" : "Home Delivery"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Total</p>
              <p className="font-extrabold text-slate-900">KES {order.total_amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
              Items ({order.order_items.length})
            </p>
          </div>
          <div className="divide-y divide-slate-50 px-5">
            {order.order_items.map((item: any) => {
              const cd = item.customization_data;
              const size = cd?.size ?? item.product_variants?.size ?? null;
              const badges: string[] = cd?.badges?.length ? cd.badges.map(resolveBadgeLabel) : [];
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
                      KES {(item.quantity * item.unit_price).toLocaleString()}
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
                      {cd?.addOnPrice > 0 && (
                        <div className="flex justify-between px-3 py-1.5 bg-sky-50 rounded-b-lg">
                          <span className="text-sky-600">Customization add-on</span>
                          <span className="font-semibold text-sky-700">+KES {cd.addOnPrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-between text-sm">
            <span className="font-medium text-slate-500">Order Total</span>
            <span className="font-extrabold text-slate-900">KES {order.total_amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Help */}
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
          Need help with this order?{" "}
          <Link href="/contact" className="font-semibold text-sky-600 hover:text-sky-700">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
