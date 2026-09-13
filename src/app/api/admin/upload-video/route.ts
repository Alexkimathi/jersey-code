import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { createServiceClient } from "@/lib/supabase/server";

async function verifyAdmin(token: string) {
  const supabase = createServiceClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("id", user.id)
    .single();

  return adminUser ?? null;
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await verifyAdmin(token);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
  const allowed = ["mp4", "webm", "mov", "ogg"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "Unsupported video format" }, { status: 400 });
  }

  let blob;
  try {
    blob = await put(`banners/hero.${ext}`, file, {
      access: "public",
      contentType: file.type,
      allowOverwrite: true,
      multipart: true,
    });
  } catch (err) {
    console.error("Blob upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Check BLOB_READ_WRITE_TOKEN is configured." }, { status: 500 });
  }

  // Save the URL to the database using the service client (bypasses RLS)
  const supabase = createServiceClient();
  const { data: existing } = await (supabase as any)
    .from("banners")
    .select("id")
    .eq("position", "background")
    .single();

  if (existing) {
    const { error: updateError } = await (supabase as any)
      .from("banners")
      .update({ video_url: blob.url })
      .eq("id", existing.id);

    if (updateError) {
      console.error("DB update failed:", updateError);
      return NextResponse.json({ error: "Video uploaded but failed to save URL: " + updateError.message }, { status: 500 });
    }
  } else {
    const { error: insertError } = await (supabase as any)
      .from("banners")
      .insert({
        title: "Background Video",
        image_url: "",
        video_url: blob.url,
        position: "background",
        is_active: true,
        sort_order: 0,
      });

    if (insertError) {
      console.error("DB insert failed:", insertError);
      return NextResponse.json({ error: "Video uploaded but failed to save URL: " + insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ url: blob.url });
}
