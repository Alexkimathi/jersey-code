import { NextResponse } from "next/server";
import { initiateSTKPush } from "@/lib/kopokopo";

export async function POST(request: Request) {
  try {
    const { phoneNumber, amount, orderId } = await request.json();

    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await initiateSTKPush({ phoneNumber, amount, orderId });

    return NextResponse.json({ paymentId: result.paymentId });
  } catch (error) {
    console.error("Kopo Kopo STK Push error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 400 }
    );
  }
}
