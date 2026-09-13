"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useSupabase } from "@/app/providers";
import { uploadToStorage } from "@/lib/uploadToStorage";

export default function BackgroundVideoPage() {
  const { adminUser, isLoading } = useAdminAuth();
  const { supabase } = useSupabase();
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any)
        .from("banners").select("video_url").eq("position", "background").single();
      if (data?.video_url) setCurrentVideoUrl(data.video_url);
    }
    load();
  }, [supabase]);

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    if (!selectedFile) return;

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { setError("Not authenticated."); return; }

    setUploading(true);
    setProgress(0);

    try {
      const publicUrl = await uploadToStorage(selectedFile, token, "banner-media", setProgress);

      // Save URL to DB
      const res = await fetch("/api/admin/save-background-video", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url: publicUrl }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to save video URL.");
        return;
      }

      setCurrentVideoUrl(publicUrl);
      setSelectedFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Remove the background video?")) return;
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;
    await fetch("/api/admin/remove-background-video", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setCurrentVideoUrl("");
    setSelectedFile(null);
  };

  if (isLoading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  if (!adminUser) return <AdminLayout><div className="p-8 text-red-600">Access denied.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-xl p-4 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Background Video</h1>
        <p className="text-sm text-gray-500 mb-8">
          This video plays behind all banner slides on the homepage hero.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">Background video saved.</div>
        )}

        {currentVideoUrl && (
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-black">
            <video key={currentVideoUrl} src={currentVideoUrl}
              className="w-full h-48 object-cover" muted loop autoPlay playsInline />
            <div className="px-4 py-2 bg-gray-50 flex items-center justify-between gap-2">
              <p className="text-xs text-gray-500 truncate">{currentVideoUrl}</p>
              <button type="button" onClick={handleRemove}
                className="text-xs text-red-600 hover:text-red-700 flex-none">Remove</button>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload video file</label>
            <input type="file" accept="video/mp4,video/webm,video/mov,video/ogg"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
            {selectedFile && !uploading && (
              <>
                <p className="text-xs text-amber-600 mt-1">{selectedFile.name}</p>
                <video src={URL.createObjectURL(selectedFile)}
                  className="mt-3 w-full h-40 object-cover rounded-lg bg-black" muted controls playsInline />
              </>
            )}
          </div>

          {uploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-blue-600 font-medium">
                <span>Uploading...</span><span>{progress}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={uploading || !selectedFile}>
              {uploading ? `Uploading ${progress}%…` : "Save Video"}
            </Button>
            <Link href="/admin/banners">
              <Button variant="outline" type="button">Back</Button>
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
