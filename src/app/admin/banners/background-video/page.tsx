"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function BackgroundVideoPage() {
  const router = useRouter();
  const { adminUser, isLoading } = useAdminAuth();
  const [recordId, setRecordId] = useState<string | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "fake-key"
      ),
    []
  );

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any)
        .from("banners")
        .select("id, video_url")
        .eq("position", "background")
        .single();

      if (data) {
        setRecordId(data.id);
        setCurrentVideoUrl(data.video_url ?? "");
        setVideoUrl(data.video_url ?? "");
      }
    }
    load();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    let finalUrl = videoUrl;

    if (selectedFile) {
      setUploading(true);
      const ext = selectedFile.name.split(".").pop() ?? "mp4";
      const path = `banners/background/${Date.now()}.${ext}`;
      const { data, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, selectedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: selectedFile.type,
        });

      if (uploadError || !data) {
        setError(uploadError?.message || "Upload failed.");
        setSaving(false);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);
      finalUrl = urlData.publicUrl;
      setUploading(false);
    }

    const payload = {
      title: "Background Video",
      image_url: "",
      video_url: finalUrl || null,
      position: "background",
      is_active: true,
      sort_order: 0,
    };

    if (recordId) {
      const { error: updateError } = await (supabase as any)
        .from("banners")
        .update({ video_url: finalUrl || null })
        .eq("id", recordId);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { data: inserted, error: insertError } = await (supabase as any)
        .from("banners")
        .insert(payload)
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
      if (inserted) setRecordId(inserted.id);
    }

    setCurrentVideoUrl(finalUrl);
    setSelectedFile(null);
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleRemove = async () => {
    if (!recordId || !confirm("Remove the background video?")) return;
    setSaving(true);
    await (supabase as any)
      .from("banners")
      .update({ video_url: null })
      .eq("id", recordId);
    setCurrentVideoUrl("");
    setVideoUrl("");
    setSelectedFile(null);
    setSaving(false);
  };

  if (isLoading) {
    return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  }

  if (!adminUser) {
    return <AdminLayout><div className="p-8 text-red-600">Access denied.</div></AdminLayout>;
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm";

  return (
    <AdminLayout>
      <div className="max-w-xl p-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Background Video</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          This video plays behind all banner slides on the homepage hero. Upload a file or paste a direct URL.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            Background video saved.
          </div>
        )}

        {/* Current video preview */}
        {currentVideoUrl && (
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-black">
            <video
              src={currentVideoUrl}
              className="w-full h-48 object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
            <div className="px-4 py-2 bg-gray-50 flex items-center justify-between gap-2">
              <p className="text-xs text-gray-500 truncate">{currentVideoUrl}</p>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-red-600 hover:text-red-700 flex-none"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload video file
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setSelectedFile(file);
                if (file) setVideoUrl("");
              }}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
            {selectedFile && (
              <p className="text-xs text-amber-600 mt-1">{selectedFile.name} — uploads on save</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                if (e.target.value) setSelectedFile(null);
              }}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          {uploading && (
            <p className="text-sm text-blue-600 font-medium">Uploading video...</p>
          )}

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={saving || (!selectedFile && !videoUrl)}>
              {uploading ? "Uploading..." : saving ? "Saving…" : "Save Video"}
            </Button>
            <Link href="/admin/banners">
              <Button variant="outline" type="button">
                Back
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
