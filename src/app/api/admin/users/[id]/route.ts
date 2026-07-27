import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

async function verifySuperAdmin(token: string) {
  const supabase = createServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("id", user.id)
    .single() as unknown as { data: { id: string; role: string } | null };

  if (!adminUser || adminUser.role !== "super_admin") return null;
  return { user, adminUser };
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const caller = await verifySuperAdmin(token);
  if (!caller) {
    return NextResponse.json(
      { error: "Only super admins can delete admin users" },
      { status: 403 }
    );
  }

  if (id === caller.user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Deleting the auth user cascades to admin_users via FK
  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json({ error: "Failed to delete admin user" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
