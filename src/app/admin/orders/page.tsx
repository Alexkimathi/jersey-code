import { createServiceClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Order } from "@/lib/supabase/types";
import Link from "next/link";

const ORDER_STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  processing: { label: "Processing", classes: "bg-yellow-100 text-yellow-800" },
  ready: { label: "Ready", classes: "bg-blue-100 text-blue-800" },
  out_for_delivery: { label: "Out for Delivery", classes: "bg-purple-100 text-purple-800" },
  completed: { label: "Completed", classes: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", classes: "bg-red-100 text-red-800" },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Paid", classes: "bg-green-100 text-green-800" },
  failed: { label: "Failed", classes: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelled", classes: "bg-gray-100 text-gray-800" },
};

const STATUS_FILTERS = [
  { value: undefined, label: "All Orders" },
  { value: "processing", label: "Processing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

async function getOrders(orderStatus?: string) {
  const supabase = createServiceClient();
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (orderStatus) {
    query = query.eq("order_status", orderStatus);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return (data || []) as Order[];
}

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = searchParams.status;
  const orders = await getOrders(statusFilter);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <span className="text-sm text-gray-500">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_FILTERS.map(({ value, label }) => (
            <Link
              key={value ?? "all"}
              href={value ? `/admin/orders?status=${value}` : "/admin/orders"}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === value
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fulfillment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => {
                  const payStatus = PAYMENT_STATUS_CONFIG[order.payment_status];
                  const ordStatus = ORDER_STATUS_CONFIG[order.order_status];
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono text-sm text-blue-600 hover:underline"
                        >
                          #{order.id.slice(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer_name || "—"}
                        </div>
                        <div className="text-xs text-gray-500">{order.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        KES {order.total_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payStatus?.classes ?? "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {payStatus?.label ?? order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ordStatus?.classes ?? "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {ordStatus?.label ?? order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                        {order.fulfillment_method.replace("_", " ")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
