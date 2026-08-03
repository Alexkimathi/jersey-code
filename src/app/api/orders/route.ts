import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/** Normalise a Kenyan phone number to 254XXXXXXXXX for consistent matching */
function normalisePhone(raw: string): string[] {
  const digits = raw.replace(/\D/g, "");
  const variants = new Set<string>();
  // already has country code
  if (digits.startsWith("254") && digits.length === 12) {
    variants.add(digits);
    variants.add("0" + digits.slice(3));       // local 0XXX
    variants.add("+" + digits);               // +254XXX
  }
  // local format 07XX or 01XX
  if (digits.startsWith("0") && digits.length === 10) {
    variants.add(digits);
    variants.add("254" + digits.slice(1));    // 254XXX
    variants.add("+254" + digits.slice(1));   // +254XXX
  }
  // raw digits without leading 0 (e.g. 7XXXXXXXX)
  if (!digits.startsWith("0") && !digits.startsWith("254") && digits.length === 9) {
    variants.add(digits);
    variants.add("0" + digits);
    variants.add("254" + digits);
    variants.add("+254" + digits);
  }
  if (variants.size === 0) variants.add(digits); // fallback
  return Array.from(variants);
}

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone")?.trim();

  if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  const variants = normalisePhone(phone);
  const supabase = createServiceClient() as any;

  // Query all phone variants in one shot using .in()
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      customer_phone,
      customer_name,
      customer_email,
      total_amount,
      order_status,
      payment_status,
      fulfillment_method,
      created_at,
      order_items (
        id,
        quantity,
        unit_price,
        custom_name,
        custom_number,
        products ( name, image_url )
      )
    `)
    .in("customer_phone", variants)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}
