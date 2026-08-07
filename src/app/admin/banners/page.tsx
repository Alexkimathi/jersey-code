import { createServerClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Banner } from "@/lib/supabase/types";
import Link from "next/link";
import { Plus, Edit, Video, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

async function getBanners(): Promise<Banner[]> {
  const supabase = createServerClient();
  const { data, error } = await (supabase as any)
    .from("banners")
    .select("*")
    .neq("position", "background")
    .neq("position", "marquee")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }

  return (data ?? []) as Banner[];
}

async function getMarqueeCount(): Promise<number> {
  const supabase = createServerClient();
  const { count } = await (supabase as any)
    .from("banners")
    .select("id", { count: "exact", head: true })
    .eq("position", "marquee");
  return count ?? 0;
}

async function getBackgroundVideo(): Promise<string | null> {
  const supabase = createServerClient();
  const { data } = await (supabase as any)
    .from("banners")
    .select("video_url")
    .eq("position", "background")
    .single();
  return data?.video_url ?? null;
}

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const [banners, backgroundVideoUrl, marqueeCount] = await Promise.all([
    getBanners(),
    getBackgroundVideo(),
    getMarqueeCount(),
  ]);

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">

        {/* Background Video */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Background Video</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-none">
                <Video className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                {backgroundVideoUrl ? (
                  <>
                    <p className="text-sm font-medium text-gray-900">Video set</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{backgroundVideoUrl}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-500">No background video</p>
                    <p className="text-xs text-gray-400">The hero section will show a dark background.</p>
                  </>
                )}
              </div>
            </div>
            <Link href="/admin/banners/background-video">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1.5" />
                {backgroundVideoUrl ? "Change Video" : "Add Video"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Marquee Text */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Marquee Text</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-none">
                <MessageSquare className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {marqueeCount > 0 ? `${marqueeCount} item${marqueeCount !== 1 ? "s" : ""}` : "No items yet"}
                </p>
                <p className="text-xs text-gray-400">Scrolling text shown below the hero banner.</p>
              </div>
            </div>
            <Link href="/admin/banners/marquee">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1.5" />
                Manage
              </Button>
            </Link>
          </div>
        </div>

        {/* Banner Slides */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Banner Slides</h2>
            <Link href="/admin/banners/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Each banner displays as a text slide over the background video.
          </p>

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
                      <p className="font-medium text-gray-900">{banner.title}</p>
                      {banner.subtitle && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">{banner.subtitle}</p>
                      )}
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
                      No banners yet. Add one to display text over the background video.
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
