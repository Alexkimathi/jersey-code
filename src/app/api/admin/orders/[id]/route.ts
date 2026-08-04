import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { OrderStatus, PaymentStatus } from "@/lib/supabase/types";

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
    .single() as unknown as { data: { id: string; role: string } | null };

  return adminUser;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminUser = await getCallerAdminUser(token);
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceClient() as any;
  const { data, error } = await supabase
    .from("orders")
    .select(
      `*,
      order_items (
        id,
        quantity,
        unit_price,
        custom_name,
        custom_number,
        products (name, image_url),
        product_variants (size)
      )`
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
  const updateData: { order_status?: OrderStatus; payment_status?: PaymentStatus } = {};

  if (order_status !== undefined) {
    if (!VALID_ORDER_STATUSES.includes(order_status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }
    updateData.order_status = order_status as OrderStatus;
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
    updateData.payment_status = payment_status as PaymentStatus;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await (supabase as any)
    .from("orders")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
