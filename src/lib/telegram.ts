const STATUS_EMOJI: Record<string, string> = {
  processing: "⏳",
  ready: "✅",
  out_for_delivery: "🚚",
  completed: "🎉",
  cancelled: "❌",
  pending: "🕐",
  paid: "💰",
  failed: "⚠️",
};

export async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}

export function buildNewOrderMessage(
  orderId: string,
  customerName: string,
  customerPhone: string,
  customerEmail: string | null | undefined,
  fulfillmentMethod: string,
  paymentMethod: string,
  total: number,
  deliveryAddress: string | null | undefined,
  items: Array<{
    name: string;
    size?: string | null;
    quantity: number;
    price: number;
    customization?: {
      edition?: string | null;
      printName?: string | null;
      printNumber?: string | null;
      font?: string | null;
      printColor?: string | null;
      badge?: string | null;
      badges?: string[] | null;
      addOnPrice?: number;
    } | null;
  }>
): string {
  const itemLines = items
    .map((i) => {
      const c = i.customization;
      const addOn = c?.addOnPrice ?? 0;
      const basePrice = i.price;
      const unitTotal = basePrice + addOn;

      const priceBreakdown =
        addOn > 0
          ? `KES ${Math.round(basePrice).toLocaleString()} + KES ${Math.round(addOn).toLocaleString()} customization`
          : `KES ${Math.round(basePrice).toLocaleString()}`;

      const lines: string[] = [
        `  • *${i.name}*`,
        `    Size: ${i.size ?? "—"}  |  Qty: ×${i.quantity}`,
        `    Price: ${priceBreakdown} = *KES ${Math.round(unitTotal * i.quantity).toLocaleString()}*`,
      ];

      if (c) {
        if (c.edition) {
          lines.push(`    Edition: ${c.edition.charAt(0).toUpperCase() + c.edition.slice(1)}`);
        }
        if (c.printName || c.printNumber) {
          const nameStr = c.printName ? `Name: ${c.printName}` : null;
          const numStr = c.printNumber ? `No: #${c.printNumber}` : null;
          lines.push(`    Print: ${[nameStr, numStr].filter(Boolean).join("  |  ")}`);
        }
        if (c.font) {
          lines.push(`    Font: ${c.font}`);
        }
        if (c.printColor) {
          lines.push(`    Print Colour: ${c.printColor}`);
        }
        // badges array takes priority; fall back to single badge field
        const badgeList = c.badges?.length
          ? c.badges
          : c.badge && c.badge !== "none"
          ? [c.badge]
          : [];
        if (badgeList.length) {
          lines.push(`    Badge(s): ${badgeList.join(", ")}`);
        }
      }

      return lines.join("\n");
    })
    .join("\n\n");

  const fulfillmentLabel =
    fulfillmentMethod === "delivery" ? "🚚 *Delivery*" : "🏪 *Store Pickup*";
  const address = deliveryAddress || null;

  return [
    `🛒 *New Order — #${orderId.slice(0, 8).toUpperCase()}*`,
    ``,
    `👤 *Customer*`,
    `  Name: ${customerName}`,
    `  Phone: ${customerPhone}`,
    customerEmail ? `  Email: ${customerEmail}` : `  Email: —`,
    ``,
    `📦 *Items*`,
    itemLines,
    ``,
    `💰 *Order Total: KES ${Math.round(total).toLocaleString()}*`,
    ``,
    fulfillmentLabel,
    address ? `  📍 ${address}` : null,
    `💳 *Payment:* M-Pesa STK Push`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export function buildOrderUpdateMessage(
  orderId: string,
  changes: { order_status?: string; payment_status?: string }
): string {
  const lines = [`📋 *Order #${orderId.slice(0, 8).toUpperCase()} Updated*`, ``];

  if (changes.order_status) {
    const emoji = STATUS_EMOJI[changes.order_status] ?? "🔄";
    lines.push(`Order Status: ${emoji} ${changes.order_status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`);
  }
  if (changes.payment_status) {
    const emoji = STATUS_EMOJI[changes.payment_status] ?? "🔄";
    lines.push(`Payment: ${emoji} ${changes.payment_status.replace(/\b\w/g, (c) => c.toUpperCase())}`);
  }

  return lines.join("\n");
}
