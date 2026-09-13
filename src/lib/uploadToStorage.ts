/**
 * Uploads a file directly to Supabase Storage via a server-generated signed URL.
 * The file goes: browser → Supabase (no Vercel Function involved → no size limit).
 */
export async function uploadToStorage(
  file: File,
  token: string,
  bucket = "banner-media",
  onProgress?: (pct: number) => void,
): Promise<string> {
  // 1. Get a signed upload URL from the server
  const res = await fetch("/api/admin/get-upload-url", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, bucket }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to get upload URL");

  const { signedUrl, publicUrl } = json as { signedUrl: string; publicUrl: string };

  // 2. Upload directly to Supabase using XHR (supports progress events)
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
    });
    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.open("PUT", signedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });

  return publicUrl;
}
