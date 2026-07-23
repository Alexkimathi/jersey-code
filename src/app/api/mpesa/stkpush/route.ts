import { NextResponse } from "next/server";
import { initiateStkPush } from "@/lib/mpesa";

export async function POST(request: Request) {
  try {
    const { phoneNumber, amount, orderId } = await request.json();

    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await initiateStkPush({
      phoneNumber,
      amount,
      orderId,
    });

    return NextResponse.json({
      CheckoutRequestID: result.checkoutRequestId,
      ResponseDescription: result.responseDescription,
      ResponseCode: "0",
    });
  } catch (error) {
    console.error("M-Pesa STK Push error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        ResponseCode: "1",
      },
      { status: 400 }
    );
  }
}
