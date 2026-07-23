import { createServerClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

async function getStats() {
  const supabase = createServerClient();

  const [
    productsResult,
    ordersResult,
    ordersDataResult,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount, payment_status"),
  ]);

  const productsCount = productsResult.count || 0;
  const ordersCount = ordersResult.count || 0;
  const orders = (ordersDataResult.data || []) as { total_amount: number; payment_status: string }[];

  const totalRevenue = orders.reduce(
    (sum, order) => (order.payment_status === "paid" ? sum + order.total_amount : sum),
    0
  );

  const pendingOrders = orders.filter((o) => o.payment_status === "pending").length;

  return {
    productsCount,
    ordersCount,
    totalRevenue,
    pendingOrders,
  };
}

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    {
      title: "Total Products",
      value: stats.productsCount,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: stats.ordersCount,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Revenue",
      value: `KES ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
