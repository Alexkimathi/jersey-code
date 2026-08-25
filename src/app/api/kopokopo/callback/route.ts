import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createHmac } from "crypto";

const KOPOKOPO_API_KEY = process.env.KOPOKOPO_API_KEY!;

function verifySignature(rawBody: string, signature: string): boolean {
  if (!KOPOKOPO_API_KEY) return true; // skip verification if key not configured
  const expected = createHmac("sha256", KOPOKOPO_API_KEY)
    .update(rawBody)
    .digest("hex");
  // signature header may be "sha256=<hex>" or just "<hex>"
  const received = signature.startsWith("sha256=")
    ? signature.slice(7)
    : signature;
  return expected === received;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-kopokopo-signature") ?? "";

    if (signature && !verifySignature(rawBody, signature)) {
      console.error("Kopo Kopo callback: invalid signature");
      return NextResponse.json({ status: "ok" });
    }

    const body = JSON.parse(rawBody);
    console.log("Kopo Kopo Callback:", JSON.stringify(body, null, 2));

    const resource = body?.event?.resource;
    if (!resource) {
      return NextResponse.json({ status: "ok" });
    }

    const orderId: string | undefined = resource?.metadata?.order_id;
    // "Success" | "Failed" | "Pending"
    const status: string | undefined = resource?.status;

    if (!orderId) {
      console.error("Kopo Kopo callback: no order_id in metadata");
      return NextResponse.json({ status: "ok" });
    }

    const supabase = createServiceClient() as any;

    if (status === "Success") {
      await supabase
        .from("orders")
        .update({ payment_status: "paid", order_status: "processing" })
        .eq("id", orderId);
    } else if (status === "Failed") {
      await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", orderId);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Kopo Kopo Callback error:", error);
    return NextResponse.json({ status: "ok" });
  }
}
