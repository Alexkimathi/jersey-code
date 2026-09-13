"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useSupabase } from "@/app/providers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BannerForm({ params }: PageProps) {
  const router = useRouter();
  const { adminUser, isLoading } = useAdminAuth();
  const { supabase } = useSupabase();
  const [bannerId, setBannerId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Video upload state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    video_url: "",
    sort_order: 0,
    is_active: true,
    starts_at: "",
    ends_at: "",
  });

  useEffect(() => {
    params.then((p) => {
      if (p.id === "new") setIsNew(true);
      else setBannerId(p.id);
    });
  }, [params]);

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
          title: data.title ?? "",
          subtitle: data.subtitle ?? "",
          image_url: data.image_url ?? "",
          video_url: data.video_url ?? "",
          sort_order: data.sort_order ?? 0,
          is_active: data.is_active ?? true,
          starts_at: data.starts_at ? data.starts_at.slice(0, 16) : "",
          ends_at: data.ends_at ? data.ends_at.slice(0, 16) : "",
        });
        setImagePreview(data.image_url ?? "");
        setVideoPreview(data.video_url ?? "");
      }
    }
    loadBanner();
  }, [bannerId, supabase]);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  const handleUploadImage = async () => {
    if (!imageFile) return formData.image_url;
    const token = await getToken();
    if (!token) { setError("Not authenticated."); return formData.image_url; }

    setUploadingImage(true);
    const form = new FormData();
    form.append("file", imageFile);
    try {
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Image upload failed");
      return json.url as string;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUploadVideo = async () => {
    if (!videoFile) return formData.video_url;
    const token = await getToken();
    if (!token) { setError("Not authenticated."); return formData.video_url; }

    setUploadingVideo(true);
    setVideoProgress(0);
    const ext = videoFile.name.split(".").pop()?.toLowerCase() ?? "mp4";
    try {
      const blob = await upload(`banners/banner-${Date.now()}.${ext}`, videoFile, {
        access: "public",
        handleUploadUrl: "/api/admin/video-upload-token",
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: ({ percentage }) => setVideoProgress(Math.round(percentage)),
      });
      return blob.url;
    } finally {
      setUploadingVideo(false);
      setVideoProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.title.trim()) { setError("Title is required."); return; }

    setIsSubmitting(true);
    try {
      const [imageUrl, videoUrl] = await Promise.all([
        handleUploadImage(),
        handleUploadVideo(),
      ]);

      const payload = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        image_url: imageUrl || "",
        video_url: videoUrl || null,
        position: "hero",
        sort_order: formData.sort_order,
        is_active: formData.is_active,
        starts_at: formData.starts_at || null,
        ends_at: formData.ends_at || null,
      };

      if (isNew) {
        const { error: insertError } = await (supabase as any).from("banners").insert(payload);
        if (insertError) throw new Error(insertError.message);
      } else {
        const { error: updateError } = await (supabase as any)
          .from("banners").update(payload).eq("id", bannerId);
        if (updateError) throw new Error(updateError.message);
      }

      router.push("/admin/banners");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!bannerId || !confirm("Delete this banner?")) return;
    setIsDeleting(true);
    const { error: deleteError } = await (supabase as any)
      .from("banners").delete().eq("id", bannerId);
    if (deleteError) { setError(deleteError.message); setIsDeleting(false); return; }
    router.push("/admin/banners");
    router.refresh();
  };

  if (isLoading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  if (!adminUser) return <AdminLayout><div className="p-8 text-red-600">Access denied.</div></AdminLayout>;

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm";
  const busy = isSubmitting || uploadingImage || uploadingVideo;

  return (
    <AdminLayout>
      <div className="max-w-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? "New Banner" : "Edit Banner"}
          </h1>
          {!isNew && (
            <button type="button" onClick={handleDelete} disabled={isDeleting}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50">
              {isDeleting ? "Deleting…" : "Delete banner"}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input type="text" required value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputClass} placeholder="e.g. New Season Jerseys" />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input type="text" value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className={inputClass} placeholder="e.g. Shop the latest arrivals" />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
            {(imagePreview || formData.image_url) && (
              <img src={imagePreview || formData.image_url} alt="Banner"
                className="w-full h-40 object-cover rounded-lg mb-2 bg-gray-100" />
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setImageFile(f);
                if (f) setImagePreview(URL.createObjectURL(f));
              }}
              className="block w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-slate-100 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
            {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading image...</p>}
            <p className="text-xs text-gray-400 mt-1">Or paste a URL below</p>
            <input type="url" value={formData.image_url}
              onChange={(e) => { setFormData({ ...formData, image_url: e.target.value }); setImagePreview(e.target.value); }}
              className={inputClass + " mt-1"} placeholder="https://..." />
          </div>

          {/* Video upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Video</label>
            {(videoPreview || formData.video_url) && (
              <video key={videoPreview || formData.video_url}
                src={videoPreview || formData.video_url}
                className="w-full h-40 object-cover rounded-lg mb-2 bg-black"
                muted loop autoPlay playsInline />
            )}
            <input type="file" accept="video/mp4,video/webm,video/mov,video/ogg"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setVideoFile(f);
                if (f) setVideoPreview(URL.createObjectURL(f));
              }}
              className="block w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-slate-100 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
            {uploadingVideo && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs text-blue-600 font-medium">
                  <span>Uploading video...</span><span>{videoProgress}%</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-150"
                    style={{ width: `${videoProgress}%` }} />
                </div>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">Or paste a URL below</p>
            <input type="url" value={formData.video_url}
              onChange={(e) => { setFormData({ ...formData, video_url: e.target.value }); setVideoPreview(e.target.value); }}
              className={inputClass + " mt-1"} placeholder="https://..." />
          </div>

          {/* Sort order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input type="number" min="0" value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })}
              className={inputClass} />
            <p className="text-xs text-gray-400 mt-1">Lower numbers appear first.</p>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input type="datetime-local" value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input type="datetime-local" value={formData.ends_at}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                className={inputClass} />
            </div>
          </div>

          {/* Active */}
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={busy}>
              {uploadingImage ? "Uploading image…" : uploadingVideo ? `Uploading video ${videoProgress}%…` : isSubmitting ? "Saving…" : isNew ? "Create Banner" : "Update Banner"}
            </Button>
            <Link href="/admin/banners">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
