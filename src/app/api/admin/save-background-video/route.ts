import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

async function verifyAdmin(token: string) {
  const supabase = createServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .single();
  return adminUser ?? null;
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await verifyAdmin(token);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { url } = await req.json() as { url: string };
  if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

  const supabase = createServiceClient();

  const { data: existing } = await (supabase as any)
    .from("banners")
    .select("id")
    .eq("position", "background")
    .single();

  if (existing) {
    await (supabase as any)
      .from("banners")
      .update({ video_url: url })
      .eq("id", existing.id);
  } else {
    await (supabase as any)
      .from("banners")
      .insert({
        title: "Background Video",
        image_url: "",
        video_url: url,
        position: "background",
        is_active: true,
        sort_order: 0,
      });
  }

  return NextResponse.json({ ok: true });
}
