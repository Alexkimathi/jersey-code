import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { initiateStkPush } from "@/lib/mpesa";
import { CheckoutFormData } from "@/lib/supabase/types";

type RequestBody = CheckoutFormData & { items: any[]; total: number };

async function createOrderItems(supabase: any, orderId: string, items: any[]) {
  const orderItems = items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    variant_id: item.variantId,
    quantity: item.quantity,
    unit_price: item.price + (item.customization?.addOnPrice ?? 0),
    custom_name: item.customization?.printName ?? null,
    custom_number: item.customization?.printNumber ?? null,
    customization_data: {
      size: item.size ?? null,
      edition: item.customization?.edition ?? null,
      font: item.customization?.font ?? null,
      printColor: item.customization?.printColor ?? null,
      badges: item.customization?.badges ?? [],
      addOnPrice: item.customization?.addOnPrice ?? 0,
    },
  }));

  const { error } = await supabase.from("order_items").insert(orderItems);
  if (error) console.error("Error creating order items:", error);
}

async function postCheckoutSideEffects(
  requestUrl: string,
  orderId: string,
  body: RequestBody
) {
  // Reserve stock
  try {
    await fetch(new URL("/api/stock/reserve", requestUrl).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: body.items, orderId }),
    });
  } catch (err) {
    console.error("Error reserving stock:", err);
  }

  const itemsRich = body.items.map((i: any) => ({
    name: i.name,
    size: i.size ?? null,
    quantity: i.quantity,
    unitPrice: i.price,
    customName: i.customization?.printName ?? null,
    customNumber: i.customization?.printNumber ?? null,
    font: i.customization?.font ?? null,
    printColor: i.customization?.printColor ?? null,
    badges: i.customization?.badges ?? [],
    edition: i.customization?.edition ?? null,
    addOnPrice: i.customization?.addOnPrice ?? 0,
  }));

  const emailUrl = new URL("/api/emails/send", requestUrl).toString();

  // Always notify the business
  const businessEmail = process.env.BUSINESS_NOTIFICATION_EMAIL;
  if (businessEmail) {
    try {
      await fetch(emailUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          emailType: "new_order_alert",
          customerEmail: businessEmail,
          customerName: "Jersey Code",
          data: {
            total: body.total,
            fulfillmentMethod: body.fulfillmentMethod,
            customerName: body.customerName,
            customerPhone: body.customerPhone,
            customerEmail: body.customerEmail ?? null,
            deliveryAddress: body.deliveryAddress ?? null,
            itemsRich,
          },
        }),
      });
    } catch (err) {
      console.error("Error sending business notification:", err);
    }
  }

  // Send confirmation to customer only if they provided an email
  if (body.customerEmail) {
    try {
      await fetch(emailUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          emailType: "order_confirmation",
          customerEmail: body.customerEmail,
          customerName: body.customerName,
          data: {
            total: body.total,
            fulfillmentMethod: body.fulfillmentMethod,
            estimatedDelivery:
              body.fulfillmentMethod === "delivery"
                ? "1–3 business days"
                : "Ready next business day",
            itemsRich,
          },
        }),
      });
    } catch (err) {
      console.error("Error sending customer confirmation:", err);
    }
  }
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const supabase = createServiceClient() as any;

    // ── 1. Create the order first (always) ──────────────────────
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: body.customerName,
        customer_phone: body.customerPhone,
        customer_email: body.customerEmail || null,
        fulfillment_method: body.fulfillmentMethod,
        payment_method: body.paymentMethod,
        payment_status: "pending",
        order_status: "processing",
        total_amount: body.total,
        delivery_address: body.deliveryAddress,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    await createOrderItems(supabase, order.id, body.items);

    // ── 2. M-Pesa: initiate STK push after order exists ─────────
    if (body.paymentMethod === "mpesa") {
      try {
        const mpesaResult = await initiateStkPush({
          phoneNumber: body.customerPhone,
          amount: body.total,
          orderId: order.id,
        });

        // Store the checkout request ID so the callback can find this order
        await supabase
          .from("orders")
          .update({ mpesa_checkout_request_id: mpesaResult.checkoutRequestId })
          .eq("id", order.id);
      } catch (mpesaError) {
        // Order exists — log the M-Pesa failure but don't block the response.
        // The customer will see the order confirmation; payment can be retried.
        console.error("M-Pesa STK push failed:", mpesaError);
      }
    }

    await postCheckoutSideEffects(request.url, order.id, body);
    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
