import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const NOTIFY_EMAIL = process.env.BUSINESS_NOTIFICATION_EMAIL || "jersey.code.ke@gmail.com";
const FROM_EMAIL   = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[Newsletter] Skipped — RESEND_API_KEY not set");
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: "New newsletter subscriber",
      text: `A new visitor subscribed to the Jersey Code newsletter.\n\nEmail: ${email}\n\nDate: ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:12px;">
          <p style="margin:0 0 8px;font-size:20px;font-weight:800;color:#0f172a;">New newsletter subscriber</p>
          <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Someone just subscribed on jerseycode.co.ke</p>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">Email</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#0f172a;">${email}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Newsletter] Error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
