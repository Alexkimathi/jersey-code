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

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const caller = await verifySuperAdmin(token);
  if (!caller) {
    return NextResponse.json(
      { error: "Only super admins can create admin users" },
      { status: 403 }
    );
  }

  let body: {
    email: string;
    password: string;
    full_name?: string;
    role: string;
    can_create?: boolean;
    can_edit?: boolean;
    can_hide?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password, full_name, role, can_create, can_edit, can_hide } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  if (!["admin", "super_admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Create Supabase Auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? "Failed to create auth user" },
      { status: 500 }
    );
  }

  const newUserId = authData.user.id;

  const db = supabase as any;

  // Insert into admin_users
  const { error: insertError } = await db.from("admin_users").insert({
    id: newUserId,
    role,
    full_name: full_name?.trim() || null,
    created_by: caller.user.id,
  });

  if (insertError) {
    // Rollback: delete the auth user
    await supabase.auth.admin.deleteUser(newUserId);
    return NextResponse.json(
      { error: "Failed to create admin user record" },
      { status: 500 }
    );
  }

  // Insert permissions for regular admin role
  if (role === "admin") {
    await db.from("admin_permissions").insert({
      admin_id: newUserId,
      can_create: can_create ?? false,
      can_edit: can_edit ?? false,
      can_hide: can_hide ?? false,
    });
  }

  return NextResponse.json({ success: true, id: newUserId });
}
