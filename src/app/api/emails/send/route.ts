import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jerseystore.co.ke";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const STORE_NAME = "Jersey Code";

// ─── Helpers ───────────────────────────────────────────────────────────────

const BADGE_LABELS: Record<string, string> = {
  premier_league: "Premier League Badge",
  la_liga: "La Liga Badge",
  bundesliga: "Bundesliga Badge",
  serie_a: "Serie A Badge",
  club_world_cup: "Club World Cup Badge",
  uefa_champions_league: "UEFA Champions League Badge",
  uefa_europa_league: "UEFA Europa League Badge",
  fifa_world_champions_2025: "FIFA World Champions Badge 2025",
  world_cup: "World Cup Badge",
};

function buildItemsHtml(itemsRich: any[]): string {
  if (!itemsRich?.length) return "";

  return itemsRich.map((item) => {
    const customRows: string[] = [];

    if (item.size)
      customRows.push(`<tr><td style="color:#94a3b8;padding:2px 0;font-size:12px;">Size</td><td style="text-align:right;font-weight:600;color:#334155;font-size:12px;">${item.size}</td></tr>`);
    if (item.edition)
      customRows.push(`<tr><td style="color:#94a3b8;padding:2px 0;font-size:12px;">Edition</td><td style="text-align:right;font-weight:600;color:#334155;font-size:12px;text-transform:capitalize;">${item.edition}</td></tr>`);
    if (item.customName)
      customRows.push(`<tr><td style="color:#94a3b8;padding:2px 0;font-size:12px;">Print Name</td><td style="text-align:right;font-weight:700;color:#0f172a;font-size:12px;letter-spacing:0.05em;">${item.customName}</td></tr>`);
    if (item.customNumber)
      customRows.push(`<tr><td style="color:#94a3b8;padding:2px 0;font-size:12px;">Print Number</td><td style="text-align:right;font-weight:700;color:#0f172a;font-size:12px;">#${item.customNumber}</td></tr>`);
    if (item.font)
      customRows.push(`<tr><td style="color:#94a3b8;padding:2px 0;font-size:12px;">Font</td><td style="text-align:right;font-weight:600;color:#334155;font-size:12px;">${item.font}</td></tr>`);
    if (item.printColor)
      customRows.push(`<tr><td style="color:#94a3b8;padding:2px 0;font-size:12px;">Print Color</td><td style="text-align:right;font-weight:600;color:#334155;font-size:12px;">${item.printColor}</td></tr>`);
    if (item.badges?.length)
      item.badges.forEach((b: string) => {
        const label = BADGE_LABELS[b] ?? b;
        customRows.push(`<tr><td style="color:#94a3b8;padding:2px 0;font-size:12px;">Badge</td><td style="text-align:right;font-weight:600;color:#334155;font-size:12px;">${label}</td></tr>`);
      });
    if (item.addOnPrice > 0)
      customRows.push(`<tr><td style="color:#0ea5e9;padding:2px 0;font-size:12px;">Customization add-on</td><td style="text-align:right;font-weight:600;color:#0ea5e9;font-size:12px;">+KES ${Number(item.addOnPrice).toLocaleString()}</td></tr>`);

    const customBlock = customRows.length
      ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:8px 12px;margin-top:6px;">${customRows.join("")}</table>`
      : "";

    const itemTotal = (item.quantity * item.unitPrice) + (item.addOnPrice ?? 0);

    return `
    <div style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;font-weight:700;color:#0f172a;">${item.name}</td>
          <td style="text-align:right;font-size:13px;font-weight:700;color:#0f172a;white-space:nowrap;">KES ${itemTotal.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:#94a3b8;">Qty: ${item.quantity}</td>
        </tr>
      </table>
      ${customBlock}
    </div>`;
  }).join("");
}

function buildItemsText(itemsRich: any[]): string {
  if (!itemsRich?.length) return "";
  return itemsRich.map((item) => {
    const lines = [`• ${item.name} x${item.quantity}`];
    if (item.size) lines.push(`  Size: ${item.size}`);
    if (item.edition) lines.push(`  Edition: ${item.edition}`);
    if (item.customName) lines.push(`  Print Name: ${item.customName}`);
    if (item.customNumber) lines.push(`  Print Number: #${item.customNumber}`);
    if (item.font) lines.push(`  Font: ${item.font}`);
    if (item.printColor) lines.push(`  Print Color: ${item.printColor}`);
    if (item.badges?.length) item.badges.forEach((b: string) => lines.push(`  Badge: ${BADGE_LABELS[b] ?? b}`));
    if (item.addOnPrice > 0) lines.push(`  Customization add-on: +KES ${item.addOnPrice}`);
    return lines.join("\n");
  }).join("\n");
}

// ─── HTML email templates ──────────────────────────────────────────────────

function baseLayout(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#0f172a;padding:28px 32px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">${STORE_NAME}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:32px;">${bodyHtml}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
              © ${new Date().getFullYear()} ${STORE_NAME} · Nairobi, Kenya
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const emailTemplates: Record<
  string,
  (data: Record<string, any>) => { subject: string; html: string; text: string }
> = {
  order_confirmation: (data) => {
    const trackUrl = `${SITE_URL}/orders/${data.orderId}`;
    const itemsHtml = buildItemsHtml(data.itemsRich ?? []);
    const itemsText = buildItemsText(data.itemsRich ?? []);
    const html = baseLayout(
      `Order Confirmed – #${data.orderId.slice(0, 8).toUpperCase()}`,
      `
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;">You're all set! 🎉</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#64748b;">Hi ${data.customerName}, your order has been received and is being prepared.</p>

      <!-- Order meta -->
      <table width="100%" style="background:#f8fafc;border-radius:10px;padding:16px 20px;margin-bottom:16px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:12px;color:#94a3b8;">Order ID</td>
          <td align="right" style="font-size:13px;font-weight:700;color:#0f172a;font-family:monospace;">#${data.orderId.slice(0, 8).toUpperCase()}</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:#94a3b8;padding-top:10px;">Fulfillment</td>
          <td align="right" style="font-size:13px;color:#334155;padding-top:10px;">${data.fulfillmentMethod === "pickup" ? "Store Pickup" : "Home Delivery"}</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:#94a3b8;padding-top:10px;">Estimated</td>
          <td align="right" style="font-size:13px;color:#334155;padding-top:10px;">${data.estimatedDelivery}</td>
        </tr>
      </table>

      <!-- Items -->
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Your Items</p>
      <div style="border:1px solid #e2e8f0;border-radius:10px;padding:4px 16px;margin-bottom:16px;">
        ${itemsHtml}
      </div>

      <!-- Total -->
      <table width="100%" style="margin-bottom:24px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:15px;font-weight:700;color:#0f172a;">Order Total</td>
          <td align="right" style="font-size:18px;font-weight:800;color:#0f172a;">KES ${Number(data.total).toLocaleString()}</td>
        </tr>
      </table>

      <a href="${trackUrl}" style="display:block;background:#0f172a;color:#ffffff;text-align:center;padding:14px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;margin-bottom:20px;">
        Track Your Order
      </a>

      <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
        Questions? Reply to this email or visit <a href="${SITE_URL}/contact" style="color:#0ea5e9;">our contact page</a>.
      </p>
      `
    );
    return {
      subject: `Order Confirmed – #${data.orderId.slice(0, 8).toUpperCase()}`,
      html,
      text: `Hi ${data.customerName},\n\nYour order #${data.orderId.slice(0, 8).toUpperCase()} has been received.\n\n${itemsText}\n\nTotal: KES ${Number(data.total).toLocaleString()}\nFulfillment: ${data.fulfillmentMethod}\n\nTrack your order: ${trackUrl}\n\n${STORE_NAME}`,
    };
  },

  payment_received: (data) => {
    const trackUrl = `${SITE_URL}/orders/${data.orderId}`;
    const html = baseLayout(
      "Payment Received",
      `
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;">Payment confirmed ✓</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#64748b;">Hi ${data.customerName}, we've received your payment and your order is being prepared.</p>

      <table width="100%" style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:12px;color:#94a3b8;">Order ID</td>
          <td align="right" style="font-size:13px;font-weight:700;color:#0f172a;font-family:monospace;">#${data.orderId.slice(0, 8).toUpperCase()}</td>
        </tr>
        <tr>
          <td style="font-size:14px;font-weight:700;color:#0f172a;padding-top:16px;border-top:1px solid #e2e8f0;margin-top:12px;">Amount paid</td>
          <td align="right" style="font-size:16px;font-weight:800;color:#059669;padding-top:16px;border-top:1px solid #e2e8f0;">KES ${Number(data.amount).toLocaleString()}</td>
        </tr>
      </table>

      <a href="${trackUrl}" style="display:block;background:#0f172a;color:#ffffff;text-align:center;padding:14px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;">
        Track Your Order
      </a>
      `
    );
    return {
      subject: `Payment Confirmed – KES ${Number(data.amount).toLocaleString()}`,
      html,
      text: `Hi ${data.customerName},\n\nPayment of KES ${Number(data.amount).toLocaleString()} received for order #${data.orderId.slice(0, 8).toUpperCase()}.\n\nTrack your order: ${trackUrl}\n\n${STORE_NAME}`,
    };
  },

  order_shipped: (data) => {
    const trackUrl = `${SITE_URL}/orders/${data.orderId}`;
    const html = baseLayout(
      "Your Order Is On Its Way",
      `
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;">Your order is on its way 🚚</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#64748b;">Hi ${data.customerName}, great news — your jersey is out for delivery!</p>

      <table width="100%" style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:12px;color:#94a3b8;">Order ID</td>
          <td align="right" style="font-size:13px;font-weight:700;color:#0f172a;font-family:monospace;">#${data.orderId.slice(0, 8).toUpperCase()}</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:#94a3b8;padding-top:12px;">Expected delivery</td>
          <td align="right" style="font-size:13px;color:#334155;padding-top:12px;">${data.expectedDelivery}</td>
        </tr>
      </table>

      <a href="${trackUrl}" style="display:block;background:#0f172a;color:#ffffff;text-align:center;padding:14px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;">
        Track Your Order
      </a>
      `
    );
    return {
      subject: `Your Order Is On Its Way – #${data.orderId.slice(0, 8).toUpperCase()}`,
      html,
      text: `Hi ${data.customerName},\n\nYour order #${data.orderId.slice(0, 8).toUpperCase()} is out for delivery!\n\nExpected: ${data.expectedDelivery}\n\nTrack your order: ${trackUrl}\n\n${STORE_NAME}`,
    };
  },

  order_ready: (data) => {
    const trackUrl = `${SITE_URL}/orders/${data.orderId}`;
    const html = baseLayout(
      "Your Order Is Ready for Pickup",
      `
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;">Ready for pickup! 📦</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#64748b;">Hi ${data.customerName}, your order is ready and waiting for you at our store.</p>

      <table width="100%" style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:12px;color:#94a3b8;">Order ID</td>
          <td align="right" style="font-size:13px;font-weight:700;color:#0f172a;font-family:monospace;">#${data.orderId.slice(0, 8).toUpperCase()}</td>
        </tr>
      </table>

      <a href="${trackUrl}" style="display:block;background:#0f172a;color:#ffffff;text-align:center;padding:14px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;">
        View Order Details
      </a>
      `
    );
    return {
      subject: `Ready for Pickup – #${data.orderId.slice(0, 8).toUpperCase()}`,
      html,
      text: `Hi ${data.customerName},\n\nYour order #${data.orderId.slice(0, 8).toUpperCase()} is ready for pickup at our store.\n\nView order: ${trackUrl}\n\n${STORE_NAME}`,
    };
  },
};

// ─── Route handler ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { orderId, emailType, customerEmail, customerName, data } =
      await request.json();

    if (!orderId || !emailType || !customerEmail) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const template = emailTemplates[emailType];
    if (!template) {
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    const emailContent = template({ customerName, orderId, ...data });

    // Log intent to DB
    await supabase.from("email_logs").insert([
      {
        order_id: orderId,
        customer_email: customerEmail,
        email_type: emailType,
        status: "pending",
        created_at: new Date().toISOString(),
      },
    ]);

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn("[Email] Skipped — RESEND_API_KEY not set");
      return NextResponse.json({ success: true, skipped: true });
    }

    const resend = new Resend(apiKey);
    const { data: sendData, error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });
    console.log("[Email] Resend response:", { data: sendData, error: sendError });

    if (sendError) {
      console.error("[Email] Resend error:", sendError);
      await supabase
        .from("email_logs")
        .update({ status: "failed" })
        .eq("order_id", orderId)
        .eq("email_type", emailType);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    await supabase
      .from("email_logs")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("order_id", orderId)
      .eq("email_type", emailType);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email service error:", error);
    return NextResponse.json({ error: "Failed to process email" }, { status: 500 });
  }
}
