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

  const blob = await put(`banners/hero.${ext}`, file, {
    access: "public",
    contentType: file.type,
    allowOverwrite: true,
    multipart: true,
  });

  return NextResponse.json({ url: blob.url });
}
