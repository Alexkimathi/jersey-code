import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("M-Pesa Callback:", JSON.stringify(body, null, 2));

    const callback = body.Body?.stkCallback;
    if (!callback) {
      return NextResponse.json({ ResultCode: 0 });
    }

    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;
    const resultDesc = callback.ResultDesc;

    const supabase = createServiceClient() as any;

    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("mpesa_checkout_request_id", checkoutRequestId)
      .single();

    if (!order) {
      console.error("Order not found for checkout request:", checkoutRequestId);
      return NextResponse.json({ ResultCode: 0 });
    }

    if (resultCode === 0) {
      const metadata = callback.CallbackMetadata?.Item || [];
      const amountItem = metadata.find(
        (item: any) => item.Name === "Amount"
      );
      const mpesaReceiptItem = metadata.find(
        (item: any) => item.Name === "MpesaReceiptNumber"
      );

      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          order_status: "processing",
          mpesa_merchant_request_id: callback.MerchantRequestID,
        })
        .eq("id", order.id);
    } else {
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
        })
        .eq("id", order.id);
    }

    return NextResponse.json({ ResultCode: 0 });
  } catch (error) {
    console.error("M-Pesa Callback error:", error);
    return NextResponse.json({ ResultCode: 0 });
  }
}
