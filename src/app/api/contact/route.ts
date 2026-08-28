import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const NOTIFY_EMAIL = process.env.BUSINESS_NOTIFICATION_EMAIL || "jersey.code.ke@gmail.com";
const FROM_EMAIL   = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    // ── 1. Try to store in DB using service role key (bypasses RLS) ──
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase.from("contact_messages").insert([{
        name, email, phone: phone || null, subject, message, status: "new",
      }]);
    } catch (dbErr) {
      // Non-fatal — we still send the email below
      console.warn("[Contact] DB insert failed:", dbErr);
    }

    // ── 2. Send email notification via Resend ──
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);

      const subjectLabels: Record<string, string> = {
        order:     "Order Inquiry",
        product:   "Product Question",
        custom:    "Custom / Personalisation",
        shipping:  "Shipping Issue",
        return:    "Return / Refund",
        complaint: "Complaint",
        other:     "Other",
      };
      const topicLabel = subjectLabels[subject] ?? subject;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        replyTo: email,
        subject: `Contact form: ${topicLabel} — from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#f8fafc;border-radius:12px;">
            <p style="margin:0 0 4px;font-size:20px;font-weight:800;color:#0f172a;">New contact message</p>
            <p style="margin:0 0 24px;font-size:13px;color:#64748b;">Submitted via jerseycode.co.ke · Reply-To is set to the sender</p>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
                  ["Name",    name],
                  ["Email",   email],
                  ...(phone ? [["Phone", phone]] : []),
                  ["Topic",   topicLabel],
                ].map(([k, v], i) => `
                  <tr style="border-top:${i > 0 ? "1px solid #f1f5f9" : "none"};">
                    <td style="padding:12px 16px;font-size:12px;color:#94a3b8;width:90px;">${k}</td>
                    <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#0f172a;">${v}</td>
                  </tr>`).join("")}
              </table>
            </div>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;">
              <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">Message</p>
              <p style="margin:0;font-size:14px;color:#0f172a;line-height:1.6;white-space:pre-wrap;">${message}</p>
            </div>
          </div>
        `,
        text: `New contact message\n\nName: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}\nTopic: ${topicLabel}\n\nMessage:\n${message}`,
      });
    } else {
      console.warn("[Contact] RESEND_API_KEY not set — email skipped");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact] Error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
