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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await verifyAdmin(token);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("team_lists").delete().eq("id", params.id);

  if (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json({ error: "Failed to delete team" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
