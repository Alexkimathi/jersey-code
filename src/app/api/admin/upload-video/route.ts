import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { createServiceClient } from "@/lib/supabase/server";

async function verifyAdmin(token: string) {
  const supabase = createServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
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

  const ext = req.headers.get("x-filename")?.split(".").pop()?.toLowerCase() ?? "mp4";
  const allowed = ["mp4", "webm", "mov", "ogg"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "Unsupported video format" }, { status: 400 });
  }

  const contentType = req.headers.get("content-type") ?? "video/mp4";

  if (!req.body) {
    return NextResponse.json({ error: "No file body received" }, { status: 400 });
  }

  let blob;
  try {
    // Stream the body directly to Vercel Blob — no server buffering
    blob = await put(`banners/hero.${ext}`, req.body, {
      access: "public",
      contentType,
      allowOverwrite: true,
    });
  } catch (err) {
    console.error("Blob upload failed:", err);
    return NextResponse.json({ error: "Upload to storage failed." }, { status: 500 });
  }

  // Save URL to DB using service client (bypasses RLS)
  const supabase = createServiceClient();
  const { data: existing } = await (supabase as any)
    .from("banners")
    .select("id")
    .eq("position", "background")
    .single();

  if (existing) {
    await (supabase as any)
      .from("banners")
      .update({ video_url: blob.url })
      .eq("id", existing.id);
  } else {
    await (supabase as any)
      .from("banners")
      .insert({
        title: "Background Video",
        image_url: "",
        video_url: blob.url,
        position: "background",
        is_active: true,
        sort_order: 0,
      });
  }

  return NextResponse.json({ url: blob.url });
}
