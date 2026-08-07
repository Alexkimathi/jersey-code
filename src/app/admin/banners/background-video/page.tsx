"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useSupabase } from "@/app/providers";

export default function BackgroundVideoPage() {
  const { adminUser, isLoading } = useAdminAuth();
  const { supabase } = useSupabase();
  const [recordId, setRecordId] = useState<string | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      }
    }
    load();
  }, [supabase]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedFile) return;

    setSaving(true);
    setUploading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      setError("Not authenticated. Please log in again.");
      setSaving(false);
      setUploading(false);
      return;
    }

    const form = new FormData();
    form.append("file", selectedFile);

    const res = await fetch("/api/admin/upload-video", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const json = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(json.error ?? "Upload failed.");
      setSaving(false);
      return;
    }

    const finalUrl = json.url;

    const payload = {
      title: "Background Video",
      image_url: "",
      video_url: finalUrl,
      position: "background",
      is_active: true,
      sort_order: 0,
    };

    if (recordId) {
      const { error: updateError } = await (supabase as any)
        .from("banners")
        .update({ video_url: finalUrl })
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
    setSelectedFile(null);
    setSaving(false);
  };

  if (isLoading) {
    return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  }

  if (!adminUser) {
    return <AdminLayout><div className="p-8 text-red-600">Access denied.</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-xl p-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Background Video</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          This video plays behind all banner slides on the homepage hero.
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
              accept="video/mp4,video/webm,video/mov,video/ogg"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
            {selectedFile && (
              <p className="text-xs text-amber-600 mt-1">{selectedFile.name} — uploads on save</p>
            )}
          </div>

          {uploading && (
            <p className="text-sm text-blue-600 font-medium">Uploading video...</p>
          )}

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={saving || !selectedFile}>
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
