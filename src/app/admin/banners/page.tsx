import { createServerClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Banner } from "@/lib/supabase/types";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/Button";

async function getBanners(): Promise<Banner[]> {
  const supabase = createServerClient();
  const { data, error } = await (supabase as any)
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }

  return (data ?? []) as Banner[];
}

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await getBanners();

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <Link href="/admin/banners/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {banner.image_url && (
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="w-14 h-9 object-cover rounded-md border border-gray-200 flex-none"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{banner.title}</p>
                        {banner.subtitle && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">{banner.subtitle}</p>
                        )}
                        {banner.link_url && (
                          <p className="text-xs text-blue-500 truncate max-w-xs">{banner.link_url}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                    {banner.position}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {banner.sort_order}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {banner.starts_at || banner.ends_at ? (
                      <span>
                        {banner.starts_at
                          ? new Date(banner.starts_at).toLocaleDateString()
                          : "—"}{" "}
                        →{" "}
                        {banner.ends_at
                          ? new Date(banner.ends_at).toLocaleDateString()
                          : "∞"}
                      </span>
                    ) : (
                      <span className="text-gray-400">Always</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        banner.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {banner.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/banners/${banner.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No banners yet. Create your first banner to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
