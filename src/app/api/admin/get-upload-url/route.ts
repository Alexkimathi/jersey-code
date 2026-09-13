import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

async function verifyAdmin(token: string) {
  const supabase = createServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  const { data: adminUser } = await supabase
    .from("admin_users").select("id").eq("id", user.id).single();
  return adminUser ?? null;
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await verifyAdmin(token);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { filename, bucket = "banner-media" } = await req.json() as { filename: string; bucket?: string };
  if (!filename) return NextResponse.json({ error: "filename required" }, { status: 400 });

  const supabase = createServiceClient();

  // Create bucket if it doesn't exist
  await supabase.storage.createBucket(bucket, { public: true }).catch(() => {});

  const path = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to create upload URL" }, { status: 500 });
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    path,
    publicUrl: publicData.publicUrl,
  });
}
