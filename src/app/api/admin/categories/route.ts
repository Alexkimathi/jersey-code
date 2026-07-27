import { NextRequest, NextResponse } from "next/server";
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

  let body: { name?: string; list_type?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, list_type } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Team name is required" }, { status: 400 });
  }

  if (!["epl", "national", "other"].includes(list_type ?? "")) {
    return NextResponse.json({ error: "Invalid list type" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Determine next sort_order for this list_type
  const { data: existing } = await supabase
    .from("team_lists")
    .select("sort_order")
    .eq("list_type", list_type)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSortOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 1;

  const { error } = await supabase.from("team_lists").insert({
    name: name.trim(),
    list_type,
    sort_order: nextSortOrder,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This team is already in that list" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to add team" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
