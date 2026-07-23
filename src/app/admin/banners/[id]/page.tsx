"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const POSITION_OPTIONS = ["hero", "sidebar", "mid-page", "footer"];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BannerForm({ params }: PageProps) {
  const router = useRouter();
  const { adminUser, isLoading } = useAdminAuth();
  const [bannerId, setBannerId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => {
      if (p.id === "new") {
        setIsNew(true);
      } else {
        setBannerId(p.id);
      }
    });
  }, [params]);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    video_url: "",
    link_url: "",
    position: "hero",
    sort_order: 0,
    is_active: true,
    starts_at: "",
    ends_at: "",
  });

  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "fake-key"
      ),
    []
  );

  useEffect(() => {
    if (!bannerId) return;

    async function loadBanner() {
      const { data } = await (supabase as any)
        .from("banners")
        .select("*")
        .eq("id", bannerId)
        .single();

      if (data) {
        setFormData({
          title: data.title,
          subtitle: data.subtitle ?? "",
          image_url: data.image_url ?? "",
          video_url: data.video_url ?? "",
          link_url: data.link_url ?? "",
          position: data.position,
          sort_order: data.sort_order,
          is_active: data.is_active,
          starts_at: data.starts_at ? data.starts_at.slice(0, 16) : "",
          ends_at: data.ends_at ? data.ends_at.slice(0, 16) : "",
        });
      }
    }

    loadBanner();
  }, [bannerId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!formData.image_url.trim()) {
      setError("Image URL is required.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      subtitle: formData.subtitle || null,
      video_url: formData.video_url || null,
      link_url: formData.link_url || null,
      starts_at: formData.starts_at || null,
      ends_at: formData.ends_at || null,
    };

    if (isNew) {
      const { error: insertError } = await (supabase as any)
        .from("banners")
        .insert(payload);

      if (insertError) {
        setError(insertError.message);
        setIsSubmitting(false);
        return;
      }
    } else {
      const { error: updateError } = await (supabase as any)
        .from("banners")
        .update(payload)
        .eq("id", bannerId);

      if (updateError) {
        setError(updateError.message);
        setIsSubmitting(false);
        return;
      }
    }

    router.push("/admin/banners");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!bannerId || !confirm("Delete this banner? This cannot be undone.")) return;
    setIsDeleting(true);

    const { error: deleteError } = await (supabase as any)
      .from("banners")
      .delete()
      .eq("id", bannerId);

    if (deleteError) {
      setError(deleteError.message);
      setIsDeleting(false);
      return;
    }

    router.push("/admin/banners");
    router.refresh();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">Loading...</div>
      </AdminLayout>
    );
  }

  if (!adminUser) {
    return (
      <AdminLayout>
        <div className="p-8 text-red-600">Access denied.</div>
      </AdminLayout>
    );
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm";

  return (
    <AdminLayout>
      <div className="max-w-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? "New Banner" : "Edit Banner"}
          </h1>
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Delete banner"}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className={inputClass}
              placeholder="https://..."
            />
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="Preview"
                className="mt-2 h-32 w-full object-cover rounded-lg border border-gray-200"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className={inputClass}
              >
                {POSITION_OPTIONS.map((p) => (
                  <option key={p} value={p} className="capitalize">
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="datetime-local"
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="datetime-local"
                value={formData.ends_at}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isNew ? "Create Banner" : "Update Banner"}
            </Button>
            <Link href="/admin/banners">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
