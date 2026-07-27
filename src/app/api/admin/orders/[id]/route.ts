import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const VALID_ORDER_STATUSES = ["processing", "ready", "out_for_delivery", "completed", "cancelled"];
const VALID_PAYMENT_STATUSES = ["pending", "paid", "failed", "cancelled"];

async function getCallerAdminUser(token: string) {
  const supabase = createServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("id", user.id)
    .single();

  return adminUser;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminUser = await getCallerAdminUser(token);
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { order_status?: string; payment_status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { order_status, payment_status } = body;
  const updateData: Record<string, string> = {};

  if (order_status !== undefined) {
    if (!VALID_ORDER_STATUSES.includes(order_status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }
    updateData.order_status = order_status;
  }

  if (payment_status !== undefined) {
    if (adminUser.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can update payment status" },
        { status: 403 }
      );
    }
    if (!VALID_PAYMENT_STATUSES.includes(payment_status)) {
      return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
    }
    updateData.payment_status = payment_status;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", params.id);

  if (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
